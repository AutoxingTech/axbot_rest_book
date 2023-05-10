# Changelog

## 2.5.0

- Add `/services/calibrate_gyro_scale` in [Calibrate Gyroscope Scale](../reference/services.md#calibrate-gyroscope-scale)
- Add [App Store APIs](../reference/app_store.md)
- Add USB Device APIs
  - [List USB Devices](../reference/device.md#list-usb-devices)
  - [Save USB Devices](../reference/device.md#saved-usb-devices)
  - [Reset USB Devices](../reference/services.md#reset-usb-devices)
- Support adjusting robot footprint in `/robot-params`. A restart is required for it to take effect.
- Add new caps: `supportsGyroscopeScaleCalibration`, `supportsParamFiles`, `supportsAppStore`, `supportsUsbDevices`

## 2.4.0

- Add `/control/bump_tolerance` in `/robot-params`. See [Robot Params](../reference/robot_params.md)
- Combine IMU bias calibration with pose calibration. Add capability flag `combineImuBiasAndPoseCalibration`.

## 2.3.0

- Add `position_quality` and `lidar_matched` in Websocket `/slam/state`. See [Positioning State](../reference/websocket.md#positioning-state)
- Add `open` in /device/available_wifis. See [Available WIFIs](../reference/device.md#wifi-list)
- Add `/planning/auto_hold` in `/robot-params`. See [Robot Params](../reference/robot_params.md)
- Add `/services/set_route_mode` in [Network Setup](../reference/services.md#set-route-mode) and [Network Info](../reference/device.md#network-information)

## 2.2.0

- Supports `GET /device/available_wifis`
- Supports `GET /device/wifi_info`
- Improve HTML page `/wifi_setup`

## 2.1.0

- Support automatically initial position correction. See `adjust_position` in `/chassis/pose`.
- Websocket supports `/env_symmetry_map`.
- Websocket supports `/env_match_map`.
- Support service `POST /services/setup_wifi`

## 2.0.0

- Support `POST /services/monitor_recheck_errors`
- Support `POST /services/calibrate_depth_cameras`

## 1.10.1

- Add Websocket command to get device info `{"topic": "/get_device_info_brief"}`.
- Add `GET /device/info/brief`.
- Add service `POST /services/enable_auto_mapping`.

## 1.10.0

- Add firmware info about bottom sensor pack and depth camera, in `/device/info`.
- Add service `/services/start_global_positioning`
- Add `calibrate_pose` in [Imu Calibration](../reference/services.md#recalibrate-imu)
- Add service `/wake_up_device` in [Wake Up Device](../reference/services.md#wake-up-device)
