# Data Specifications

Generally, you can plug a LAN cable into the chassis and join a local network.
Then all ROS topics and services will be accessible.

For example, `/tracked_pose(geometry_msgs/PoseStamped)` topic contains the POSE of the robot.

```
$ rostopic echo /tracked_pose
header:
  seq: 30764921
  stamp:
    secs: 1660643718
    nsecs: 523722400
  frame_id: "map"
pose:
  position:
    x: 0.0011666490831103715
    y: 0.0070293429118208905
    z: 0.0
  orientation:
    x: -0.0064081880462722686
    y: -0.006468852103009961
    z: -0.08701832035436392
    w: 0.9961650972610605
```

But, ROS topics and services are considered internal, and hence subject to changes.
So we recommend stick to REST API & Websocket.

## Robot visualization (视化机器人)

### 机器人描述 数据

We didn't use URDF. But we have a YAML file, it contains extrinsic parameters of sensors:
For example:

```yaml
imu:
  device: /dev/i2c-1
  topic: /imu
  frame_id: imu_link
  pose:
    pos: [0, 0, 0]
    rpy: [0, 0, 0]

lidar:
  device: /dev/ttyAMA4
  pose:
    pos: [0, 0, 0]
    rpy: [3.1415926, 0, 0]

depth_camera:
  devices:
    camera_1:
      name: 'forward'
      topic: '/depth_camera/forward/points2'
      image_topic: '/depth_camera/forward/image'
      padding: [0, 0, 0, 0]
      pose: [0, 0.22, 0.65, 1.5707963, 1.5707963, 0.0174533]
    camera_2:
      name: 'downward'
      topic: '/depth_camera/downward/points2'
      image_topic: '/depth_camera/downward/image'
      padding: [0, 0, 0, 0]
      pose: [0, 0.22, 0.62, -1.5707963, 0.6283185, 3.1764992]
```

### 机器人当前位置 数据

> 以周期流（~10Hz) 提供 在地图上 机器人位置（浮动）和方向（浮动）的。
>
> 特定于 ROS，在固定框架（fixed frame) 例 /map， 提供机器人位姿（位置和转角） 可参考 ROS 里程计

- Websocket topic `/tracked_pose` [Tracked Pose](./websocket.md#current-pose)
- ROS topic `/tracked_pose(geometry_msgs/PoseStamped)`.

## Robot sensor visualization (视化机器人传感器)

### 激光雷达/扫描 数据

> 以周期流 (~5Hz) 在机器人框架上提供 以米(meters in float)为单位的扫描范围数据，或以周期流 (~5Hz) 在机器人固定框架（例 /map) 上提供 三维点云

- Websocket topic `/scan_matched_points2` is world frame cloud points.
- ROS topic `/scan_matched_points2` can also be subscribed.

### 相机影像数据

> 周期流(>5Hz), 图片格式： jpeg/raw/h264, 最小分辨率 至少 180p

## Robot maps(机器人地图)

### 获取当前地图

> 二进制占用网格的地图(pgm/png/image) 和
> 带有相关地图元数据(文件格式 例 yaml) 如下:
>
> - Resolution (float) 分辨率（浮点数）: 地图分辨率 ，以 meters / pixel 为但为
> - Origin (vector of 3): T 地图左下角像素的二维位姿，(x, y, yaw)，yaw 为逆时针旋转（yaw=0 表示不旋转）

There are 3 ways to get current map:

- Websocket topic `/map`, `/map_info`
- REST API `GET /chassis/current_map` it will return the id of the map. And then call `GET /maps/:id` to get the detail.
- ROS topic `/map`, `/map_info`

### 获取地图列表

> - Request: 机器人标识符字符串，例如 Universally unique identifier(UUID) 或 地图名称
> - Operation: 查询机器人的所有可用地图

