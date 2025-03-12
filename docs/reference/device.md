# Device Information API

## Device Information

```bash
curl http://192.168.25.25:8090/device/info
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
    "supportsRgbCamera": true, // supports RGB related topics
    "combineImuBiasAndPoseCalibration": true // Since 2.4.0. Combine bias and pose calibration.
  }
}
```

## Short Device Information

```bash
curl http://192.168.25.25:8090/device/info/brief # for less information
```

## Wifi List

```bash
curl http://192.168.25.25:8090/device/available_wifis
```

```json
[
  {
    "ssid": "AutoXing",
    "bss": "a4:fa:76:33:d3:62",
    "rssi": -45,
    "open": false // since 2.3.0
  },
  {
    "ssid": "AutoXing-guest",
    "bss": "a4:fa:76:33:d3:72",
    "rssi": -33,
    "open": false // since 2.3.0
  }
]
```

## Network Information

```bash
curl http://192.168.25.25:8090/device/wifi_info
```

Station mode response:

```json
{
  "wifi_mode": "station",
  "wpa_state": "completed",
  "route_mode": "eth0_first",
  "wifi_ip": "10.10.41.43",
  "wifi_mac": "e4:5f:01:6d:bd:6a",
  "ssid": "AutoXing",
  "debug_message":"info: Switching to station mode.",
  "routes":[
    "default via 192.168.25.2 dev eth0 src 192.168.25.25 metric 202 ",
    "default via 10.10.40.1 dev wlan0 proto dhcp metric 600 ",
    "10.10.40.0/23 dev wlan0 proto kernel scope link src 10.10.41.43 metric 600 ",
    "192.168.25.0/24 dev eth0 proto dhcp scope link src 192.168.25.25 metric 202 "
  ],
  "active_access_point":{
    "ssid":"AutoXing",
    "hw_address":"a4:fa:76:33:d3:70",
    "strength":100
  },
  "last_wifi_connect_result":{}
}
```

AP mode response:

```json
{ "mode": "ap" }
```

## List Usb Devices

Usb devices are organized as a tree.

```
008/001 1d6b:0001 8 [fe3a0000.usb] USB 1.1 root hub
004/001 1d6b:0001 4 [fe3e0000.usb] USB 1.1 root hub
007/001 1d6b:0002 7 [fe380000.usb] USB 2.0 root hub
    007/002 1a40:0101 7-1 [] USB 2.0 hub
        007/033 0603:000a 7-1.3 [HK100QB2A26D1143] iHawk_100Q
        007/035 0603:000a 7-1.4 [HK100QB2A26D1346] iHawk_100Q
```

```
curl http://192.168.25.25:8090/device/usb_devices
```

This request list all usb devices on a robot:

```
[
    {
        "vendor_product": "1d6b:0001",
        "sn": "fe3a0000.usb",
        "alias": "USB 1.1 root hub",
        "description": "Linux Foundation 1.1 root hub",
        "bind": "",
        "bus_id": 8,
        "dev_id": 1,
        "port": 1,
        "full_port": "8",
        "level": 0,
        "devices": [],
    },
    {
        "vendor_product": "1d6b:0002",
        "sn": "fe380000.usb",
        "alias": "USB 2.0 root hub",
        "description": "Linux Foundation 2.0 root hub",
        "bind": "",
        "bus_id": 7,
        "dev_id": 1,
        "port": 1,
        "full_port": "7",
        "level": 0,
        "devices": [
            {
                "vendor_product": "1a40:0101",
                "sn": "",
                "alias": "USB 2.0 hub",
                "description": "Terminus Technology Inc. Hub",
                "bind": "",
                "bus_id": 7,
                "dev_id": 2,
                "port": 1,
                "full_port": "7-1",
                "level": 4,
                "devices": [
                    {
                        "vendor_product": "0603:000a",
                        "sn": "HK100QB2A26D1143",
                        "alias": "iHawk_100Q",
                        "description": "Novatek Microelectronics Corp. ",
                        "bind": "",
                        "bus_id": 7,
                        "dev_id": 33,
                        "port": 3,
                        "full_port": "7-1.3",
                        "level": 8,
                        "devices": [],
                    },
                    {
                        "vendor_product": "0603:000a",
                        "sn": "HK100QB2A26D1346",
                        "alias": "iHawk_100Q",
                        "description": "Novatek Microelectronics Corp. ",
                        "bind": "",
                        "bus_id": 7,
                        "dev_id": 35,
                        "port": 4,
                        "full_port": "7-1.4",
                        "level": 8,
                        "devices": [],
                    },
                ],
            }
        ],
    },
]
```

