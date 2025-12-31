# Service API

## Recalibrate IMU

Initiates IMU calibration. The robot must remain perfectly still on a hard, flat surface during this process.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/imu/recalibrate
```

This service call only triggers the calibration; the actual process typically takes 10 to 20 seconds to complete.

Once the calibration is finished, a notification will be sent via the `/action` WebSocket topic.

**Sample Success Output:**

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

**Sample Failure Output:**

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

## Set Control Mode

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"control_mode": "auto"}' \
  http://192.168.25.25:8090/services/wheel_control/set_control_mode
```

**Parameters**

```ts
class SetControlModeRequest {
  control_mode: 'auto' | 'manual' | 'remote';
}
```

Use the `/wheel_state` WebSocket topic to monitor the current control mode and wheel status.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## Set or Clear Emergency Stop

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/wheel_control/set_emergency_stop
```

**Parameters**

```ts
class SetEmergencyStopRequest {
  enable: boolean;
}
```

Use the `/wheel_state` WebSocket topic to monitor the emergency stop status.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## Restart Services

Restarts all software services on the robot.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/restart_service
```

## Shutdown or Reboot the Device

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"target": "main_power_supply", reboot: false}' \
  http://192.168.25.25:8090/services/baseboard/shutdown
```

**Parameters**

```ts
class ShutdownRequest {
  target:
    | 'main_computing_unit' // Reboot or shutdown only the main computing board.
    | 'main_power_supply'; // Reboot or shutdown the entire device.
  reboot: boolean; // true to reboot, false to shutdown.
}
```

## Clear Wheel Errors

```bash
curl -X POST http://192.168.25.25:8090/services/wheel_control/clear_errors
```

## Clear Flip Error

Error `8004` (flip error) indicates a serious issue, such as the robot having tipped over.
This requires manual inspection. Once the issue is resolved, use this service to clear the error and restore the robot to an operational state.

```bash
curl -X POST http://192.168.25.25:8090/services/monitor/clear_flip_error
```

## Clear Slide Error

:::warning
Experimental Feature
:::

Error `2008` (slide error) indicates that the robot may have had a significant impact with an invisible obstacle. Manual inspection is required before clearing this error.

```bash
curl -X POST http://192.168.25.25:8090/services/monitor/clear_slipping_error
```

## Power On or Off the Lidar

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"action": "power_on"}' \
  http://192.168.25.25:8090/services/baseboard/power_on_lidar
```

**Parameters**

```ts
class PowerOnRequest {
  action: 'power_on' | 'power_off';
}
```

## Power On or Off the Depth Camera

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/depth_camera/enable_cameras
```

**Parameters**

```ts
class EnableDepthCameraRequest {
  enable: boolean;
}
```

## Configure Wi-Fi

Switches the Wi-Fi between Access Point (AP) and Station mode.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "station", "ssid":"xxxxxxxxx", "psk": "xxxxx"}' \
  http://192.168.25.25:8090/services/setup_wifi
```

**Parameters**

```ts
interface SetupWifiRequest {
  mode: 'ap' | 'station';
  ssid?: string; // SSID, required for station mode
  psk?: string; // Wi-Fi Protected Access Pre-Shared Key, required for station mode

  route_mode?:
    | 'eth0_first'
    | 'wlan0_first'
    | 'usb0_first'
    | 'wlan0_usb0_auto_first';
}
```

## Set Route Mode

Configures the routing table rules for the robot's chassis.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "xxx"}' \
  http://192.168.25.25:8090/services/set_route_mode
```

**Parameters**

```ts
interface RouteModeRequest {
  mode: 'eth0_first' | 'wlan0_first' | 'usb0_first' | 'wlan0_usb0_auto_first';
}
```

`route_mode`: Determines the priority of network interfaces in the routing table:

- `eth0_first`: Sets `eth0` as the default route, if available.
- `wlan0_first`: Sets `wlan0` as the default route, if available.
- `usb0_first`: Sets `usb0` as the default route, if available.
- `wlan0_usb0_auto_first`: Based on `ping` results: if `wlan0` has internet connectivity, it is used as the default route; otherwise, `usb0` is used.

A static HTML page for network configuration is also available on the local network at: http://192.168.25.25:8090/wifi_setup

![](./network_setup.png)

## Wake Up the Device

Wakes the robot from its sleep state. If the robot is already awake, this command has no effect.

```bash
curl -X POST http://192.168.25.25:8090/services/wake_up_device
```

Monitor the [Sensor Manager State](./websocket.md#sensor-manager-state) WebSocket topic for sleep, awake, or awakening status.

## Start Global Positioning

```bash
curl -X POST \
  -H "Content-Type: application/json"
  http://192.168.25.25:8090/services/start_global_positioning
