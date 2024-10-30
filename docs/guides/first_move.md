# Start Moving

To move the robot, two prerequisites are required:

1. A map must be set
2. An initial pose must be given

## Setting a Map

One can use [RobotAdmin](./robot_admin.md) website to set a map on which the robot resides.

![](./2022-03-17-17-21-44.png)

Or use [Map List API](../reference/maps.md#map-list)，to find and map id.
And use `POST /chassis/current-map` to set the map as current map.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"map_id": 286}' \
  http://192.168.25.25:8090/chassis/current-map
```

```json
{
  "id": 286,
  "uid": "616cd441e1209813dd4bb25d",
  "map_name": "-1层",
  "create_time": 1647503669,
  "map_version": 6,
  "overlays_version": 8
}
```

## Coordinates

![](./coordinates.png)

On `RobotAdmin`, two arrows (red for X-axis, blue for Y-axis) cross on the origin of the map.
The two axes forms a orthogonal rectangular coordinate system.

The coordinate of a point on map is marked as (x, y), which are the distances in meters from the origin.

A `pose` is usually expressed as:

```json
{
  "pos": [0.12, 0.85], // position
  "ori": 1.57 // orientation, in radius. The x-positive direction is 0, counter-clockwise
}
```

## Setting Pose

To move the robot, an initial pose must be given.

As a common practice, mapping starts from the charger.
So the initial pose of the robot(on charger) becomes origin of the map.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"position": [0, 0, 0], "ori": 1.57}' \
  http://192.168.25.25:8090/chassis/pose
```

- `position: [0, 0, 0]` means `x=0, y=0, z=0`。
- `ori: 1.57` pi/2，means robot's heading is Y-positive.

When map and initial pose are both given, the robot can be seen on `RobotAdmin` as:

![](./2022-03-17-17-31-03.png)

## Start Moving

As for now, use `POST /chassis/moves` to create a move action.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"standard", "target_x":0.731, "target_y":-1.525, "target_z":0, "creator":"head-unit"}' \
  http://192.168.25.25:8090/chassis/moves
```

```json
{
  "id": 4409,
  "creator": "head-unit",
  "state": "moving",
  "type": "standard",
  "target_x": 0.731,
  "target_y": -1.525,
  "target_z": 0.0,
  "target_ori": null,
  "target_accuracy": null,
  "use_target_zone": null,
  "is_charging": null,
  "charge_retry_count": 0,
  "fail_reason": 0,
  "fail_reason_str": "None - None",
  "fail_message": "",
  "create_time": 1647509573,
  "last_modified_time": 1647509573
}
```

## Planning State

Use `GET /chassis/moves/:id` to see the state of a move action.

```bash
curl http://192.168.25.25:8090/chassis/moves/4409
```

```json
{
  "id": 4409,
  "creator": "head-unit",
  "state": "finished",
  "type": "standard",
  "target_x": 0.7310126134385344,
  "target_y": -1.5250144001960249,
  "target_z": 0.0,
  "target_ori": null,
  "target_accuracy": null,
  "use_target_zone": null,
  "is_charging": null,
  "charge_retry_count": 0,
  "fail_reason": 0,
  "fail_reason_str": "None - None",
  "fail_message": "",
  "create_time": 1647509573,
  "last_modified_time": 1647509573
}
```

`state` field show the state of the action.

The current action's state is constantly changing. Though it can be queried with the above API, it very inefficient.
So we provides `websocket` API, to allow the robot to constantly report back its states. This is more efficient than request/response form of REST API.
