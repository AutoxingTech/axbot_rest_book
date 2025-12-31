# Video API

The robot may be equipped with one or more RGB cameras. During operation, it records video clips that can be downloaded via the Video API.

For real-time video streaming, see the [WebSocket](./websocket.md#rgb-video-stream) documentation.

Video clips are provided in raw H.264 stream format.

## Video List

```bash
curl http://192.168.25.25:8090/videos/
```

```json
[
  {
    "filename": "2022-05-24 19_58_43-back.h264",
    "size": "0.0B",
    "end": "24-May-2022 19:58:43",
    "url": "http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-back.h264",
    "download_url": "http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-back.h264/download"
  },
  {
    "filename": "2022-05-24 19_58_43-front.h264",
    "size": "0.0B",
    "end": "24-May-2022 19:58:43",
    "url": "http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-front.h264",
    "download_url": "http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-front.h264/download"
  }
]
```

## Download Video

```bash
curl http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-front.h264/download
```

## Delete a Video

```bash
curl -X DELETE http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-front.h264
```

## Delete All Videos

```bash
curl -X DELETE http://192.168.25.25:8090/videos/
```