```

**Parameters**

```ts
interface StartGlobalPositioningRequest {
  use_barcode?: boolean; // default to true.
  use_base_map_match?: boolean; // default to true.
}
```

Feedback can be monitored via the [Global Positioning State](./websocket.md#global-positioning-state) WebSocket topic.

### Barcode

![](./barcode.png)

A barcode is a marker composed of interleaved reflective and non-reflective surfaces.
Each barcode at a site contains a unique ID, allowing the robot to determine its exact location unambiguously upon detection.

When `use_barcode` is set to `true`, it takes priority over point-cloud-based matching. Detected barcode matches are always considered highly reliable.
To utilize this feature, barcodes and their corresponding poses must be [collected and added to the map's overlays](./websocket.md#collected-barcode).

## Auto-Mapping

:::warning
Experimental Feature
:::

When auto-mapping is enabled, the robot will automatically explore and map its environment.
This feature is only available while the robot is in mapping mode.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/enable_auto_mapping
```

**Parameters**

```ts
interface EnableAutoMappingRequest {
  enable: boolean;
}
```

## Recheck Errors

```
POST /services/monitor_recheck_errors
```

## Calibrate Depth Cameras

This service aligns the point clouds from the depth cameras with the point cloud from the horizontal Lidar.

Before initiating calibration, ensure that:

- The robot is on a flat, level surface.
- The robot is facing a wall corner or a large, rectangular object.

![](./2023-02-02-16-44-19.png)

```
POST /services/calibrate_depth_cameras
```

## Calibrate Gyroscope Scale

Initiates gyroscope scale calibration. The robot must remain perfectly still on a hard, flat surface during this process.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/imu/calibrate_gyro_scale
```

This service call only triggers the calibration; the actual process typically takes about 20 seconds to complete.

Once the calibration is finished, a notification will be sent via the `/action` WebSocket topic.

**Sample Success Output:**

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

**Sample Failure Output:**

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

## Reset USB Devices

Resetting the USB hub can sometimes help recover malfunctioning hardware devices.

The format `"1/3"` represents the `bus_id/dev_id` in the device tree. For more information, see [List USB Devices](./device.md#list-usb-devices).

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"devices_to_reset": ["1/3", "8/1"]}' \
  http://192.168.25.25:8090/services/reset_usb_devices
```

## Clear "System Down Unexpectedly" Alert

![](./system-down-alert.png)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_system_down_unexpectedly
```

## Clear "Range Data All Zero" Error

If all Lidar points return a value of 0, it indicates that the Lidar device is malfunctioning or failing.

This service temporarily clears the associated error message.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_range_data_all_zero_error
```

## Jack Device Up/Down

Raise or lower the jack device. The state of the jack device is available via the WebSocket [Jack State](./websocket.md#jack-state).

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

## Step Time

Use this service to correct the system time if it is inaccurate.

::: warning
`GET` is used to detect time errors. Do not call it frequently. Use the WebSocket `/alerts` topic instead to monitor time errors.
:::

```bash
curl http://192.168.25.25:8090/services/step_time
```

```json
{
  "should_step": false, // No need to correct time
  "message": "there is no need to make step: system time is 0.000253560 seconds fast of NTP time"
}
```

`POST` is used to correct the time.

```bash
curl -X POST http://192.168.25.25:8090/services/step_time
```

```json
{
  "message": "Step time successfully"
}
```

## Get Nav. Thumbnail

Since 2.8.0, requires `caps.supportsGetNavThumbnail`.

Retrieves an image snapshot of the robot and its surroundings, including the map, costmap, point cloud, and virtual walls.

The image is 200x200 pixels and can be used for error reporting.

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
    "data": "iVBORw0KGgoAAAANS..." // base64 encoded PNG
  }
}
```

## Get RGB Image

Since 2.8.0, requires `caps.supportsGetRgbImage`.

Retrieves the latest image from an RGB camera. This is similar to the [WebSocket RGB Image Stream](./websocket.md#rgb-image-stream) but is more efficient for use cases that only require occasional images.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"topic": "/rgb_cameras/front/compressed"}' \
  http://192.168.25.25:8090/services/get_rgb_image
```

