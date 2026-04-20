# Node.js Scaling & Multithreading Models

Node.js is naturally single-threaded. To scale for intensive CPU or high-traffic workloads, choose from these three models:

## 1. Worker Threads (`worker_threads`)
Introduced to handle CPU-intensive tasks using multithreading.
- Runs multiple threads inside a single parent process.
- Threads **share memory** (you can pass highly efficient `SharedArrayBuffer` arrays), making communication extremely fast.
- **Best Use Case:** Heavy computations (image processing, video encoding, Machine Learning, cryptography) without blocking the main Event Loop.
- 👉 **Key Point:** Full Parallelism *within the same process*.

## 2. Clustering (`cluster` module)
Used to scale Node.js applications horizontally across multiple CPU cores.
- Creates multiple separate Node.js processes (workers) that **share the same server port**.
- Each worker runs its own isolated Event Loop and memory space.
- A Master process receives connections and dynamically distributes incoming HTTP requests to workers (Round-Robin by default).
- **Best Use Case:** Web servers handling extreme high traffic throughput. Horizontal scaling on a single machine.
- 👉 **Key Point:** Multiple processes handling web requests in parallel.

## 3. Forking (`child_process.fork`)
Spawns an entirely new, heavy Node.js process.
- Used for running completely independent tasks or long-running background services.
- Communication happens via Inter-Process Communication (IPC array message passing).
- **No shared memory** by default (unlike Worker Threads).
- **Best Use Case:** Isolated execution (running a background reporting script, CRON jobs, completely isolated services).
- 👉 **Key Point:** Heavy isolation for non-critical path tasks.
