# Changelog

## 1.10.1

- Add Websocket command to get device info `{"topic": "/get_device_info_brief"}`.
- Add `GET /device/info/brief`.
- Add service `POST /services/enable_auto_mapping`.

## 1.10.0

- Add firmware info about bottom sensor pack and depth camera, in `/device/info`.
- Add service `/services/start_global_positioning`
- Add `calibrate_pose` in [Imu Calibration](../reference/services.md#recalibrate-imu)
- Add service `/wake_up_device` in [Wake Up Device](../reference/services.md#wake-up-device)
