# pwdl

PhysicsWallah Batch Downloader

## Setup

1. Install dependencies:

```bash
bun install
```

2. Configure `.env` file:

```bash
BATCH_ID=your_batch_id
TOKEN=your_token
PREFERRED_RESOLUTION=720  # optional, default 720
DOWNLOAD_DIR=downloads     # optional
CONCURRENCY=1             # optional, default 1
CHUNK_CONCURRENCY=5        # optional, default 5
```

## Usage

### 1. Discover batch structure

```bash
bun . discover
```

This will discover all subjects, topics, and lectures and store them in the database.

### 2. Download lectures

```bash
bun . download
```

Options:
- `-c, --concurrency <number>` - Number of concurrent lectures (default: 1)
- `-C, --chunk-concurrency <number>` - Number of concurrent chunks per lecture (default: 5)
- `-l, --limit <number>` - Limit the number of lectures to download
- `-i, --id <string>` - Download a specific lecture by ID

Examples:

```bash
# Download with higher concurrency
bun . download -c 3 -C 10

# Download only 10 lectures
bun . download -l 10

# Download specific lecture
bun . download -i "lecture_id_here"
```