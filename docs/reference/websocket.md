# WebSocket Reference

The current SDK exposes topic names in `TopicNames` and payload types in `topicMessages.ts`. This page groups those topics by function and highlights the payload fields that are stable in the SDK types.

## Session Control

Subscribe and unsubscribe with JSON control messages:

```json
{"enable_topic":"/tracked_pose"}
{"disable_topic":"/tracked_pose"}
```

If `caps.supportsEnableTopicList` is true, the robot also accepts arrays:

```json
{"enable_topic":["/tracked_pose","/planning_state","/alerts"]}
{"disable_topic":["/tracked_pose","/planning_state","/alerts"]}
```

Most topics are available on `ws://ROBOT_HOST:8090/ws/v2/topics` or the equivalent managed endpoint.

## Topic Groups

### Mapping, Maps, And Localization

| Topic | SDK type | Notes |
| --- | --- | --- |
| `/map` | `OccupancyGridMsg` | Full occupancy map with inline `data` |
| `/map_v2` | `OccupancyGridMsg` | Cached-map variant using `data_url` |
| `/incremental_map` | `OccupancyGridMsg` | Incremental mapping overlay |
| `/bump_map` | `OccupancyGridMsg` | Bump-derived map layer |
| `/env_match_map` | `OccupancyGridMsg` | Environment match quality view |
| `/env_symmetry_map` | `OccupancyGridMsg` | Symmetry/featurelessness view |
| `/wifi_strength_map` | `OccupancyGridMsg` | Wi-Fi heatmap |
| `/strongest_wifi_strength_map` | `OccupancyGridMsg` | Strongest-AP heatmap |
| `/map/costmap` | `OccupancyGridMsg` | Costmap with inline `data` |
| `/map/costmap_v2` | `OccupancyGridMsg` | Cached costmap variant |
| `/maps/5cm/1hz` | `OccupancyGridMsg` | Low-resolution obstacle map |
| `/maps/1cm/1hz` | `OccupancyGridMsg` | High-resolution obstacle map |
| `/maps/1cm/1hz/depth` | `OccupancyGridMsg` | Depth-derived obstacle map |
| `/map/info` | `MapInfoMsg` | Current map name, UID, and overlays |
| `/tracked_pose` | `TrackedPoseMsg` | Current fused pose |
| `/path` | `PathMsg` | Global path |
| `/local_path` | `LocalPathMsg` | Local path/debug trajectory |
| `/trajectory` | `TrajectoryMsg` | Robot trail |
| `/trajectory_node_list` | `TrajectoryMsg` | Deprecated legacy alias |
| `/slam/state` | `SlamStateMsg` | Mapping versus positioning state |
| `/constraint_list` | `ConstraintListMsg` | SLAM debug constraints |
| `/move_base/trajectory` | `MoveBaseTrajectoryRawMsg` | Relative planning trajectory |

### Planning, Actions, And Platform State

| Topic | SDK type | Notes |
| --- | --- | --- |
| `/planning_state` | `PlanningStateMsg` | Current move state and targets |
| `/action` | `ActionMsg` | Action/event audit stream |
| `/alerts` | `AlertsMsg` | Current active alerts |
| `/wheel_state` | `WheelStateMsg` | Control mode and estop state |
| `/battery_state` | `DetailedBatteryStateMsg` | Battery telemetry |
| `/motion_metrics` | `MotionMetricsMsg` | Velocity and acceleration metrics |
| `/imu_state` | `ImuStateMsg` | IMU calibration and health state |
| `/depth_camera_state` | `DepthCameraStateMsg` | Whether depth cameras are enabled |
| `/baseboard_state` | `BaseboardStateMsg` | Baseboard power-related state |
| `/platform_monitor/travelled_distance` | `TravelledDistanceMsg` | Distance counters |
| `/push_handle_state` | `PushHandleStateMsg` | Push-handle mode and activation |
| `/sensor_manager_state` | `SensorManagerStateMsg` | Power state: awake, awakening, or sleeping |
| `/jack_state` | `JackStateMsg` | Jack progress and load data |
| `/towing_state` | `TowingStateMsg` | Towing-lock state |
| `/global_positioning_state` | `GlobalPositioningStateMsg` | Result of start-global-positioning |
| `/ws_connections` | `WsConnectionsMsg` | Connected WebSocket clients |
| `/ws_connection_established` | `WsConnectionEstablishedMsg` | Connection event |
| `/ws_connection_disconnected` | `WsConnectionDisconnectedMsg` | Disconnect event |

### Perception And Sensors

| Topic | SDK type | Notes |
| --- | --- | --- |
| `/scan_matched_points2` | `PointCloudMsg` | Map-frame SLAM point cloud |
| `/semantic_points` | `SemanticPointsMsg` | Base64-encoded structured point data |
| `/ultrasonic_echoes/points2` | `PointCloudMsg` | Ultrasonic echo point cloud |
| `/detected_features/gates` | `GateFeaturesMsg` | Detected gates |
| `/detected_features/charger_pose` | `DetectedFeaturesMsg` | Charger pose candidates |
| `/detected_features/chargers` | `DetectedFeaturesMsg` | Charger detections |
| `/detected_rack` | `DetectedRackMsg` | Rack alignment feedback |
| `/vision_detected_objects` | `BoundBoxArrayMsg` | Vision detections |
| `/lidar_detected_objects` | `BoundBoxArrayMsg` | LiDAR detections |
| `/matched_depth_points/forward` | `PointCloudGeneralMsg` | Forward matched depth points |
| `/matched_depth_points/downward` | `PointCloudGeneralMsg` | Downward matched depth points |
| `/matched_depth_points/upward` | `PointCloudGeneralMsg` | Upward matched depth points |
| `/depth_camera_state` | `DepthCameraStateMsg` | Camera availability summary |

