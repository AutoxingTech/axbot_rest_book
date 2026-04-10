# Recording API

The current SDK uses the `recording` endpoints for two different jobs:

| SDK helper | Method | Path | Notes |
| --- | --- | --- | --- |
| `saveBag()` | `POST` | `/recording/` | Starts a manual recording even though the helper name says `saveBag` |
| `removeRecording(filename?)` | `DELETE` | `/recording/{filename}` or `/recording/` | Deletes one recording or all recordings |
| `getBagPlayerMetadata(filename, 'recording')` | `GET` | `/recording/{filename}/player` | Metadata only |
| `getBagPlayerChunk(filename, startTime, endTime, 'recording')` | `GET` | `/recording/{filename}/player?start_time=...&end_time=...` | Parsed JSON chunk |
| `getBagPlayerChunkStream(...)` | `GET` | same as above | Raw streaming `Response` |

## Create A Recording

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "$ROBOT_API_BASE/recording/"
```

Current robots typically return a recording file descriptor:

```json
{
  "filename": "2022-07-20 14:19:56_xxx.bag",
  "size": "1.3MB",
  "size_bytes": 1390762,
  "end": "20-Jul-2022 14:19:57",
  "download_url": "http://ROBOT_HOST:8090/recording/2022-07-20%2014:19:56_xxx.bag/download"
}
```

Older docs documented an optional `filename_suffix`. That field is not exposed by the current SDK helper, so if you need it, use the raw REST endpoint directly and verify it on the target build.

## List Recordings

```bash
curl "$ROBOT_API_BASE/recording/"
```

A current robot response looks like this:

```json
[
  {
    "filename": "B652507a06100Ao_2026-03-13_14-26-15_9016.bag",
    "size": "15.4KB",
    "size_bytes": 15774,
    "end": "13-Mar-2026 14:26:15",
    "download_url": "http://tunnel.autoxing.com:21044/recording/B652507a06100Ao_2026-03-13_14-26-15_9016.bag/download"
  }
]
```

## Delete Recordings

```bash
curl -X DELETE "$ROBOT_API_BASE/recording/B652507a06100Ao_2026-03-13_14-26-15_9016.bag"
curl -X DELETE "$ROBOT_API_BASE/recording/"
```

## Recording Player Metadata

The recording player shares the same response model as the bag player.

A live response from the upgraded robot:

```json
{
  "total_messages": 81,
  "start_time": 1773383115,
  "end_time": 1773383175
}
```

## Recording Player Chunk

Example response excerpt:

```json
{
  "total_messages": 81,
  "start_time": 1773383115,
  "end_time": 1773383175,
  "messages": [
    {
      "topic": "/jack_state",
      "state": "hold",
      "progress": 0.0,
      "weight": 0,
      "weight_error": 0,
      "self_checking": false,
      "self_check_state": "no_error",
      "__stamp": 1773383115.3701293,
      "__latched": true
    }
  ]
}
```

This is the same contract used by `getBagPlayerChunk(...)`, with `prefix='recording'`.
