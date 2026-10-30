# WebSocket 参考 (WebSocket Reference) {#websocket-reference}

Topic 用于接收机器人的实时信息。
使用以下命令开始或停止监听特定的 Topic。

```
{"enable_topic": "TOPIC_NAME"}
{"disable_topic": "TOPIC_NAME"}
```

自 2.7.0 版本起，支持同时启用多个 Topic。这需要 `supportsEnableTopicList` 能力标志。

```
{"enable_topic": ["/actions", "/alerts", "/tracked_pose"]} // 自 2.7.0 起
{"disable_topic": ["/actions", "/alerts", "/tracked_pose"]} // 自 2.7.0 起
```

## Protobuf 消息 (Protobuf Messages) {#protobuf-messages}

部分 Topic 以二进制 protobuf WebSocket 帧发送，其他 Topic 使用 JSON 文本消息。一个连接可以同时接收这两种格式。在支持的服务器上，可添加 `?pb=1`，优先使用支持两种格式的 Topic 的 protobuf 格式。

二进制帧格式如下：

```text
[topic_length: 1 byte][topic: UTF-8 bytes][flags: 1 byte][publisher_index: 1 byte, optional][payload]
```

Topic 长度是 Topic 名称的字节数。标志位 0 表示负载经 gzip 压缩；标志位 1 表示包含发布者索引字节。其他标志位为保留位。必要时先解压负载，再将其解码为 `ax_proto_msgs.RosMessageWrapper`。其 `type` 标识消息类型，对应的负载字段包含 Topic 数据。

