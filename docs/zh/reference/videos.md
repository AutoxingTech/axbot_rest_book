# 视频 (Video) API

机器人可能配备一个或多个 RGB 摄像头。运行过程中，它会录制视频剪辑，可通过视频 API 下载。

有关实时视频流，请参阅 [WebSocket](./websocket.md#rgb-视频流) 文档。

视频剪辑以原始 H.264 流格式提供。

## 视频列表

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

## 下载视频

```bash
curl http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-front.h264/download
```

## 删除视频

```bash
curl -X DELETE http://192.168.25.25:8090/videos/2022-05-24%2019_58_43-front.h264
```

## 删除所有视频

```bash
curl -X DELETE http://192.168.25.25:8090/videos/
```
