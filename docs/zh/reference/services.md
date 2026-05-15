# 服务 API (Service API) {#service-api}

## 重新校准 IMU (Recalibrate IMU) {#recalibrate-imu}

启动 IMU 校准。在此过程中，机器人必须完全静止地停放在坚硬、平坦的地面上。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/imu/recalibrate
```

此服务调用仅触发校准过程；实际过程通常需要 10 到 20 秒才能完成。

校准完成后，将通过 `/action` WebSocket Topic 发送通知。

**成功输出示例：**

```json
{
  "topic": "/action",
  "timestamp": 1681733608.653,
  "email": "",
  "username": "",
  "deviceName": "718220110000909",
  "action": "recalibrate_imu",
  "message": "IMU calibration succeeded"
}
```

**失败输出示例：**

```json
{
  "topic": "/action",
  "timestamp": 1681733580.702,
  "email": "",
  "username": "",
  "deviceName": "718220110000909",
  "action": "recalibrate_imu",
  "message": "error: IMU calibration failed. Failed to rotate to right"
}
```

## 设置控制模式 (Set Control Mode) {#set-control-mode}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"control_mode": "auto"}' \
  http://192.168.25.25:8090/services/wheel_control/set_control_mode
```

**参数**

```ts
class SetControlModeRequest {
  control_mode: 'auto' | 'manual' | 'remote';
}
```

使用 `/wheel_state` WebSocket Topic 监控当前的控制模式和车轮状态。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## 设置或清除急停 (Set or Clear Emergency Stop) {#set-or-clear-emergency-stop}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/wheel_control/set_emergency_stop
```

**参数**

```ts
class SetEmergencyStopRequest {
  enable: boolean;
}
```

使用 `/wheel_state` WebSocket Topic 监控急停状态。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## 重启服务 (Restart Services) {#restart-services}

重启机器人上的所有软件服务。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/restart_service
```

## 关闭或重启设备 (Shutdown or Reboot the Device) {#shutdown-or-reboot-the-device}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"target": "main_power_supply", reboot: false}' \
  http://192.168.25.25:8090/services/baseboard/shutdown
```

**参数**

```ts
class ShutdownRequest {
  target:
    | 'main_computing_unit' // 仅重启或关闭主计算板。
    | 'main_power_supply'; // 重启或关闭整个设备。
  reboot: boolean; // true 为重启，false 为关机。
}
```

## 清除车轮错误 (Clear Wheel Errors) {#clear-wheel-errors}

```bash
curl -X POST http://192.168.25.25:8090/services/wheel_control/clear_errors
```

## 清除倾翻错误 (Clear Flip Error) {#clear-flip-error}

错误 `8004` (倾翻错误) 表示发生了严重问题，例如机器人已侧翻。
这需要人工检查。问题解决后，使用此服务清除错误并使机器人恢复运行状态。

```bash
curl -X POST http://192.168.25.25:8090/services/monitor/clear_flip_error
```

## 清除打滑错误 (Clear Slide Error) {#clear-slide-error}

:::warning
实验性功能
:::

错误 `2008` (打滑错误) 表示机器人可能与不可见的障碍物发生了剧烈碰撞。在清除此错误之前需要进行人工检查。

```bash
curl -X POST http://192.168.25.25:8090/services/monitor/clear_slipping_error
```

## 开启或关闭激光雷达电源 (Power On or Off the Lidar) {#power-on-or-off-the-lidar}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"action": "power_on"}' \
  http://192.168.25.25:8090/services/baseboard/power_on_lidar
```

**参数**

```ts
class PowerOnRequest {
  action: 'power_on' | 'power_off';
}
```

## 开启或关闭深度摄像头电源 (Power On or Off the Depth Camera) {#power-on-or-off-the-depth-camera}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/depth_camera/enable_cameras
```

**参数**

```ts
class EnableDepthCameraRequest {
  enable: boolean;
}
```

## 配置 Wi-Fi (Configure Wi-Fi) {#configure-wi-fi}

在热点 (AP) 模式和基站 (Station) 模式之间切换 Wi-Fi。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "station", "ssid":"xxxxxxxxx", "psk": "xxxxx"}' \
  http://192.168.25.25:8090/services/setup_wifi
```

**参数**

```ts
interface SetupWifiRequest {
  mode: 'ap' | 'station';
  ssid?: string; // SSID，Station 模式下必填
  psk?: string; // Wi-Fi 预共享密钥，Station 模式下必填

  route_mode?:
    | 'eth0_first'
    | 'wlan0_first'
    | 'usb0_first'
    | 'wlan0_usb0_auto_first';
}
```

