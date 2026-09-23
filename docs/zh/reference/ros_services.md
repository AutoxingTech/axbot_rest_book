# 转发 ROS 服务 API (Forwarded ROS Services API) {#forwarded-ros-services-api}

## 约定 (Conventions) {#conventions}

### 内容类型与响应格式 (Content-type & response format) {#content-type--response-format}

默认响应格式为 `application/x-protobuf`。支持 JSON 的端点在请求包含 `Accept: application/json` 头时，会以 `application/json` 格式响应。JSON 响应体通过 `google::protobuf::util::MessageToJsonString`（proto3 JSON 映射 — 字段名为蛇形命名法）序列化生成。

<!-- prettier-ignore -->
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

<!-- prettier-ignore -->
| 方法  | 路径                                                      | ROS 源                                                     |
| ----- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `GET` | `/ros/map/overlays`                                       | `/get_map_overlays` (`ax_msgs/GetMapOverlays`)             |
| `PUT` | `/ros/map/overlays`                                       | `/set_map_overlays` (`ax_msgs/SetMapOverlays`)             |
| `GET` | `/ros/map/traffic_info`                                   | `/get_traffic_info` (`ax_msgs/GetTrafficInfo`)             |
| `PUT` | `/ros/map/traffic_info`                                   | `/set_traffic_info` (`ax_msgs/SetTrafficInfo`)             |
| `GET` | `/ros/slam/map_image`                                     | `/slam/get_image` (`cartographer_ros_msgs/GetMapImage`)    |
| `GET` | `/ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}` | `/submap_query_v2` (`cartographer_ros_msgs/SubmapQueryV2`) |
| `GET` | `/ros/rosmaster/topics`                                   | ROS master API (`getTopics` + `getSystemState`)            |
| `GET` | `/ros/rosmaster/topics/published_names`                   | ROS master API (`getSystemState` — 仅发布者)               |
| `POST` | `/ros/imu/clear_gyro_scale`                               | `/imu/clear_gyro_scale` (`std_srvs/Trigger`)               |
| `POST` | `/ros/jack_mast/calibrate_mast_tick_base`                 | `/calibrate_mast_tick_base` (`std_srvs/Trigger`)           |

---

## Map Overlays (地图叠加层) {#map-overlays}

读取或替换动态地图叠加层，格式为 GeoJSON `FeatureCollection`。这是一个原始 JSON 端点 — `Accept` 请求头会被忽略，响应始终为 `application/json`。

### 获取叠加层 (Get overlays) {#get-overlays}

转发 ROS 服务 `/get_map_overlays`（`ax_msgs/GetMapOverlays`）。

#### 路由 (Route)

```text
GET /ros/map/overlays
```

#### 请求 (Request)

无参数，无请求体。

#### 响应 (Response)

`200` `application/json` — 叠加层以 GeoJSON `FeatureCollection` 形式自服务原样透传。

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0]
          ]
        ]
      },
      "properties": { "kind": "speed_limit_zone" }
    }
  ]
}
```

#### 缓存行为 (Cache behavior)

`Cache-Control: no-cache` — 叠加层是动态状态。

#### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                          |
| ------ | --------------------------------------------- |
| `500`  | `map_server` 返回 `success = false`；响应体为其 `message` |

#### 示例 (Example)

```bash
curl http://192.168.25.25:8090/ros/map/overlays > overlays.json
```

### 设置叠加层 (Set overlays) {#set-overlays}

转发 ROS 服务 `/set_map_overlays`（`ax_msgs/SetMapOverlays`）。

#### 路由 (Route)

```text
PUT /ros/map/overlays
```

#### 请求 (Request)

请求体为 GeoJSON `FeatureCollection`，`Content-Type: application/json`。请求体会作为 `overlays` 字符串原样发送给 ROS 服务。

<!-- prettier-ignore -->
| `Content-Type` 请求头   | Body                        |
| ----------------------- | --------------------------- |
| `application/json`      | GeoJSON `FeatureCollection` |
| (其他)                  | `415 Unsupported Media Type`|

#### 响应 (Response)

`200` `application/json`:

```json
{ "success": true, "message": "" }
```

#### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                          |
| ------ | --------------------------------------------- |
| `400`  | 请求体格式错误（无效 JSON）                   |
| `415`  | 不支持的请求 `Content-Type`                   |
| `500`  | `map_server` 返回 `success = false`；响应体为其 `message` |

#### 示例 (Example)

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  --data-binary @overlays.json \
  http://192.168.25.25:8090/ros/map/overlays
```

### SDK 用法 (SDK usage)

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";
import type { FeatureCollection } from "@kingsimba/axbot-sdk/geojson";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });

