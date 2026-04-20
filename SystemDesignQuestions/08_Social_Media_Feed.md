# Design a Social Media Feed (Twitter / Instagram)

## 1. Problem Statement
Design a social media feed where users can continuously scroll through posts from people they follow, ordered by time.

### Requirements
- **Functional:**
  - Publish tweets/posts.
  - View the timeline/news feed (posts from all followed users).
  - High availability (viewing the feed should never be down).
- **Non-Functional:**
  - Massive read-to-write ratio (100 reads per 1 write).
  - Fast feed loading (< 200ms latency).

## 2. High-Level Architecture 
```text
           [ App Client ]
                 |
      [ API Gateway / Load Balancer ]
          /                 \
[ Post / Write API ]   [ Timeline / Read API ]
          |                  |
   [ Post DB ]          [ In-Memory Timeline Cache (Redis) ]
          |                  |
[ Fanout Worker ] --> [ Precomputes users' feeds ]
```

## 3. Core Design Concepts & Decisions
To generate a feed for User A, querying `SELECT * FROM posts WHERE user_id IN (User A's 500 followers) ORDER BY time DESC` is way too slow to do in real-time.
We must **Precompute** the feed using the "Fanout" approach.

- **Fanout on Write (Push Model):**
  When User B tweets, a Background Worker fetches all of User B's followers. It takes the Tweet ID and *pushes* it into the Redis Cache of every follower's Timeline list.
  *Pros:* Loading the feed is instant O(1) read from Redis.
  *Cons:* It's terrible for celebrities. If Justin Bieber tweets, pushing to 100M follower caches might take minutes (The "Celebrity Problem").

- **Fanout on Read (Pull Model):**
  Wait to compute the feed until the user opens the app. Just pull all tweets from followed users.
  *Pros:* Fixes the celebrity problem.
  *Cons:* Horribly slow for normal users.

- **Hybrid Model (The Right Answer):**
  Normal users use Fanout-on-Write. Celebrities use Fanout-on-Read. When User A opens their app, the system gets their precomputed feed from Redis, and merges it dynamically with recent celebrity tweets.

## 4. API Design
1. `POST /api/v1/tweets`
2. `GET /api/v1/timeline?cursor=16300050`
   *(Always use cursor-based pagination (e.g. "Get posts older than ID X") instead of offset pagination to avoid jumping when new posts are inserted).*

## 5. Database Schema
**Table: User_Follow** (Graph Database or indexed SQL)
- `follower_id`
- `followee_id`

**Table: Tweet** (NoSQL / Cassandra)
- `tweet_id` (Snowflake ID)
- `user_id`
- `content`

## 6. Handling Edge Cases & Bottlenecks
- **Caching Memory limit:** Storing timelines for 1 Billion users in Redis is too expensive.
  **Solution:** Only keep timelines in Redis for Active Users (logged in within the last 14 days). For inactive users, fallback to calculating their feed via SQL when they suddenly log in.
- **Infinite Scroll:** Only load 20 tweets at a time. The client loads the next 20 using the last `tweet_id` as the pointer.

## 7. Interview "Gotchas"
- Explaining the difference between **Fanout-on-Read** and **Fanout-on-Write** is the entire crux of the Twitter system design problem.
- Explaining **Cursor Pagination vs Offset Pagination** demonstrates senior frontend/API coordination understanding.
