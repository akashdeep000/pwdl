# pwdl

PhysicsWallah Batch Downloader

## Prerequisites

### DRM Decryption (CDRM)

This tool requires a CDRM (Content Decryption Module) service to decrypt Widevine-protected videos. The public CDRM service at `cdrm-project.com` is currently unavailable.

**Options:**

1. **Self-host CDRM-Project**: 
   - Follow instructions at https://github.com/tpd94/CDRM-Project
   - Set `CDRM_URL=http://your-server:5000/api/decrypt` in `.env`

2. **Use a friend's instance** if they have one running

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
CDRM_URL=https://your-cdrm-server.com/api/decrypt  # required for downloads
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

## Troubleshooting

### Downloads failing silently
Run with a single lecture to see detailed logs:
```bash
bun . download -i "lecture_id" -l 1
```

### CDRM API errors
- "Connection timed out" - The CDRM server is unreachable. Check `CDRM_URL` in `.env`.
- "CDRM API failed" - The server responded but returned an error. Check server logs.