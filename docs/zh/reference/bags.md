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

## 数据包流式回放 API {#bag-streaming-api}

把录制好的数据包推送给远端播放器。接口分两半：**索引**给出每条消息的连接与时间戳，不读取任何消息内容；**消息段**返回原始、仍然保持序列化状态的字节。因为内容原样透传，所以任何话题类型都能回放——不需要为每种消息维护转换器，新增消息类型也无需改动服务端。

需要 `bagStreaming` 能力标志。

### 数据源

路径里的第一个元素选择数据包目录：

<!-- prettier-ignore -->
| 数据源 | 内容 |
| :--- | :--- |
| `bags` | 循环录制的数据包（持续录制） |
| `recordings` | 用户主动保存的录制 |

### 端点

```text
GET /ros/bag-player/{source}/{filename}/meta
GET /ros/bag-player/{source}/{filename}/index
GET /ros/bag-player/{source}/{filename}/messages?start=<n>&end=<n>
```

### 1. 获取数据包元数据

`GET /ros/bag-player/{source}/{filename}/meta` 返回 `200 application/json`：

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
| 字段 | 说明 |
| :--- | :--- |
| `startTime`、`endTime` | 首末消息时间戳，单位：秒。 |
| `startTimeUs`、`endTimeUs` | 同一时间戳的微秒精确值。需要精确排序时用这两个，秒形式会丢精度。 |
| `totalMessages` | 已建立索引的消息条数。 |
| `segmentSize` | `/messages` 每段建议的消息条数。 |
| `connections` | 每个数据包连接一项：`conn` 是索引里使用的连接号，`topic` 与 `type` 描述消息内容，`messageDefinition` 是录制下来的 `.msg` 文本。 |

话题不等于连接：只要发布者身份变化，录制器就会新开一个连接，因此同一个话题可能分散在多个 `conn` 上。始终通过 `connections[conn].topic` 解析轨道。

### 2. 获取索引

`GET /ros/bag-player/{source}/{filename}/index` 返回 `200 application/x-protobuf`，内容为 `bagstream.BagIndex`：每个连接一条轨道，记录全局消息序号与相对数据包起点的微秒时间戳。两个数组都做了差分编码与压缩打包，大文件也只占几 KB。

每个数据包取一次索引，之后的播放全部基于它。

### 3. 获取消息内容

`GET /ros/bag-player/{source}/{filename}/messages?start=<n>&end=<n>` 返回 `200 application/x-protobuf`，内容为 `bagstream.MessageBatch`：按全局序号取 `[start, end)` 区间的消息，每条带自己的序号与原始序列化字节。

<!-- prettier-ignore -->
| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `start` | integer | 是 | 起始消息序号，含。 |
| `end` | integer | 是 | 结束消息序号，不含；超过 `totalMessages` 时按总数截断。 |

`start` 与 `end` 是**消息序号，不是时间戳**。用索引把播放位置换算成消息序号，再按 `segmentSize` 分段请求。

一段请求会复用途经的每个数据块，因此连续取一段比在包里零散地跳着取便宜得多。

### 解析消息内容

`BagEntry.data` 是 `connections[conn].type` 所指消息类型的 ROS 1 序列化字节——与 `rosbag` 存放的内容完全相同。用对应的消息定义解析即可，接口不做重新编码、过滤或转换。

本接口的消息定义在 TypeScript SDK 中公开：[`src/proto/bagstream.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/bagstream.proto)；同一仓库也提供官方 SDK 使用的消息类。

### 缓存

所有响应都是不可变的，三个端点都会返回：

```text
Cache-Control: public, max-age=31536000, immutable
ETag: W/"<hash>"
```

带上 `If-None-Match` 可得到 `304 Not Modified`。响应还带 `X-Response-Time-Ms`，表示服务端生成该响应的耗时（含首次请求时的索引构建）。

### 错误响应

<!-- prettier-ignore -->
| 状态码 | 原因 |
| :--- | :--- |
| `400` | 文件名非法、缺少 `start`/`end`，或消息区间越界。 |
| `404` | 数据源不存在，或没有该数据包。 |
| `500` | 数据包打不开。 |

`500` 包含无法建立索引的数据包。只支持 ROS 1 v2.0 分块数据包，不支持 ROS 2 数据包（mcap、sqlite3）。录制过程没有正常结束的数据包不含索引记录，会被拒绝并提示先执行 `rosbag reindex <file>`——没有索引时，枚举消息只能把整个文件解压一遍。

## 数据包播放器 API（旧）

::: warning 已废弃
请改用[数据包流式回放 API](#bag-streaming-api)：它对任何话题类型都返回原始消息字节，而这个端点只能回放机器人已有 JSON 转换器的消息类型。
:::

旧的播放器在服务端把每条消息转成 JSON，并支持回填锁存话题。

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
