# API Debugging Strategy – Quick Interview Revision

During System Design and behavioral rounds, you will be given incident scenarios and asked how to debug them. Use this runbook:

1. **Some Users Slow, Others Fine**
   - *Check:* Massive user data size, Cache miss for their region, Premium feature code-path, User-specific DB locks, Payload differences.
   - *Strategy:* Retrieve logs from a "Slow" user and trace it against a "Fast" user.

2. **All Users Slow**
   - *Check:* Global traffic spike (DDOS), DB connection pool exhaustion, Entire Cache cluster down, External dependency response time, Recent deployment regression.
   - *Strategy:* Check shared bottlenecks. If caused by a sudden recent deployment, rollback immediately.

3. **CPU Normal but API Slow**
   - *Check:* Waiting on a slow Database, DB Row Locks, 3rd Party External API hanging, DNS resolution, Thread starvation.
   - *Strategy:* Normal CPU means the server is *waiting* for IO. Inspect waits/blocking paths.

4. **DB Healthy but API Slow**
   - *Check:* Connection pool maxed out at the API layer, ORM `N+1` query problems, Retry storms from microservices, Network latency between EC2 and RDS.
   - *Strategy:* DB server health doesn't equal query execution health. Look at the application layer metrics.

5. **Memory Fine but Slow API**
   - *Check:* Garbage Collection (GC) pauses ("Stop The World"), Object churning, Heap pressure, Memory leaks.
   - *Strategy:* Extract GC logs and check heap allocation metrics.

6. **p50 Latency Good, p99 Latency Bad**
   - *Check:* One specific buggy Pod/Server, One specific Database Shard performing poorly, Retry mechanisms randomly firing, Cold cache hits, Sporadic GC spikes.
   - *Strategy:* Investigate the outliers. Do not trust average response times.

7. **Errors are Zero but Users Say It's Slow**
   - *Check:* High latency close to timeout thresholds, Client making hidden background retries masking the issue.
   - *Strategy:* Stop looking at 4xx/5xx logs. Look closely at p95/p99 latency charts.

8. **Only Write APIs Slow**
   - *Check:* DB Row/Table locks, Massive Transactions open too long, Hot Rows, Synchronous calls directly to downstream services during saves.
   - *Strategy:* Inspect lock waits and analyze the write path solely.

9. **Only Read APIs Slow**
   - *Check:* Missing Database Indexes, Massive Full Table Scans, Cache miss storms, Querying with heavy JOINS.
   - *Strategy:* Run `EXPLAIN ANALYZE` on SQL queries and assess cache hit ratios.

10. **Only One Pod / Container Slow**
    - *Check:* Bad underlying physical Node, Container-specific memory leak, CPU throttling limits hit, Stale network connections.
    - *Strategy:* Terminate/Restart the Pod immediately to restore health, analyze metrics post-mortem.

11. **One Specific Region Slow**
    - *Check:* Local CDN pop-node issues, DNS routing anomalies, Regional Load Balancer failures, DB Replica lag from master.
    - *Strategy:* Compare region dashboards.

12. **Slow Immediately After Deployment**
    - *Check:* Code regression, Configuration drift/change, New unoptimized SQL executed, DB Connection Pool size altered.
    - *Strategy:* **Rollback first**, figure out the RCA (Root Cause Analysis) in staging later.

13. **Worked in QA, Broke in Prod**
    - *Check:* Scale difference (Production has millions of rows vs QA's 100 rows), Real high-concurrency traffic vs single-user QA, Dirty production data, 3rd party latency.
    - *Strategy:* Remember: QA validates logic, Production validates scale.

14. **Slowdown Happens Every Hour Consistently**
    - *Check:* Background CRON jobs, DB Backups running, Heavy ETL pipelines extracting data, Expiring/refreshing cache batches.
    - *Strategy:* Correlate API drops with background schedule charts.

15. **Message Queue Continuously Growing**
    - *Check:* Consumers are too slow handling messages, Poison pill messages crashing consumer retries, Downstream dependency delays blocking consumer.
    - *Strategy:* Auto-scale consumers or optimize consumer execution time.

16. **Cache Server is Healthy but APIs are Slow**
    - *Check:* Low cache hit ratio (meaning API relies on DB anyway), Hot Key problems (one node routing all traffic), Cache stampede/thundering herd.
    - *Strategy:* Server health does not equal cache usefulness. Analyze eviction rates and hit patterns.

17. **External Dependency (Stripe/Auth) Slow**
    - *Strategy:* Enforce hard timeouts, implement fallbacks, and instantly trip the Circuit Breaker to prevent cascading failures to your own DB pool.

18. **Traffic Volume is the Same but Latency Doubled**
    - *Check:* Unexpected Cache droppage causing everything to hit the DB, SQL Query Plan altered dynamically by DB engine.
    - *Strategy:* Focus on system efficiency metrics, not traffic volume.

19. **Sudden Spike in DB CPU**
    - *Check:* Someone dropped an index, Full Table scans, Cache cluster went offline, Aggressive traffic burst.
    - *Strategy:* Look at `pg_stat_statements` or `MySQL Slow Query Log` immediately.

20. **Only the Login API is Slow**
    - *Check:* Upstream Auth Provider (Okta/Auth0) hanging, Heavy CPU usage from Token signing (JWT hashing), Session store (Redis) latency.
    - *Strategy:* Trace the authentication/authorization chain specifically.
