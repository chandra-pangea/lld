# Design a Video Streaming Platform (YouTube / Netflix)

## 1. Problem Statement
Design a highly scalable platform where users can upload videos, and viewers can watch those videos globally without buffering.

### Requirements
- **Functional:**
  - Upload videos.
  - Stream videos smoothly across different devices (Phones, TVs, 4K monitors).
  - Search and discover videos.
- **Non-Functional:**
  - **High throughput, low latency** for viewing.
  - Absolutely **no buffering** under varying internet speeds.
  - Huge storage capacity.

## 2. High-Level Architecture 
```text
              [ Creator ]
                   |
            [ Upload API ] ---> [ Original Blob Storage (S3) ]
                   |
     [ Distributed Transcoding Pipeline ] (ffmpeg workers)
                   |
     [ Processed Video Chunks Storage (S3) ]
                   |
      [ Global CDN (Cloudflare/Akamai) ]
                   |
               [ Viewer ]
```

## 3. Core Design Concepts & Decisions
- **Adaptive Bitrate Streaming (ABS):**
  This is the magic behind Netflix/YouTube. We do not stream a single 1GB MP4 file. 
  When a video is uploaded, the **Transcoding Pipeline** does two things:
  1. *Formats:* Converts it into 1080p, 720p, 480p, etc.
  2. *Chunking:* Slices the video into tiny 3-second segments (using protocols like HLS or DASH).
  The client downloads a manifest file. If their internet is fast, they request the 1080p chunks. If they enter a tunnel, the client drops down and requests the 480p chunks for the next 3 seconds, avoiding buffering.
- **Content Delivery Network (CDN):**
  Streaming video directly from one AWS server in Virginia to a user in Japan will cause lag. We use CDNs heavily. The video chunks are cached at Edge Servers physically located inside ISPs across the globe.

## 4. Transcoding Pipeline Workflow
Video encoding is extremely CPU-heavy. We use a **Directed Acyclic Graph (DAG)** workflow.
1. Video uploaded.
2. Split video into chunks.
3. Message Queue (Kafka/RabbitMQ) assigns chunks to hundreds of worker machines.
4. Workers encode their tiny piece into 1080p, 720p, etc.
5. Merge them back / Generate the HLS `.m3u8` manifest file.
6. Push to CDN.

## 5. Database Schema (NoSQL/SQL)
**Table: Video_Metadata** (PostgreSQL / MongoDB)
- `video_id` (PK)
- `uploader_id`
- `title`, `description`
- `manifest_url_s3`
- `views`

## 6. Handling Edge Cases & Bottlenecks
- **Viral Video / Scale:** The squid game trailer drops. Millions hit the database metadata.
  **Solution:** Aggressive Redis caching for the specific Video Metadata. The actual video bytes are handled purely by the Edge CDN, saving our main servers.
- **Upload Failures:** If a user uploads a 5GB 4K file and it fails at 99%, we use **Resumable Uploads**. The client chunks the file locally and uploads pieces. The server tracks received chunks.

## 7. Interview "Gotchas"
- Explaining the difference between downloading an `.mp4` and using **HLS (HTTP Live Streaming) / DASH chunks** is what separates juniors from seniors in this question.
- Point out that **Uploads are Write-Heavy/Compute-Heavy**, while **Viewing is intensely Read-Heavy**. They must be separated into entirely different sub-systems.
