# Design a Distributed Rate Limiter

## 1. Problem Statement
Design an API rate limiter that restricts the number of requests a client can make to a server over a given timeframe (e.g., 5 requests per minute per IP or per API Key).

### Requirements
- **Functional:**
  - Allow/block requests based on predefined limits (e.g., `api_key: 10/min`).
  - Send HTTP 429 "Too Many Requests" when limits are exceeded.
- **Non-Functional:**
  - Nearly zero latency (must not slow down the actual API call).
  - High availability (if the rate limiter goes down, the API should still work).
  - Shared state across multiple load balancers in a distributed setup.

## 2. High-Level Architecture 
```text
[ Client ] ---> [ API Gateway / Load Balancer ] ---> [ App Servers ]
                           |
            [ Rate Limiting Middleware/Service ]
                           |
                  [ Redis Cluster ]
```

## 3. Core Design Concepts & Decisions
- **Why Redis?** 
  We need extremely fast, in-memory data storage to avoid latency. Redis supports atomic operations (using Lua scripts) which prevents race conditions when tracking limit counters across multiple API Gateways.
- **Which Algorithm should we use?**
  1. *Token Bucket:* Best overall. Companies like Amazon and Stripe use this. A bucket has a max capacity of tokens. Every request removes a token. A cron worker refills tokens at a steady rate.
  2. *Sliding Window Log:* Tracks exact timestamps. Highly accurate but consumes too much memory (logging every request timestamp).
  3. *Sliding Window Counter:* The sweet spot. Breaks time into fixed windows (e.g., 1 min) and uses a weighted average between the previous minute's counter and the current minute to smooth out traffic spikes.

## 4. How the Bucket Algorithm Works (Token Bucket)
- **Data in Redis:** `{ "apikey_123_tokens": 8, "last_refill": "10:05:00" }`
- **When request arrives:**
  1. Fetch `tokens` and `last_refill` from Redis.
  2. Calculate how many tokens to refill based on elapsed time.
  3. If `tokens > 0`, decrement and allow.
  4. If `tokens == 0`, drop request (HTTP 429).
  *(All of this is wrapped in a single Redis Lua Script for atomicity).*

## 5. API Response Headers
When rate limiting, always supply helpful HTTP headers to the client:
- `X-Ratelimit-Remaining`: Tokens left.
- `X-Ratelimit-Limit`: Max limit per window.
- `X-Ratelimit-Retry-After`: How many seconds to wait before trying again.

## 6. Handling Edge Cases & Bottlenecks
- **Race conditions:** Two API streams hit two load balancers at the exact same millisecond. If we do a traditional Read -> Decrement -> Write, we will miscount. **Solution**: Redis `INCR` command or atomic Lua scripts.
- **Hard vs Soft Limits:** What if it's an internal service spiking? We might use a "Soft" limit that allows requests but routes them to a priority queue, or just triggers an alert.
- **Fail-open:** If the Redis cluster crashes entirely, the Rate Limiter should "fail open" (allow requests to pass through) rather than taking down the entire company's product.

## 7. Interview "Gotchas"
The interviewer will inevitably ask: "What if there are 10 distributed API Gateways spread across the globe? How do they sync limits?"
- **Answer:** You shouldn't sync multiple disconnected Redis databases due to latency. Instead, use a centralized Redis cluster (e.g., one in US-East, one in EU). If latency to Redis is too high, use Local Memory Counters on the Gateway servers, and sync the local counters to Redis asynchronously every 1 second (Eventual Consistency model).
