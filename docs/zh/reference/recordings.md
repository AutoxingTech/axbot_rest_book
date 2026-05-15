# 录制 (Recording) API

某些告警（如 `7002 - position lost` 定位丢失）会触发数据包 (bag files) 的自动录制。或者，您也可以使用 `POST /recording/` 手动发起录制。

## 创建录制

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename_suffix": "xxx"}' \
  http://192.168.25.25:8090/recording/
```

```json
{
  "filename": "2022-07-20 14:19:56_xxx.bag",
  "size": "1.3MB",
  "size_bytes": 1390762,
  "end": "20-Jul-2022 14:19:57",
  "download_url": "http://192.168.25.25:8090/recording/2022-07-20%2014:19:56_xxx.bag/download"
}
```

**参数**

```ts
interface CreateRecordingRequest {
  // 附加到文件名的后缀。
  // 最终生成的文件名将是 {time}_{filename_suffix}.bag。
  // 如果未提供后缀，文件名将仅为 {time}.bag。
  filename_suffix?: string;
}
```

## 获取录制列表

```bash
curl http://192.168.25.25:8090/recording/
```

```json
[
  {
    "filename": "2022-07-13 16:57:27_1008.bag",
    "size": "18.3MB",
    "size_bytes": 19180918,
    "end": "13-Jul-2022 16:57:30",
    "download_url": "http://192.168.25.25:8090/recording/2022-07-13%2016:57:27_1008.bag/download"
  }
]
```