// 读取当前叠加层
const overlays: FeatureCollection = await api.getMapOverlays();

// 替换叠加层
await api.setMapOverlays(overlays);
```

---

## Traffic Info (动态交通信息) {#traffic-info}

读取或替换当前已加载地图的动态交通信息（禁行区域），格式为轻量 JSON 文档。这是一个原始 JSON 端点 — `Accept` 请求头会被忽略，响应始终为 `application/json`。

交通信息与[地图叠加层](#map-overlays)分开存储：服务端会把每个 zone 转换为带 `properties.trafficInfo = true` 标记的 `Polygon` feature 追加到当前叠加层中。调用 `set_map` 或 `set_map_overlays` 会清除这些生成的 feature。

### 获取交通信息 (Get traffic info) {#get-traffic-info}

转发 ROS 服务 `/get_traffic_info`（`ax_msgs/GetTrafficInfo`）。

#### 路由 (Route)

```text
GET /ros/map/traffic_info
```

#### 请求 (Request)

无参数，无请求体。

#### 响应 (Response)

`200` `application/json` — 交通信息 JSON 文档。

```jsonc
{
  // 接口格式版本；当前仅支持 1。
  "version": 1,

  // 该交通信息所属地图的 UID。
  "map_uid": "6246b10c21e1f5ce844af829",

  // 禁行区域列表，全量替换语义。
  "no_passing_zones": [
    {
      // 列表内唯一。
      "id": "npz-001",

      // 地图坐标系下的 [x, y] 顶点对，至少 3 个；首尾自动闭合。
      "polygon": [
        [1.0, 2.0],
        [3.0, 2.0],
        [3.0, 5.0],
        [1.0, 5.0],
      ],

      // 预留字段。version 1 中仅存储不生效 — 禁行区域恒生效。
      "time_rules": [],
    },
  ],
}
```

#### 缓存行为 (Cache behavior)

`Cache-Control: no-cache` — 交通信息是动态状态。

#### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                          |
| ------ | --------------------------------------------- |
| `500`  | `map_server` 返回 `success = false`；响应体为其 `message` |

#### 示例 (Example)

```bash
curl http://192.168.25.25:8090/ros/map/traffic_info > traffic_info.json
```

### 设置交通信息 (Set traffic info) {#set-traffic-info}

转发 ROS 服务 `/set_traffic_info`（`ax_msgs/SetTrafficInfo`）。

#### 路由 (Route)

```text
PUT /ros/map/traffic_info
```

#### 请求 (Request)

请求体为交通信息 JSON 文档，`Content-Type: application/json`。请求体会作为 `traffic_info` 字符串原样发送给 ROS 服务。

<!-- prettier-ignore -->
| `Content-Type` 请求头   | Body                        |
| ----------------------- | --------------------------- |
| `application/json`      | 交通信息 JSON               |
| (其他)                  | `415 Unsupported Media Type`|

该调用为**全量替换**语义：未出现在 `no_passing_zones` 中的区域会被删除，传空数组即清空所有动态禁行区域。`map_uid` 必须与当前已加载地图的 UID 一致。

#### 响应 (Response)

`200` `application/json`:

```json
{ "success": true, "message": "" }
```

#### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                          |
| ------ | --------------------------------------------- |
| `400`  | 请求体格式错误（无效 JSON）                   |
| `415`  | 不支持的请求 `Content-Type`                   |
| `500`  | `map_server` 返回 `success = false`；响应体为其 `message` |

`500` 覆盖以下校验失败：未加载地图、`map_uid` 与当前地图不一致、zone `id` 重复、多边形顶点少于 3 个。

#### 示例 (Example)

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  --data-binary @traffic_info.json \
  http://192.168.25.25:8090/ros/map/traffic_info
```

### SDK 用法 (SDK usage)

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";
import type { TrafficInfo } from "@kingsimba/axbot-sdk/robotApiType";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });

// 读取当前交通信息
const trafficInfo: TrafficInfo = await api.getTrafficInfo();