[RosMessageWrapper 定义](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/ros_message_wrapper.proto)列出了支持的消息类型和负载。[protobuf 源码目录](https://github.com/AutoxingTech/axbot-ts-sdk/tree/master/src/proto)包含这些消息的定义。也可通过 [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk) TypeScript SDK 获取这些定义。

## Topic 索引 (Topic index) {#topic-index}

Topic 按功能分组：

- [定位](./websocket-localization.md) —— SLAM 状态、位姿、全局定位、条码和地标。
- [建图](./websocket-mapping.md) —— 地图与代价地图图像、增量更新、轨迹以及地图质量诊断。
- [导航与规划](./websocket-navigation.md) —— 规划状态、路径、跟随目标控制、机器人模型与信号。
- [底盘与安全](./websocket-chassis.md) —— 车轮、里程计、IMU、触碰限位和推手。
- [货物与设备](./websocket-cargo.md) —— 顶升、辊道、货架、托盘和挂车状态。
- [感知与摄像头](./websocket-perception.md) —— 点云、检测对象和摄像头视频流。
- [环境与连接](./websocket-environment.md) —— 附近机器人、自动门、V2X 信标和 GNSS/INS。
- [系统与电源](./websocket-system.md) —— 电池、传感器电源、报警、应用事件和 IO 引脚。

### 定位 (Localization)

<!-- prettier-ignore -->
| Topic                                                                              | 说明                                                              |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`/slam/state`](./websocket-localization.md#positioning-state)                       | SLAM 状态、定位可靠性与定位质量。                                 |
| [`/tracked_pose`](./websocket-localization.md#current-pose)                          | 机器人在世界坐标系中的位姿。                                      |
| [`/global_positioning_state`](./websocket-localization.md#global-positioning-state)  | `start_global_positioning` 的进度和结果。                         |
| [`/collected_barcode`](./websocket-localization.md#collected-barcode)                | 机器人看到的条码及其地图位姿。                                    |
| [`/landmarks`](./websocket-localization.md#landmarks)                                | 为当前地图采集的地标。                                            |

### 建图 (Mapping)

<!-- prettier-ignore -->
| Topic                                                         | 说明                                                                          |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`/map`](./websocket-mapping.md#map)                          | 当前地图图像；定位模式下只更新一次，建图模式下持续更新。                      |
| [`/map_v2`](./websocket-mapping.md#cached-topics)             | 通过可缓存的 `data_url` 提供的大地图图像。                                    |
| [`/maps/5cm/1hz`](./websocket-mapping.md#obstacle-map)        | 用于路径规划的低分辨率代价地图。                                              |
| [`/maps/1cm/1hz`](./websocket-mapping.md#obstacle-map)        | 用于碰撞检测的高分辨率代价地图。                                              |
| [`/incremental_map`](./websocket-mapping.md#incremental-map)  | 建图后新出现的障碍物和被清除的空间。                                          |
| [`/updated_map_slice`](./websocket-mapping.md#updated-map-slice) | 刚更新的地图区域的灰度切片。                                               |
| [`/trajectory`](./websocket-mapping.md#trajectory)            | 机器人轨迹，建图模式下完整，定位模式下定期裁剪。                              |
| [`/env_match_map`](./websocket-mapping.md#environment-match-map)       | 实时点云与已存地图的匹配程度。                                        |
| [`/env_symmetry_map`](./websocket-mapping.md#environment-symmetry-map) | 环境对定位而言的对称（歧义）程度。                                    |

### 导航与规划 (Navigation & Planning)

<!-- prettier-ignore -->
| Topic                                                                     | 说明                                            |
| ------------------------------------------------------------------------- | ----------------------------------------------- |
| [`/planning_state`](./websocket-navigation.md#planning-state)              | 当前移动动作的执行状态。                        |
| [`/path`](./websocket-navigation.md#global-path)                           | 规划出的全局路径。                              |
| [`/local_path`](./websocket-navigation.md#local-path)                      | 局部规划器路径（调试）。                        |
| [`/follow_target_state`](./websocket-navigation.md#follow-target-state)    | 向机器人发送跟随目标控制消息。                  |
| [`/robot_model`](./websocket-navigation.md#robot-model)                    | 动态轮廓，包含挂载的货架。                      |
| [`/platform_monitor/travelled_distance`](./websocket-navigation.md#traveled-distance) | 当前移动的距离和耗时。                |
| [`/robot_signal`](./websocket-navigation.md#robot-signal)                  | 转向灯和刹车灯状态。                            |

### 底盘与安全 (Chassis & Safety)

<!-- prettier-ignore -->
| Topic                                                          | 说明                                       |
| -------------------------------------------------------------- | ------------------------------------------ |
| [`/wheel_state`](./websocket-chassis.md#wheel-state)           | 控制模式、急停和车轮释放状态。             |
| [`/odom_state`](./websocket-chassis.md#odom-state)             | 激光里程计可靠性与协方差（调试）。         |
| [`/fused_sensor_state`](./websocket-chassis.md#fused-sensor-state) | 打滑、被推动和静止状态估计。           |
| [`/imu_state`](./websocket-chassis.md#imu-state)               | 原始 IMU 数据与陀螺仪零偏标定状态。        |
| [`/bumper_state`](./websocket-chassis.md#bumper-state)         | 前、后触碰限位状态。                       |
| [`/push_handle_state`](./websocket-chassis.md#push-handle-state) | 推手模式与激活状态。                    |

### 货物与设备 (Cargo & Equipment)

<!-- prettier-ignore -->
| Topic                                                            | 说明                                      |
| ---------------------------------------------------------------- | ----------------------------------------- |
| [`/jack_state`](./websocket-cargo.md#jack-state)                 | 顶升位置、进度和自检状态。                |
| [`/roller_state`](./websocket-cargo.md#roller-state)             | 辊道状态：保持、装货中或卸货中。          |
| [`/detected_rack`](./websocket-cargo.md#detected-rack)           | 机器人前方检测到的货架及其尺寸。          |
| [`/detected_rack_states`](./websocket-cargo.md#detected-rack-states) | 实时的货架占用观测。                  |
| [`/map_rack_states`](./websocket-cargo.md#map-rack-states)       | 地图上全部货架的累计占用状态。            |
| [`/detected_pallets`](./websocket-cargo.md#detected-pallets)     | 机器人周边检测到的托盘及其尺寸。          |
| [`/detected_trailer`](./websocket-cargo.md#detected-trailer)     | 机器人后方检测到的挂车及其连接几何。      |

### 感知与摄像头 (Perception & Cameras)

<!-- prettier-ignore -->
| Topic                                                                        | 说明                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------- |
| [`/scan_matched_points2`](./websocket-perception.md#point-cloud-used-for-slam) | 用于 SLAM 的组合激光雷达点云。                  |
| [`/horizontal_laser_2d/matched`](./websocket-perception.md#point-cloud-for-individual-lidar-devices) | 用于调试的单个设备点云。 |
| [`/vision_detected_objects`](./websocket-perception.md#vision-detected-objects) | 视觉系统检测到的对象（实验性）。                |
| [`/rgb_cameras/front/video`](./websocket-perception.md#rgb-video-stream)     | RGB 摄像头的 H.264 视频。                         |
| [`/rgb_cameras/front/compressed`](./websocket-perception.md#rgb-image-stream) | RGB 摄像头的 JPEG 图像。                         |
| [`/depth_camera/downward/image`](./websocket-perception.md#depth-camera-images) | 深度摄像头图像（base64 PNG）。                  |
| [`/external_rgb_camera_control`](./websocket-perception.md#external-rgb-camera-data) | 外接 RGB 摄像头的控制与数据通道。          |

### 环境与连接 (Environment & Connectivity)

<!-- prettier-ignore -->
| Topic                                                                    | 说明                                          |
| ------------------------------------------------------------------------ | --------------------------------------------- |
| [`/nearby_robots`](./websocket-environment.md#nearby-robots)              | 机器人周边感知到的其他机器人。                |
| [`/nearby_robot_footprints`](./websocket-environment.md#nearby-robot-footprints) | 与 `/nearby_robots` 摘要对应的轮廓。   |
| [`/nearby_auto_doors`](./websocket-environment.md#nearby-auto-doors)      | 附近自动门的状态与多边形。                    |
| [`/v2x_health_state`](./websocket-environment.md#v2x-health-state)        | V2X 信标的接收健康状况。                      |
| [`/devpvt`](./websocket-environment.md#devpvt)                            | CHC 传感器的原始 GNSS/INS 导航数据。          |

### 系统与电源 (System & Power)

<!-- prettier-ignore -->
| Topic                                                                 | 说明                                        |
| --------------------------------------------------------------------- | ------------------------------------------- |
| [`/battery_state`](./websocket-system.md#battery-state)                | 电池电压、电流和电量。                      |
| [`/detailed_battery_state`](./websocket-system.md#detailed-battery-state) | 电池状态以及单体电压、容量和健康度。    |
| [`/sensor_manager_state`](./websocket-system.md#sensor-manager-state)  | 传感器处于唤醒、唤醒中还是休眠状态。        |
| [`/alerts`](./websocket-system.md#alerts)                              | 当前活动的报警。                            |
| [`/app_events`](./websocket-system.md#app-events)                      | 应用事件流（protobuf）。                    |
| [`/get_device_info_brief`](./websocket-system.md#device-info)          | 通过 WebSocket 请求设备与固件信息。         |
| [`/io_pins_state`](./websocket-system.md#digital-input-output)         | 逻辑 IO 引脚状态与输出引脚控制。            |
| [`/raw_io_board_state`](./websocket-system.md#raw-io-board-state)      | IO 板的原始输入/输出引脚状态。              |
