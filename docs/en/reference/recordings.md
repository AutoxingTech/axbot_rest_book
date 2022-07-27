# Recording API

## 记录 Bag

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"filename_suffix": "xxx"}'
  http://localhost:8000/recording/
```

```json
{
  "filename": "2022-07-20 14:19:56_xxx.bag",
  "size": "1.3MB",
  "size_bytes": 1390762,
  "end": "20-Jul-2022 14:19:57",
  "download_url": "http://localhost:8000/recording/2022-07-20%2014:19:56_xxx.bag/download"
}
```

**参数说明**

```ts
interface CreateRecordingRequest {
  filename_suffix?: string; // 文件名后缀，会以 {time}_{filename_suffix}.bag 的作为文件名
  // 如果不填，则以 {time}.bag 作为文件名
}
```

## 查看 bag 列表

```bash
curl http://localhost:8000/recording/
```

```json
[
  {
    "filename": "2022-07-13 16:57:27_1008.bag",
    "size": "18.3MB",
    "size_bytes": 19180918,
    "end": "13-Jul-2022 16:57:30",
    "download_url": "http://localhost:8000/recording/2022-07-13%2016:57:27_1008.bag/download"
  }
]
```
