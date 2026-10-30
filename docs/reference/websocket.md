# WebSocket Reference

Topics are used to receive real-time information from the robot.
Use the following commands to start or stop listening to specific topics.

```
{"enable_topic": "TOPIC_NAME"}
{"disable_topic": "TOPIC_NAME"}
```

Since version 2.7.0, multiple topic names are supported. This requires the `supportsEnableTopicList` capability flag.

```
{"enable_topic": ["/actions", "/alerts", "/tracked_pose"]} // since 2.7.0
{"disable_topic": ["/actions", "/alerts", "/tracked_pose"]} // since 2.7.0
```

## Protobuf Messages {#protobuf-messages}

Some topics are sent as binary protobuf WebSocket frames; others use JSON text messages. A connection can receive both formats. On servers that support it, append `?pb=1` to prefer protobuf for topics available in both formats.

Binary frames have this layout:

```text
[topic_length: 1 byte][topic: UTF-8 bytes][flags: 1 byte][publisher_index: 1 byte, optional][payload]
```

The topic length is the number of bytes in the topic name. Flag bit 0 indicates a gzip-compressed payload; bit 1 indicates that the publisher index byte is present. Other flag bits are reserved. Decompress the payload when necessary, then decode it as `ax_proto_msgs.RosMessageWrapper`. Its `type` identifies the message, and the corresponding payload field contains the topic data.