### Cameras, Fleet, And Environment

| Topic | SDK type | Notes |
| --- | --- | --- |
| `/rgb_cameras/front/video` | `RgbCameraRawMsg` | H.264 front stream |
| `/rgb_cameras/front_augmented/video` | `RgbCameraRawMsg` | Annotated/augmented front stream |
| `/rgb_cameras/back/video` | `RgbCameraRawMsg` | H.264 rear stream |
| `/nearby_robots` | `NearbyRobotsMsg` | Nearby fleet members and predicted trend |
| `/nearby_robot_footprints` | `NearbyRobotFootprintsMsg` | Footprint lookup table for nearby robots |
| `/nearby_auto_doors` | `NearbyAutoDoorsMsg` | Auto-door polygons and state |
| `/detected_pallets` | `DetectedPalletsMsg` | Pallet detections |
| `/robot/footprint` | `RobotFootprintMsg` | Current footprint polygon |
| `/robot_model` | `RobotModelMsg` | Current and expanded footprint |

## Core Payload Examples

### Occupancy Grid Topics

The same payload structure is used by `/map`, `/map_v2`, costmap topics, and several diagnostic map layers:

```json
{
  "topic": "/map",
  "origin": [-8.1, -4.8],
  "size": [182, 59],
  "resolution": 0.1,
  "data": "iVBORw0KGgoAAAANSUhEUgAAALYAAAA7BAAAAA..."
}
```

Cached variants use `data_url` instead of `data`.

### Tracked Pose

```json
{
  "topic": "/tracked_pose",
  "pos": [3.7325, -10.8525],
  "ori": -1.56,
  "cov": [[0.01, 0], [0, 0.01]]
}
```

### Planning State

The SDK type is intentionally conservative and guarantees these fields:

```json
{
  "topic": "/planning_state",
  "move_state": "moving",
  "target_poses": [
    {
      "pos": [4.08, 2.99],
      "ori": 0
    }
  ],
  "charger_pose": {
    "pos": [0, 0],
    "ori": 0
  },
  "going_back_to_charger": false
}
```

Some robot builds also publish fields such as `action_id`, `remaining_distance`, `fail_reason`, and `stuck_state`. Those are useful, but they are not currently typed in the SDK.

### Alerts

```json
{
  "topic": "/alerts",
  "alerts": [
    {
      "code": 6004,
      "level": "error",
      "msg": "Kernel temperature is higher than 80!"
    }
  ]
}
```

### Battery State

The SDK models the battery topic with the richer `DetailedBatteryStateMsg` payload:

```json
{
  "topic": "/battery_state",
  "current": 3.6,
  "voltage": 26.3,
  "percentage": 0.64,
  "power_supply_status": "discharging",
  "secs": 1653299708,
  "capacity": 14.0,
  "cell_voltages": [4.141, 4.138, 4.139],
  "design_capacity": 15.0,
  "state_of_health": 0.93
}
```

### Jack State

```json
{
  "topic": "/jack_state",
  "state": "hold",
  "progress": 0.35,
  "self_checking": false,
  "weight": 0,
  "weight_error": 0
}
```

### Global Positioning State

```json
{
  "topic": "/global_positioning_state",
  "state": "succeeded",
  "score": 82.1,
  "needs_confirmation": false,
  "pose": {
    "pos": [0.32, 0.97],
    "ori": 0.0
  },
  "message": "Succeeded with barcode R25B13_7"
}
```

### RGB Video Streams

RGB video topics carry base64-encoded H.264 access units:

```json
{
  "topic": "/rgb_cameras/front/video",
  "stamp": 1653303702.821,
  "data": "AAAAAWHCYADAAb5Bv4yqqseHIsjRwL5E4C4uX/CmRcXVaxddV3zf5uZO..."
}
```

![](./rgb_camera.png)

### Nearby Robots

```json
{
  "topic": "/nearby_robots",
  "robots": [
    {
      "uid": "21922076002353N",
      "pose": { "pos": [1.05, 0.08], "ori": 1.69 },
      "trend": [],
      "footprint_digest": "0150acd9"
    }
  ]
}
```

## Practical Notes

### Mapping UIs

For mapping and map-debugging screens, the most useful subscription set is usually:

```json
{
  "enable_topic": [
    "/tracked_pose",
    "/map_v2",
    "/trajectory",
    "/scan_matched_points2",
    "/maps/5cm/1hz",
    "/slam/state"
  ]
}
```

![](./map.png)
![](./trajectory.png)
![](./pointcloud.png)

### Cached Topics

Large map-like topics often use cached static-file URLs. Clients should cache those resources using the provided `ETag` and `Cache-Control` headers instead of re-fetching full PNG payloads every frame.

### Capability Detection

Not every robot publishes every topic in this page. Check `device.info.caps` before depending on optional features such as bags, RGB cameras, jack devices, towing, or semantic points.

## Topics Mentioned In Older Docs But Not Exported By The Current SDK

The previous version of this page described several useful topics that are not currently represented in `TopicNames` or the exported SDK payload types. They may still exist on some builds, but they should be treated as raw, build-specific integrations.

| Topic | Status |
| --- | --- |
| `/follow_target_state` | Legacy/raw only; not exported by current SDK |
| `/device_info_brief` | Legacy/raw only; not exported by current SDK |
| `/odom_state` | Legacy/raw only; not exported by current SDK |
| `/external_rgb_camera_control` | Legacy/raw only; not exported by current SDK |
| `/external_rgb_data/front` | Legacy/raw only; not exported by current SDK |
| `/collected_barcode` | Legacy/raw only; not exported by current SDK |
| `/robot_signal` | Legacy/raw only; not exported by current SDK |
