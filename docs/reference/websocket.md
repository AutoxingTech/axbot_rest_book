# Websocket Reference

## Wheel State

```json
{
  "topic": "/wheel_state",
  "control_mode": "auto", // auto/remote/manual，对应自动、手推、远控
  "emergency_stop_pressed": true // 急停是否按下
}
```

## Positioning State

```json
{
  "topic": "/slam/state",
  "state": "positioning", // 'inactive/slam/positioning' 闲置/建图/定位
  "reliable": true,
  "inter_constraint_count": 20,
  "good_constraint_count": 20
}
```

## Vision Detected Objects

::: warning
还在开发中。
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

## Battery Information

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

## Current Pose

自车在当前地图下的位姿。

```json
{
  "topic": "/tracked_pose",
  "pos": [3.7325, -10.8525],
  "ori": -1.56 // 朝向。X轴正向为0。Y 轴正向为 pi/2
}
```

## Move Action State

用于实时返回当前 MoveAction 的执行状态。

```ts
enum ActionType
{
  none,
  standard, // 一般运动
  charge // 充电
  along_given_route, // 沿固定轨迹行驶
  return_to_elevator_waiting_point, // 返回电梯待命点(当进电梯失败时用)
  pull_over // 靠边停车
}

enum MoveState
{
  none,
  idle,
  moving,
  succeeded,
  failed,
  cancelled
}
```

```json
{
  "topic": "/planning_state",
  "action_id": 561,
  "action_type": "standard", // see ActionType
  "move_state": "moving", // see MoveState
  "target_poses": [
    {
      "pos": [4.08, 2.99],
      "ori": 0
    }
  ],
  "fail_reason": 0, // 当 move_state 为 failed 时，显示错误原因
  "fail_reason_str": "none", // 当 move_state 为 failed 时，显示错误原因
  "remaining_distance": 2.8750057220458984, // 剩余距离

  // 目标点的位姿
  // 当前运动目标。不一定是传入的目标坐标(当对桩时，会实时返回检测的充电桩的位置)。
  "intent_target_pose": {
    "pos": [0, 0],
    "ori": 0
  }
}
```

## Lidar Point Cloud

世界坐标系下的点云。

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

## Route

当前路线。

```json
{
  "topic": "/path",
  "stamp": 1653301966860,
  "positions": [
    [0.94, 0.27],
    [0.94, 0.25],
    [0.96, 0.25]
  ]
}
```

## Mapping Trajectory

实时反馈建图过程中的轨迹

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

实时反馈当前的警告信息

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
调试用，可能会变。
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

For Browser for Node. Use [jmuxer](https://github.com/samirkumardas/jmuxer) can decode it.

![](./rgb_camera.png)

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

## 传感器控制器状态

```ts
type PowerState =
  | 'awake' // 工作中
  | 'awakening' // 正在从睡眠中唤醒，会持续2、3秒
  | 'sleeping'; // 睡眠中
```

```json
{
  "topic": "/sensor_manager_state",
  "power_state": "awake" // 见 PowerState
}
```

## 附近的机器人

```json
{
  "topic": "/nearby_robots",
  "robots": [
    {
      "uid": "xx",
      "trend": "",
      ""
    }
  ]
}
```

## Odom 状态

一个 Debug 用的频道，用于观察激光里程计的斜方差。

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

## 外部接入 RGB 相机数据

如果底盘没有安装摄像头，可以从外部接入 RGB 相机数据，从而实现图像识别，监控。

**控制频道**

头壳接收这个 websocket 消息，做如下工作：

- 启动对应的设备
- 设置对应的分辨率、FPS
- 把数据按照指定的频道回传

```json
{
  "topic": "/external_rgb_camera_control",
  "enabled_devices": [
    {
      "name": "前视",
      "width": 320,
      "height": 240,
      "fps": 5,
      "external_data_topic": "/external_rgb_data/front"
    }
  ]
}
```

**数据频道**

把摄像头数据，通过 websocket 发给底盘，回传给底盘。

```json
{
  "topic": "/external_rgb_data/front", // 用控制频道指定的名称
  "format": "jpeg", // 目前只支持 jpeg,
  "stamp": 1655896161.012, // 图片的 Unix Timestamp
  "data": "Aasdfwe3424..." // base64编码的 jpeg 图像
}
```
