# Video API

The current SDK only wraps video deletion. Listing and downloading videos still happen through raw REST endpoints.

| SDK helper | Method | Path | Notes |
| --- | --- | --- | --- |
| `removeVideo(filename?)` | `DELETE` | `/videos/{filename}` or `/videos/` | Deletes one video or all videos |

## List Videos

```bash
curl "$ROBOT_API_BASE/videos/"
```

A current robot response looks like this:

```json
[
  {
    "filename": "2026-04-01 07_30_00-front.h264",
    "size": "7.9MB",
    "size_bytes": 8279668,
    "end": "01-Apr-2026 07:40:00",
    "url": "http://tunnel.autoxing.com:21044/videos/2026-04-01%2007_30_00-front.h264",
    "download_url": "http://tunnel.autoxing.com:21044/videos/2026-04-01%2007_30_00-front.h264/download"
  }
]
```

Video clips are stored as raw H.264 streams. For live camera feeds, use the RGB camera WebSocket topics described in [websocket.md](./websocket.md#rgb-video-streams).

## Download A Video

```bash
curl -O "$ROBOT_API_BASE/videos/2026-04-01%2007_30_00-front.h264/download"
```

## Delete Videos

```bash
curl -X DELETE "$ROBOT_API_BASE/videos/2026-04-01%2007_30_00-front.h264"
curl -X DELETE "$ROBOT_API_BASE/videos/"
```

As with bags and recordings, omitting `filename` deletes the entire collection.
