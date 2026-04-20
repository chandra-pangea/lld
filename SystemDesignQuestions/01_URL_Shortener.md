# Design a URL Shortener (TinyURL / Bitly)

## 1. Problem Statement
Design a service that takes a long URL and generates a short and unique URL. When users click the short URL, they are redirected to the original long URL.

### Requirements
- **Functional:**
  - Generate a shortened URL given a long URL.
  - Redirect directly to the original URL when the short URL is accessed.
  - Custom short URLs.
  - Link expiration.
- **Non-Functional:**
  - High Availability (Redirects cannot fail).
  - Low latency (Redirects must be fast).
  - Scalability (100 million URLs generated per day -> billions read).

## 2. High-Level Architecture 
```text
          [ Client ]
              |
      [ API Gateway / Load Balancer ]
              |
      [ Read/Write API Servers ]
        /           \
[ Caching (Redis) ]  [ Relational DB / NoSQL DB ]
                        |
            [ Key Generation Service (KGS) ]
```

## 3. Core Design Concepts & Decisions
- **Encoding Strategy:** 
  We use Base62 encoding (A-Z, a-z, 0-9 = 62 characters). A 7-character string in Base62 gives `62^7 = ~3.5 Trillion` combinations, which is more than enough.
- **Key Generation Service (KGS):**
  Instead of generating keys on the fly (which causes collisions and requires DB locks), we pre-generate unique 7-character strings using an offline Key Generation Service (using Zookeeper to manage ranges) and load them into a `unused_keys` database table. The API just grabs a pre-generated key instantly!
- **Database Choice:** 
  Since the data relationship is just Key-Value without complex joins, we can use a **NoSQL database (like DynamoDB or Cassandra)** for high scalability. However, PostgreSQL/MySQL is fine too if we shard it based on the short URL hash.

## 4. API Design
1. `POST /api/v1/data/shorten`
   Param: `{ "original_url": "https://...", "custom_alias": "myname" }`
   Return: `201 OK`, `{ "short_url": "https://tinyurl.com/aBc12x" }`
2. `GET /api/v1/{short_url_key}`
   Return: `301 Moved Permanently` or `302 Found` + `Location: <Original URL>`

*(Note: `301` means the browser caches the redirect, taking load off our servers. `302` means the browser checks our server every time, useful for tracking analytics/clicks).*

## 5. Database Schema
**Table: URL_Mapping**
- `hash_key` (VARCHAR 7, Primary Key)
- `original_url` (VARCHAR 2048)
- `created_at` (TIMESTAMP)
- `expiration_date` (TIMESTAMP)
- `user_id` (INT)

## 6. Handling Edge Cases & Bottlenecks
- **DB Bottleneck:** 100M writes/day is ~1160 writes/sec, but reads are 100x higher. 
- **Solution:** Add a caching layer (Redis or Memcached). Store the top 20% most accessed URLs. Cache eviction policy: LRU.
- **Malicious Users:** Rate Limiting via API Gateway (based on API key or IP address).
- **Cleanup:** A sweeping background worker runs daily, checking `expiration_date` and deleting old records, putting the `hash_key` back into KGS.

## 7. Interview "Gotchas"
The interviewer is testing if you know **how to avoid DB collisions** when two users submit links at the exact same millisecond. Proposing the offline **Key Generation Service (KGS)** is the "magic bullet" answer that gets you hired for this question.
