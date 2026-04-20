# Design a Real-Time Chat App (WhatsApp / Discord)

## 1. Problem Statement
Design a system allowing users to send real-time 1-on-1 text messages, participate in group chats, and see online/offline status presence.

### Requirements
- **Functional:**
  - 1-on-1 and Group messaging.
  - Real-time message delivery.
  - Online/Offline user presence.
  - Message history / persistent storage.
- **Non-Functional:**
  - Extremely low latency.
  - Scale: 1 Billion active users, sending millions of messages a second.

## 2. High-Level Architecture 
```text
           [ Client A ]                [ Client B ]
                |                           |
         [ Load Balancer ]           [ Load Balancer ]
                |                           |
        [ WebSocket Server 1 ] --- [ WebSocket Server 2 ]
                 |                          |
          [ Message Queue (Kafka / RabbitMQ) ]
                 |
      [ Chat Service API (REST) ] -> [ Key-Value Store (Cassandra) ]
                 |
       [ Presence Service (Redis) ]
```

## 3. Core Design Concepts & Decisions
- **Protocols:**
  HTTP is terrible for real-time chat because the client has to keep asking "Do I have a new message?" (Polling).
  Instead, we use **WebSockets** for a persistent, bi-directional connection. A user connects to ONE WebSocket server and holds that TCP connection open.
- **Routing Messages:**
  When User A sends a message to User B:
  1. A sends to WebSocket Server X.
  2. Server X checks Redis "Session Cache" -> "Where is User B connected?".
  3. User B is on WebSocket Server Y.
  4. Server X publishes the message to a Queue/PubSub, Server Y consumes it and pushes it down the pipe to User B.
- **Database Choice:**
  Chat histories create insane volumes of time-series data with heavy writes and very sequential range reads. Use a **Wide-Column NoSQL like Cassandra or HBase**. Relational DBs will crumble under this write load.

## 4. API Design
Unlike normal apps, most data goes through WebSockets. But some APIs are REST:
1. `POST /v1/auth/login` -> Returns a Token + IP of the WebSocket server to connect to.
2. `GET /v1/chat/history?user_id=123&limit=50&before_msg_id=X` (REST is used to fetch old history when scrolling up, saving WebSocket bandwidth).

## 5. Database Schema (Cassandra)
**Table: Messages**
- `chat_id` (Partition Key) - To group all messages for a specific 1-on-1 or Group.
- `message_id` (Clustering Key) - Snowflake ID generated based on timestamp to auto-sort messages chronologically.
- `sender_id`
- `content`
- `created_at`

## 6. Handling Edge Cases & Bottlenecks
- **Message Ordering:** How do we guarantee ordered messages in a distributed system where network latency varies?
  **Solution:** DO NOT trust client timestamps. Generate a unique, time-sortable ID roughly ordered by time on the server. Examples: Twitter Snowflake ID or logical clocks. The database sorts by this ID automatically.
- **Online Presence (Is User Typing?):**
  A Presence Service updates Redis (`{ "User_A": "Online" }`). But users disconnect abruptly (subway tunnel). Use a "Heartbeat" protocol via WebSockets that pings every 5 seconds. If missed 3 times, mark them offline.

## 7. Interview "Gotchas"
- You must explain that **WebSockets are Stateful** (Session is tied to one specific machine) while REST APIs are **Stateless**. That means Auto-Scaling WebSocket servers is much harder and requires a Redis layer to map *which user is connected to which server IP.*
