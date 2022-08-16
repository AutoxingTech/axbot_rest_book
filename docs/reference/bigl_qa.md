# Data Specifications

## Robot visualization (视化机器人)

### 机器人描述 数据

We didn't use URDF. But we have a YAML file, it contains extrinsic parameters of sensors:
For example:

```yaml
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

Generally, you can plug a LAN cable into the chassis and join a local network.
Then all topic and services will be accessible, for example `/odom(nav_msgs/Odometry)`, `/imu(sensor_msgs/Imu)`

> 特定于 ROS，在固定框架（fixed frame) 例 /map， 提供机器人位姿（位置和转角） 可参考 ROS 里程计

For example, `/tracked_pose(std_msgs/PoseStamped)` topic contains the POSE of the robot.
Topics and services are considered internal, and hence subject to changes.
So we recommend stick to REST API & Websocket whenever possible.

## Robot sensor visualization (视化机器人传感器)

### 激光雷达/扫描 数据

> 以周期流 (~5Hz) 在机器人框架上提供 以米(meters in float)为单位的扫描范围数据，或以周期流 (~5Hz) 在机器人固定框架（例 /map) 上提供 三维点云

Websocket topic `/scan_matched_points2` is world frame cloud points. ROS topic `/scan_matched_points2` can also be subscribed.

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

- `GET /maps`. [Map List](maps.md#map-list)
- `POST /chassis/current_map` [Set Current Map](./current_map_and_pose.md#set-current-map)

### 获取航点

> - Request: 机器人标识符字符串，例如 UUID 或 需要检索其航点名称
> - Operation: 查询机器人所有可用的航路点
> - Response: 返回航点列表及其标识符、名称和在固定框架中(例如/map)机
>   器人目标位姿

There are POIs in map info(which is a GeoJSON).

The map info can be get with:

- REST API `GET /maps/:id` [Get Map Detail](./maps.md#get-map-detail). Especially `overlays` field.
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

○ Trigger
■ Request: 空白或停靠位置的姿势
■ Operation: 命令导航系统将机器人导航到停靠位置并自动启动自动停靠序
列
■ Response: 返回成功/失败(boolean) 用于传达停靠请求是否被接受
● 使用手动速度命令进行远程操作:
○ User 以周期流（~10Hz)提供线速度和角速度(float)来进行远程操控. 若要将机器人
停止在安全位置，使用零值.

## Robot mission actions(机器人任务动作)

● 开始任务
○ Trigger
■ Request: 务标识符字符串，例如 UUID 或任务名称
■ Operation: 开始请求的任务
■ Response: 返回成功/失败(boolean)以表示请求的任务是否成功启动
● 暂停任务
○ Trigger
■ Request: 暂停任务的空白请求
■ Operation: 暂停当前任务
■ Response: 返回成功/失败(boolean)以表示请求的任务是否成功暂停
● 恢复任务
○ Trigger
■ Request: 恢复当前暂停任务的空白请求
■ Operation: 恢复当前暂停的任务
■ Response: 返回成功/失败(boolean)以表示当前任务是否成功恢复
● 停止任务
○ Trigger
■ Request: 停止当前任务的空白请求
■ Operation: 停止当前任务
■ Response: 返回成功/失败(boolean)以表示当前任务是否成功停止
● 获取任务详情
○ Trigger
■ Request: 任务标识符字符串(例如 UUID) 或需要获取详细信息的任务名称
■ Operation: 获取任务中的所有单个任务或项目
■ Response: 返回任务中单个任务或项目的列表
● 获取可用任务
○ Trigger
■ Request: 机器人/地图标识符字符串，例如 UUID 或名称
■ Operation: 查询地图/机器人可用的所有可用任务
■ Response: 返回任务列表及其标识符和名称

# Robot diagnostics(机器人诊断)

● 导航系统状态
○ 以周期性流 (~5Hz)，提控导航系统当前状态（字符串 strings 或状态代码 status
code， 包括错误代码 error code 等）
● ESTOP status(急停状态)
○ 以周期性流 (~1Hz)，提控导航系统急停按钮按下状态（字符串或状态代码)
● Battery level status(电池电量状态)
○ 以周期性流 (~1Hz)，反映当前电池电量（符串、浮点数或整数)
● 对接/充电状态
○ 以周期性流 (~1Hz)，反映导航系统停靠/充电状态（字符串或状态代码)
● 任务进度状态
○ 以周期性流 (~1Hz)，反映导航系统特定任务状态（字符串 strings 或状态代码
status code， 包括错误代码 error code 等）
● 传感器状态
(end of document
