# Websocket Reference

Topics are used to receive realtime information from the robot.
Use the following commands to start/stop listening to some topics.

```
{"enable_topic": "TOPIC_NAME"}
{"disable_topic": "TOPIC_NAME"}
```

Since 2.7.0, multiple topic names are supported. Require cap flag `supportsEnableTopicList`.

```
{"enable_topic": ["/actions", "/alerts", "/tracked_pose"]} // since 2.7.0
{"disable_topic": ["/actions", "/alerts", "/tracked_pose"]} // since 2.7.0
```

## Map

In pure-location mode, the `/map` topic contains the currently used map. Any only update once.

In mapping mode, the map is constantly updated at a small interval.

![](./map.png)

```json
{
  "topic": "/map",
  "resolution": 0.1, // the width/height of a single pixel, in meter
  "size": [182, 59], // the size of the image, in pixel
  "origin": [-8.1, -4.8], // The world coordinate of the lower left pixel
  "data": "iVBORw0KGgoAAAANSUhEUgAAALYAAAA7BAAAAA..." // Base64 encoded PNG file
}
```

## Obstacle Map

It shows the sensed obstacles around the robot, including data from all sensors and virtual-walls.

It's only for debugging, seeing through the eyes of the robots.

The **dark-red** pixels are the entity of the obstacles, while the **light-red** pixels are extruded with the inscribe-radius of the robot. The center of the robot may never enter the red area, or the robot must have collide with something.

| Low Res. Costmap           | High Res. Costmap            |
| -------------------------- | ---------------------------- |
| /maps/5cm/1hz              | /maps/1cm/1hz                |
| Used for path planning     | Used for collision detection |
| ![](./low_res_costmap.png) | ![](./high_res_costmap.png)  |

```
{
  "topic": "/maps/5cm/1hz", // or '/maps/1cm/1hz'
  "resolution": 0.05,
  "size": [
    200,
    200
  ],
  "origin": [
    -2.8,
    -6.2
  ],
  "data": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICA..." // based64 encoded PNG file
}
```

## Wheel State

```json
{
  "topic": "/wheel_state",
  "control_mode": "auto", // auto/remote/manual
  "emergency_stop_pressed": true, // Whether in emergency stop mode

  // optional. Only some specific robot model supports it. 
  // Some wheels has a release-wheels-wire.
  // This flag reflects whether the wire is active.
  "wheels_released": true
}
```

## Positioning State

```json
{
  "topic": "/slam/state",
  
  // inactive: Idle. Not creating map, no map is set either.
  // slam: creating map
  // positioning: A map is set, the robot is in localization state.
  "state": "positioning",

  "reliable": true,       // false means the position is lost

  // "lidar_reliable = False" means that no constraint exists between newly created 
  // observations(submaps) and the current static map.
  // 
  // The position loss steps are as follow:
  // 1. No constraints(between new observations and static map) exists, "lidar_reliable" will become false.
  // 2. The robot enters pure dead-reckoning mode. And "position_loss_progress" will start to increase.
  // 3. After some movements if new constraints are created, "lidar_reliable" will become true.
  //    But if "position_loss_progress" reaches 1.0, "reliable" will also become false.
  "lidar_reliable": false, // since 2.11.0-rc18
  "position_loss_progress": 0.35  // since 2.11.0-rc18. Only exists when lidar_reliable = false

  // The quality of positioning(Experimental)
  //
  // Only valid in positioning state.
  // since 2.3.0.
  //  0 - unknown
  //  1 - lost
  //  3 - poor
  //  8 - good
  // 10 - excellent
  "position_quality": 10,
  
  // how much the current lidar points matches with the static map
  "lidar_matching_score": 0.545, 

  // other debugging flags
  "lidar_matched": true,
  "wheel_slipping": false,
  "inter_constraint_count": 27,
  "good_constraint_count": 27
}
```

## Vision Detected Objects

::: warning
Experimental Feature
:::

```ts
enum VisualObjectLabel {
  none = 0,
  person = 1, // 人
  platformHandTruck = 2, // 手推板车
  scaffold = 3, // 脚手架
  queueStand = 4, // 排队栏杆
  portableGrandstand = 5, // 移动式看台
}
```

