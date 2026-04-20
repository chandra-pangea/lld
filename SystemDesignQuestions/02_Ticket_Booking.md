# Design a Ticket Booking System (BookMyShow / Ticketmaster)

## 1. Problem Statement
Design a system where users can view movies/events, select specific seats in a theater, and securely book them without double-booking.

### Requirements
- **Functional:**
  - View events, cities, and theaters.
  - Select seats from a seating chart.
  - Lock seats temporarily for 10 minutes during payment checkout.
  - Complete booking and send ticket.
- **Non-Functional:**
  - **High Concurrency** (Thousands of users clicking the same seat for popular concerts).
  - Absolute **Consistency** (ACID) - No two people can buy the exact same seat.
  - Good latency for searching.

## 2. High-Level Architecture 
```text
           [ Client Mobile/Web ]
                   |
            [ API Gateway ]
       /           |           \
[Search Svc]  [Booking Svc]  [Payment Svc]
     |             |                |
[Elasticsearch] [SQL DB]     [Third Party Gateway]
                   |
            [Redis Distributed Lock]
```

## 3. Core Design Concepts & Decisions
- **Database Choice:** 
  You absolutely **MUST** use an RDBMS (Relational Database like MySQL/PostgreSQL) because you need **ACID Transactions** with Row-Level Locking (e.g., `SELECT ... FOR UPDATE`) to prevent double-booking. NoSQL is a bad choice here.
- **Handling Concurrency (The "Hold"):** 
  When User A selects Seat 1, we must lock it so User B can't even try to buy it. We use a **Redis Distributed Lock** (or DB row lock) with a TTL (Time To Live) of 10 minutes. If User A doesn't pay in 10 mins, the lock expires automatically and the seat becomes available to others.
- **Search Heavy:**
  Searching for movies, cities, and theaters is 99% of the traffic. This data rarely changes (movies/theaters are static). We sync this data to **Elasticsearch** or heavily cache it in Redis.
  
## 4. API Design
1. `GET /api/v1/events/{id}/seats` -> Returns matrix of seat availability.
2. `POST /api/v1/booking/reserve` 
   Param: `{ "event_id": 12, "seats": ["A1", "A2"] }`
   Return: `200 OK` (Seats locked, proceed to payment) or `409 Conflict` (Seat taken).
3. `POST /api/v1/booking/confirm`
   Param: `{ "booking_id": 12345, "payment_token": "abc..." }`

## 5. Database Schema
**Table: Show_Seat**
- `show_id` (FOREIGN KEY)
- `seat_id` (FOREIGN KEY)
- `status` (ENUM: AVAILABLE, RESERVED, BOOKED)
- `locked_until` (TIMESTAMP)

## 6. Handling Edge Cases & Bottlenecks
- **Surge Traffic (Taylor Swift Concert):** 
  A massive spike in traffic can crash the SQL DB. **Solution:** Implement a Virtual Waiting Room Pipeline (Message Queue based) that funnels a rate-limited number of users to the seating chart page at a time.
- **Payment Failures:** 
  If the payment gateway fails, the API marks the transaction as failed, releases the seat lock in Redis/SQL, and broadcasts an update via WebSockets to users viewing the seating chart.

## 7. Interview "Gotchas"
- Mentioning **"Transactions isolation levels"**. Specifically, using `Serializable` or Row-Level Locking (`SELECT * FROM Show_Seat WHERE seat_id = 1 AND status = 'AVAILABLE' FOR UPDATE`) is the key to passing this interview.
- Never suggest NoSQL (like MongoDB) for the actual booking transaction leg, as handling complex rollback logic manually is an anti-pattern for this specific problem.
