# Recording API

Certain alerts, such as `7002 - position lost`, will trigger the automatic recording of bag files. Alternatively, you can use `POST /recording/` to manually initiate a recording.

## Create a Recording

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename_suffix": "xxx", "duration": "2m", "category": "pos"}' \
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

**Parameters**

```ts
interface CreateRecordingRequest {
  // The suffix to be appended to the filename.
  // The resulting filename will be {time}_{filename_suffix}.bag.
  // If no suffix is provided, the filename will simply be {time}.bag.
  filename_suffix?: string;
  // Duration of the recording (e.g. "2m", "5m").
  // Maximum allowed value is 5m.
  duration?: string;
  // Category of the recording. Currently only "pos" is supported.
  // When set to "pos", point clouds are recorded at the original frequency
  // to aid in reproducing positioning errors.
  category?: string;
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
