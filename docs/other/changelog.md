# Changelog

## 2.2.0

- Supports `GET /device/available_wifis`
- Supports `GET /device/wifi_info`
- Improve HTML page `/setup_wifi`

## 2.1.0

- Support automatically initial position correction. See `adjust_position` in `/chassis/pose`.
- Websocket supports `/env_symmetry_map`.
- Websocket supports `/env_match_map`.

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