```json
{
  "topic": "/vision_detected_objects",
  "boxes": [
    {
      "pose": { "pos": [0.32, 0.97], "ori": 0.0 }, // 物体的位置和朝向
      "dimensions": [0.0, 0.0, 0.0], // 物体的宽、长、高
      "value": 0.8005573153495789,
      "label": 1 // VisualObjectLabel
    },
    {
      "pose": { "pos": [0.63, 1.08], "ori": 0.0 },
      "dimensions": [0.0, 0.0, 0.0],
      "value": 0.5348057150840759,
      "label": 1
    },
    {
      "pose": { "pos": [0.51, 0.74], "ori": 0.0 },
      "dimensions": [0.0, 0.0, 0.0],
      "value": 0.41888049244880676,
      "label": 1
    }
  ]
}
```

## Battery State

![](./battery.png)

```json
{
  "topic": "/battery_state",
  "secs": 1653299708, // 时间戳
  "voltage": 26.3, // 电池电压
  "current": 3.6, // 电池电流。充电时，一般为负。运行时，一般为正。
  "percentage": 0.64, // 电量
  "power_supply_status": "discharging" // charging/discharing/full
}
```

## Detailed Battery State

Since 2.11.0

![](./battery.png)

```json
{
  "topic": "/detailed_battery_state",
  "secs": 1653299708, // 时间戳
  "voltage": 26.3, // 电池电压
  "current": 3.6, // 电池电流。充电时，一般为负。运行时，一般为正。
  "percentage": 0.64, // 电量
  "power_supply_status": "discharging", // charging/discharing/full
  "cell_voltages": [4.141, 4.138, 4.139, 4.133, 4.136, 4.138, 4.138],
  "capacity": 14.0, // Ah
  "design_capacity": 15.0, // Ah
  "state_of_health": 0.93, // percentage
  "cycle_count": 80,
}
```

## Current Pose

Current pose in world frame.

```json
{
  "topic": "/tracked_pose",
  "pos": [3.7325, -10.8525],
  "ori": -1.56 // 朝向。X轴正向为0。Y 轴正向为 pi/2
}
```

## Planning State

Return the execution state of the latest move action.

```ts
enum ActionType {
  none,
  standard,
  charge,
  along_given_route, // move along a given track
  return_to_elevator_waiting_point, // used when failed to enter elevator
  enter_elevator,
  leave_elevator,
  pull_over, // (DON'T USE) pull over to make space (for other robots to pass)
  align_with_rack, // (DON'T USE)
}

enum MoveState {
  none,
  idle,
  moving,
  succeeded,
  failed,
  cancelled,
}

enum StuckState {
  move_stucked,
  target_spin_stucked,
}
```

```json
{
  "topic": "/planning_state",

  "map_uid": "xxxxxx", // the uid of current map

  // action
  "action_id": 3354,
  "action_type": "enter_elevator", // See ActionType, since 2.5.2
  "move_state": "moving", // see MoveState
  "fail_reason": 0, // valid when move_state == failed
  "fail_reason_str": "none", // valid when move_state == failed
  "remaining_distance": 2.8750057220458984, // in meters

  // target related
  "target_poses": [
    {
      "pos": [4.08, 2.99],
      "ori": 0
    }
  ],

  // intent related
  "move_intent": "", // deprecated by `action_type`
  "intent_target_pose": {
    // The pose of the current target
    "pos": [0, 0],
    "ori": 0
  },

  // stuck state
  "stuck_state": "move_stucked", // See StuckState, since 2.5.2
  "in_elevator": true, // optional, since 2.5.2
  "viewport_blocked": true, // optional, since 2.5.2

  // optional, since 2.9.0. 
  // Destination is occupied by another robot. So it's waiting on road side.
  "is_waiting_for_dest": true,

  "docking_with_conveyer": true, // optional, since 2.9.0

  // optional, since 2.11.0. Default to 0. 
  // Only valid when moving along a given route.
  // It gives the number of points which are already passed.
  "given_route_passed_point_count": 3 
}
```

## Lidar Point Cloud

![](./pointcloud.png)

### Point Cloud Used for SLAM

The combined point cloud from one or multiple lidar(if any) used for SLAM.
The coordinates are in world frame.

```json
{
  "topic": "/scan_matched_points2",
  "stamp": 1653302201889,
  "points": [
    [7.83, 3.84, 0.04],
    [7.8, 3.88, 0.04],
    [7.79, 4.14, 0.04]
    ...
  ]
}
```

