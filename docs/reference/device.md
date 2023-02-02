# Device Information API

## Device Information

```bash
curl http://localhost:8000/device/info
```

```json
{
  "rosversion": "1.15.11",
  "rosdistro": "noetic",
  "axbot_version": "1.9.x", // The version of main package
  "device": {
    "model": "hygeia", // device model. hygeia/waiter/hotel/tray/longtray etc.
    "sn": "71822043000350z", // SN. Unique for all devices.
    "name": "71822043000350z" // Some prototype devices has a name.
    // But for most devices, it's the same as SN.
  },
  "baseboard": {
    "firmware_version": "22a32218"
  },
  "wheel_control": {
    "firmware_version": "amps_20211103" // wheel firmware version
  },
  "bottom_sensor_pack": {
    "firmware_version": "1.1.1"
  },
  "depth_camera": {
    "firmware_version": "[/dev/camera:1.2.5-s2-ax-D1]"
  },
  "robot": {
    "footprint": [],
    "inscribed_radius": 0.248,
    "height": 1.2,
    "thickness": 0.546,
    "wheel_distance": 0.36,
    "width": 0.496,
    "charge_contact_position": "back" // Position of the charge contact. "back" or "front"
  },
  "caps": {
    "supportsImuRecalibrateService": true, // supports /services/imu/recalibrate
    "supportsShutdownService": true, // supports /services/baseboard/shutdown
    "supportsRestartService": true, // supports /services/restart_service
    "supportsResetOccupancyGridService": true, // supports /services/occupancy_grid_server/reset
    "supportsImuRecalibrationFeedback": true, // supports /imu_state WebSocket topic
    "supportsSetControlModeService": true, // supports /services/wheel_control/set_control_mode
    "supportsSetEmergencyStopService": true, // supports /services/wheel_control/set_emergency_stop
    "supportsWheelStateTopic": true, // supports /wheel_state WebSocket topic
    "supportsWsV2": true, // supports ws://HOST/ws/v2/topics
    "supportsRgbCamera": true // supports RGB related topics
  }
}
```

## Short Device Information

```bash
curl http://localhost:8000/device/info/brief # for less information
```

## Wifi List

```bash
curl http://localhost:8000/device/avaliable_wifis
```

```json
[
  { "ssid": "AutoXing", "bss": "a4:fa:76:33:d3:62", "rssi": -45 },
  { "ssid": "AutoXing-guest", "bss": "a4:fa:76:33:d3:72", "rssi": -33 }
]
```

## Wifi Information

```bash
curl http://localhost:8000/device/wifi_info
```

Station mode response:

```json
{
  "mode": "station",
  "ip": "10.10.40.83",
  "mac": "ee:94:de:b8:40:6e",
  "dev": "wlan0",
  "via": "10.10.40.1",
  "ssid": "AutoXing"
}
```

AP mode response:

```json
{ "mode": "ap" }
```
