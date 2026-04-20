# Design a Ride-Sharing App (Uber / Lyft)

## 1. Problem Statement
Design a service that matches riders with nearby drivers, updates locations in real-time, and calculates ETAs.

### Requirements
- **Functional:**
  - Drivers can broadcast their location.
  - Riders can request a ride and match with the nearest driver.
  - Real-time location tracking for both parties.
- **Non-Functional:**
  - Extremely low latency for location updates.
  - Highly reliable matching engine.
  - Scale: Millions of drivers, location pinged every 3 seconds.

## 2. High-Level Architecture 
```text
           [ Rider ]                  [ Driver ]
               \                         /
            [ WebSockets / API Gateway ]
                 |                   |
        [ Request Matcher ]     [ Location Tracking Service ]
                 |                   |
          [ MySQL & Maps ]      [ Geohash Redis DB ]
```

## 3. Core Design Concepts & Decisions
- **Spatial Indexing (The most important part):**
  We cannot run a SQL query `SELECT * FROM Drivers WHERE distance < 5km` every second for millions of riders. 
  **Solution:** We map the earth into a grid using **Geohashing** or **Quadtrees**.
  - A Geohash converts a 2D coordinate into a 1D string (e.g., `9q8yy`). 
  - Drivers in the same grid block share the same Geohash prefix.
  - We store Driver Data in Redis: `Key = Geohash, Value = Set of Driver IDs`.
- **Location Pinging:** 
  Drivers send their Lat/Long every 3 seconds. A Location Service receives this via UDP/WebSockets, calculates their new Geohash, and updates Redis heavily in-memory.
- **Matching Engine:**
  When a rider requests a car, the Matcher gets the rider's Geohash, pulls all drivers from Redis in that hash (and neighboring hashes), calculates actual driving ETAs via a Graph/Map API, and sends push notifications to drivers.

## 4. API Design
1. `PUT /api/v1/driver/location` (via WebSocket/UDP for low overhead)
   Payload: `{ "driver_id": 123, "lat": 40.71, "lng": -74.00 }`
2. `POST /api/v1/ride/request`
   Payload: `{ "rider_id": 99, "pickup_lat": 40.7, "pickup_lng": -74.0, "dest_id": ...}`
3. `GET /api/v1/ride/track/{ride_id}` (WebSocket stream for live map updates)

## 5. Database Schema
- **Location Cache (Redis)**: `Geohash -> Set<DriverIDs>`
- **Active Rides (NoSQL/Cassandra)**: Real-time active trips to handle frequent status updates.
- **Trips DB (PostgreSQL)**: Source of truth for completed trips, billing, and accounting.

## 6. Handling Edge Cases & Bottlenecks
- **The "Driver in the River" Problem:** A driver is geographically 50 meters away, but there is a river blocking them driving-wise.
  **Solution:** Geohash matching is just the first filter. The final filter MUST use a Routing Map API (like Google Maps Dijkstra algorithm) to find actual driving distance.
- **High volume of pings:** Millions of POST requests a second is too heavy for HTTPS. Use **WebSockets** or **UDP protocols** for the location tracking pings from driver phones. Dropping a ping is fine since we will get another one 3 seconds later.

## 7. Interview "Gotchas"
- Explaining **Geohashing vs Quadtrees**. Geohashes are fixed grids and easy to store in Redis as strings. Quadtrees dynamically split grids when a city gets too dense (New York vs Desert) and are often stored in-memory on local tracking servers. Comparing both shows immense senior-level maturity.
