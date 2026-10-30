# 服务 API (Service API) {#service-api}

服务是触发机器人动作的 HTTP 接口。除非下文的参数块另有说明，请求体留空。

接口使用两种 URL 前缀：

- `/services/...` —— 机器人服务。通常为 `POST`，返回 JSON。
- `/ros/...` —— 从 ROS 转发的服务。默认返回二进制 protobuf；请求头带 `Accept: application/json` 时返回 proto3 JSON。少数接口（地图叠加层、动态交通信息）为原始 JSON。

参考手册按功能分组：

- [运动与底盘控制](./services-motion.md) —— 驱动模式、急停、车轮与底盘错误。
- [定位](./services-localization.md) —— 全局定位，以及充电桩、托盘、挂车、货架的位姿查询。
- [建图](./services-mapping.md) —— 自动建图、地标、叠加层、交通信息、子图与 SLAM 地图图片。
- [货物搬运](./services-cargo.md) —— 顶升、辊道、牵引钩、货物装卸与货架尺寸检测。
- [感知与传感器](./services-perception.md) —— 激光雷达与深度摄像头电源、RGB 图像、导航缩略图与 V2X 信标。
- [标定](./services-calibration.md) —— IMU、陀螺仪刻度、深度摄像头、双激光雷达与顶升桅杆标定。
- [网络](./services-network.md) —— Wi-Fi 模式与路由优先级。
- [系统与维护](./services-system.md) —— 电源、时间、重启、错误恢复与 ROS 主题内省。

## 约定 (Conventions) {#conventions}

### 内容类型与响应格式 (Content-type & response format) {#content-type--response-format}

`/services/` 下的接口使用 JSON。`/ros/` 下转发的服务默认返回 `application/x-protobuf`；当请求包含 `Accept: application/json` 时返回 `application/json`。JSON 响应体由同一个 protobuf 消息经 `google::protobuf::util::MessageToJsonString` 序列化生成（proto3 JSON 映射 —— 字段名为 snake_case）。

<!-- prettier-ignore -->
| 请求头 `Accept`          | 响应 `Content-Type`      | 响应体                       |
| ------------------------ | ------------------------ | ---------------------------- |
| （缺省）                 | `application/x-protobuf` | 二进制 protobuf              |
| `application/x-protobuf` | `application/x-protobuf` | 二进制 protobuf              |
| `application/json`       | `application/json`       | proto3 JSON                  |
| （其他任意值）           | `text/plain`             | `415 Unsupported Media Type` |

原始 JSON 接口（地图叠加层与动态交通信息）会忽略 `Accept`，始终返回 `application/json`。

### Protobuf 定义 (Protobuf definitions) {#protobuf-definitions}

