# Changelog

## 2.14.0

- 2026-10-31 Reorganize the [Service API](../reference/services.md) and [WebSocket](../reference/websocket.md) references by function; forwarded ROS services are now part of the service reference instead of a separate page
- 2026-10-30 Add [/app_events](../reference/websocket-system.md#app-events) WebSocket topic
- 2026-10-29 Add [Load/Unload on Truck](../reference/moves.md#truck-load-unload) move types
- 2026-09-23 Add [Calibrate Mast Tick Base](../reference/services-calibration.md#calibrate-mast-tick-base) forwarded ROS service
- 2026-09-19 Add [Clear Gyro Scale](../reference/services-calibration.md#clear-gyro-scale) forwarded ROS service
- 2026-09-16 Add `expected_cargo_action` in [/planning_state](../reference/websocket-navigation.md#planning-state)
- 2026-09-14 Add [Traffic Info](../reference/services-mapping.md#traffic-info) API to read/replace the dynamic no-passing zones of the current map
- 2026-09-12 Add [Bag Streaming API](../reference/bags.md#bag-streaming-api) to replay any bag over plain HTTP with raw message payloads
- 2026-08-21 Add `lat`/`lon` in [/devpvt](../reference/websocket-environment.md#devpvt)
- 2026-06-17 Add `gyro_bias` and `gyro_bias_target` in [/imu_state](../reference/websocket-chassis.md#imu-state)
- 2026-08-21 Remove the obsolete map download endpoint and `download_url` field from [Mapping](../reference/mappings.md#mapping-list)
- 2026-08-21 Add file sizes (`pbstream_size`, `image_size`, `bag_size`) to [Mapping](../reference/mappings.md#mapping-list) and [Map](../reference/maps.md#map-list) list/detail responses
- 2026-08-04 Add [Map Overlays](../reference/services-mapping.md#map-overlays) API to read/replace dynamic map overlays as GeoJSON
- 2026-07-22 Add [Rack Pose](../reference/services-localization.md#rack-pose) to query the jack plate's front/rear edge pose for rack POI definition
- 2026-07-01 Add [SLAM Map Image](../reference/services-mapping.md#slam-map-image) API to fetch the current SLAM map as a protobuf-encoded PNG
- 2026-07-01 Update proto namespace: submap messages moved to `ros_messages.slam`, `StatusResponse.code` uses the `StatusCode` enum
- 2026-06-30 Add [Detected Rack States](../reference/websocket-cargo.md#detected-rack-states) and [Map Rack States](../reference/websocket-cargo.md#map-rack-states) WebSocket topics
- 2026-06-17 Add `/imu_state` WebSocket topic with gyro bias fields
- 2026-06-17 Add `/fused_sensor_state` WebSocket topic
- 2026-06-14 Rename `topics/published` to `topics/published_names` in ROS services docs
- 2026-06-09 Add [Forwarded ROS Services](../reference/services.md) reference for ROS submap and topic APIs
- 2026-06-03 Add three calibration modes (single_shot, right_wall, front_wall) to [Calibrate Duo Lidar Poses](../reference/services-calibration.md#calibrate-duo-lidar-poses)
- 2026-05-11 Add [Submaps](../reference/submaps.md) reference for `/submap_list` and `SubmapQueryV2`
- 2026-04-29 Add services [Towing Hook Lock, Towing Hook Release, Clear Towing Hook Error](../reference/services-cargo.md#towing-hook-lock)
- 2026-04-29 Add services [Load/Unload Cargo](../reference/services-cargo.md#load-unload-cargo)
- Add `/services/query_pose/trailer_pose` [Query Pose](../reference/services-localization.md#query-pose)
- Support creating maps directly from local files in [Map API](../reference/maps.md#create-map-from-local-files)
- Emphasize download mapping result by binary file, with [pbstream_url](../reference/mappings.md#mapping-list)
- Add `nav_sat_state` in [/slam/state](../reference/websocket-localization.md#positioning-state)
- Add `/devpvt` websocket channel [CHC NavState (GNSS/INS)](../reference/websocket-environment.md#devpvt)
- Add service [/service/jack_self_check](../reference/services-cargo.md#jack-device-up-down-self-check)

## 2.12.0

- Add websocket channel [V2X Health State](../reference/websocket-environment.md#v2x-health-state)
- Add service [Probe V2X Beacons](../reference/services-perception.md#probe-v2x-beacons)
- Add websocket channel [Raw Io-board State](../reference/websocket-system.md#raw-io-board-state)
- Add path orientation in [/path](../reference/websocket-navigation.md#global-path)
- Add `expanded_footprint` in [/robot_model](../reference/websocket-navigation.md#robot-model)
- Add websocket channel [Updated Map Slice](../reference/websocket-mapping.md#updated-map-slice)
- Add `/services/query_pose` [Query Pose](../reference/services-localization.md#query-pose)
- Add `/device/sensors` [Sensors List](../reference/device.md#sensor-list), for quality control process.
- Add `/xxxx_laser_2d/matched` [point cloud for individual lidar device](../reference/websocket-perception.md#point-cloud-for-individual-lidar-devices).
- Add `/depth_camera/xxx/image` [depth camera images](../reference/websocket-perception.md#depth-camera-images)

## 2.11.0

- Add service [clear_fall_risk_warning](../reference/services-system.md#clear-fall-risk-warning).
- Add `capacity`, `design_capacity`, `state_of_health` and `cycle_count` in [detailed_battery_state](../reference/websocket-system.md#detailed-battery-state).
- Add websocket topic [Detected Trailer](../reference/websocket-cargo.md#detected-trailer)
- Add websocket topic [Push Handle State](../reference/websocket-chassis.md#push-handle-state)
- Add websocket topic [Detailed Battery State](../reference/websocket-system.md#detailed-battery-state)
- Add [Clear Jack Errors](../reference/services-cargo.md#clear-jack-errors)
- Add [landmarks](../reference/landmarks.md)
- Add [Confirm Estop](../reference/services-motion.md#confirm-emergency-stop)
- Support [Loading map from local file](../reference/current_map_and_pose.md#set-current-map-by-loading-local-files)
- Support new service [Calibrate Depth Camera Masks](../reference/services-calibration.md#calibrate-depth-camera-masks)
- Add `/services/start_collecting_landmarks`, `/services/stop_collecting_landmarks` and `/collected_data`

## 2.10.0

- Add websocket topic [/detected_pallets](../reference/websocket-cargo.md#detected-pallets)
- Add `properties` in mapping task object. It will be used to store landmarks.

## 2.9.1

- Add `relative_pose` in [/collected_barcode](../reference/websocket-localization.md#collected-barcode)

## 2.9.0

- Add [System Settings](../reference/system_settings.md)
- Deprecate [Robot Params](../reference/robot_params.md)
- Add `docking_with_conveyer` and `is_waiting_for_dest` in [/planning_state](../reference/websocket-navigation.md#planning-state)
- Add `wheels_released` in [/wheel_state](../reference/websocket-chassis.md#wheel-state).
- Add [/bumper_state](../reference/websocket-chassis.md#bumper-state)
- Add roller services. See [Load/Unload Cargo with Roller](../reference/services-cargo.md#load-unload-cargo-with-roller)
- Add roller websocket topic [/roll_state](../reference/websocket-cargo.md#roller-state)

## 2.8.3

- Add `not_installed` package status. See [List Packages](../reference/app_store.md#list-packages)

## 2.8.0

- Support [Get Nav. Thumbnail Service](../reference/services-perception.md#get-nav-thumbnail)
- Support websocket topic [/robot_signal](../reference/websocket-navigation.md#robot-signal)
- Support [Get Rgb Image Service](../reference/services-perception.md#get-rgb-image)
- Support Websocket topic [/nearby_auto_doors](../reference/websocket-environment.md#nearby-auto-doors)

## 2.7.7

- Support `/control/bump_based_speed_limit/enable` in [robot params](../reference/robot_params.md)
- Support [following a moving target](../reference/moves.md#follow-target). Add cap `supportsFollowTarget`.
- Support [getting default params](../reference/robot_params.md#get-default-parameters)

## 2.7.1

- Support management of [time sources](../reference/device.md#time-sources)
- Support use the robot as a [NTP Server](../reference/device.md#ntp-server)

## 2.7.0

- Support [auto-doors and gateways](../reference/iot_devices.md#automatic-doors-and-gateways).
- Support enabling a list of topics. Like `{"enable_topic": ["/actions", "/alerts", "/tracked_pose"]}`
- Support [global positioning based on barcode](../reference/services-localization.md#barcode)
  - New capability flag: `supportsBarcodeGp`
  - Add two params in service `/services/start_global_positioning`.
  - Add websocket topic `/collected_barcode`. See [collected barcodes](../reference/websocket-localization.md#collected-barcode)
- Support [loop recording of bags](../reference/bags.md)
  - New capability flag: `supportsBags`
- Add new param [/wheel_control/acc_smoother/smooth_level](../reference/robot_params.md)
- Support [correcting time error](../reference/services-system.md#step-time)
- Support [installing package from local file](../reference/app_store.md#install-package-from-a-local-file)
- Support [Boot Progress](../reference/device.md#boot-progress)
- Support [setting map with data directly](../reference/current_map_and_pose.md#set-current-map).
- Support jacking device:
  - New capability flag: `supportsJack`
  - New move action type: `align_with_rack`, `to_unload_point`. See [Jack Device](../reference/moves.md#jack-device)
  - New move actin fail reason `rack_moved`.
  - Add services. See [Jack Up/Down](../reference/services-cargo.md#jack-device-up-down-self-check)
  - Add websocket topic [`/jack_state`](../reference/websocket-cargo.md#jack-state)
- Support [dynamic footprint](../reference/robot_params.md#robot-footprint):
  - New capability flag: `supportsDynamicFootprints`.
  - Add new websocket topic [`/nearby_robot_footprints`](../reference/websocket-environment.md#nearby-robot-footprints)
  - Add new websocket topic [`/robot_model`](../reference/websocket-navigation.md#robot-model)
  - The [`/nearby_robots`](../reference/websocket-environment.md#nearby-robots) topic has a new property `footprint_digest`.

## 2.6.1

- Add APIs `/hostnames`, to add/delete local DNS entries.
- Support [cached topics](../reference/websocket-mapping.md#cached-topics).
- Add new caps: `supportsCachedTopics`.

## 2.6.0

- Support full-automatic [incremental mapping](../reference/websocket-mapping.md#incremental-map).
- Add new caps: supportsIncrementalMapping

## 2.5.6

- Add websocket `/local_path`
- Add new cap: supportsLocalPath

## 2.5.2

- `map_uid` can be used to [set current map](../reference/current_map_and_pose.md#set-current-map).
- In Websocket `/planning_state`, add `action_type`, `in_elevator`, `viewport_blocked`. See [Planning State](../reference/websocket-navigation.md#planning-state).
- Support [`POST /services/clear_range_data_all_zero_error`](../reference/services-system.md#clear-range-data-all-zero-error).
- Websocket `/trajectory` can show trajectory in both mapping and pure-localization mode.

## 2.5.0

- Add `/services/calibrate_gyro_scale` in [Calibrate Gyroscope Scale](../reference/services-calibration.md#calibrate-gyroscope-scale)
- Add [App Store APIs](../reference/app_store.md)
- Add USB Device APIs
  - [List USB Devices](../reference/device.md#list-usb-devices)
  - [Save USB Devices](../reference/device.md#saved-usb-devices)
  - [Reset USB Devices](../reference/services-system.md#reset-usb-devices)
- Support adjusting robot footprint in `/robot-params`. A restart is required for it to take effect.
- Add new caps: `supportsGyroscopeScaleCalibration`, `supportsParamFiles`, `supportsAppStore`, `supportsUsbDevices`
- Support service [`POST /services/clear_system_down_unexpectedly`](../reference/services-system.md#clear-system-down-unexpectedly-alert)

## 2.4.0

- Add `/control/bump_tolerance` in `/robot-params`. See [Robot Params](../reference/robot_params.md)
- Combine IMU bias calibration with pose calibration. Add capability flag `combineImuBiasAndPoseCalibration`.

## 2.3.0

- Add `position_quality` and `lidar_matched` in Websocket `/slam/state`. See [Positioning State](../reference/websocket-localization.md#positioning-state)
- Add `open` in /device/available_wifis. See [Available WIFIs](../reference/device.md#wi-fi-list)
- Add `/planning/auto_hold` in `/robot-params`. See [Robot Params](../reference/robot_params.md)
- Add `/services/set_route_mode` in [Network Setup](../reference/services-network.md#set-route-mode) and [Network Info](../reference/device.md#network-information)

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
- Add `calibrate_pose` in [Imu Calibration](../reference/services-calibration.md#recalibrate-imu)
- Add service `/wake_up_device` in [Wake Up Device](../reference/services-system.md#wake-up-the-device)
  ce)
