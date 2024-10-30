# Recording API

Some alerts(like 7002 - position lost) will trigger automatic recording of bags.
Or, one can use `POST /recording` to manually record a bag.

## Create a Recording

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

**Paramters**

```ts
interface CreateRecordingRequest {
  // The suffix of the file name.
  // The actual file name will be {time}_{filename_suffix}.bag
  // Without suffix, it will be {time}.bag
  filename_suffix?: string;
}
```

## Get Recording List

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
