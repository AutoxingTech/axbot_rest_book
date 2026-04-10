# Current Map And Pose API

The SDK wraps two pose-related helpers:

| SDK helper | Method | Path | Request body |
| --- | --- | --- | --- |
| `setMap(mapId)` | `POST` | `/chassis/current-map` | `{ "map_id": number }` |
| `setPose(x, y, theta)` | `POST` | `/chassis/pose` | `{ "position": [x, y], "ori": theta }` |

## Set Current Map

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"map_id":18}' \
  "$ROBOT_API_BASE/chassis/current-map"
```

The SDK helper requires `mapId` and returns `false` immediately if it is missing.

### What The SDK Does

`setMap(mapId)` performs two requests:

1. `POST /chassis/current-map` with `{ "map_id": mapId }`
2. `POST /chassis/pose` with `{ "position": [0, 0], "ori": 1.57 }`

That second step mirrors the current SDK implementation. It resets the robot pose to a safe default after switching maps.

## Get Current Map

The raw REST endpoint remains useful even though it is not wrapped by the SDK:

```bash
curl "$ROBOT_API_BASE/chassis/current-map"
```

A current robot response looks like this:

```json
{
  "id": 18,
  "uid": "69d770f4825f4e0556177042",
  "map_name": "1",
  "create_time": 1775726829,
  "map_version": 0,
  "overlays_version": 1
}
```

The latched topic `/map/info` reports the currently active map to WebSocket clients.

## Set Pose

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"position":[0.0,0.0],"ori":1.57}' \
  "$ROBOT_API_BASE/chassis/pose"
```

The SDK helper sends a 2D position array and heading in radians.

### SDK Request Shape

```ts
interface SetPoseRequest {
  position: [number, number];
  ori: number;
}
```

Older docs described a 3D `position` array and `adjust_position`. Those fields are not used by the current SDK helper and should be treated as raw-REST, build-specific behavior.

## Pose Feedback

Use `/tracked_pose` to observe the latest fused pose:

```json
{
  "topic": "/tracked_pose",
  "pos": [-3.553, -0.288],
  "ori": -1.28,
  "cov": [[0.01, 0], [0, 0.01]]
}
```

## Raw REST Variants To Review

The previous version of this page described additional map-loading modes such as `map_uid`, direct map payload upload, and loading from local files. Those capabilities are not represented by the current SDK helper and should be validated directly on the target robot before use.
