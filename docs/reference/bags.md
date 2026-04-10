# Bags API

The current SDK supports bag deletion and the shared bag-player interface.

| SDK helper | Method | Path | Notes |
| --- | --- | --- | --- |
| `removeBag(filename?)` | `DELETE` | `/bags/{filename}` or `/bags/` | Deletes one bag or all bags |
| `getBagPlayerMetadata(filename, 'bags')` | `GET` | `/bags/{filename}/player` | Metadata only |
| `getBagPlayerChunk(filename, startTime, endTime, 'bags')` | `GET` | `/bags/{filename}/player?start_time=...&end_time=...` | Parsed JSON chunk |
| `getBagPlayerChunkStream(...)` | `GET` | same as above | Raw streaming `Response` |

The robot also exposes list and download endpoints for bags, but those are not currently wrapped by `robotApi.ts`.

## List Bags

```bash
curl "$ROBOT_API_BASE/bags/"
```

A current robot response looks like this:

```json
[
  {
    "filename": "B652507a06100Ao_2026-04-06_01-50-00.bag",
    "size": "3.8MB",
    "size_bytes": 4027099,
    "end": "06-Apr-2026 02:00:00",
    "download_url": "http://tunnel.autoxing.com:21044/bags/B652507a06100Ao_2026-04-06_01-50-00.bag/download"
  }
]
```

## Delete Bags

```bash
curl -X DELETE "$ROBOT_API_BASE/bags/B652507a06100Ao_2026-04-06_01-50-00.bag"
curl -X DELETE "$ROBOT_API_BASE/bags/"
```

Omit `filename` only when you explicitly want to clear the entire bag store.

## Bag Player Metadata

```bash
curl "$ROBOT_API_BASE/bags/SOME_FILE.bag/player"
```

The SDK expects this payload shape:

```json
{
  "total_messages": 5000,
  "start_time": 1674650000,
  "end_time": 1674653600
}
```

## Bag Player Chunk

```bash
curl "$ROBOT_API_BASE/bags/SOME_FILE.bag/player?start_time=1674650000&end_time=1674650060"
```

The SDK parses the chunk as:

```json
{
  "total_messages": 5000,
  "start_time": 1674650000,
  "end_time": 1674653600,
  "messages": [
    {
      "topic": "/some_topic",
      "__stamp": 1674650010.123,
      "__latched": true
    }
  ]
}
```

Each message is the JSON-converted topic payload with an added `__stamp`. Latched messages may also include `__latched=true`.

## Notes On Live Robots

On the upgraded robot used for this sweep, the player endpoint for one historical continuous bag returned a file-not-found error because the file had already been rotated out of the cache. The SDK contract itself is unchanged; if a bag still exists on disk, the endpoint shape above is what clients should expect.
