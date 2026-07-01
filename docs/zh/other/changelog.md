# 更新日志

## 2.14.0

- 2026-07-01 添加 [SLAM 地图图片](../reference/ros_services.md#slam-map-image) API，用于获取当前 SLAM 地图的 protobuf 编码 PNG
- 2026-07-01 更新 proto 命名空间：子图消息移至 `ros_messages.slam`，`StatusResponse.code` 改用 `StatusCode` 枚举
- 2026-06-30 添加 [检测到的货架状态](../reference/websocket.md#detected-rack-states) 和 [货架地图状态](../reference/websocket.md#map-rack-states) WebSocket 主题
- 2026-06-03 为[校准双激光雷达位姿](../reference/services.md#calibrate-duo-lidar-poses)添加三种校准模式（single_shot、right_wall、front_wall）
- 2026-05-11 为 `/submap_list` 和 `SubmapQueryV2` 添加 [子图](../reference/submaps.md) 参考
- 2026-04-29 添加服务 [牵引钩锁定、牵引钩释放、清除牵引钩错误](../reference/services.md#towing-hook-lock)
- 2026-04-29 添加服务 [装载/卸载货物](../reference/services.md#loadunload-cargo)
- 添加 `/services/query_pose/trailer_pose` [查询位姿](../reference/services.md#query-pose)
- 支持在 [地图 API](../reference/maps.md#create-map-from-local-files) 中直接从本地文件创建地图
- 强调通过二进制文件下载建图结果，使用 [pbstream_url](../reference/mappings.md#mapping-list)
- 在 [/slam/state](../reference/websocket.md#positioning-state) 中添加 `nav_sat_state`
- 添加 `/devpvt` websocket 通道 [CHC 导航状态 (GNSS/INS)](../reference/websocket.md#devpvt)
- 添加服务 [/service/jack_self_check](../reference/services.md#jack-device-up-down-self-check)

## 2.12.0

- 添加 websocket 通道 [V2X 健康状态](../reference/websocket.md#v2x-health-state)
- 添加服务 [探测 V2X 信标](../reference/services.md#probe-v2x-beacons)
- 添加 websocket 通道 [原始 IO 板状态](../reference/websocket.md#raw-io-board-state)
- 在 [/path](../reference/websocket.md#global-path) 中添加路径朝向
- 在 [/robot_model](../reference/websocket.md#robot-model) 中添加 `expanded_footprint`
- 添加 websocket 通道 [更新的地图切片](../reference/websocket.md#updated-map-slice)
- 添加 `/services/query_pose` [查询位姿](../reference/services.md#query-pose)
- 添加 `/device/sensors` [传感器列表](../reference/device.md#sensor-list)，用于质量控制流程。
- 添加 `/xxxx_laser_2d/matched` [单个激光雷达设备的点云](../reference/websocket.md#point-cloud-for-individual-lidar-device)。
- 添加 `/depth_camera/xxx/image` [深度相机图像](../reference/websocket.md#depth-camera-images)

## 2.11.0

- 添加服务 [清除跌落风险警告](../reference/services.md#clear-fall-risk-warning)。
- 在 [详细电池状态](../reference/websocket.md#detailed-battery-state) 中添加 `capacity`、`design_capacity`、`state_of_health` 和 `cycle_count`。
- 添加 websocket 主题 [检测到的拖车](../reference/websocket.md#detected-trailer)
- 添加 websocket 主题 [推杆状态](../reference/websocket.md#push-handle-state)
- 添加 websocket 主题 [详细电池状态](../reference/websocket.md#detailed-battery-state)
- 添加 [清除顶升错误](../reference/services.md#clear-jack-errors)
- 添加 [地标 (Landmarks)](../reference/landmarks.md)
- 添加 [确认急停](../reference/services.md#confirm-emergency-stop)
- 支持 [从本地文件加载地图](../reference/current_map_and_pose.md#set-current-map-by-loading-local-files)
- 支持新服务 [校准深度相机掩码](../reference/services.md#calibrate-depth-camera-masks)
- 添加 `/services/start_collecting_landmarks`、`/services/stop_collecting_landmarks` 和 `/collected_data`

## 2.10.0

- 添加 websocket 主题 [/detected_pallets](../reference/websocket.md#detected-pallets)
- 在建图任务对象中添加 `properties`。它将用于存储地标。

## 2.9.1

- 在 [/collected_barcode](../reference/websocket.md#collected-barcode) 中添加 `relative_pose`

## 2.9.0

- 添加 [系统设置](../reference/system_settings.md)
- 弃用 [机器人参数](../reference/robot_params.md)
- 在 [/planning_state](../reference/websocket.md#planning-state) 中添加 `docking_with_conveyer` 和 `is_waiting_for_dest`
- 在 [/wheel_state](../reference/websocket.md#wheel-state) 中添加 `wheels_released`。
- 添加 [/bumper_state](../reference/websocket.md#bumper-state)
- 添加滚筒服务。详见 [使用滚筒装载/卸载货物](../reference/services.md#loadunload-cargo-with-roller)
- 添加滚筒 websocket 主题 [/roll_state](../reference/websocket.md#roller-state)

## 2.8.3

- 添加 `not_installed` 软件包状态。详见 [列出软件包](../reference/app_store.md#list-packages)

## 2.8.0

- 支持 [获取导航缩略图服务](../reference/services.md#get-nav-thumbnail)
- 支持 websocket 主题 [/robot_signal](../reference/websocket.md#robot-signal)
- 支持 [获取 RGB 图像服务](../reference/services.md#get-rgb-image)
- 支持 Websocket 主题 [/nearby_auto_doors](../reference/websocket.md#nearby-auto-doors)

## 2.7.7

- 在 [机器人参数](../reference/robot_params.md) 中支持 `/control/bump_based_speed_limit/enable`
- 支持 [跟随移动目标](../reference/moves.md#follow-target)。添加能力标记 `supportsFollowTarget`。
- 支持 [获取默认参数](../reference/robot_params.md#get-default-params)

## 2.7.1

- 支持 [时间源](../reference/device.md#time-sources) 管理
- 支持将机器人用作 [NTP 服务器](../reference/device.md#ntp-server)

## 2.7.0

- 支持 [自动门和网关](../reference/iot_devices.md#auto-door-and-gateway)。
- 支持启用主题列表。例如 `{"enable_topic": ["/actions", "/alerts", "/tracked_pose"]}`
- 支持 [基于反光条的全局定位](../reference/services.md#barcode)
  - 新的能力标记：`supportsBarcodeGp`
  - 在服务 `/services/start_global_positioning` 中添加两个参数。
  - 添加 websocket 主题 `/collected_barcode`。详见 [采集到的反光条](../reference/websocket.md#collected-barcode)
- 支持 [Bag 包循环录制](../reference/bags.md)
  - 新的能力标记：`supportsBags`
- 添加新参数 [/wheel_control/acc_smoother/smooth_level](../reference/robot_params.md)
- 支持 [修正时间误差](../reference/services.md#step-time)
- 支持 [从本地文件安装软件包](../reference/app_store.md#install-package-from-local-file)
- 支持 [启动进度](../reference/device.md#boot-progress)
- 支持 [直接使用数据设置地图](../reference/current_map_and_pose.md#set-current-map)。
- 支持顶升设备：
  - 新的能力标记：`supportsJack`
  - 新的移动动作类型：`align_with_rack` (与货架对齐)、`to_unload_point` (前往卸货点)。详见 [顶升设备](../reference/moves.md#jack-device)
  - 新的移动动作失败原因 `rack_moved` (货架已移动)。
  - 添加服务。详见 [顶升/降下](../reference/services.md#jack-device-up-down-self-check)
  - 添加 websocket 主题 [`/jack_state`](../reference/websocket.md#jack-state)
- 支持 [动态轮廓 (Dynamic Footprint)](../reference/robot_params.md#robot-footprint)：
  - 新的能力标记：`supportsDynamicFootprints`。
  - 添加新的 websocket 主题 [`/nearby_robot_footprints`](../reference/websocket.md#nearby-robot-footprints)
  - 添加新的 websocket 主题 [`/robot_model`](../reference/websocket.md#robot-model)
  - [`/nearby_robots`](../reference/websocket.md#nearby-robots) 主题新增属性 `footprint_digest`。

## 2.6.1

- 添加 API `/hostnames`，以添加/删除本地 DNS 条目。
- 支持 [缓存的主题](../reference/websocket.md#cached-topics)。
- 添加新能力标记：`supportsCachedTopics`。

## 2.6.0

- 支持全自动 [增量建图](../reference/websocket.md#incremental-map)。
- 添加新能力标记：`supportsIncrementalMapping`

## 2.5.6

- 添加 websocket `/local_path`
- 添加新能力标记：`supportsLocalPath`

## 2.5.2

- `map_uid` 可用于 [设置当前地图](../reference/current_map_and_pose.md#set-current-map)。
- 在 Websocket `/planning_state` 中添加 `action_type`、`in_elevator`、`viewport_blocked`。详见 [规划状态](../reference/websocket.md#planning-state)。
- 支持 [`POST /services/clear_range_data_all_zero_error`](../reference/services.md#clear-range-data-all-zero-error)。
- Websocket `/trajectory` 可在建图和纯定位模式下显示轨迹。

## 2.5.0

- 在 [校准陀螺仪刻度](../reference/services.md#calibrate-gyroscope-scale) 中添加 `/services/calibrate_gyro_scale`
- 添加 [应用商店 API](../reference/app_store.md)
- 添加 USB 设备 API
  - [列出 USB 设备](../reference/device.md#list-usb-devices)
  - [保存的 USB 设备](../reference/device.md#saved-usb-devices)
  - [重置 USB 设备](../reference/services.md#reset-usb-devices)
- 支持在 `/robot-params` 中调整机器人轮廓。需要重启才能生效。
- 添加新能力标记：`supportsGyroscopeScaleCalibration`、`supportsParamFiles`、`supportsAppStore`、`supportsUsbDevices`
- 支持服务 [`POST /services/clear_system_down_unexpectedly`](../reference/services.md#clear-alert-system-down-unexpectedly)

## 2.4.0

- 在 `/robot-params` 中添加 `/control/bump_tolerance`。详见 [机器人参数](../reference/robot_params.md)
- 将 IMU 偏置校准与位姿校准结合。添加能力标记 `combineImuBiasAndPoseCalibration`。

## 2.3.0

- 在 Websocket `/slam/state` 中添加 `position_quality` 和 `lidar_matched`。详见 [定位状态](../reference/websocket.md#positioning-state)
- 在 `/device/available_wifis` 中添加 `open`。详见 [可用 WIFI 列表](../reference/device.md#wifi-list)
- 在 `/robot-params` 中添加 `/planning/auto_hold`。详见 [机器人参数](../reference/robot_params.md)
- 在 [网络设置](../reference/services.md#set-route-mode) 和 [网络信息](../reference/device.md#network-information) 中添加 `/services/set_route_mode`

## 2.2.0

- 支持 `GET /device/available_wifis`
- 支持 `GET /device/wifi_info`
- 改进 HTML 页面 `/wifi_setup`

## 2.1.0

- 支持自动初始位置修正。详见 `/chassis/pose` 中的 `adjust_position`。
- Websocket 支持 `/env_symmetry_map`。
- Websocket 支持 `/env_match_map`。
- 支持服务 `POST /services/setup_wifi`

## 2.0.0

- 支持 `POST /services/monitor_recheck_errors`
- 支持 `POST /services/calibrate_depth_cameras`

## 1.10.1

- 添加 Websocket 命令以获取设备信息简报 `{"topic": "/get_device_info_brief"}`。
- 添加 `GET /device/info/brief`。
- 添加服务 `POST /services/enable_auto_mapping`。

## 1.10.0

- 在 `/device/info` 中添加关于底部传感器包和深度相机的固件信息。
- 添加服务 `/services/start_global_positioning`
- 在 [IMU 校准](../reference/services.md#recalibrate-imu) 中添加 `calibrate_pose`
- 在 [唤醒设备](../reference/services.md#wake-up-device) 中添加服务 `/wake_up_device`