### Point Cloud for Individual Lidar Device

Since 2.12.0

This topic is used to debug individual lidar device.
The coordinates are in world frame.

Commonly used topic names are:

```
/horizontal_laser_2d/matched
/left_laser_2d/matched
/right_laser_2d/matched
/lt_laser_2d/matched (left top)
/rb_laser_2d/matched (right back)
```

```json
{
    "topic": "/horizontal_laser_2d/matched",
    "stamp": 1741764468.939,
    "fields": [
        {
            "name": "x",
            "data_type": "f32"
        },
        {
            "name": "y",
            "data_type": "f32"
        },
        {
            "name": "z",
            "data_type": "f32"
        },
        {
            "name": "intensity",
            "data_type": "f32"
        }
    ],
    "data": "QphAQHPLmkHDpvk/xcTEPk+RQED22ppBp6..." // base64 encoded binary data
}
```

## Global Path

Current global path.

![](./route.png)

```json
{
  "topic": "/path",
  "stamp": 1653301966860,
  "positions": [
    [0.94, 0.27, 0.01], // the heading(3rd member) is added since 2.12.0
    [0.94, 0.25, 0.01],
    [0.96, 0.25, 0.01]
  ]
}
```

## Trajectory

The trail of the robot.

- In mapping mode, the trajectory is the full trajectory of the whole mapping process.
- In pure location mode, the trajectory is trimmed once a while.

![](./trajectory.png)

:::warning
For 2.5.0 or below, this enable message is wrongly named as `/trajectory_node_list`.
To play safe, enable both `/trajectory` and `/trajectory_node_list`.
:::

```json
{
  "topic": "/trajectory",
  "points": [
    [2.0, 3.0],
    [2.1, 3.1],
    [2.4, 3.0],
    [2.7, 2.9],
    [3.0, 2.8],
    [3.6, 2.6],
    [3.7, 2.5],
    [3.9, 2.3],
    [4.1, 2.1],
    [3.9, -1.1],
    [3.8, -2.2]
  ]
}
```

## Alerts

This topic contains currently active alerts.

The application should monitor alerts and take according actions, like:

1.  Go back to charger when battery is low(8501). Turn off the robot when battery is extremely low(8003).
2.  Warn users about docking errors(10001, 10002, 10003).
3.  Warn users about possible robot falls over. (4008).
4.  Warn users about IMU calibration error(4501, 4502) before creating new map.
5.  Notify us about application crashes. (1001, 1002, 1003, 1004, 2001, 3001, 4001, 11001, etc)
6.  Notify us about sensor errors. (4009, 5001, etc)

A full list of alerts is on https://rb-admin.autoxing.com/api/v1/static/error_code_map_full.json.

![](./alerts.png)

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

## Traveled Distance

::: warning
Experimental Feature
:::

```json
{
  "topic": "/platform_monitor/travelled_distance",
  "start_time": 1653303520, // 本次 move 起始时间
  "duration": 60, // 本次 move 执行时间
  "distance": 27.89, // 本次 move 移动距离
  "accumulated_distance": 5230.0 // 系统启动后运行总距离
}
```

## RGB Video Stream

h264 encoded data stream.

```json
{
  "topic": "/rgb_cameras/front/video",
  "stamp": 1653303702.821,
  "data": "AAAAAWHCYADAAb5Bv4yqqseHIsjRwL5E4C4uX/CmRcXVaxddV3zf5uZO..."
}
```

![](./rgb_camera.png)

