# Bags API

Starting from version 2.7.0, bag files are recorded continuously. When the total storage size exceeds a predefined limit, the oldest files are automatically purged.

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

## Bag Streaming API

Streams a recorded bag to a remote player. The API is split into two independent halves: an **index** that names every message (connection, timestamp) without touching any payload, and **payload segments** that return the raw, still-serialized message bytes. Because payloads are passed through verbatim, every topic type can be replayed — there is no per-message converter to maintain, and a newly introduced message type works without any server change.

Enablement requires the `bagStreaming` capability flag.

### Sources

The first path element selects the bag directory:

<!-- prettier-ignore -->
| Source | Contents |
| :--- | :--- |
| `bags` | Continuously recorded bags (the loop recorder) |
| `recordings` | Recordings saved explicitly by the user |

### Endpoints

```text
GET /ros/bag-player/{source}/{filename}/meta
GET /ros/bag-player/{source}/{filename}/index
GET /ros/bag-player/{source}/{filename}/messages?start=<n>&end=<n>
```

### 1. Get bag metadata

`GET /ros/bag-player/{source}/{filename}/meta` returns `200 application/json`:

```json
{
  "startTime": 1674650000.123,
  "endTime": 1674653600.456,
  "startTimeUs": 1674650000123456,
  "endTimeUs": 1674653600456000,
  "totalMessages": 5000,
  "segmentSize": 1024,
  "connections": [
    {
      "conn": 0,
      "topic": "/tracked_pose",
      "type": "geometry_msgs/PoseStamped",
      "messageDefinition": "..."
    }
  ]
}
```

<!-- prettier-ignore -->
| Field | Description |
| :--- | :--- |
| `startTime`, `endTime` | First and last message stamp, in seconds. |
| `startTimeUs`, `endTimeUs` | The same stamps as exact microseconds. Prefer these when ordering; the seconds form loses precision. |
| `totalMessages` | Number of indexed messages. |
| `segmentSize` | Recommended number of messages per `/messages` request. |
| `connections` | One entry per bag connection: `conn` is the id used by the index, `topic` and `type` describe the payload, `messageDefinition` is the recorded `.msg` text. |

A topic is not the same as a connection: the recorder opens a new connection whenever the publisher identity changes, so one topic can be spread over several `conn` ids. Always resolve a track through `connections[conn].topic`.

### 2. Get the index

`GET /ros/bag-player/{source}/{filename}/index` returns `200 application/x-protobuf` with a `bagstream.BagIndex` message: one track per connection, holding the global message indexes and their stamps in microseconds from the bag start. Both lists are delta-encoded and packed, so a long bag costs kilobytes, not megabytes.

Fetch the index once per bag, then drive playback from it.

### 3. Get message payloads

`GET /ros/bag-player/{source}/{filename}/messages?start=<n>&end=<n>` returns `200 application/x-protobuf` with a `bagstream.MessageBatch` message: the messages in `[start, end)` by global index, each carrying its index and the raw serialized ROS bytes.

<!-- prettier-ignore -->
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `start` | integer | Yes | First message index, inclusive. |
| `end` | integer | Yes | Last message index, exclusive. Clamped to `totalMessages`. |

`start` and `end` are **message indexes, not timestamps**. Use the index to map a playback position to a message number, then request segments of `segmentSize` messages.

A segment reuses each chunk it touches, so asking for a run of consecutive messages is much cheaper than scattering requests across the bag.

### Decoding payloads

`BagEntry.data` is the ROS 1 wire format of the message type named by `connections[conn].type` — the same bytes `rosbag` stores. Decode it with the matching message definition; the API never re-encodes, filters or converts.

The message schemas for this API are published in the TypeScript SDK: [`src/proto/bagstream.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/bagstream.proto). The same package also generates the message classes used by the official SDK.

### Caching

Every response is immutable, so all three endpoints send:

```text
Cache-Control: public, max-age=31536000, immutable
ETag: W/"<hash>"
```

Send `If-None-Match` to get `304 Not Modified`. Responses also carry `X-Response-Time-Ms`, the server-side cost of building the response (including the one-time index build).

### Error responses

<!-- prettier-ignore -->
| Status | Reason |
| :--- | :--- |
| `400` | Invalid filename, missing `start`/`end`, or an out-of-range segment. |
| `404` | Unknown source, or no such bag. |
| `500` | The bag could not be opened. |

`500` covers bags that cannot be indexed. Only ROS 1 v2.0 chunked bags are supported; ROS 2 bags (mcap, sqlite3) are not. A bag whose writer did not close cleanly has no index records and is rejected with a hint to run `rosbag reindex <file>` first — without an index, enumerating the messages would mean decompressing the whole file.

## Legacy Bag Player API

::: warning Deprecated
Prefer the [Bag Streaming API](#bag-streaming-api): it returns raw message bytes for any topic type, while this endpoint only replays the message types the robot has JSON converters for.
:::

The legacy player converts each message to JSON on the server and supports backfilling latched topics.

### Endpoint

`GET /bags/<filename>/player`

### 1. Get Bag Metadata

Fetches general information about the bag file, such as the total number of messages and the time duration.

#### Request

`GET /bags/<filename>/player`

### Success Response

- **Code:** `200 OK`
- **Content:**
  ```json
  {
    "total_messages": 5000,
    "start_time": 1674650000,
    "end_time": 1674653600
  }
  ```
  - `total_messages`: Integer representing the total number of messages in the bag.
  - `start_time`: Integer timestamp (Unix epoch) of the first message.
  - `end_time`: Integer timestamp (Unix epoch) of the last message.

### 2. Get Message Chunks

Fetches messages within a specific time range. This is used by the frontend to stream or download chunks of the bag.

#### Request

`GET /bags/<filename>/player?start_time=<float>&end_time=<float>`

#### Query Parameters

<!-- prettier-ignore -->
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `start_time` | float | Yes | The start of the time range in seconds (Unix epoch). |
| `end_time` | float | Yes | The end of the time range in seconds (Unix epoch). |

### Success Response

- **Code:** `200 OK`
- **Content:**
  ```json
  {
    "total_messages": 5000,
    "start_time": 1674650000,
    "end_time": 1674653600,
    "messages": [
      {
        "topic": "/some_topic",
        "field1": "value1",
        "__stamp": 1674650010.123,
        "__latched": true
      },
      ...
    ]
  }
  ```
  - `messages`: A list of JSON-converted ROS messages.
  - Each message includes:
    - `__stamp`: High-precision timestamp when the message was recorded.
    - `__latched`: Boolean flag set to `true` if the message belongs to a latched topic. This includes both backfilled messages (previous state) and messages occurring within the requested time range.

#### Special Behavior: Latched Topics

When a time range is requested, the API automatically includes the most recent message for "latched" topics that occurred _before_ the `start_time`. This ensures the player has the current state for static or slowly-changing topics (like maps or configurations) as soon as the chunk starts.

**Latched topics include:**

- `/map/info`
- `/alerts`
- `/map_image`
- `/sensor_manager_state`
- `/robot_model`
- `/nearby_robot_footprints`
- `/path`
- `/local_path`
- `/detected_features/racks_v2`
- `/detected_features/pallets`
- `/detected_features/chargers`
- `/planning_state`
- `/jack_state`
- `/towing_state`

---

### Caching

Responses are cached with the following header:
`Cache-Control: public, max-age=2592000` (30 days)

### Error Responses

- **Code:** `400 BAD REQUEST`
- **Content:** `{"error": "string explaining the error"}` (e.g., if the bag file is not found or corrupted).