Protobuf 消息定义随 [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk) TypeScript SDK 一同发布到 npm。`.proto` 源文件位于 [axbot-ts-sdk 仓库](https://github.com/AutoxingTech/axbot-ts-sdk/tree/master/src/proto)。每个接口都会引用自己的响应消息。

## 服务索引 (Service index) {#service-index}

### 运动与底盘控制 (Motion & Chassis Control)

<!-- prettier-ignore -->
| 接口                                                    | 方法   | 说明                                                     |
| ------------------------------------------------------- | ------ | -------------------------------------------------------- |
| [`/services/wheel_control/set_control_mode`](./services-motion.md#set-control-mode)                     | `POST` | 在 `auto`、`manual`、`remote` 之间切换控制模式。         |
| [`/services/wheel_control/set_emergency_stop`](./services-motion.md#set-or-clear-emergency-stop)        | `POST` | 触发或释放软件急停。                                     |
| [`/services/confirm_estop`](./services-motion.md#confirm-emergency-stop)                                | `POST` | 急停按下后，在坡道上释放车轮。                           |
| [`/services/wheel_control/clear_errors`](./services-motion.md#clear-wheel-errors)                       | `POST` | 清除车轮控制器报告的错误。                               |
| [`/services/monitor/clear_flip_error`](./services-motion.md#clear-flip-error)                           | `POST` | 检查确认倾翻后清除错误 `8004`。                          |
| [`/services/monitor/clear_slipping_error`](./services-motion.md#clear-slide-error)                      | `POST` | 检查确认剧烈碰撞后清除错误 `2008`（实验性）。            |

### 定位 (Localization)

<!-- prettier-ignore -->
| 接口                                                    | 方法   | 说明                                                     |
| ------------------------------------------------------- | ------ | -------------------------------------------------------- |
| [`/services/start_global_positioning`](./services-localization.md#start-global-positioning) | `POST` | 使用条码和基础地图匹配进行全局定位。                     |
| [`/services/query_pose/<poi>`](./services-localization.md#query-pose)                       | `GET`  | 查询充电桩、托盘、挂车或货架边缘的地图位姿。             |

### 建图 (Mapping)

<!-- prettier-ignore -->
| 接口                                                    | 方法      | 说明                                             |
| ------------------------------------------------------- | --------- | ------------------------------------------------ |
| [`/services/enable_auto_mapping`](./services-mapping.md#auto-mapping)                       | `POST`    | 让机器人自主探索并建图（实验性）。               |
| [`/services/start_collecting_landmarks`](./services-mapping.md#collect-landmarks)           | `POST`    | 为当前地图采集地标。                             |
| [`/services/stop_collecting_landmarks`](./services-mapping.md#collect-landmarks)            | `POST`    | 停止采集地标。                                   |
| [`/ros/map/overlays`](./services-mapping.md#map-overlays)                                   | `GET/PUT` | 以 GeoJSON 读取或替换动态地图叠加层。            |
| [`/ros/map/traffic_info`](./services-mapping.md#traffic-info)                               | `GET/PUT` | 读取或替换动态禁行区域。                         |
| [`/ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}`](./services-mapping.md#submap-query-v2) | `GET` | 获取单个 Cartographer 子图。                |
| [`/ros/slam/map_image`](./services-mapping.md#slam-map-image)                               | `GET`     | 获取当前 SLAM 地图（protobuf 编码的 PNG）。      |

### 货物搬运 (Cargo Handling)

<!-- prettier-ignore -->
| 接口                                                    | 方法   | 说明                                          |
| ------------------------------------------------------- | ------ | --------------------------------------------- |
| [`/services/jack_up`](./services-cargo.md#jack-device-up-down-self-check)                   | `POST` | 升高顶升。                                    |
| [`/services/jack_down`](./services-cargo.md#jack-device-up-down-self-check)                 | `POST` | 降低顶升。                                    |
| [`/services/jack_self_check`](./services-cargo.md#jack-device-up-down-self-check)           | `POST` | 顶升自检。                                    |
| [`/services/clear_jack_errors`](./services-cargo.md#clear-jack-errors)                      | `POST` | 清除顶升过载错误。                            |
| [`/services/roller_load`](./services-cargo.md#load-unload-cargo-with-roller)                | `POST` | 用辊道装货。                                  |
| [`/services/roller_unload`](./services-cargo.md#load-unload-cargo-with-roller)              | `POST` | 用辊道卸货。                                  |
| [`/services/load_cargo`](./services-cargo.md#load-unload-cargo)                             | `POST` | 用举升机构装货。                              |
| [`/services/unload_cargo`](./services-cargo.md#load-unload-cargo)                           | `POST` | 用举升机构卸货。                              |
| [`/services/towing_hook_lock`](./services-cargo.md#towing-hook-lock)                        | `POST` | 锁定牵引钩。                                  |
| [`/services/towing_hook_release`](./services-cargo.md#towing-hook-release)                  | `POST` | 释放牵引钩。                                  |
| [`/services/clear_towing_hook_error`](./services-cargo.md#clear-towing-hook-error)          | `POST` | 清除牵引钩设备错误。                          |
| [`/services/start_rack_size_detection`](./services-cargo.md#start-rack-size-detection)      | `POST` | 用激光扫描仪测量货架宽度和深度。              |
| [`/services/stop_rack_size_detection`](./services-cargo.md#start-rack-size-detection)       | `POST` | 停止货架尺寸测量。                            |

### 感知与传感器 (Perception & Sensors)

<!-- prettier-ignore -->
| 接口                                                    | 方法   | 说明                                                     |
| ------------------------------------------------------- | ------ | -------------------------------------------------------- |
| [`/services/baseboard/power_on_lidar`](./services-perception.md#power-on-or-off-the-lidar)              | `POST` | 开启或关闭激光雷达电源。                                 |
| [`/services/depth_camera/enable_cameras`](./services-perception.md#power-on-or-off-the-depth-camera)    | `POST` | 启用或禁用深度摄像头。                                   |
| [`/services/get_rgb_image`](./services-perception.md#get-rgb-image)                                     | `POST` | 获取最新的 RGB 摄像头图像。                              |
| [`/services/get_nav_thumbnail`](./services-perception.md#get-nav-thumbnail)                             | `POST` | 获取机器人及周边环境的 200×200 快照。                    |
| [`/services/probe_v2x_beacons`](./services-perception.md#probe-v2x-beacons)                             | `POST` | 激活 V2X 信标数秒以测试连通性。                          |

### 标定 (Calibration)

<!-- prettier-ignore -->
| 接口                                                    | 方法   | 说明                                                  |
| ------------------------------------------------------- | ------ | ----------------------------------------------------- |
| [`/services/imu/recalibrate`](./services-calibration.md#recalibrate-imu)                                | `POST` | 机器人静止时重新校准 IMU。                            |
| [`/services/imu/calibrate_gyro_scale`](./services-calibration.md#calibrate-gyroscope-scale)            | `POST` | 校准陀螺仪刻度。                                      |
| [`/ros/imu/clear_gyro_scale`](./services-calibration.md#clear-gyro-scale)                               | `POST` | 清除已保存的陀螺仪刻度标定。                          |
| [`/services/calibrate_depth_cameras`](./services-calibration.md#calibrate-depth-cameras)                | `POST` | 将深度摄像头点云与激光雷达对齐。                      |
| [`/services/calibrate_depth_camera_masks`](./services-calibration.md#calibrate-depth-camera-masks)      | `POST` | 遮罩深度摄像头拍到的机器人自身部分。                  |
| [`/services/calibrate_duo_lidar_poses`](./services-calibration.md#calibrate-duo-lidar-poses)            | `POST` | 校准左前、右后双激光雷达的位姿。                      |
| [`/ros/jack_mast/calibrate_mast_tick_base`](./services-calibration.md#calibrate-mast-tick-base)         | `POST` | 校准顶升桅杆的刻度基准。                              |

### 网络 (Network)

<!-- prettier-ignore -->
| 接口                                                    | 方法   | 说明                                          |
| ------------------------------------------------------- | ------ | --------------------------------------------- |
| [`/services/setup_wifi`](./services-network.md#configure-wi-fi)                             | `POST` | 在 AP 和 station 模式之间切换 Wi-Fi。         |
| [`/services/set_route_mode`](./services-network.md#set-route-mode)                          | `POST` | 选择默认路由使用的网络接口。                  |

### 系统与维护 (System & Maintenance)

<!-- prettier-ignore -->
| 接口                                                    | 方法       | 说明                                                   |
| ------------------------------------------------------- | ---------- | ------------------------------------------------------ |
| [`/services/wake_up_device`](./services-system.md#wake-up-the-device)                                   | `POST`     | 将机器人从休眠中唤醒。                                 |
| [`/services/restart_service`](./services-system.md#restart-services)                                    | `POST`     | 重启所有机器人软件。                                   |
| [`/services/baseboard/shutdown`](./services-system.md#shutdown-or-reboot-the-device)                    | `POST`     | 重启或关闭主控计算机或整机。                           |
| [`/services/step_time`](./services-system.md#step-time)                                                 | `GET/POST` | 检查时间偏差（`GET`）或校准时钟（`POST`）。            |
| [`/services/monitor_recheck_errors`](./services-system.md#recheck-errors)                               | `POST`     | 重新执行错误检查。                                     |
| [`/services/reset_usb_devices`](./services-system.md#reset-usb-devices)                                 | `POST`     | 按 `bus/dev` 复位指定的 USB 设备。                     |
| [`/services/clear_system_down_unexpectedly`](./services-system.md#clear-system-down-unexpectedly-alert) | `POST`     | 清除“系统异常关闭”报警。                               |
| [`/services/clear_range_data_all_zero_error`](./services-system.md#clear-range-data-all-zero-error)     | `POST`     | 清除“距离数据全为零”的激光雷达错误。                    |
| [`/services/clear_fall_risk_warning`](./services-system.md#clear-fall-risk-warning)                     | `POST`     | 清除跌落风险警告。                                     |
| [`/ros/rosmaster/topics`](./services-system.md#topic-list)                                              | `GET`      | 列出已发布的 ROS 主题及其类型和数量。                   |
| [`/ros/rosmaster/topics/published_names`](./services-system.md#published-topic-names)                   | `GET`      | 列出已发布 ROS 主题的名称。                             |
