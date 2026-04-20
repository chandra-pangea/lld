// ============================================================
// PROXY DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Proxy provides a substitute or placeholder for another object.
// A proxy controls access to the original object, allowing you to perform 
// something either BEFORE or AFTER the request reaches the original object.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Virtual Proxy (Lazy loading a heavy image/DB connection)
// 2. Protection Proxy (Checking user permissions before API call)
// 3. Caching Proxy (Checking cache before hitting real API)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Subject Interface
interface VideoDownloader {
  downloadVideo(id: string): string;
}

// Step 2: Real Subject (The heavy/sensitive object)
class RealVideoDownloader implements VideoDownloader {
  downloadVideo(id: string): string {
    console.log(`⏳ Downloading video ${id} from YouTube...`);
    return `[Video Data for ${id}]`;
  }
}

// Step 3: The Proxy (Wraps Real Subject, Adds Cache & Access Control)
class ProxyVideoDownloader implements VideoDownloader {
  private realDownloader = new RealVideoDownloader();
  private cache: { [key: string]: string } = {};

  downloadVideo(id: string): string {
    // Optional Protection logic could go here
    if (id === "blocked_video") {
      return "🚫 Access Denied";
    }

    // Caching logic
    if (!this.cache[id]) {
      console.log(`🔄 Proxy: Cache miss. Calling RealSubject...`);
      this.cache[id] = this.realDownloader.downloadVideo(id);
    } else {
      console.log(`⚡ Proxy: Cache hit! Serving fast.`);
    }

    return this.cache[id];
  }
}

// Step 4: Client Code
const downloader = new ProxyVideoDownloader();

// First time -> Proxy calls real class
downloader.downloadVideo("cat_video");

// Second time -> Proxy serves from cache!
downloader.downloadVideo("cat_video");

// Blocked -> Proxy stops routing to real class
console.log(downloader.downloadVideo("blocked_video"));

// ─── MEMORY TRICK ────────────────────────────────────────────
// Proxy = NIGHTCLUB BOUNCER.
// The Bouncer stands in front of the Club (Real Subject).
// He checks your ID (Protection Proxy), maybe tracks how many people 
// are inside (Metrics Proxy), and if you pass, he lets you in.
