# 转发 ROS 服务 API (Forwarded ROS Services API) {#forwarded-ros-services-api}

## 约定 (Conventions) {#conventions}

### 内容类型与响应格式 (Content-type & response format) {#content-type--response-format}

默认响应格式为 `application/x-protobuf`。支持 JSON 的端点在请求包含 `Accept: application/json` 头时，会以 `application/json` 格式响应。JSON 响应体通过 `google::protobuf::util::MessageToJsonString`（proto3 JSON 映射 — 字段名为蛇形命名法）序列化生成。

| `Accept` 请求头          | `Content-Type` 响应头    | Body                         |
| ------------------------ | ------------------------ | ---------------------------- |
| (缺省)                   | `application/x-protobuf` | 二进制 protobuf              |
| `application/x-protobuf` | `application/x-protobuf` | 二进制 protobuf              |
| `application/json`       | `application/json`       | proto3 JSON                  |
| (其他)                   | `text/plain`             | `415 Unsupported Media Type` |

### Protobuf 定义 (Protobuf definitions) {#protobuf-definitions}

Protobuf 消息定义发布在 npm 上的 [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk) TypeScript SDK 中。`.proto` 源文件可在 [axbot-ts-sdk 仓库](https://github.com/AutoxingTech/axbot-ts-sdk/tree/master/src/proto)中找到。每个端点都引用其对应的响应消息。

---

## 服务索引 (Service index)

| 方法  | 路径                                                      | ROS 源                                                     |
| ----- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `GET` | `/ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}` | `/submap_query_v2` (`cartographer_ros_msgs/SubmapQueryV2`) |
| `GET` | `/ros/rosmaster/topics`                                   | ROS master API (`getTopics` + `getSystemState`)            |
| `GET` | `/ros/rosmaster/topics/published_names`                   | ROS master API (`getSystemState` — 仅发布者)               |

---

## Submap Query V2 (子地图查询 V2) {#submap-query-v2}

### 路由 (Route)

```text
GET /ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}
```

### 请求参数 (Request)

| 参数            | 类型    | 位置  | 说明                 |
| --------------- | ------- | ----- | -------------------- |
| `uuid`          | string  | path  | 透传给 ROS 请求      |
| `trajectory_id` | integer | path  | 十进制整数           |
| `submap_index`  | integer | path  | 十进制整数           |
| `ver`           | string  | query | 可选；仅影响缓存行为 |

无请求体。

### 响应 (Response)

`ros_messages.SubmapQueryV2Response` — 参见 [`submap_query.proto`](../ros_message_forward/proto/submap_query.proto) 和 [`geometry.proto`](../ros_message_forward/proto/geometry.proto)。

### 缓存行为 (Cache behavior)

- 带有 `?ver=...`：`Cache-Control: public, max-age=31536000, immutable`
- 不带 `ver`：`Cache-Control: no-cache` + 弱 `ETag`
- 匹配 `If-None-Match`：`304 Not Modified`

### 附加错误码 (Additional error codes)

| 状态码 | 含义               |
| ------ | ------------------ |
| `404`  | ROS 服务报告未找到 |
| `502`  | ROS 服务调用失败   |
| `504`  | ROS 服务超时不可用 |

### 示例 (Example)

```bash
curl -i \
  'http://192.168.25.25:8090/ros/slam/submaps/681dc447472ac49d7b074fa1/12/3?ver=42' \
  -o submap_query.pb
```

---

## Topic List (主题列表) {#topic-list}

列出当前所有已发布的 ROS 主题，包含类型、发布者数量和订阅者数量。直接查询 ROS master。

### 路由 (Route)

```text
GET /ros/rosmaster/topics
```

### 请求 (Request)

无参数，无请求体。

### 响应 (Response)

`ros_messages.TopicListResponse` — 包含重复的 `TopicInfo`（`name`、`type`、`publisher_count`、`subscriber_count`）。仅包含至少有一个发布者的主题。

参见 [`topics.proto`](../ros_message_forward/proto/topics.proto)。

### 缓存行为 (Cache behavior)

`Cache-Control: no-cache` — 主题状态是动态的；无 ETag。

### 示例 (Example)

```bash
# protobuf（默认）
curl http://192.168.25.25:8090/ros/rosmaster/topics | protoc --decode_raw

# JSON
curl -H "Accept: application/json" \
  http://192.168.25.25:8090/ros/rosmaster/topics | jq .
```

```json
{
  "topics": [
    {
      "name": "/tf",
      "type": "tf2_msgs/TFMessage",
      "publisher_count": 1,
      "subscriber_count": 3
    }
  ]
}
```

---

## Published Topic Names (已发布主题名称) {#published-topic-names}

返回至少有一个发布者的主题名称列表。

### 路由 (Route)

```text
GET /ros/rosmaster/topics/published_names
```

### 请求 (Request)

无参数，无请求体。

### 响应 (Response)

`ros_messages.PublishedTopicNamesResponse` — 包含重复的 `names` 字段。

参见 [`topics.proto`](../ros_message_forward/proto/topics.proto)。

### 缓存行为 (Cache behavior)

`Cache-Control: no-cache` — 主题状态是动态的。

### 示例 (Example)

```bash
# protobuf（默认）
curl http://192.168.25.25:8090/ros/rosmaster/topics/published_names | protoc --decode_raw

# JSON
curl -H "Accept: application/json" \
  http://192.168.25.25:8090/ros/rosmaster/topics/published_names | jq .
```

```json
{
  "names": ["/tf", "/scan", "/odom"]
}
```
