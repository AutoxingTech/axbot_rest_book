# 导航 (Navigation)

在当前地图上规划两个位姿之间的一级路线。

## 路线规划 (Plan Route) {#plan-route}

自 2.16.0 起支持。更早版本的机器人不提供该接口，会返回 `404`。

调用 `ax_navi_ros` 中 `route_server` 节点提供的独立一级路线规划服务。代理到
`/plan_route` ROS 服务（`ax_msgs/ProtoService`），其载荷为
`ax_proto_msgs.RoutePlanRequest` / `ax_proto_msgs.RoutePlanResponse` —— 见
[`route_server.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/route_server.proto)。

### 路由 (Route)

```text
POST /ros/navi/plan_route
```

### 请求 (Request)

请求体携带一个 `RoutePlanRequest`，可以是 proto3 JSON 或序列化后的 protobuf。

<!-- prettier-ignore -->
| 请求头 `Content-Type`    | 请求体                              |
| ------------------------ | ----------------------------------- |
| `application/json`       | `RoutePlanRequest` 的 proto3 JSON   |
| `application/x-protobuf` | 序列化后的 `RoutePlanRequest`       |
| （其他任意值）           | `415 Unsupported Media Type`        |

```json
{
  "start": { "x": 1.0, "y": 2.0, "theta": 0.0 },
  "end": { "x": 10.0, "y": 5.0, "theta": 1.5708 }
}
```

两个位姿均为必填。`theta` 单位为弧度，可为任意有限值 —— 规划器会自行归一化。
坐标缺失或非有限值由规划服务判定，并在响应中返回，不会作为 HTTP 错误。

### 响应 (Response)

返回 `200` 及一个 `ax_proto_msgs.RoutePlanResponse`，格式由 `Accept` 请求头决定。

<!-- prettier-ignore -->
| 字段                  | 类型                    | 说明                                                       |
| --------------------- | ----------------------- | ---------------------------------------------------------- |
| `fail_reason`         | `MoveFailReason.Type`   | 成功时为 `NONE`                                            |
| `error_message`       | string                  | 供开发者定位失败的文字说明，不要用于产品逻辑               |
| `origin`              | `Pose2D`                | 第一个路线点的绝对位姿                                     |
| `position_resolution` | float                   | 每个位置单位的米数，当前为 `0.001`                          |
| `angle_resolution`    | float                   | 每个角度单位的弧度数，当前为 `0.0001`                       |
| `dx`、`dy`            | `sint32[]`              | 相对前一个点、按量化坐标表示的位置增量                      |
| `theta`               | `sint32[]`              | 每个点的绝对量化朝向                                       |
| `motion_mode`         | `MotionMode.Type[]`     | 从第 `i` 点到第 `i + 1` 点的运动模式；最后一个点为 `NONE`   |
| `spin_index`          | `uint32[]`              | 需要原地旋转的点的下标，升序                                |

规划失败时只有 `fail_reason` 与 `error_message` 有意义；`fail_reason` 为 `NONE`
时才会填充其后的路线字段。

路线点采用增量编码以压缩大路线。需按顺序还原：

```text
qx[i] = qx[i-1] + dx[i]         qx[-1] = 0
x[i]  = origin.x + qx[i] * position_resolution
y[i]  = origin.y + qy[i] * position_resolution
ori[i] = theta[i] * angle_resolution
```

业务失败（起点或终点在地图外、终点不可达、地图未就绪）同样返回 `200`，由
`fail_reason` 与 `error_message` 描述；各取值见[移动失败原因](./moves.md#move-failure-reasons)。

### 缓存行为 (Cache behavior)

`Cache-Control: no-store` —— 结果取决于当前地图与规划配置。

### 附加错误码 (Additional error codes)

<!-- prettier-ignore -->
| 状态码 | 含义                                       |
| ------ | ------------------------------------------ |
| `400`  | 请求体格式错误，或请求体为空               |
| `415`  | 不支持的请求 `Content-Type`                |
| `502`  | ROS 服务调用失败，或响应无法解码           |
| `504`  | 超时前 `/plan_route` 一直不可用            |

### 示例 (Example)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  --data '{"start":{"x":1.0,"y":2.0,"theta":0.0},"end":{"x":10.0,"y":5.0,"theta":1.5708}}' \
  http://192.168.25.25:8090/ros/navi/plan_route | jq .
```

```json
{
  "origin": { "x": 1.0, "y": 2.0 },
  "position_resolution": 0.001,
  "angle_resolution": 0.0001,
  "dx": [0, 0, 9000],
  "dy": [0, 3000, 0],
  "theta": [0, 15708, 15708],
  "motion_mode": ["REVERSE", "FORWARD"]
}
```

proto3 JSON 会省略取默认值的字段，因此规划成功时没有 `fail_reason`（`NONE`），
空的 `spin_index` 或 `error_message` 也不会出现。`fail_reason` 缺失即视为成功。

### SDK 用法 (SDK usage)

```ts
import { robotApi } from "@kingsimba/axbot-sdk/robotApi";

robotApi.init({ getApiBase: () => "http://192.168.25.25:8090" });

const { message, points } = await robotApi.planRoute(
  { x: 1.0, y: 2.0, theta: 0 },
  { x: 10.0, y: 5.0, theta: 1.5708 },
);
// points 已还原为绝对位姿：
// [{ x, y, theta, motionMode, spin }, ...]
if (message.fail_reason !== 0) {
  console.warn(message.error_message);
}
```