::: tip
For browser or NodeJS, the stream can be decoded with [jmuxer](https://github.com/samirkumardas/jmuxer).
Use `flusingTime: 0` to avoid delay.

```js
this.jmuxer = new JMuxer({
    node: myNativeElement,
    mode: 'video',
    flushingTime: 0,
});
```
:::

Currently topics: (Different devices may differ)

- `/rgb_cameras/front/video`
- `/rgb_cameras/back/video`
- `/rgb_cameras/front_augmented/video` Augmented video stream
  for debugging vision based object detection.

![](./detect.png)

## RGB Image Stream

jpeg encoded image stream.

::: tip
Image stream is considerably larger than H264 video stream. For internet, please use video stream.
:::

```json
{
  "topic": "/rgb_cameras/front/compressed",
  "stamp": 1653303702.821,
  "format": "jpeg",
  "data": "YXNkZmFzZndlcndldHNhZGZhc2Rmd2V0cjJ5NDVqdHltNDU2..."
}
```

Currently topics: (Different devices may differ)

- `/rgb_cameras/front/compressed`
- `/rgb_cameras/back/compressed`

## Sensor Manager State

```ts
type PowerState =
  | 'awake' // operational
  | 'awakening' // Recovering from sleeping to awake. Usually lasts 2-3 seconds.
  | 'sleeping'; // when sleeping, some sensors are turned off.
```

```json
{
  "topic": "/sensor_manager_state",
  "power_state": "awake" // see PowerState
}
```

## Robot Model

The footprint of a robot may change dynamically. For example, it will become larger when it loads a rack.
This topic is used to know the dynamic footprint of the robot.

```json
{
  "topic": "/robot_model",
  "footprint": [
    [0.13, -0.25],
    [0.203, -0.228],
    [0.235, -0.178],
    [0.245, -0.077],
    [0.248, 0.029],
    [0.243, 0.163],
    [0.235, 0.217],
    [0.207, 0.26],
    [0.17, 0.291],
    [0.122, 0.324],
    [-0.122, 0.324],
    [-0.17, 0.291],
    [-0.207, 0.26],
    [-0.235, 0.217],
    [-0.243, 0.163],
    [-0.248, 0.029],
    [-0.245, -0.077],
    [-0.235, -0.178],
    [-0.203, -0.228],
    [-0.13, -0.25]
  ],
  // since 2.12.4 The expanded_footprint adds more safe zone around the robot
  "expanded_footprint": [
    [-0.245, -0.077],
    [-0.235, -0.178],
    [-0.203, -0.228],
    [-0.13, -0.25]
    "..."
  ]
  "width": 0.496
}
```

## Nearby Robots

With a dedicated hardware (optional installation), the robot can sense the whereabouts and the path of other robots.

This information can be used to avoid collision between robots or move in formation.

![](./nearby_robots.png)

```json
{
  "topic": "/nearby_robots",
  "robots": [
    {
      "uid": "21922076002353N",
      "pose": { "pos": [1.05, 0.08], "ori": 1.69 },
      "trend": [],
      "footprint_digest": "0150acd9" // since 2.7.0, See /nearby_robot_footprints
    },
    {
      "uid": "21922076002413T",
      "pose": { "pos": [0.19, 0.01], "ori": 1.6 },
      "trend": [
        [0.19, 0.01],
        [0.12, -0.02]
      ],
      "footprint_digest": "7cb254d5"
    }
  ]
}
```

## Nearby Robot Footprints

This topic contains detailed footprints of nearby robots.

In 2.7.0, the topic `/nearby_robots` adds a property `footprint_digest`.
It can be used with `/nearby_robot_footprints` to determine the footprint of nearby robots.

```json
{
  "topic": "/nearby_robot_footprints",
  "footprints": [
    {
      "digest": "0150acd9",
      "coordinates": [
        [0.0, -0.273],
        [0.14, -0.27],
        [0.2, -0.25],
        [0.24, -0.2],
        [0.25, -0.1],
        [0.25, 0.13],
        [0.24, 0.2],
        [0.18, 0.26],
        [0.15, 0.265],
        [0.14, 0.283],
        [-0.14, 0.283],
        [-0.15, 0.265],
        [-0.18, 0.26],
        [-0.24, 0.2],
        [-0.25, 0.13],
        [-0.25, -0.1],
        [-0.24, -0.2],
        [-0.2, -0.25],
        [-0.14, -0.27]
      ]
    }
  ]
}
```

## Odom State

A debug topic, to visualize covariance of lidar odom。

```json
{
  "topic": "/odom_state",
  "lidar_odom_reliable": true,
  "lidar_odom_cov": [
    0.000023889469957794063,
    -0.00002311983917024918,
    -0.00002311983917024918,
    0.00005866867650183849
  ]
}
```

## External RGB Camera Data

If the robot isn't shipped with RGB cameras. One can install external cameras and feed the data back to the robot.
So monitoring and vision based functions can still work.

**Control Channel**

When receiving this topic, the peripheral device should:

1. Open the corresponding cameras
2. Set required resolution, fps
3. Send data back through the data channel

```json
{
  "topic": "/external_rgb_camera_control",
  "enabled_devices": [
    {
      "name": "Front Camera",
      "width": 320,
      "height": 240,
      "fps": 5,
      "external_data_topic": "/external_rgb_data/front"
    }
  ]
}
```

**Data Channel**

Use this channel to send RGB data to the robot.

```json
{
  "topic": "/external_rgb_data/front", // The topic, specified in the control channel's `external_data_topic`
  "format": "jpeg", // must be jpeg
  "stamp": 1655896161.012, // The timestamp of the image
  "data": "Aasdfwe3424..." // base64 encoded JPEG data
}
```

## Global Positioning State

The feedback of service `POST /services/start_global_positioning`.

```json
{
  "topic": "/global_positioning_state",
  "state": "succeeded",
  "score": "82.1",

  // If false, the pose is globally unique and can be trusted.
  // If true, the environment is not a good match
  // or pose is not globally unique thus should be verified by an human operator.
  //
  // If the result is from a successful match of barcode,
  // `needs_confirmation` is always true.
  "needs_confirmation": false,
  "pose": { "pos": [0.32, 0.97], "ori": 0.0 }, // 物体的位置和朝向
  "message": "Succeeded with barcode R25B13_7"
}
```

## Device Info

Only for those clients which already established a websocket connection but don't want to make REST API requests.

Request:

```json
{ "topic": "/get_device_info_brief" }
```

Response:

```json
{
  "topic": "/device_info_brief",
  "rosversion": "1.15.11",
  "rosdistro": "noetic",
  "axbot_version": "master-pi64",
  "device": {
    "model": "waiter"
  },
  "baseboard": {
    "firmware_version": "22032218"
  },
  "wheel_control": {
    "device_type": "amps",
    "firmware_version": "amps_20211103"
  },
  "lidar": {
    "model": "ld06"
  },
  "bottom_sensor_pack": {
    "firmware_version": ""
  },
  "depth_camera": {
    "firmware_version": ""
  },
  "remote_params": {
    "tags": [
      "ihawk_crossfire",
      "RGB_external",
      "strongest_lidar_match",
      "mute_baseboard_com_output"
    ]
  }
}
```

## Environment Match Map

This map reflects how the point clouds matches the existing map.

Red indicates the environment has changed. If there is too much red, the map should be rebuilt.

![](./2023-02-02-16-32-47.png)

Request:

```json
{ "enable_topic": "/env_match_map" }
```

Response:

```json
{
  "topic": "/env_match_map",
  "stamp": 1675326661.915,
  "resolution": 0.10000000149011612,
  "size": [579, 614],
  "origin": [-9.35, -34.75],
  "data": "iVBORw0KGgoAAAANSUhEUgAAAkMAA..."
}
```

## Environment Symmetry Map

This map reflects the degree of symmetry of point cloud against current environment.

Red indicates a featureless environment, like tunnel or spacious lobby.

![](./2023-02-02-16-33-45.png)

Request:

```json
{ "enable_topic": "/env_symmetry_map" }
```

Response:

```json
{
  "topic": "/env_symmetry_map",
  "stamp": 1674993781.916,
  "resolution": 0.10000000149011612,
  "size": [579, 614],
  "origin": [-9.35, -34.75],
  "data": "iVBORw0KGgoAAAANSUhEUgAAAkMAAAJmCAAAAAB..."
}
```

## Local Path

This topic is used for debugging.

```json
{
  "topic": "/local_path",
  "width": 1.1,
  "color": "##FFEACD50", // RRGGBBAA
  "poses": [
    [1, 2, 3], // x, y, ori
    [3, 4, 3] // x, y, ori
  ]
}
```

## Jack State

The state of the jacking device.

```json
{
  "topic": "/jack_state",
  "state": "hold", // unknown, hold, jacking_up, jacking_down
  "progress": 0.35, // position of the jacking device, in percentage
  "self_checking": false,
  "self_check_state": "no_error" // no_error, up, down, error, unknown
}
```

## Incremental Map

Incremental mapping is used to enhance positioning in an ever-changing environment.
This topic shows the freshly incremented map. It can be turn on in `RobotAdmin`'s display panel.

The image in the topic is grey-scale. But in `RobotAdmin`, the colors are transformed,
with red pixels represent new obstacles and light-blue represent new clear space.

![](./incremental_map.png)

```json
{
  "topic": "/incremental_map",
  "stamp": 1693570082.777,
  "resolution": 0.05000000074505806,
  "size": [638, 881],
  "origin": [-21.95, -1.25],
  "data": "iVBORw0KGgoAAAANSUhEUgAAAn4AAANxBAAAAACaa..."
}
```

## Cached Topics

To handle very large map, `/map_v2`, `/map/costmap_v2`, `/incremental_map_v2` uses `data_url` instead of `data`.

In this way, the data of websocket is greatly reduced. And the image has `Cache-Control: public, max-age=` and `Etag: xxx` headers, so the browsers and servers can cache the images.

```json
{
  "topic": "/map_v2",
  "stamp": 1693570028.939,
  "resolution": 0.05000000074505806,
  "size": [661, 1256],
  "origin": [-8.25, -36.05],
  "data_url": "static-files/map-d69c26ec2bdff8dad76fe6e8d3fa65d9b3041fc669ee3c0a96f7b544473fcec0.png"
}
```

Use `http:://192.168.25.25:8090/static-files/map-d69c26ec2bdff8dad76fe6e8d3fa65d9b3041fc669ee3c0a96f7b544473fcec0.png` to access the image later.

```
$ curl -I http://192.168.25.25:8090/static-files/map-d69c26ec2bdff8dad76fe6e8d3fa65d9b3041fc669ee3c0a96f7b544473fcec0.png
HTTP/1.1 200 OK
date: Fri, 01 Sep 2023 12:20:04 GMT
server: uvicorn
Content-Type: image/png
ETag: d69c26ec2bdff8dad76fe6e8d3fa65d9b3041fc669ee3c0a96f7b544473fcec0
Cache-Control: public, max-age=2592000
Vary: Accept, Cookie
Allow: GET, HEAD, OPTIONS
X-Page-Generation-Duration-ms: 18
X-Frame-Options: DENY
Content-Length: 141733
X-Content-Type-Options: nosniff
Referrer-Policy: same-origin
Cross-Origin-Opener-Policy: same-origin
```

## Collected Barcode

This topic is used to collect barcodes.

```json
{
  "topic": "/collected_barcode",
  "state": "unknown|ok|no_result|not_unique|too_far|unaligned_with_robot",
  "barcode": 
  {
    "id": "D2_125", 
    "pose": {"pos": [-14.842, 17.595], "ori": -1.457}, 

    // Since 2.9.1
    // It's only accurate when the robot is not moving
    "relative_pose": {"pos": [-1.992, -0.092], "ori": -0.312} 
  }
}
```

The collected barcodes should be added into `overlays` of the map. See [overlays](./overlays.md#barcode)
The barcodes in `overlays` can be used in [global positioning](./services.md#start-global-positioning).


## Detected Rack

```json
{
  "topic": "/detected_rack",
  "rack_detected": true,
  "frame": "map", // optional, valid when `rack_detected` is true
  // optional, valid when `rack_detected` is true
  "rack_box": {
    "pose": {
      "pos": [0.0, 0.0],
      "ori": 0.0
    },
    "width": 0.64324,
    "height": 0.69234
  },
  // optional, valid when `rack_detected` is true
  "rack_box_aligned": {
    "pose": {
      "pos": [0.0, 0.0],
      "ori": 0.0
    },
    "width": 0.66,
    "height": 0.70
  }
}
```

## Follow Target State

This topic is used for [following a moving target](./moves.md#follow-target)

The user should send this message to the robot at a reasonable rate(around 2-4hz).

```json
{
  "topic": "/follow_target_state",
  "follow_state": "follow_pose|pause|fail",
  "target_pose": {
    // valid when follow_state == follow_pose
    "pos": [1.1, 2.2], // optional. The pose can have only pos or ori
    "ori": 1.2 // optional. The pose can have only pos or ori
  }
}
```

`follow_state` has the following values:

- `follow_pose`: Move to the given `target_pose`
- `pause`: Hold the robot still
- `fail`: Mark the current action as failed. To start following again, start another action.

## Robot Signal

Since 2.8.0, requires `caps.supportsRobotSignal`.

Some indicators to tell whether the robot is turning left/right, or braking.

```json
{
  "topic": "/robot_signal",
  "turn_left": true, // turning left
  "turn_right": false,  // turning right
  "brake": false, // braking
  "reverse": false, // backing up
}
```

## Nearby Auto Doors

This topic is used to visualize the state of auto-doors.

![](./nearby_auto_doors.png)

```json
{
  "topic": "/nearby_auto_doors",
  "doors": [
    {
      "name": "Abc",
      "mac": "123",
      "state": "closed",
      "polygon": [
        [
          2.937,
          3.875
        ],
        [
          2.899,
          2.368
        ],
        [
          3.208,
          2.329
        ],
        [
          3.237,
          3.904
        ]
      ]
    }
  ]
}
```

## Bumper State

Since 2.9.0

The state of the bump sensor around the robot.

```json
{
  "topic": "/bumper_state",
  "front_bumper_pressed": false,
  "rear_bumper_pressed": false
}
```

## Roller State

Since 2.9.0

The state of the roller.

```json
{
  "topic": "/roller_state",
  "state": "hold", // unknown, hold, loading, unloading
}
```

## Detected Pallets

Since 2.10.0

The detected pallets.

![](./pallet.png)

![](./detected_pallet.png)

```json
{
    "topic": "/detected_pallets",
    "pallets": [
        {
            "frame": "map",
            "pallet_id": "SOME_PALLET_ID",
            "pose": {
                "pos": [120.0, 50.0],
                "ori": 1.618,
            },
            "size": {
                "width": 1.0,
                "depth": 1.3,
                "height": 0.3,
                "pocket_width": 0.3,
                "pocket_height": 0.2,
                "pocket_spacing": 0.2,
            }
        }
    ]
}
```

## Landmarks

Since 2.11.0

This topic is used to visualize [landmarks](./landmarks.md) collected during the mapping process.

```json
{
  "topic": "/landmarks",
  "landmarks": [
      {
        "id": "landmark_1",
        "pos": [0.32, 0.97],
        "in_use": true
      }
  ]
}
```

## Digital Input/Output

(Under discussion)

The IO board is a dedicated hardware. It connects to the robot with the USB port.
It supports 16 or more IO pins. The IO pins work at 12V/24V.
Some IO pins are predefined as braking light, turning light etc. And some can be controlled by the user.

The state of the IO pins:

```json
{
  "topic": "/io_pins_state",
  "inputs": [
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0]
  ],
  "outputs": [
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0]
  ]
}
```

Full update of output pins:

```json
{
  "topic": "/set_output_pins",
  "outputs": [
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0]
  ]
}
```

Selected update of output pins:

```json
{
  "topic": "/modify_output_pins",
  "enable": [0, 9, 13],
  "disable": [2, 4, 6],
}
```

## Push Handle State

```json
{
  "topic": "/push_handle_state",
  "mode": "idle", // idle, push, drive
  "left_activated": false,
  "right_activated": false,
  "calibrating": true, // Optional. Only present when true
}
```

## Detected Trailer

![](./trailer.png)

```json
{
    "topic": "/detected_trailer",
    "detected": true,
    "hitch_position": [0, -0.35], // relative to the pose of the robot
    "hitch_arm_length": 0.4,  // the length of the hitch arm
    "width": 0.5, // width of the trailer
    "depth": 1.0, // depth(length) of the trailer
    "pose": {  // pose of the trailer, relative to the robot
        "pos": [0.31, -0.85],
        "ori": 0.13
    }
}
```

## Depth Camera Images

Since 2.12.0

![](./depth_image_rainbow.png)

```json
{
    "topic": "/depth_camera/downward/image",
    "size": [160, 100],
    "data": "iVBORw0KGgoAAAANSUhEUgAAALYAAAA7BAAAAA..." // Base64 encoded PNG file
}
```

Commonly used topic names are:

```
/depth_camera/downward/image
/depth_camera/upward/image
/depth_camera/forward/image
```

## Updated Map Slice

```json
{
    "topic": "/updated_map_slice",
    "width": 298,
    "height": 356,
    "resolution": 0.05,
    "origin_x": -4.4,
    "origin_y": -9.0,
    "data": "iVBORw0KGgoAAAANSUhEUg..." // base64 encoded greyscale PNG
}
```

## Raw Io-board State

![](./raw_io_board_state.png)

The current state of input & output of the IoBoard.

```json
rtn = {
    "topic": "/raw_io_board_state",
    "inputs_active": [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    "outputs_active": [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
}
```
