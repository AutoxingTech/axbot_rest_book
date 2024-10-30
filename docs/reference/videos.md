# Video API

The robot may comes with one or more RGB cameras. When operating, it will record video clips.
Video API allows you to download these video clips.

For realtime video stream, see [Websocket](websocket.md#rgb-video-stream).

The video clips are in H264 raw stream format.

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
