# Bags API (数据包录制)

自 2.7.0 版本起，数据包文件 (bag files) 采用持续录制方式。当总存储大小超过预定义的限制时，最旧的文件将被自动清除。

## 获取数据包列表

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

## 数据包播放器 API

数据包播放器 API 允许在线回放 ROS bag 文件。它提供有关数据包的元数据，并支持在特定时间范围内下载消息分块。

### 端点

`GET /bags/<filename>/player`

### 1. 获取数据包元数据

获取关于数据包文件的通用信息，例如消息总数和时间跨度。

#### 请求

`GET /bags/<filename>/player`

### 成功响应

- **状态码:** `200 OK`
- **内容:**
  ```json
  {
    "total_messages": 5000,
    "start_time": 1674650000,
    "end_time": 1674653600
  }
  ```
  - `total_messages`: 整数，表示数据包中的消息总数。
  - `start_time`: 整数时间戳 (Unix epoch)，第一条消息的时间。
  - `end_time`: 整数时间戳 (Unix epoch)，最后一条消息的时间。

### 2. 获取消息分块

获取特定时间范围内的消息。前端使用此接口来流式传输或下载数据包的分块。

#### 请求

`GET /bags/<filename>/player?start_time=<float>&end_time=<float>`

#### 查询参数

<!-- prettier-ignore -->
| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `start_time` | float | 是 | 时间范围的起始时间，单位为秒 (Unix epoch)。 |
| `end_time` | float | 是 | 时间范围的结束时间，单位为秒 (Unix epoch)。 |

### 成功响应

- **状态码:** `200 OK`
- **内容:**
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
  - `messages`: JSON 格式化后的 ROS 消息列表。
  - 每条消息包含：
    - `__stamp`: 消息录制时的高精度时间戳。
    - `__latched`: 布尔标志，如果消息属于“锁存” (latched) 话题，则设为 `true`。这包括回填的消息 (先前的状态) 以及在请求时间范围内发生的消息。

#### 特殊行为：锁存话题 (Latched Topics)

当请求一个时间范围时，API 会自动包含在 `start_time` _之前_ 发生的“锁存”话题的最新消息。这确保了播放器在分块开始时就拥有静态或缓慢变化话题 (如地图或配置) 的当前状态。

**锁存话题包括：**

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

### 缓存

响应会被缓存，并带有以下响应头：
`Cache-Control: public, max-age=2592000` (30 天)

### 错误响应

- **状态码:** `400 BAD REQUEST`
- **内容:** `{"error": "string explaining the error"}` (例如，如果未找到或损坏了该数据包文件)。
