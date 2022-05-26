# 视频 API

设备可能配有一个或者多个 RGB 摄像头。当运行时，会循环记录视频。视频格式目前为 H264 流。
通过视频 API，可以下载和管理视频记录。

实时视频，参见 [Websocket](websocket.md#rgb-视频流) 中内容。

## 列举视频

```bash
curl http://localhost:8000/videos/
```

```json
[
  {
    "filename": "2022-05-24 19_58_43-back.h264",
    "size": "0.0B",
    "end": "24-May-2022 19:58:43",
    "url": "http://tunnel.autoxing.com:10126/videos/2022-05-24%2019_58_43-back.h264",
    "download_url": "http://tunnel.autoxing.com:10126/videos/2022-05-24%2019_58_43-back.h264/download"
  },
  {
    "filename": "2022-05-24 19_58_43-front.h264",
    "size": "0.0B",
    "end": "24-May-2022 19:58:43",
    "url": "http://tunnel.autoxing.com:10126/videos/2022-05-24%2019_58_43-front.h264",
    "download_url": "http://tunnel.autoxing.com:10126/videos/2022-05-24%2019_58_43-front.h264/download"
  }
]
```

## 下载视频

```bash
curl http://localhost:8000/videos/2022-05-24%2019_58_43-front.h264/download
```

## 删除视频

```bash
curl -X DELETE http://localhost:8000/videos/2022-05-24%2019_58_43-front.h264
```

## 删除全部视频

```bash
curl -X DELETE http://localhost:8000/videos/
```
