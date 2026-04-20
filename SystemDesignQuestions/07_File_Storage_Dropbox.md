# Design a File Sync / Cloud Storage Service (Dropbox / Google Drive)

## 1. Problem Statement
Design a service where users can upload, share, and continually sync files seamlessly across multiple devices (Mobile, Desktop App, Web).

### Requirements
- **Functional:**
  - Upload, download, and update files.
  - Sync updates automatically to all logged-in devices.
  - Support large files (up to 50 GB).
- **Non-Functional:**
  - Save bandwidth (don't upload a 50GB file if someone just changed 1 word).
  - High durability (ACID compliance for file metadata, 99.9999% durability for actual file bytes).

## 2. High-Level Architecture 
```text
                  [ User's Desktop Client ]
                 /                         \
    [ Metadata API (REST) ]       [ Block / File API (gRPC/HTTP) ]
             |                                 |
[ Message Queue (RabbitMQ) ]           [ Cloud Storage ]
             |                             (e.g. AWS S3)
[ Database (PostgreSQL) ]
```

## 3. Core Design Concepts & Decisions
- **Block Storage over Object Storage:**
  Uploading a 50GB file as one giant object is terrible. If the internet cuts out at 99%, they restart.
  **Solution:** The Desktop Client chunks the file into **4MB Blocks**. Each block is hashed (e.g. SHA-256). We upload the blocks individually to Cloud Storage (S3).
- **Delta Sync:**
  If a user modifies page 1 of a 100-page PDF, the client computes the new hash for the modified 4MB chunk only. It uploads *only* that chunk. This saves immense bandwidth.
- **Deduplication:**
  If 10,000 users upload the exact same viral Meme video, we don't store it 10,000 times. We check the chunk hashes in our Metadata DB. If the hash exists, we just point the new user's metadata to the existing S3 block.

## 4. API Design
Usually uses two distinct services:
1. `POST /api/v1/blocks/upload` -> Actually streams raw bytes to the Block Server/S3.
2. `POST /api/v1/metadata/commit` -> Tells the DB: "File 'taxes.pdf' now consists of block hashes [A, B, C]."

## 5. Database Schema (PostgreSQL)
**Table: File_Metadata**
- `file_id` (PK)
- `user_id`
- `file_name`
- `version`

**Table: File_Blocks**
- `file_id`
- `block_order_index`
- `block_hash_id` (Points to physical S3 object)

## 6. Handling Edge Cases & Bottlenecks
- **Sync Conflict:** Two users edit the same document offline and reconnect simultaneously.
  **Solution:** Whichever version reaches the server first becomes `version 2`. The second version is rejected. The user is prompted to resolve the conflict (saving as "taxes_conflicted_copy.pdf").
- **Real-Time Sync Notification:** When I upload a file from my phone, how does my laptop download it instantly?
  **Solution:** Long-Polling or Server-Sent Events (SSE). The laptop hangs an HTTP request open, waiting for the Message Queue to say "Hey, laptop! User A has new blocks available."

## 7. Interview "Gotchas"
- Explaining **Checksums (SHA-256) and Block chunking** is the absolute requirement for this interview. It proves you understand how to design around network bandwidth bottlenecks.
