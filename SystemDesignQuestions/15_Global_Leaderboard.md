# Design a Global Leaderboard System (Gaming / LeetCode)

## 1. Problem Statement
Design a real-time leaderboard for a massive multiplayer game or platform where millions of users are constantly gaining points, and anyone can instantly view the Top 100 players or their own exact global rank.

### Requirements
- **Functional:**
  - Update user score (`+10 points`).
  - Get the Top K players (Global Top 100).
  - Get the specific rank of a given user (e.g., User A is rank #1,432,019).
- **Non-Functional:**
  - Scalable to 50+ Million active players updating scores constantly.
  - Sub-millisecond latency for rank retrieval.

## 2. High-Level Architecture 
```text
           [ App Client ]
                 |
          [ API Gateway ]
                 |
      [ Leaderboard Service ]
       /                   \
[ Redis (ZSET) ]    [ Relational DB (MySQL) ]
(In-Memory Fast)    (Persistent Backup)
```

## 3. Core Design Concepts & Decisions
- **Why SQL fails here:**
  Running `SELECT COUNT(*) FROM players WHERE score > my_score` takes several seconds on a table of 50M rows. Doing this thousands of times a second crashes the DB.
- **The Perfect Solution: Redis Sorted Sets (ZSET)**
  Redis natively supports a data structure called a Sorted Set. Under the hood, it's implemented using a **Skip List** and a Hash Map.
  - Adding/Updating a score (`ZADD`): `O(log N)`
  - Fetching Top 100 (`ZREVRANGE`): `O(log N + 100)`
  - Getting my exact rank (`ZREVRANK`): `O(log N)`
  This operates completely in RAM, responding in low milliseconds even with millions of elements.

## 4. Scaling Beyond One Redis Node
A single Redis thread maxes out around 100k operations per second and maybe 50GB RAM. If our game is globally popular, we must partition.
- **Sharding by Score Range:**
  Instead of one giant leaderboard, we split it across 3 Redis clusters.
  - Node A: Scores 0 - 1000
  - Node B: Scores 1001 - 5000
  - Node C: Scores > 5000
  If a user has 1200 points, we update Node B. 
  To get their global rank, Node B calculates their local rank, and the service adds the *total user count* of Node C (since everyone in Node C has a higher score).

## 5. API Design
1. `POST /api/v1/score`
   Payload: `{ "user_id": 99, "points": 10 }`
2. `GET /api/v1/leaderboard/top?limit=100` -> Returns Top 100
3. `GET /api/v1/leaderboard/user/{user_id}` -> Returns user's exact rank and score.

## 6. Handling Edge Cases & Bottlenecks
- **Ties / Same Score:** Redis ZSET sorts items with the exact same score lexicographically (alphabetically by UserID). If you want ties to be broken by "Who got the score first", you can modify the score float (e.g., integer score + timestamp as a decimal fraction).
- **Persistence:** Redis is in-memory. If the cluster reboots, the entire leaderboard is gone.
  **Solution:** Every time a user wins a match, we asynchronously log the definitive win/score in a persistent MySQL database (The Source of Truth). We use Redis AOF (Append Only File) to back up RAM to disk. If Redis completely dies, we run a batch script parsing the MySQL data to rebuild the Redis ZSET.

## 7. Interview "Gotchas"
- Explaining the underlying time complexity of the Redis ZSET (**Skip List implementation**) shows deep computer science knowledge beyond just memorizing "use Redis".
- Exploring how to handle **Ties** in rankings proves you think about edge cases.