## 设置路由模式 (Set Route Mode) {#set-route-mode}

配置机器人底盘的路由表规则。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "xxx"}' \
  http://192.168.25.25:8090/services/set_route_mode
```

**参数**

```ts
interface RouteModeRequest {
  mode: 'eth0_first' | 'wlan0_first' | 'usb0_first' | 'wlan0_usb0_auto_first';
}
```

`route_mode`: 确定路由表中网络接口的优先级：

- `eth0_first`: 如果可用，将 `eth0` 设置为默认路由。
- `wlan0_first`: 如果可用，将 `wlan0` 设置为默认路由。
- `usb0_first`: 如果可用，将 `usb0` 设置为默认路由。
- `wlan0_usb0_auto_first`: 根据 `ping` 结果：如果 `wlan0` 具有互联网连接，则将其用作默认路由；否则，使用 `usb0`。

在此本地网络地址也可以访问静态的 Wi-Fi 配置 HTML 页面：http://192.168.25.25:8090/wifi_setup

![](./network_setup.png)

## 唤醒设备 (Wake Up the Device) {#wake-up-the-device}

将机器人从睡眠状态唤醒。如果机器人已经处于唤醒状态，此命令无效。

```bash
curl -X POST http://192.168.25.25:8090/services/wake_up_device
```

监控 [传感器管理状态 (Sensor Manager State)](./websocket.md#sensor-manager-state) WebSocket Topic 以获取睡眠、唤醒或正在唤醒的状态。

## 启动全局定位 (Start Global Positioning) {#start-global-positioning}

```bash
curl -X POST \
  -H "Content-Type: application/json"
  http://192.168.25.25:8090/services/start_global_positioning
```

**参数**

```ts
interface StartGlobalPositioningRequest {
  use_barcode?: boolean; // 默认为 true。
  use_base_map_match?: boolean; // 默认为 true。
}
```

可以通过 [全局定位状态 (Global Positioning State)](./websocket.md#global-positioning-state) WebSocket Topic 监控反馈。

### 条码 (Barcode) {#barcode}

![](./barcode.png)

条码是由反光和不反光表面交替组成的标记。
现场的每个条码都包含唯一的 ID，使机器人能够在检测到条码时明确地确定其精确位置。

当 `use_barcode` 设置为 `true` 时，它的优先级高于基于点云的匹配。检测到的条码匹配始终被视为高度可靠。
要利用此功能，必须[收集条码及其对应的位姿并将其添加到地图的 Overlays 中](./websocket.md#collected-barcode)。

## 自动建图 (Auto-Mapping) {#auto-mapping}

:::warning
实验性功能
:::

启用自动建图后，机器人将自动探索并测绘其环境。
此功能仅在机器人处于建图模式时可用。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/enable_auto_mapping
```

**参数**

```ts
interface EnableAutoMappingRequest {
  enable: boolean;
}
```

## 重新检查错误 (Recheck Errors) {#recheck-errors}

```
POST /services/monitor_recheck_errors
```

## 校准深度摄像头 (Calibrate Depth Cameras) {#calibrate-depth-cameras}

此服务将深度摄像头的点云与水平激光雷达的点云对齐。

在开始校准之前，请确保：

- 机器人位于平整、水平的地面上。
- 机器人正对着墙角或一个大型的长方体物体。

![](./2023-02-02-16-44-19.png)

```
POST /services/calibrate_depth_cameras
```

## 校准陀螺仪刻度 (Calibrate Gyroscope Scale) {#calibrate-gyroscope-scale}

启动陀螺仪刻度校准。在此过程中，机器人必须完全静止地停放在坚硬、平坦的地面上。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/imu/calibrate_gyro_scale
```

此服务调用仅触发校准过程；实际过程通常需要约 20 秒才能完成。

校准完成后，将通过 `/action` WebSocket Topic 发送通知。

**成功输出示例：**

```json
{
  "topic": "/action",
  "timestamp": 1681733608.653,
  "email": "",
  "username": "",
  "deviceName": "718220110000909",
  "action": "calibrate_gyro_scale",
  "message": "Gyroscope scale calibration succeeded"
}
```

**失败输出示例：**

```json
{
  "topic": "/action",
  "timestamp": 1681733580.702,
  "email": "",
  "username": "",
  "deviceName": "718220110000909",
  "action": "calibrate_gyro_scale",
  "message": "error: Gyroscope scale calibration failed. Please remove nearby obstacles."
}
```

## 重置 USB 设备 (Reset USB Devices) {#reset-usb-devices}

重置 USB 集线器有时可以帮助恢复发生故障的硬件设备。

格式 `"1/3"` 代表设备树中的 `bus_id/dev_id`。更多信息请参见 [列出 USB 设备 (List USB Devices)](./device.md#list-usb-devices)。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"devices_to_reset": ["1/3", "8/1"]}' \
  http://192.168.25.25:8090/services/reset_usb_devices
```

