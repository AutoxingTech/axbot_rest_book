# 设备信息 API

## 设备信息

```bash
curl http://192.168.25.25:8090/device/info
```

```json
{
  "rosversion": "1.15.11",
  "rosdistro": "noetic",
  "axbot_version": "1.9.x", // 主软件程序的版本。
  "device": {
    "model": "hygeia", // 设备型号 (例如：hygeia, waiter, hotel, tray, longtray)。
    "sn": "71822043000350z", // 序列号 (SN)，每个设备都是唯一的。
    "name": "71822043000350z" // 某些原型设备可能有特定的名称。
    // 对于大多数生产设备，这与 SN 相同。
  },
  "baseboard": {
    "firmware_version": "22a32218"
  },
  "wheel_control": {
    "firmware_version": "amps_20211103" // 轮控器的固件版本。
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
    "charge_contact_position": "back" // 充电触点位置 ("back" 或 "front")。
  },
  "caps": {
    "supportsImuRecalibrateService": true, // 支持 /services/imu/recalibrate 服务。
    "supportsShutdownService": true, // 支持 /services/baseboard/shutdown 服务。
    "supportsRestartService": true, // 支持 /services/restart_service 服务。
    "supportsResetOccupancyGridService": true, // 支持 /services/occupancy_grid_server/reset 服务。
    "supportsImuRecalibrationFeedback": true, // 支持 /imu_state WebSocket 话题。
    "supportsSetControlModeService": true, // 支持 /services/wheel_control/set_control_mode 服务。
    "supportsSetEmergencyStopService": true, // 支持 /services/wheel_control/set_emergency_stop 服务。
    "supportsWheelStateTopic": true, // 支持 /wheel_state WebSocket 话题。
    "supportsWsV2": true, // 支持 V2 WebSocket API (ws://HOST/ws/v2/topics)。
    "supportsRgbCamera": true, // 支持 RGB 相机相关话题。
    "combineImuBiasAndPoseCalibration": true, // 自 2.4.0 版本起可用。合并 IMU 偏置和位姿校准。
    "supportsJackCheck": true, // 支持 POST /services/jack_self_check
    "supportsDuoLidar": true, // 支持 POST /services/calibrate_duo_lidar_poses
  }
}
```

## 简要设备信息

```bash
curl http://192.168.25.25:8090/device/info/brief # 获取精简后的设备信息集。
```

## Wi-Fi 列表

```bash
curl http://192.168.25.25:8090/device/available_wifis
```

```json
[
  {
    "ssid": "AutoXing",
    "bss": "a4:fa:76:33:d3:62",
    "rssi": -45,
    "open": false // 自 2.3.0 版本起可用。
  },
  {
    "ssid": "AutoXing-guest",
    "bss": "a4:fa:76:33:d3:72",
    "rssi": -33,
    "open": false // 自 2.3.0 版本起可用。
  }
]
```

## 网络信息

```bash
curl http://192.168.25.25:8090/device/wifi_info
```

Station 模式下的响应：

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

AP 模式下的响应：

```json
{ "mode": "ap" }
```

## 列出 USB 设备

USB 设备按树状结构组织。

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

此请求列出连接到机器人的所有 USB 设备：

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

## 已保存的 USB 设备

由于 USB 设备偶尔可能会断开连接，此 API 允许您备份当前的 USB 设备列表。此备份以后可用于识别任何缺失或断开连接的设备。

保存当前的 USB 设备列表：

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '[...]' \
  http://192.168.25.25:8090/device/usb_devices/saved
```

获取已保存的 USB 设备列表：

```bash
curl http://192.168.25.25:8090/device/usb_devices/saved
```

清除已保存的 USB 设备列表：

```bash
curl -X DELETE http://192.168.25.25:8090/device/usb_devices/saved
```

## 启动进度

在启动过程中，任何 API 请求都将返回 `503 Service Unavailable` 状态码。
启动过程完成后，API 将恢复正常工作。

但是，`GET /device/boot_progress` 将始终返回 `200 OK` 状态，即使在启动完成后也是如此。

例如：

```bash
curl http://192.168.25.25:8090/device/info # 在启动过程中返回 503。
curl http://192.168.25.25:8090/device/boot_progress # 始终返回 200。
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

## 时间配置

使用 [Chrony](https://chrony-project.org/) 来管理机器人的系统时间。

自 2.7.1 版本起，您可以使用以下 API 管理某些时间配置。

当前的 Chrony 配置可以从以下端点获取：

```
curl http://192.168.25.25:8090/device/chrony/chrony.conf
```

### 时间源

Chrony 可以使用已配置的时间源列表。

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

语法是 [Chrony 时间源](https://manpages.debian.org/experimental/chrony/chrony.conf.5.en.html#Time_sources)配置的一个子集。

* `server [HOSTNAME] [PORT port] [iburst] [trust]`
* `pool [NAME] [PORT port] [iburst] [trust]`

建议至少配置四个时间源，以减轻不准确时间源 (falseticker) 的影响。
详情请参阅 https://access.redhat.com/solutions/58025

设置时间源：

```
curl -X PUT \
  -H "Content-Type: application/json" \
  --data '["pool 2.debian.pool.ntp.org iburst", "pool 0.cn.pool.ntp.org iburst"]' \
  http://192.168.25.25:8090/device/chrony/sources
```

恢复默认时间源：

```
curl -X DELETE http://192.168.25.25:8090/device/chrony/allows
```

### NTP 服务器

Chrony 也可以配置为作为 NTP 服务器运行。

要为 `192.168.2.*` 子网启用 NTP 访问，请使用以下 API：

```
curl -X PUT \
  -H "Content-Type: application/json" \
  --data '["allow 192.168.2.0/24"]' \
  http://192.168.25.25:8090/device/chrony/allows
```

语法遵循 [Chrony 时间服务器](https://manpages.debian.org/experimental/chrony/chrony.conf.5.en.html#NTP_server)配置。

```
allow [all] [SUBNET]
```

获取当前的允许规则：

```
curl http://192.168.25.25:8090/device/chrony/allows
```

禁用 NTP 服务器：

```
curl -X DELETE http://192.168.25.25:8090/device/chrony/allows
```

## 传感器列表

自 2.12.0 版本起可用。

返回所有传感器及其主要话题的列表，用于质量控制 (QC) 过程中的人工检查。

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