// 替换禁行区域
trafficInfo.no_passing_zones = [
  {
    id: "npz-001",
    polygon: [
      [1.0, 2.0],
      [3.0, 2.0],
      [3.0, 5.0],
      [1.0, 5.0],
    ],
  },
];
await api.setTrafficInfo(trafficInfo);
```

---

## Submap Query V2 (子地图查询 V2) {#submap-query-v2}

### 路由 (Route)

```text
GET /ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}
```

### 请求参数 (Request)

<!-- prettier-ignore -->
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

<!-- prettier-ignore -->
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

## SLAM Map Image (SLAM 地图图片) {#slam-map-image}

获取当前 SLAM 地图的 Protobuf 编码 PNG 图像。转发 ROS 服务 `/slam/get_image`。

### 路由 (Route)

```text
GET /ros/slam/map_image
```

### 请求参数 (Request)

<!-- prettier-ignore -->
| 参数                  | 类型    | 位置  | 说明                           |
| --------------------- | ------- | ----- | ------------------------------ |
| `trajectory_id`       | integer | query | 可选。按轨迹 ID 过滤。        |
| `resolution`          | number  | query | 可选。图像分辨率（米/像素）。 |
| `new_trajectory_only` | boolean | query | 可选。仅使用最新轨迹的子图。  |

无请求体。

### 响应 (Response)

`ros_messages.slam.GetMapImageResponse` — 参见 [`slam/map_image.proto`](../ros_message_forward/proto/slam/map_image.proto) 和 [`slam/status.proto`](../ros_message_forward/proto/slam/status.proto)。

响应中包含：

<!-- prettier-ignore -->
| 字段             | 类型       | 说明                             |
| ---------------- | ---------- | -------------------------------- |
| `origin_x`       | double     | 地图图像原点的世界 X 坐标。     |
| `origin_y`       | double     | 地图图像原点的世界 Y 坐标。     |
| `resolution`     | double     | 地图分辨率（米/像素）。         |
| `png_bytes`      | bytes      | PNG 编码的图像数据。            |
| `status_code`    | StatusCode | 结果状态码（见 `slam/status.proto`）。 |
| `status_message` | string     | 人类可读的状态消息。            |

### 缓存行为 (Cache behavior)

无缓存 — 地图图像是动态的，反映当前 SLAM 状态。

### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义               |
| ------ | ------------------ |
| `502`  | ROS 服务调用失败   |
| `504`  | ROS 服务超时不可用 |

### 示例 (Example)

```bash
# 以二进制 protobuf 格式获取
curl -H "Accept: application/x-protobuf" \
  'http://192.168.25.25:8090/ros/slam/map_image' \
  -o map_image.pb

# 以 JSON 格式获取
curl -H "Accept: application/json" \
  'http://192.168.25.25:8090/ros/slam/map_image' | jq .
```

```json
{
  "origin_x": -8.1,
  "origin_y": -4.8,
  "resolution": 0.05,
  "status_code": "OK",
  "status_message": ""
}
```

### SDK 用法 (SDK usage)

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });
const result = await api.getMapImage({ resolution: 0.05 });
if (result) {
  const png = new Blob([result.message.png_bytes], { type: "image/png" });
  const url = URL.createObjectURL(png);
  // 将 url 用作 <img src> 或 ImageBitmap 源
}
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

---

## Clear Gyro Scale (清除陀螺仪比例标定) {#clear-gyro-scale}

转发 `imu_node` 提供的 ROS 服务 `/imu/clear_gyro_scale`（`std_srvs/Trigger`）。清除 IMU 陀螺仪比例标定，将陀螺仪标记为未标定。

### 路由 (Route)

```text
POST /ros/imu/clear_gyro_scale
```

### 请求 (Request)

无参数，无请求体。`Accept` 请求头会被忽略 — 响应始终为 `application/json`。

### 响应 (Response)

`200` `application/json`:

```json
{ "success": true, "message": "Gyro scale cleared." }
```

### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                                      |
| ------ | --------------------------------------------------------- |
| `500`  | `imu_node` 返回 `success = false`；响应体为其 `message`   |
| `502`  | ROS 服务调用失败                                          |
| `504`  | ROS 服务超时不可用                                        |

### 示例 (Example)

```bash
curl -X POST http://192.168.25.25:8090/ros/imu/clear_gyro_scale
```

### SDK 用法 (SDK usage)

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });
await api.clearGyroScale();
```

---

## Calibrate Mast Tick Base (校准顶升桅杆刻度基准) {#calibrate-mast-tick-base}

转发 `jack_mast_node` 提供的 ROS 服务 `/calibrate_mast_tick_base`（`std_srvs/Trigger`）。触发顶升桅杆刻度基准校准。

### 路由 (Route)

```text
POST /ros/jack_mast/calibrate_mast_tick_base
```

### 请求 (Request)

无参数，无请求体。`Accept` 请求头会被忽略 — 响应始终为 `application/json`。

### 响应 (Response)

`200` `application/json`:

```json
{ "success": true, "message": "..." }
```

### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                                      |
| ------ | --------------------------------------------------------- |
| `500`  | `jack_mast_node` 返回 `success = false`；响应体为其 `message` |
| `502`  | ROS 服务调用失败                                          |
| `504`  | ROS 服务超时不可用                                        |

### 示例 (Example)

```bash
curl -X POST http://192.168.25.25:8090/ros/jack_mast/calibrate_mast_tick_base
```
