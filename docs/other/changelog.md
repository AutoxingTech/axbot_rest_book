# Changelog

## 2.12.0

- Add websocket channel [V2X Health State](../reference/websocket.md#v2x-health-state)
- Add service [Probe V2X Beacons](../reference/services.md#probe-v2x-beacons)
- Add websocket channel [Raw Io-board State](../reference/websocket.md#raw-io-board-state)
- Add path orientation in [/path](../reference/websocket.md#global-path)
- Add `expanded_footprint` in [/robot_model](../reference/websocket.md#robot-model)
- Add websocket channel [Updated Map Slice](../reference/websocket.md#updated-map-slice)
- Add `/services/query_pose` [Query Pose](../reference/services.md#query-pose)
- Add `/device/sensors` [Sensors List](../reference/device.md#sensor-list), for quality control process.
- Add `/xxxx_laser_2d/matched` [point cloud for individual lidar device](../reference/websocket.md#point-cloud-for-individual-lidar-device).
- Add `/depth_camera/xxx/image` [depth camera images](../reference/websocket.md#depth-camera-images)

## 2.11.0

- Add service [clear_fall_risk_warning](../reference/services.md#clear-fall-risk-warning).
- Add `capacity`, `design_capacity`, `state_of_health` and `cycle_count` in [detailed_battery_state](../reference/websocket.md#detailed-battery-state).
- Add websocket topic [Detected Trailer](../reference/websocket.md#detected-trailer)
- Add websocket topic [Push Handle State](../reference/websocket.md#push-handle-state)
- Add websocket topic [Detailed Battery State](../reference/websocket.md#detailed-battery-state)
- Add [Clear Jack Errors](../reference/services.md#clear-jack-errors)
- Add [landmarks](../reference/landmarks.md)
- Add [Confirm Estop](../reference/services.md#confirm-emergency-stop)
- Support [Loading map from local file](../reference/current_map_and_pose.md#set-current-map-by-loading-local-files)
- Support new service [Calibrate Depth Camera Masks](../reference/services.md#calibrate-depth-camera-masks)
- Add `/services/start_collecting_landmarks`, `/services/stop_collecting_landmarks` and `/collected_data`

## 2.10.0

- Add websocket topic [/detected_pallets](../reference/websocket.md#detected-pallets)
- Add `properties` in mapping task object. It will be used to store landmarks.

## 2.9.1

- Add `relative_pose` in [/collected_barcode](../reference/websocket.md#collected-barcode)

## 2.9.0

- Add [System Settings](../reference/system_settings.md)
- Deprecate [Robot Params](../reference/robot_params.md)
- Add `docking_with_conveyer` and `is_waiting_for_dest` in [/planning_state](../reference/websocket.md#planning-state)
- Add `wheels_released` in [/wheel_state](../reference/websocket.md#wheel-state).
- Add [/bumper_state](../reference/websocket.md#bumper-state)
- Add roller services. See [Load/Unload Cargo with Roller](../reference/services.md#loadunload-cargo-with-roller)
- Add roller websocket topic [/roll_state](../reference/websocket.md#roller-state)


## 2.8.3

- Add `not_installed` package status. See [List Packages](../reference/app_store.md#list-packages)

## 2.8.0

- Support [Get Nav. Thumbnail Service](../reference/services.md#get-nav-thumbnail)
- Support websocket topic [/robot_signal](../reference/websocket.md#robot-signal)
- Support [Get Rgb Image Service](../reference/services.md#get-rgb-image)
- Support Websocket topic [/nearby_auto_doors](../reference/websocket.md#nearby-auto-doors)

## 2.7.7

- Support `/control/bump_based_speed_limit/enable` in [robot params](../reference/robot_params.md)
- Support [following a moving target](../reference/moves.md#follow-target). Add cap `supportsFollowTarget`.
- Support [getting default params](../reference/robot_params.md#get-default-params)

## 2.7.1

- Support management of [time sources](../reference/device.md#time-sources)
- Support use the robot as a [NTP Server](../reference/device.md#ntp-server)

## 2.7.0

- Support [auto-doors and gateways](../reference/iot_devices.md#auto-door-and-gateway).
- Support enabling a list of topics. Like `{"enable_topic": ["/actions", "/alerts", "/tracked_pose"]}`
- Support [global positioning based on barcode](../reference/services.md#barcode)
  - New capability flag: `supportsBarcodeGp`
  - Add two params in service `/services/start_global_positioning`.
  - Add websocket topic `/collected_barcode`. See [collected barcodes](../reference/websocket.md#collected-barcode)
- Support [loop recording of bags](../reference/bags.md)
  - New capability flag: `supportsBags`
- Add new param [/wheel_control/acc_smoother/smooth_level](../reference/robot_params.md)
- Support [correcting time error](../reference/services.md#step-time)
- Support [installing package from local file](../reference/app_store.md#install-package-from-local-file)
- Support [Boot Progress](../reference/device.md#boot-progress)
- Support [setting map with data directly](../reference/current_map_and_pose.md#set-current-map).
- Support jacking device:
  - New capability flag: `supportsJack`
  - New move action type: `align_with_rack`, `to_unload_point`. See [Jack Device](../reference/moves.md#jack-device)
  - New move actin fail reason `rack_moved`.
  - Add services. See [Jack Up/Down](../reference/services.md#jack-device-updown)
  - Add websocket topic [`/jack_state`](../reference/websocket.md#jack-state)
- Support [dynamic footprint](../reference/robot_params.md#robot-footprint):
  - New capability flag: `supportsDynamicFootprints`.
  - Add new websocket topic [`/nearby_robot_footprints`](../reference/websocket.md#nearby-robot-footprints)
  - Add new websocket topic [`/robot_model`](../reference/websocket.md#robot-model)
  - The [`/nearby_robots`](../reference/websocket.md#nearby-robots) topic has a new property `footprint_digest`.

## 2.6.1

- Add APIs `/hostnames`, to add/delete local DNS entries.
- Support [cached topics](../reference/websocket.md#cached-topics).
- Add new caps: `supportsCachedTopics`.

## 2.6.0

- Support full-automatic [incremental mapping](../reference/websocket.md#incremental-map).
- Add new caps: supportsIncrementalMapping

## 2.5.6

- Add websocket `/local_path`
- Add new cap: supportsLocalPath

## 2.5.2

- `map_uid` can be used to [set current map](../reference/current_map_and_pose.md#set-current-map).
- In Websocket `/planning_state`, add `action_type`, `in_elevator`, `viewport_blocked`. See [Planning State](../reference/websocket.md#planning-state).
- Support [`POST /services/clear_range_data_all_zero_error`](../reference/services.md#clear-range-data-all-zero-error).
- Websocket `/trajectory` can show trajectory in both mapping and pure-localization mode.

## 2.5.0

- Add `/services/calibrate_gyro_scale` in [Calibrate Gyroscope Scale](../reference/services.md#calibrate-gyroscope-scale)
- Add [App Store APIs](../reference/app_store.md)
- Add USB Device APIs
  - [List USB Devices](../reference/device.md#list-usb-devices)
  - [Save USB Devices](../reference/device.md#saved-usb-devices)
  - [Reset USB Devices](../reference/services.md#reset-usb-devices)
- Support adjusting robot footprint in `/robot-params`. A restart is required for it to take effect.
- Add new caps: `supportsGyroscopeScaleCalibration`, `supportsParamFiles`, `supportsAppStore`, `supportsUsbDevices`
- Support service [`POST /services/clear_system_down_unexpectedly`](../reference/services.md#clear-alert-system-down-unexpectedly)

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
