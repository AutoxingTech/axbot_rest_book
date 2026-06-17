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

## Bag Player API

The Bag Player API allows for replaying ROS bag files online. It provides metadata about the bag and enables downloading message chunks within specific time ranges.

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
