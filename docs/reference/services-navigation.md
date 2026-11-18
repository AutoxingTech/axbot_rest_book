# Navigation

Plan a primary route between two poses on the current map.

## Plan Route {#plan-route}

Available since version 2.16.0. Older robots do not serve the endpoint and answer `404`.

Runs the standalone primary route planning service provided by the `route_server`
node of `ax_navi_ros`. Proxies to the `/plan_route` ROS service
(`ax_msgs/ProtoService`), whose payload is `ax_proto_msgs.RoutePlanRequest` /
`ax_proto_msgs.RoutePlanResponse` — see
[`route_server.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/route_server.proto).

### Route

```text
POST /ros/navi/plan_route
```

### Request

The body carries a `RoutePlanRequest` as proto3 JSON or as serialized protobuf.

<!-- prettier-ignore -->
| `Content-Type` request header | Body                                |
| ----------------------------- | ----------------------------------- |
| `application/json`            | Proto3 JSON of `RoutePlanRequest`   |
| `application/x-protobuf`      | Serialized `RoutePlanRequest`       |
| (any other)                   | `415 Unsupported Media Type`        |

```json
{
  "start": { "x": 1.0, "y": 2.0, "theta": 0.0 },
  "end": { "x": 10.0, "y": 5.0, "theta": 1.5708 }
}
```

Both poses are required. `theta` is in radians and may be any finite value — the
planner normalizes it. Missing or non-finite coordinates are rejected by the
planning service and reported in the response, not as an HTTP error.

### Response

`200` with an `ax_proto_msgs.RoutePlanResponse`, in the format selected by the
`Accept` header.

<!-- prettier-ignore -->
| Field                 | Type                    | Meaning                                                                 |
| --------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `fail_reason`         | `MoveFailReason.Type`   | `NONE` on success                                                       |
| `error_message`       | string                  | Failure text for developers; do not build product logic on it           |
| `origin`              | `Pose2D`                | Absolute pose of the first route point                                  |
| `position_resolution` | float                   | Metres per position unit, currently `0.001`                             |
| `angle_resolution`    | float                   | Radians per angle unit, currently `0.0001`                              |
| `dx`, `dy`            | `sint32[]`              | Position deltas of quantized coordinates, relative to the previous point |
| `theta`               | `sint32[]`              | Absolute quantized orientation of each point                            |
| `motion_mode`         | `MotionMode.Type[]`     | Motion mode from point `i` to point `i + 1`; `NONE` on the last point   |
| `spin_index`          | `uint32[]`              | Ascending indexes of the points that rotate in place                    |

Only `fail_reason` and `error_message` are meaningful when planning failed;
the route fields below them are filled when `fail_reason` is `NONE`.

Route points are delta-encoded to keep large routes small. Restore them in order:

```text
qx[i] = qx[i-1] + dx[i]         qx[-1] = 0
x[i]  = origin.x + qx[i] * position_resolution
y[i]  = origin.y + qy[i] * position_resolution
ori[i] = theta[i] * angle_resolution
```

Planning failures — start or end out of the map, unreachable goal, map not
ready — still answer `200`. They are described by `fail_reason` and
`error_message`; see [Move failure reasons](./moves.md#move-failure-reasons) for
the values.

### Cache behavior

`Cache-Control: no-store` — the result depends on the current map and planner
configuration.

### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                                  |
| ------ | -------------------------------------------------------- |
| `400`  | Malformed request body, or empty body                    |
| `415`  | Unsupported request `Content-Type`                        |
| `502`  | ROS service call failed, or its response could not be decoded |
| `504`  | `/plan_route` was unavailable before timeout             |

### Example

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

Proto3 JSON omits default-valued fields, so a successful route carries no
`fail_reason` (`NONE`), and an empty `spin_index` or `error_message` is absent.
Treat a missing `fail_reason` as success.

### SDK usage

```ts
import { robotApi } from "@kingsimba/axbot-sdk/robotApi";

robotApi.init({ getApiBase: () => "http://192.168.25.25:8090" });

const { message, points } = await robotApi.planRoute(
  { x: 1.0, y: 2.0, theta: 0 },
  { x: 10.0, y: 5.0, theta: 1.5708 },
);
// points are restored to absolute poses:
// [{ x, y, theta, motionMode, spin }, ...]
if (message.fail_reason !== 0) {
  console.warn(message.error_message);
}
```
