# Design a Distributed Notification System

## 1. Problem Statement
Design a centralized service capable of sending out millions of Push Notifications, Emails, and SMS messages per day reliably.

### Requirements
- **Functional:**
  - Send messages via Email, SMS, and Mobile Push.
  - Support high-priority transactional alerts (OTP) vs low-priority marketing.
  - Track open/read rates.
- **Non-Functional:**
  - **No data loss** (If a 3rd party SMS gateway goes down, we shouldn't lose the notification).
  - Prevent duplicate notifications (Idempotency).
  - Scalability (10 Million per minute during major news events).

## 2. High-Level Architecture 
```text
[ Internal Microservices (Auth, Billing) ]
                     |
           [ Notification API ]
                     |
        [ Message Queue (Kafka/RabbitMQ) ]
        /               |                \
 [Push Worker]     [SMS Worker]      [Email Worker]
        |               |                |
   [ APNS/FCM ]     [ Twilio ]       [ SendGrid ]
        \               |                /
    (3rd Party Service sending to Client Phone)
```

## 3. Core Design Concepts & Decisions
- **Decoupling via Message Queues:**
  We cannot process sending an email immediately when the API is hit, because SendGrid might take 2 seconds to respond. The API must validate the request, put it in a Kafka/RabbitMQ queue, and return `202 Accepted` immediately. Workers consume from the queue asynchronously.
- **Failures and Dead Letter Queues (DLQ):**
  If Twilio's API is fully down, the SMS Worker will fail. We don't drop the message. We implement **Exponential Backoff** (retry in 1m, 5m, 15m). If it fails 5 times, we move it to a "Dead Letter Queue" for manual engineering review.
- **Idempotency (No duplicates):**
  If a worker successfully sends an SMS, but crashes before it deletes the task from the Queue, another worker will pick it up and dual-send the user an SMS. To fix this, we store a `notification_id` or hash in Redis. Before sending, the worker checks `EXISTS(hash)`. If yes, it skips.

## 4. API Design
1. `POST /api/v1/notify`
   Payload: 
   ```json
   {
      "user_id": 123,
      "type": "SMS",
      "content": "Your flight is delayed.",
      "priority": "HIGH"
   }
   ```

## 5. Database Schema
**Table: Notification_Log** (Cassandra or PostgreSQL)
- `id` (PK)
- `user_id`
- `status` (PENDING, SENT, FAILED)
- `provider_response_id` (Crucial for debugging with Twilio/SendGrid)
- `timestamp`

## 6. Handling Edge Cases & Bottlenecks
- **Priority Queues:** We don't want someone's password-reset Email getting stuck behind 5 Million Black Friday marketing emails. **Solution:** Create separate Kafka topics: `email-high-priority` and `email-batch-marketing`. 
- **Rate Limits from 3rd Parties:** Apple APNS or Twilio will throttle us if we send too fast. Our workers must respect 3rd party rate limits using a local Token Bucket rate limiter before firing the HTTP request.

## 7. Interview "Gotchas"
- Always highlight **Idempotency** and the concept of **Exponential Backoff + DLQ**. It proves you understand that 3rd party APIs will fail, and your system handles it gracefully without spamming the user or dropping alerts.
