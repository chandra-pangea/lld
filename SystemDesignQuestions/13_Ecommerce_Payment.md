# Design an E-Commerce Checkout / Payment System (Amazon)

## 1. Problem Statement
Design an e-commerce checkout flow handling cart finalization, inventory deduction, and payment processing reliably.

### Requirements
- **Functional:**
  - User submits cart.
  - Deduct items from inventory.
  - Process credit card payment via 3rd party (Stripe/PayPal).
  - Create the order for fulfillment.
- **Non-Functional:**
  - **ACID properties:** We cannot charge the card if inventory fails. We cannot deduct inventory if the card declines.
  - Fault tolerance (handling distributed failures).
  - High availability.

## 2. High-Level Architecture (Microservices)
```text
           [ Checkout API ]
            |      |      |
     [Order Svc] [Inv Svc] [Payment Svc]
         |         |          |
      [ DB ]     [ DB ]     [ DB ]
```

## 3. Core Design Concepts & Decisions
- **Microservices & the Distributed Transaction Problem:**
  In a monolith, we just use one SQL database and run `BEGIN TRANSACTION; UPDATE inventory AND INSERT order AND INSERT payment; COMMIT;`. If one fails, the DB rolls back.
  In a microservice world, Inventory has its own DB, and Order has its own DB. **Two-Phase Commit (2PC)** is too slow and locks databases.
- **Solution: The SAGA Pattern:**
  We implement a sequence of local transactions using event choreography or orchestration.
  1. *Order Service* creates order (Status: PENDING). Sends Event to Kafka.
  2. *Inventory Service* reads event, locks items successfully. Sends Event.
  3. *Payment Service* calls Stripe. (Assume it FAILS – Card Declined).
  4. Payment Service fires a `PaymentFailedEvent`.
  5. **Compensating Transactions:** The Inventory service hears this and *unlocks* the items. The Order service marks order as `CANCELLED`.
- **Payment Idempotency:**
  If our server crashes right after Stripe successfully charges the card, but before we save it, we might retry the charge when the server reboots. To prevent charging the user twice, we generate a unique `Idempotency-Key` (UUID) assigned to the checkout button. We send this to Stripe. Stripe remembers the key; if we accidentally send it twice, Stripe just returns the success receipt for the first one without double-charging.

## 4. API Design
1. `POST /api/v1/checkout/execute`
   Headers: `Idempotency-Key: uuid-1234`
   Payload: `{ "cart_id": 99, "payment_token": "tok_visa" }`

## 5. Database Schema
**Table: Orders (PostgreSQL)**
- `order_id` (PK)
- `user_id`
- `status` (PENDING, PAID, SHIPPED, CANCELLED)
- `total_price`

**Table: Ledger (Cassandra/SQL)**
- Immutable ledger tracking every financial movement (event sourcing style) for accounting.

## 6. Handling Edge Cases & Bottlenecks
- **Inventory Race Conditions:** Two people click buy on the last "PS5". 
  **Solution:** Row-level locking on the inventory table (`SELECT * FROM inventory WHERE item='PS5' FOR UPDATE`).
- **Asynchronous Payment Webhooks:** Sometimes Stripe doesn't respond instantly. We put the order in `PROCESSING` state and rely on Stripe to hit our Webhook API (`POST /webhooks/stripe`) asynchronously 5 minutes later to confirm payment.

## 7. Interview "Gotchas"
- Explaining the **SAGA Pattern (Compensating Transactions)** is the gold standard for e-commerce design.
- The concept of passing an **Idempotency Key** to the payment gateway shows true real-world enterprise experience.