- Map list is only available with REST API `GET /maps`. [Map List](maps.md#map-list)

### 切换地图

> - Request: 地图标识符字符串(例如 UUID) 或可更换地图的名称
> - Operation: 将机器人的当前地图切换到新请求的地图
> - Response: 返回成功/失败(boolean),用于传达是否实际加载了请求的地

Only available with REST APIs

- `POST /chassis/current_map` [Set Current Map](./current_map_and_pose.md#set-current-map)

### 获取航点

> - Request: 机器人标识符字符串，例如 UUID 或 需要检索其航点名称
> - Operation: 查询机器人所有可用的航路点
> - Response: 返回航点列表及其标识符、名称和在固定框架中(例如/map)机
>   器人目标位姿

There are POIs in map info(which is a [GeoJSON](https://geojson.org/)).

The POIs can be get with:

- REST API `GET /maps/:id` See [Get Map Detail](./maps.md#get-map-detail). Especially `overlays` field.
- Websocket topic `/map_info`
- ROS topic `/map_info`

## Robot unit actions (机器人单位动作)

### 定位功能

> - Request: 在固定框架中(例如/map) 机器人位置位姿
> - Operation: 执行定位以将新姿势分配给机器人
>   Response: 返回成功/失败(boolean),用于传达请求的位置位姿是否被导航系统接受

Set pose is only available with REST API [Set Pose](./current_map_and_pose.md#set-pose)

### 导航功能

> - Request: 在固定框架中(例如/map) 机器人目标位姿
> - Operation: 命令导航系统将机器人导航到请求的位姿
> - Response:返回成功/失败(boolean) 用于传达请求的姿势被导航系统是否接受为新目标

Only with REST API [Move To](./moves.md#create-move-action)

On ROS level, there is only a very primitive service call `/move_base/move_to`. We don't recommend use it.

### Dock 功能

> - Request: 空白或停靠位置的姿势
> - Operation: 命令导航系统将机器人导航到停靠位置并自动启动自动停靠序
>   列
> - Response: 返回成功/失败(boolean) 用于传达停靠请求是否被接受

Use the same API as [Move To](./moves.md#create-move-action).
But:

1. Specify the pose of the docker as target_x, target_y, target_ori.
2. Set `type` to `"charge"`

### 使用手动速度命令进行远程操作:

> ○ User 以周期流（~10Hz)提供线速度和角速度(float)来进行远程操控. 若要将机器人
> 停止在安全位置，使用零值.

- With REST API. See [Remote Control](../guides/start_websocket.md)
- With ROS
  - Call `rosservice call /wheel_control/set_control_mode "control_mode: 'remote'"`
  - Send twist to `/move_base/twist(geometry_msgs/Twist)`

## Robot mission actions(机器人任务动作)

Move actions can be listed, created or cancelled(with REST API). But there is no pause or resume. In our design, they are handled in higher level Applications.

### 开始任务

> - Request: 务标识符字符串，例如 UUID 或任务名称
> - Operation: 开始请求的任务
> - Response: 返回成功/失败(boolean)以表示请求的任务是否成功启动

### 暂停任务

> - Request: 暂停任务的空白请求
> - Operation: 暂停当前任务
> - Response: 返回成功/失败(boolean)以表示请求的任务是否成功暂停

### 恢复任务

> ○ Trigger
>
> - Request: 恢复当前暂停任务的空白请求
> - Operation: 恢复当前暂停的任务
> - Response: 返回成功/失败(boolean)以表示当前任务是否成功恢复

### 停止任务

> ○ Trigger
>
> - Request: 停止当前任务的空白请求
> - Operation: 停止当前任务
> - Response: 返回成功/失败(boolean)以表示当前任务是否成功停止

### 获取任务详情

> ○ Trigger
>
> - Request: 任务标识符字符串(例如 UUID) 或需要获取详细信息的任务名称
> - Operation: 获取任务中的所有单个任务或项目
> - Response: 返回任务中单个任务或项目的列表

### 获取可用任务

> ○ Trigger
>
> - Request: 机器人/地图标识符字符串，例如 UUID 或名称
> - Operation: 查询地图/机器人可用的所有可用任务
> - Response: 返回任务列表及其标识符和名称

## Robot diagnostics(机器人诊断)

### 导航系统状态

> 以周期性流 (~5Hz)，提控导航系统当前状态（字符串 strings 或状态代码 status
> code， 包括错误代码 error code 等）

- Websocket. See [Alerts](./websocket.md#alerts) and [Events](./websocket.md#events)
- ROS topics: `/alerts` and `/events`

### ESTOP status(急停状态)

> 以周期性流 (~1Hz)，提控导航系统急停按钮按下状态（字符串或状态代码)

- REST API and Websocket. See [Emergency Stop](./services.md#setclear-emergency-stop) and [Wheel State](./websocket.md#wheel-state)
- ROS:
  - `rosservice call /wheel_control/set_emergency_stop "data: true"`
  - ROS topic `/wheel_control/wheel_state`:

```
stamp:
  secs: 1660643107
  nsecs: 832175420
left_stamp:
  secs: 1660643107
  nsecs: 789541087
right_stamp:
  secs: 1660643107
  nsecs: 789541605
error_left: 0
error_right: 0
has_follow_error_l: False
has_follow_error_r: False
speed_left: 0.0
speed_right: 0.0
effective_max_forward_acc_left: 1.000020146369934
effective_max_forward_acc_right: 1.000020146369934
effective_max_forward_decel_left: 1.800036072731018
effective_max_forward_decel_right: 1.800036072731018
control_enabled: True
control_mode: "auto"
control_state: 1
emergency_stop_pressed: False
error_msg: "Syntron left: 0(NO_ERROR) Syntron right: 0(NO_ERROR)"
```

### Battery level status(电池电量状态)

> 以周期性流 (~1Hz)，反映当前电池电量（符串、浮点数或整数)

- Websocket [Battery State](./websocket.md#battery-information)
- ROS topic `/battery_state`

```
header:
  seq: 22001
  stamp:
    secs: 1660643179
    nsecs: 447604970
  frame_id: "battery_state"
voltage: 27.299999237060547
temperature: 28.0
current: 0.9000000357627869
charge: nan
capacity: nan
design_capacity: nan
percentage: 0.7799999713897705
power_supply_status: 2
power_supply_health: 1
power_supply_technology: 0
present: True
cell_voltage: [nan]
cell_temperature: []
location: "unknown"
serial_number: "unknown"
```

### 对接/充电状态

> 以周期性流 (~1Hz)，反映导航系统停靠/充电状态（字符串或状态代码)

- Websocket: [Battery State](./websocket.md#battery-information). See `power_supply_status`.
- ROS: In the last question, in `/battery_state`, there is a `power_supply_status`.

### 任务进度状态

> 以周期性流 (~1Hz)，反映导航系统特定任务状态（字符串 strings 或状态代码
> status code， 包括错误代码 error code 等）

- Websocket. See [Move Action State](./websocket.md#move-action-state)
- ROS topic. `/planning_state`

```
action_id: 0
action_type: 0
move_state: 1
fail_reason: 0
remaining_distance: 0.0
target_poses: []
move_intent: 0
intent_target_pose:
  position:
    x: 0.0
    y: 0.0
    z: 0.0
  orientation:
    x: 0.0
    y: 0.0
    z: 0.0
    w: 0.0
stuck_state: 0
going_back_to_charger: False
charger_pose:
  position:
    x: 0.0
    y: 0.0
    z: 0.0
  orientation:
    x: 0.0
    y: 0.0
    z: 0.0
    w: 0.0
---
```

### 传感器状态

Where do you mean by state? The temperature, errors?

For example, for IMU we have ROS topic `/imu_state`

```
recalibrating: False
calibrate_state: 0
calibrate_fail_reason: 0
pose_calibrate_state: 0
pose_calibrate_fail_reason: 0
temperature: 46.07999801635742
reconnect_count: 0
angular_velocity_standard_deviation_10s:
  x: -0.0
  y: -0.0
  z: 0.03255011773096085
angular_velocity_avg_10s:
  x: 0.0
  y: 0.0
  z: 0.08672789520836063
linear_acc_standard_deviation_10s:
  x: 0.015265743641093397
  y: 0.013931061817165242
  z: 0.024184700507327943
```
