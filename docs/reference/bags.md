# Bags API

Since 2.7.0, bags are recorded at all time. But when the total size exceeds a limit, the oldest onces are purged.

## Get Bag List

```bash
curl http://192.168.25.25:8090/bags/
```

```json
[
  {
    "filename": "2023-10-31_14-30-00.bag",
    "size": "6.8KB",
    "size_bytes": 6922,
    "end": "31-Oct-2023 14:36:17",
    "download_url": "http://192.168.25.25:8090/bags/2023-10-31_14-30-00.bag/download"
  },
  {
    "filename": "2023-11-01_13-50-00.bag",
    "size": "4.1KB",
    "size_bytes": 4172,
    "end": "01-Nov-2023 13:55:10",
    "download_url": "http://192.168.25.25:8090/bags/2023-11-01_13-50-00.bag/download"
  }
]
```