## Saved USB Devices

Because USB devices may disconnect after shipping, this API allows to make a backup of the USB device list. It can be used to identify lost devices later.

Save devices:

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '[...]' \
  http://192.168.25.25:8090/device/usb_devices/saved
```

Get saved devices:

```bash
curl http://192.168.25.25:8090/device/usb_devices/saved
```

Clear saved devices:

```bash
curl -X DELETE http://192.168.25.25:8090/device/usb_devices/saved
```

## Boot Progress

During boot process, accessing any API will result in 503(Service Unavailable).
When booting is done, the APIs will back to normal.

But, `GET /device/boot_progress` will always return `200`, even when booting is done.

For example:

```bash
curl http://192.168.25.25:8090/device/info # will return 503 during boot process
curl http://192.168.25.25:8090/device/boot_progress # always return 200
```

```json
{
  "start_time": 1697777324.597,
  "progress": 0.21,
  "logs": [
    {
      "stamp": 1697777324.597,
      "progress": 0.0,
      "msg": "=== AutoXing Axbot Starting Up ==="
    },
    {
      "stamp": 1697777328.597,
      "progress": 0.2,
      "msg": "Loading remote params ..."
    },
    {
      "stamp": 1697777330.601,
      "progress": 0.21,
      "msg": "Starting lidar_node ..."
    }
  ]
}
```

## Time Configuration

[Chrony](https://chrony-project.org/) is used to manage time of the robot.

Since 2.7.1, one can control some configurations with the following APIs.

The configuration of Chrony can be seen from:

```
curl http://192.168.25.25:8090/device/chrony/chrony.conf
```

### Time Sources

Chrony can make use of a list of time sources.

```
$ curl http://192.168.25.25:8090/device/chrony/sources
```

```json
[
  "pool 2.debian.pool.ntp.org iburst",
  "pool 1.cn.pool.ntp.org iburst",
  "pool 2.cn.pool.ntp.org iburst",
  "pool 3.cn.pool.ntp.org iburst",
  "pool 0.cn.pool.ntp.org iburst",
  "server ntp1.autoxing.com iburst",
  "server ntp2.autoxing.com iburst"
]
```

The syntax is a subset of [Chrony Time Source](https://manpages.debian.org/experimental/chrony/chrony.conf.5.en.html#Time_sources).

* `server [HOSTNAME] [PORT port] [iburst] [trust]`
* `pool [NAME] [PORT port] [iburst] [trust]`

It recommended to have at least 4 time sources to prevent one incorrect time source(falseticker).
See https://access.redhat.com/solutions/58025

Set sources:

```
curl -X PUT \
  -H "Content-Type: application/json" \
  --data '["pool 2.debian.pool.ntp.org iburst", "pool 0.cn.pool.ntp.org iburst"]' \
  http://192.168.25.25:8090/device/chrony/sources
```

Restore default time sources:

```
curl -X DELETE http://192.168.25.25:8090/device/chrony/sources
```

### NTP Server

Chrony can also be configured as a NTP server.

To enable NTP for 192.168.2.*, use the following API:

```
curl -X PUT \
  -H "Content-Type: application/json" \
  --data '["allow 192.168.2.0/24"]' \
  http://192.168.25.25:8090/device/chrony/allows
```

The syntax follows [Chrony Time Server](https://manpages.debian.org/experimental/chrony/chrony.conf.5.en.html#NTP_server).

```
allow [all] [SUBNET]
```

Get current allow rules:

```
curl http://192.168.25.25:8090/device/chrony/allows
```

Disable NTP Server

```
curl -X DELETE http://192.168.25.25:8090/device/chrony/allows
```

## Sensor List

Since 2.12.0

Return all sensors and their main topics, for human inspection in quality control process.

```
curl http://192.168.25.25:8090/device/sensors
```

```json
{
    "depth_cameras": [
        {
            "name": "ihawk_upward",
            "depth_image_topic": "/depth_camera/downward/image"
        },
        {
            "name": "ihawk_downward",
            "depth_image_topic": "/depth_camera/backward/image"
        }
    ],
    "laser_scanners": [
        {
            "name": "lidar_node",
            "scan_topic": "/horizontal_laser_2d/matched"
        }
    ],
    "rgb_cameras": [
        {
            "name": "rgb_forward",
            "image_topic": "/rgb_cameras/front/compressed"
        }
    ]
}
```
