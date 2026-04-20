# Design Search Autocomplete (Typeahead Suggestion)

## 1. Problem Statement
Design a system that suggests the top 5 search queries in real-time as the user types characters into a search box (like Google Search).

### Requirements
- **Functional:**
  - Suggest Top 5 related searches based on historical query frequency.
- **Non-Functional:**
  - Blazing fast response time (< 50ms). Humans type fast; the backend must keep up.
  - Highly available.
  - Handle massive read loads.

## 2. High-Level Architecture 
```text
           [ App Client ]
                 |
      [ API Gateway (Throttling) ]
       /             \
[ Query API ]   [ Data Collection Worker ]
      |                |
[ Redis Trie]   [ Cassandra / Hadoop ]
```

## 3. Core Design Concepts & Decisions
- **Data Structure (Trie):**
  We cannot run `SELECT * FROM queries WHERE text LIKE 'app%' ORDER BY count DESC LIMIT 5` on every keystroke. It will crash any database.
  **Solution:** Use a **Trie (Prefix Tree)** stored purely in-memory (RAM / Redis). 
  - Each node represents a character.
  - "a" -> "p" -> "p" -> "l" -> "e".
  - Finding words starting with a prefix just traverses down the tree.

- **Precomputing Top K:**
  Even with a Trie, searching the entire subtree "a->p->p" for the 5 most frequent terms takes too long if there are millions of possibilities.
  **Solution:** We store the Top 5 most frequent search queries *inside the node itself*. When the user types "a-p-p", we just hit the "p" node and immediately return the pre-calculated Top 5 array stored there. O(1) response!

- **Data Gathering (Offline processing):**
  Every time a user actually clicks "Search for 'apple iphone'", we log it to a Data Pipeline (Kafka -> Hadoop/Spark). Once a week, an offline MapReduce job calculates the new frequency weights, recreates a completely new Trie, and live-swaps it onto the servers. We NEVER update the Trie live on every search!

## 4. API Design
1. `GET /api/v1/search/autocomplete?prefix=app`
   Returns: `["apple", "apple tv", "app store", "apple watch", "apple carplay"]`

## 5. Database / Storage Schema
- **Hadoop / Big Data Cluster:** Raw log data of `{ "query": "apple", "timestamp": "..." }`.
- **In-Memory Trie Node (Redis/App Server RAM):**
  ```json
  {
    "character": "p",
    "children": ["l", "e", "s"],
    "top_queries": [
       {"query": "apple", "weight": 50000},
       {"query": "apple watch", "weight": 30000}
    ]
  }
  ```

## 6. Handling Edge Cases & Bottlenecks
- **Network Traffic overload:** If users type 120 WPM, that's multiple API calls a second per user.
  **Solution:** Throttling/Debouncing on the client side. Only send the request if the user hasn't typed for 50 milliseconds. Also, the client caches previous results. (If they type "app" -> backspace -> "app", don't hit the server).
- **Scale:** A massive Trie might exceed server RAM.
  **Solution:** Shard the Trie. Shard by the first character. Servers A-M compute prefixes starting with A through M. 

## 7. Interview "Gotchas"
- Interviewers love asking how you manage to read from the Trie while it's being updated. The trick is **you don't**. You construct the new Trie entirely offline in the background. Once finished, you do an atomic pointer swap (switching the root node reference) to the new Trie. Zero downtime.
