# Design a Distributed Message Queue (Kafka)

## 1. Problem Statement
Design a high-throughput, low-latency, and highly scalable distributed message queue system that decouples data producers from data consumers.

### Requirements
- **Functional:**
  - Producers can publish messages to a "Topic".
  - Consumers can subscribe to a "Topic" and read messages.
  - Data must persist for a configurable retention time (e.g., 7 days).
- **Non-Functional:**
  - Extreme throughput (millions of messages per sec - think LinkedIn logging).
  - High durability (no data loss).
  - Horizontal scalability.

## 2. High-Level Architecture 
```text
 [Producers] -----> [ Broker 1 ] <----- [Consumers Group A]
                    [ Broker 2 ] 
                    [ Broker 3 ] <----- [Consumers Group B]
                         |
                   [ ZooKeeper ]
              (Manages Cluster State)
```

## 3. Core Design Concepts & Decisions
- **Log-Structured Storage Structure:**
  Traditional queues (like RabbitMQ) delete messages after they are read. Distributed queues (like Kafka) do NOT. 
  A Topic is basically an **Append-Only File Log** on disk. When a producer sends a message, it is literally appended to the end of a persistent `.log` file. Disk sequential writes are shockingly fast—faster than some random RAM writes.
- **Partitions:**
  A single Topic (e.g., "PageClicks") is split into many Partitions spread across multiple Brokers. This allows 10 Consumers to read from the "PageClicks" topic at the exact same time simultaneously (parallelism).
- **Consumer Offsets:**
  The server doesn't track who read what. The Consumer itself maintains a pointer/cursor called an `Offset` (e.g., "I am currently reading message #5021 in Partition 3"). It saves this offset periodically. If the consumer crashes and reboots, it just picks up at #5021.
- **Consumer Groups:**
  Multiple applications might want the same data. 
  - Archiving Service (Group 1) reads from Offset 0 to save to Hadoop.
  - Alerting Service (Group 2) reads from the latest Offset to check for real-time fraud.
  Both groups read the exact same immutable Log seamlessly!

## 4. API Concept
Kafka typically uses a custom binary protocol over TCP, not HTTP REST.
1. `produce(topic, key, value)`
2. `consume(topic, group_id) -> returns Stream[Message]`

## 5. Storage Schema (Disk)
- `topic-partition-00/00000000.log` (Contains the raw message bytes).
- `topic-partition-00/00000000.index` (Maps the logical message Offset to the physical byte position in the log file, allowing lightning-fast lookups via binary search).

## 6. Handling Edge Cases & Bottlenecks
- **Speed & Memory:** How is Kafka so fast despite using hard drives?
  **Solution:** Zero-Copy OS technique + OS Page Cache. Kafka doesn't load data into its own application RAM. It tells the Linux Kernel to copy data directly from the disk file to the network socket, bypassing CPU overhead entirely!
- **Durability vs Latency:** 
  Producers can configure `acks`. 
  `acks=0` (Fire and forget, extremely fast, may lose data).
  `acks=all` (Wait for the message to be replicated to all follower Brokers before acknowledging. Slower but 100% durable).

## 7. Interview "Gotchas"
- You must explain the **Append-Only Log** and **Offset** mechanics. Unlike a traditional Queue, reading a message does not pop/delete it.
- Mentioning **Sequential Disk I/O** and **Zero-Copy** will deeply impress the interviewer, proving you understand hardware-level system design.