The response format is identical to the WebSocket topic.

## Load/Unload Cargo with Roller

Since 2.9.0.

The state of the roller is available via the WebSocket [Roller State](./websocket.md#roller-state).

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

## Start Rack Size Detection

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/start_rack_size_detection

curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/stop_rack_size_detection
```

Detect the width and depth of a rack using the robot's laser scanner.

:::warning
It is generally more accurate to refer to the rack's technical specifications or measure it manually with a ruler. Use this service only as a last resort.
:::

Steps to use:

1. Position the robot directly in front of the rack.
2. Call `/start_rack_size_detection`.
3. Subscribe to the [/detected_rack WebSocket topic](./websocket.md#detected-rack).
4. Slowly push the robot under the rack.
5. Once successfully detected, stop pushing and record the rack dimensions.
6. Enter the width and depth into the [system settings](./system_settings.md#rackspecs).

## Clear Jack Errors

The jack device will report an error if it becomes overloaded.

When this occurs, most jack models can still accept new commands. However, some rare models require errors to be cleared manually before they will accept further commands.

```bash
curl -X POST http://192.168.25.25:8090/services/clear_jack_errors
```

## Confirm Emergency Stop

When the robot is on a slope or in a designated slope area (specified in overlays), the wheels will not be released even if the emergency stop is pressed. A warning message will appear in the `/alerts` WebSocket topic:

![](./estop_warning.png)

If you need to push the robot manually, use the following command to confirm releasing the wheels.

```bash
curl -X POST http://192.168.25.25:8090/services/confirm_estop
```

## Calibrate Depth Camera Masks

Some depth cameras may capture parts of the robot's own body. This service identifies which pixels should be masked to prevent the robot from mistaking itself for an obstacle.

Before calibrating, place the robot in an open area with no obstacles in the field of view of any depth cameras.

```bash
curl -X POST http://192.168.25.25:8090/services/calibrate_depth_camera_masks
```

## Collect Landmarks

This service is used to collect landmarks for an existing map.

```bash
curl -X POST http://192.168.25.25:8090/services/start_collecting_landmarks
curl -X POST http://192.168.25.25:8090/services/stop_collecting_landmarks
```

The result is stored at:

```bash
curl http://192.168.25.25:8090/collected_data
```

The collected data serves as raw material. Developers must manually insert these landmarks into [overlays](./overlays.md#landmarks) for them to be used.

## Clear Fall Risk Warning

```bash
curl -X POST http://192.168.25.25:8090/services/clear_fall_risk_warning
```

## Query Pose

This API retrieves the coordinates of various points of interest (POIs). 

For example, when the robot docks on a charger, it calculates the charger’s pose 
based on the robot’s position. 

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

Similarly, if a forklift is parked at a cargo location, the system can infer the location's pose from the forklift's current position. 

```bash
curl http://192.168.25.25:8090/services/query_pose/pallet_pose
```


```json
{
    "pose": {
        "pos": [4.179, -26.094],
        "ori": 3.18,
    },

    // Since 2.13.0. If reference == 'center_of_front_edge', the returned pose is
    // the center of the pallet's front edge (new logic).
    // Otherwise, the pose is the center of the pallet (deprecated).
    "ref": "center_of_front_edge"
}
```

## Probe V2X Beacons

This service sends messages to beacons to activate them for several seconds. This is useful for testing connectivity and triggering responses.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/probe_v2x_beacons
```

Use the [V2X Health State](./websocket.md#v2x-health-state) WebSocket topic to monitor beacon responses and health status.


