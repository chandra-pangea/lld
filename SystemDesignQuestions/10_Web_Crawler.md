# Design a Web Crawler (Google Search Indexer)

## 1. Problem Statement
Design a distributed bot infrastructure that can download, parse, and store billions of web pages from the internet to create a search engine index.

### Requirements
- **Functional:**
  - Traverse the web starting from seed URLs.
  - Download HTML, extract new URLs, and save the content.
- **Non-Functional:**
  - Robustness (handle infinite loops, spider traps, malicious HTML).
  - Politeness (do not DDOS servers by crawling them too fast).
  - Scale (crawling the entire surface web).

## 2. High-Level Architecture 
```text
[ Seed URLs ] ---> [ URL Frontier (Kafka / Redis) ]
                                |
                   [ Distributed Fetcher Workers ] -> (Internet)
                                |
                      [ HTML Parser / DNS Cache ]
                                |
                   [ Content Deduplication Filter ]
                   /                            \
      [ Extract new URLs ]                  [ Save to Storage ]
```

## 3. Core Design Concepts & Decisions
- **URL Frontier (The Queue):**
  This is the brain. It contains all URLs that need to be downloaded. It's essentially a massive Priority Queue using **Breadth-First Search (BFS)** logic. Using DFS is a bad idea because you will get stuck deep in a single domain's hierarchy.
- **Politeness / Rate Limiting:**
  You must ensure you don't overwhelm "smallblog.com". Your URL Frontier groups URLs by **hostname**. It ensures that no single worker fetches from "smallblog.com" more than once per second.
- **Deduplication (Bloom Filters):**
  If two sites link to "wikipedia.com/Apple", we don't want to process the string twice. Checking an expanding SQL database of billions of URLs to see `IF EXISTS` is impossibly slow.
  **Solution:** Use a **Bloom Filter**. It's a hyper-memory-efficient probabilistic data structure. It can answer "Definitely No" or "Probably Yes" instantly in RAM. We use it to filter out URLs we've already seen.

## 4. Crawling Workflow
1. Pick URL from Frontier.
2. Resolve IP using local DNS Cache (DNS resolution is a huge bottleneck, caching is mandatory).
3. Download HTML.
4. Check Content Hash (MD5). Is this a duplicate page on a different URL? If yes, discard.
5. Extract `href` links from the HTML.
6. Check Bloom Filter. Have we crawled these links before?
7. If no, append them back to the end of the URL Frontier.

## 5. Storage
- **Metadata DB (Cassandra):** Stores URL state, last crawled timestamp, page rank score.
- **Raw Document Storage (Hadoop / HDFS / AWS S3):** Stores the actual compressed HTML binaries for the Indexing engine to parse later.

## 6. Handling Edge Cases & Bottlenecks
- **Spider Traps:** A malicious site generates dynamic endless URLs (`/dir1/dir2/dir3...`).
  **Solution:** Set a maximum depth limit per domain (e.g., max 15 slashes deep).
- **Stale Content:** How do we update pages?
  **Solution:** The system tracks how frequently a page changes. A news site gets re-added to the Frontier Priority Queue every hour. An old Wikipedia page gets re-added once a month.

## 7. Interview "Gotchas"
- Without mentioning **Bloom Filters** to prevent re-crawling URLs and **DNS Resolution Caching**, your design will fail the scaling test.
- Be adamant about the **Politeness Policy** (parsing `robots.txt` and delaying requests to the same host). Interrogators specifically look to see if you respect the rules of the internet.
