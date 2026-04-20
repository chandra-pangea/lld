# Design a Distributed Cache (Redis / Memcached)

## 1. Problem Statement
Design an in-memory key-value store that sits in front of a database database to absorb heavy read traffic. 

### Requirements
- **Functional:**
  - Put(key, value, TTL)
  - Get(key)
  - Eviction when memory is full.
- **Non-Functional:**
  - High Availability (Data isn't lost if a node crashes).
  - High Scalability (Can hold petabytes of data by grouping machines).
  - Lightning fast (sub-millisecond reads).

## 2. High-Level Architecture 
```text
           [ App Server / Client ]
             (Uses Cache-aside)
                     |
       [ Consistent Hashing Ring Array ]
      /           |            |           \
[Node 1]      [Node 2]     [Node 3]     [Node 4]
```

## 3. Core Design Concepts & Decisions
- **Memory Management & Eviction:**
  When a node runs out of physical RAM, it needs to delete data. The most common solution is **LRU (Least Recently Used)**. Data structures used: A **HashMap** (for O(1) lookups) + a **Doubly Linked List** (so we can move recently accessed nodes to the front in O(1) time).
- **Partitioning Data (Consistent Hashing):**
  If we have 3 cache servers, how do we know which server holds `Key="user123"`?
  Simple Hash: `hash("user123") % 3 = Node 1`.
  *Problem:* If we add a 4th server, the formula becomes `% 4`, entirely breaking the hash mapping for EVERYTHING, causing a total cache miss storm.
  *Solution:* **Consistent Hashing**. We plot nodes on a virtual "Hash Ring" (0 to 360 degrees). We hash the key, land on the ring, and walk clockwise to the closest Node. Adding a server only redistributes a small local fraction of keys, not all of them.
- **High Availability (Replication):**
  Each Primary Cache Node has an asynchronous Replica/Follower. If the Primary dies, Zookeeper or a Gossip Protocol promotes the Replica to Primary seamlessly.

## 4. API / Interaction
Usually uses TCP sockets with custom lightweight binary protocols (like RESP in Redis) instead of HTTP/REST for maximum speed.
`SET("user:123:session", "{data}", "EX", 3600)`

## 5. Storage Structure
Inside a single Node:
- A massive Hash Table handling string arrays.
- A background Thread periodically checking and cleaning up TTL (Time To Live) expired keys.

## 6. Handling Edge Cases & Bottlenecks
- **Thundering Herd / Cache Stampede:**
  A famous celebrity's profile expires from the cache. Suddenly, 50,000 requests hit the server, miss the cache, and hit the SQL database at the EXACT same millisecond. The database instantly crashes.
  **Solution:** **Mutex/Distributed Locks.** When a cache miss occurs, the first thread acquires a lock to query the DB. All other threads must wait exactly 50ms and try the cache again.
- **Hot Keys:**
  One specific key (e.g., Donald Trump's tweet) gets exponentially more traffic than others, overloading Node 2 while Node 1 and 3 are idle.
  **Solution:** Manually replicate "Hot" keys across ALL nodes. When an app server requests a hot key, randomly select a node.

## 7. Interview "Gotchas"
Drawing a basic box that says "Redis" is not designing a cache! You need to explicitly explain **Consistent Hashing** to handle node additions, and the **LRU HashMap + Doubly Linked List** implementation. Knowing about "Cache Stampede" is highly impressive.