The [RosMessageWrapper definition](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/ros_message_wrapper.proto) lists the supported message types and payloads. The [protobuf source directory](https://github.com/AutoxingTech/axbot-ts-sdk/tree/master/src/proto) contains their message definitions. These definitions are also available through the [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk) TypeScript SDK.

## Topic index {#topic-index}

Topics are grouped by function:

- [Localization](./websocket-localization.md) — SLAM state, pose, global positioning, barcodes, and landmarks.
- [Mapping](./websocket-mapping.md) — map and costmap images, incremental updates, trajectory, and map-quality diagnostics.
- [Navigation & Planning](./websocket-navigation.md) — planning state, paths, follow-target control, robot model, and signals.
- [Chassis & Safety](./websocket-chassis.md) — wheels, odometry, IMU, bumper, and push handle.
- [Cargo & Equipment](./websocket-cargo.md) — jack, roller, rack, pallet, and trailer state.
- [Perception & Cameras](./websocket-perception.md) — point clouds, detected objects, and camera streams.
- [Environment & Connectivity](./websocket-environment.md) — nearby robots, auto doors, V2X beacons, and GNSS/INS.
- [System & Power](./websocket-system.md) — battery, sensor power, alerts, app events, and I/O pins.

### Localization

<!-- prettier-ignore -->
| Topic                                                                              | Description                                                                |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [`/slam/state`](./websocket-localization.md#positioning-state)                       | SLAM state, position reliability, and positioning quality.                  |
| [`/tracked_pose`](./websocket-localization.md#current-pose)                          | Robot pose in the world frame.                                             |
| [`/global_positioning_state`](./websocket-localization.md#global-positioning-state)  | Progress and result of `start_global_positioning`.                         |
| [`/collected_barcode`](./websocket-localization.md#collected-barcode)                | Barcodes seen by the robot, with their map poses.                          |
| [`/landmarks`](./websocket-localization.md#landmarks)                                | Landmarks collected for the current map.                                   |

### Mapping

<!-- prettier-ignore -->
| Topic                                                         | Description                                                                  |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`/map`](./websocket-mapping.md#map)                          | Current map image; updated once in localization mode, repeatedly while mapping. |
| [`/map_v2`](./websocket-mapping.md#cached-topics)             | Large map images served through cacheable `data_url` links.                  |
| [`/maps/5cm/1hz`](./websocket-mapping.md#obstacle-map)        | Low-resolution costmap used for path planning.                               |
| [`/maps/1cm/1hz`](./websocket-mapping.md#obstacle-map)        | High-resolution costmap used for collision detection.                        |
| [`/incremental_map`](./websocket-mapping.md#incremental-map)  | New obstacles and cleared space detected since the map was built.            |
| [`/updated_map_slice`](./websocket-mapping.md#updated-map-slice) | A grayscale slice of a freshly updated map region.                        |
| [`/trajectory`](./websocket-mapping.md#trajectory)            | The robot's trail, complete in mapping mode and trimmed in localization mode. |
| [`/env_match_map`](./websocket-mapping.md#environment-match-map)       | How well the live point cloud matches the stored map.               |
| [`/env_symmetry_map`](./websocket-mapping.md#environment-symmetry-map) | How ambiguous the environment is for localization.                  |

### Navigation & Planning

<!-- prettier-ignore -->
| Topic                                                                     | Description                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`/planning_state`](./websocket-navigation.md#planning-state)              | Execution state of the current move action.                       |
| [`/path`](./websocket-navigation.md#global-path)                           | The planned global path.                                          |
| [`/local_path`](./websocket-navigation.md#local-path)                      | The local planner's path (debug).                                 |
| [`/follow_target_state`](./websocket-navigation.md#follow-target-state)    | Send follow-target control messages to the robot.                 |
| [`/robot_model`](./websocket-navigation.md#robot-model)                    | Dynamic footprint, including an attached rack.                    |
| [`/platform_monitor/travelled_distance`](./websocket-navigation.md#traveled-distance) | Distance and duration of the current move.              |
| [`/robot_signal`](./websocket-navigation.md#robot-signal)                  | Turn-signal and brake-light state.                                |

### Chassis & Safety

<!-- prettier-ignore -->
| Topic                                                          | Description                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| [`/wheel_state`](./websocket-chassis.md#wheel-state)           | Control mode, emergency stop, and wheel release state.        |
| [`/odom_state`](./websocket-chassis.md#odom-state)             | Lidar odometry reliability and covariance (debug).            |
| [`/fused_sensor_state`](./websocket-chassis.md#fused-sensor-state) | Slipping, pushing, and stillness estimates.               |
| [`/imu_state`](./websocket-chassis.md#imu-state)               | Raw IMU data and gyro bias calibration state.                 |
| [`/bumper_state`](./websocket-chassis.md#bumper-state)         | Front and rear bumper switch state.                           |
| [`/push_handle_state`](./websocket-chassis.md#push-handle-state) | Push-handle mode and activation.                            |

### Cargo & Equipment

<!-- prettier-ignore -->
| Topic                                                            | Description                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------- |
| [`/jack_state`](./websocket-cargo.md#jack-state)                 | Jack position, progress, and self-check state.             |
| [`/roller_state`](./websocket-cargo.md#roller-state)             | Roller state: hold, loading, or unloading.                 |
| [`/detected_rack`](./websocket-cargo.md#detected-rack)           | Rack detected in front of the robot, with dimensions.      |
| [`/detected_rack_states`](./websocket-cargo.md#detected-rack-states) | Real-time rack occupancy observations.                 |
| [`/map_rack_states`](./websocket-cargo.md#map-rack-states)       | Accumulated occupancy of all racks on the map.             |
| [`/detected_pallets`](./websocket-cargo.md#detected-pallets)     | Pallets detected around the robot, with dimensions.        |
| [`/detected_trailer`](./websocket-cargo.md#detected-trailer)     | Trailer detected behind the robot, with hitch geometry.    |

### Perception & Cameras

<!-- prettier-ignore -->
| Topic                                                                        | Description                                                     |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`/scan_matched_points2`](./websocket-perception.md#point-cloud-used-for-slam) | Combined LiDAR point cloud used for SLAM.                      |
| [`/horizontal_laser_2d/matched`](./websocket-perception.md#point-cloud-for-individual-lidar-devices) | Per-device point cloud for debugging. |
| [`/vision_detected_objects`](./websocket-perception.md#vision-detected-objects) | Objects detected by the vision system (experimental).         |
| [`/rgb_cameras/front/video`](./websocket-perception.md#rgb-video-stream)     | H.264 video from the RGB cameras.                               |
| [`/rgb_cameras/front/compressed`](./websocket-perception.md#rgb-image-stream) | JPEG stills from the RGB cameras.                              |
| [`/depth_camera/downward/image`](./websocket-perception.md#depth-camera-images) | Depth-camera images as base64 PNG.                          |
| [`/external_rgb_camera_control`](./websocket-perception.md#external-rgb-camera-data) | Control and data channels for external RGB cameras.     |

### Environment & Connectivity

<!-- prettier-ignore -->
| Topic                                                                    | Description                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`/nearby_robots`](./websocket-environment.md#nearby-robots)              | Other robots sensed around the robot.                        |
| [`/nearby_robot_footprints`](./websocket-environment.md#nearby-robot-footprints) | Footprints that go with `/nearby_robots` digests.     |
| [`/nearby_auto_doors`](./websocket-environment.md#nearby-auto-doors)      | State and polygons of nearby automatic doors.                |
| [`/v2x_health_state`](./websocket-environment.md#v2x-health-state)        | Reception health of V2X beacons.                             |
| [`/devpvt`](./websocket-environment.md#devpvt)                            | Raw GNSS/INS navigation data from the CHC sensor.            |

### System & Power

<!-- prettier-ignore -->
| Topic                                                                 | Description                                              |
| --------------------------------------------------------------------- | -------------------------------------------------------- |
| [`/battery_state`](./websocket-system.md#battery-state)                | Battery voltage, current, and charge level.              |
| [`/detailed_battery_state`](./websocket-system.md#detailed-battery-state) | Battery state plus cell voltages, capacity, and health. |
| [`/sensor_manager_state`](./websocket-system.md#sensor-manager-state)  | Whether the sensors are awake, awakening, or sleeping.   |
| [`/alerts`](./websocket-system.md#alerts)                              | Currently active alerts.                                 |
| [`/app_events`](./websocket-system.md#app-events)                      | Application event stream (protobuf).                     |
| [`/get_device_info_brief`](./websocket-system.md#device-info)          | Request device and firmware info over the WebSocket.     |
| [`/io_pins_state`](./websocket-system.md#digital-input-output)         | Logical IO pin state and output-pin control.             |
| [`/raw_io_board_state`](./websocket-system.md#raw-io-board-state)      | Raw IO board input/output pin state.                     |