## 清除“系统异常关闭”报警 (Clear "System Down Unexpectedly" Alert) {#clear-system-down-unexpectedly-alert}

![](./system-down-alert.png)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_system_down_unexpectedly
```

## 清除“距离数据全为零”错误 (Clear "Range Data All Zero" Error) {#clear-range-data-all-zero-error}

如果所有激光雷达点位返回的值均为 0，则表明激光雷达设备发生故障或失效。

此服务会临时清除相关的错误消息。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_range_data_all_zero_error
```

## 顶升设备上、下、自检 (Jack Device Up, Down, Self-Check) {#jack-device-up-down-self-check}

升高或降低顶升设备。顶升设备的状态可以通过 WebSocket [顶升状态 (Jack State)](./websocket.md#jack-state) 获取。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/jack_up
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/jack_down
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/jack_self_check
```

## 校时 (Step Time) {#step-time}

如果系统时间不准确，使用此服务进行校正。

::: warning
`GET` 用于检测时间错误。请勿频繁调用。应使用 WebSocket `/alerts` Topic 监控时间错误。
:::

```bash
curl http://192.168.25.25:8090/services/step_time
```

```json
{
  "should_step": false, // 无需校时
  "message": "there is no need to make step: system time is 0.000253560 seconds fast of NTP time"
}
```

`POST` 用于校正时间。

```bash
curl -X POST http://192.168.25.25:8090/services/step_time
```

```json
{
  "message": "Step time successfully"
}
```

## 获取导航缩略图 (Get Nav. Thumbnail) {#get-nav-thumbnail}

自 2.8.0 起，需要 `caps.supportsGetNavThumbnail`。

检索机器人及其周围环境的图像快照，包括地图、代价地图、点云和虚拟墙。

图像尺寸为 200x200 像素，可用于错误报告。

![](./navi_thumbnail.png)

```json
{
  "stamp": 1707211001,
  "map_name": "Ground Floor",
  "map_uid": "xxxxx",
  "map_version": 3,
  "overlays_version": 8,
  "map": {
    "resolution": 0.05,
    "size": [200, 200],
    "origin": [12.12345, -3.12345],
    "data": "iVBORw0KGgoAAAANS..." // base64 编码的 PNG
  }
}
```

## 获取 RGB 图像 (Get RGB Image) {#get-rgb-image}

自 2.8.0 起，需要 `caps.supportsGetRgbImage`。

检索 RGB 摄像头的最新图像。这类似于 [WebSocket RGB 图像流 (WebSocket RGB Image Stream)](./websocket.md#rgb-image-stream)，但对于仅需偶尔获取图像的应用场景更高效。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"topic": "/rgb_cameras/front/compressed"}' \
  http://192.168.25.25:8090/services/get_rgb_image
```

响应格式与 WebSocket Topic 相同。

## 用辊道装卸货物 (Load/Unload Cargo with Roller) {#load-unload-cargo-with-roller}

自 2.9.0 起。

辊道的状态通过 WebSocket [辊道状态 (Roller State)](./websocket.md#roller-state) 获取。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/roller_load
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/roller_unload
```

## 启动货架尺寸检测 (Start Rack Size Detection) {#start-rack-size-detection}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/start_rack_size_detection

curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/stop_rack_size_detection
```

使用机器人的激光扫描仪检测货架的宽度和深度。

:::warning
通常参考货架的技术规格或使用尺子手动测量更为准确。仅在最后手段时使用此服务。
:::

使用步骤：

1. 将机器人正对着货架停放。
2. 调用 `/start_rack_size_detection`。
3. 订阅 [/detected_rack WebSocket Topic](./websocket.md#detected-rack)。
4. 缓慢将机器人推入货架下方。
5. 成功检测后，停止推动并记录货架尺寸。
6. 在 [系统设置 (system settings)](./system_settings.md#rackspecs) 中输入宽度和深度。

## 清除顶升错误 (Clear Jack Errors) {#clear-jack-errors}

如果顶升设备过载，它将报告错误。

发生这种情况时，大多数顶升型号仍可接受新命令。然而，一些罕见的型号要求在接受进一步命令之前手动清除错误。

```bash
curl -X POST http://192.168.25.25:8090/services/clear_jack_errors
```

## 确认急停 (Confirm Emergency Stop) {#confirm-emergency-stop}

当机器人在坡道上或处于指定的坡道区域（在 Overlays 中指定）时，即使按下急停，车轮也不会释放。警告消息将出现在 `/alerts` WebSocket Topic 中：

![](./estop_warning.png)

如果需要手动推动机器人，请使用以下命令确认释放车轮。

```bash
curl -X POST http://192.168.25.25:8090/services/confirm_estop
```

## 校准深度摄像头遮罩 (Calibrate Depth Camera Masks) {#calibrate-depth-camera-masks}

某些深度摄像头可能会捕捉到机器人自身车体的一部分。此服务用于识别哪些像素应该被遮罩，以防止机器人误将自身视为障碍物。

在校准之前，请将机器人放置在一个开阔区域，且任何深度摄像头的视野内均无障碍物。

```bash
curl -X POST http://192.168.25.25:8090/services/calibrate_depth_camera_masks
```

## 收集地标 (Collect Landmarks) {#collect-landmarks}

此服务用于为现有地图收集地标。

```bash
curl -X POST http://192.168.25.25:8090/services/start_collecting_landmarks
curl -X POST http://192.168.25.25:8090/services/stop_collecting_landmarks
```

结果存储在：

```bash
curl http://192.168.25.25:8090/collected_data
```

收集到的数据作为原始材料。开发人员必须手动将这些地标插入到 [地标 Overlays (overlays)](./overlays.md#landmarks) 中才能使用。

## 清除跌落风险警告 (Clear Fall Risk Warning) {#clear-fall-risk-warning}

```bash
curl -X POST http://192.168.25.25:8090/services/clear_fall_risk_warning
```

## 查询位姿 (Query Pose) {#query-pose}

此 API 用于检索各种兴趣点 (POI) 的坐标。

例如，当机器人对接充电桩时，它会根据机器人的位置计算充电桩的位姿。

```bash
curl http://192.168.25.25:8090/services/query_pose/charger_pose
```

```json
{
    "pose": {
        "pos": [4.179, -26.094],
        "ori": 3.18,
    }
}
```

类似地，如果机器人（例如叉车或牵引机器人）停放在货物位置（例如托盘或挂车），系统可以从机器人当前位置推断出该位置的位姿。

```bash
curl http://192.168.25.25:8090/services/query_pose/pallet_pose
curl http://192.168.25.25:8090/services/query_pose/trailer_pose
```


```json
{
    "pose": {
        "pos": [4.179, -26.094],
        "ori": 3.18,
    },

    // 自 2.13.0 起。如果 reference == 'center_of_front_edge'，返回的位姿是
    // 托盘或挂车前边缘的中心（新逻辑）。
    // 否则，位姿是托盘或挂车的中心（已弃用）。
    "ref": "center_of_front_edge"
}
```

## 探测 V2X 信标 (Probe V2X Beacons) {#probe-v2x-beacons}

此服务向信标发送消息以激活它们数秒。这对于测试连接性并触发响应非常有用。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/probe_v2x_beacons
```

使用 [V2X 健康状态 (V2X Health State)](./websocket.md#v2x-health-state) WebSocket Topic 来监控信标响应和健康状态。


## 校准双激光雷达位姿 (Calibrate Duo Lidar Poses) {#calibrate-duo-lidar-poses}

此服务用于校准安装在左前角和右后角的双激光雷达位姿。
仅当 "caps.supportsDuoLidar" 为 true 时才应调用此服务。

校准前请确保：

在双激光雷达视野的重叠区域之一，必须有清晰的水平和垂直墙壁。

![](./duo-lidars.png)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/calibrate_duo_lidar_poses
```


## 牵引钩锁定 (Towing Hook Lock) {#towing-hook-lock}

锁定牵引钩以固定挂载的挂车。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/towing_hook_lock
```

## 牵引钩释放 (Towing Hook Release) {#towing-hook-release}

释放牵引钩以卸下挂载的挂车。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/towing_hook_release
```

## 清除牵引钩错误 (Clear Towing Hook Error) {#clear-towing-hook-error}

清除由牵引钩设备报告的错误。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_towing_hook_error
```

## 装卸货物 (Load/Unload Cargo) {#load-unload-cargo}

触发通过机器人的货物搬运机构进行货物的装载或卸载。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/load_cargo
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/unload_cargo
```
