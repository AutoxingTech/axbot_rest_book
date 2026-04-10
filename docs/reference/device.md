# Device API

The current SDK wraps three read-only device endpoints:

| SDK helper | Method | Path | Return type |
| --- | --- | --- | --- |
| `getDeviceInfo()` | `GET` | `/device/info` | `DeviceInfo` |
| `getBootProgress()` | `GET` | `/device/boot_progress` | `BootProgress \| null` |
| `getWifiInfo()` | `GET` | `/device/wifi_info` | untyped JSON |

These endpoints are safe to call repeatedly and are the primary source of capability detection in client applications.

## Device Information

```bash
curl "$ROBOT_API_BASE/device/info"
```

A current robot running `master-opi64` returns a large payload. The most commonly consumed fields are:

```json
{
  "axbot_version": "master-opi64",
  "device": {
    "model": "longjack",
    "sn": "B652507a06100Ao",
    "name": "B652507a06100Ao",
    "nickname": "longjack_1686",
    "param_tags": {
      "prod": ["..."],
      "dev": []
    }
  },
  "baseboard": {
    "firmware_version": "1.3.7.0",
    "emergency_stop_button_behavior": "manual_release"
  },
  "wheel_control": {
    "device_type": "amps",
    "firmware_version": "amps_20220926"
  },
  "robot": {
    "footprint": [[0, -0.369], [0.14, -0.366], [0.2, -0.346]],
    "height": 1.4,
    "wheel_distance": 0.36,
    "charge_contact": {
      "pose_2d": [0, -0.369, -1.5708]
    }
  },
  "caps": {
    "supportsWsV2": true,
    "supportsBags": true,
    "supportsJack": true,
    "supportsTowing": true
  }
}
```

### What To Look At

| Field group | Why it matters |
| --- | --- |
| `device` | Stable identity and model information |
| `robot` | Physical footprint and kinematic metadata |
| `caps` | Feature discovery for services, topics, and UI switches |
| `param_tags` | Available low-level parameter file tags |
| `gitinfo` | Build provenance when debugging runtime mismatches |

## Boot Progress

```bash
curl "$ROBOT_API_BASE/device/boot_progress"
```

The SDK returns `null` when the endpoint is unavailable or does not return JSON.

Example payload:

```json
{
  "start_time": 1775734452.426,
  "progress": 1.0,
  "logs": [
    {
      "stamp": 1775734452.426,
      "progress": 0.0,
      "msg": "=== Axbot Starting Up ==="
    },
    {
      "stamp": 1775734466.741,
      "progress": 0.23,
      "msg": "starting occupancy_grid_server ... "
    }
  ]
}
```

## Wi-Fi Information

```bash
curl "$ROBOT_API_BASE/device/wifi_info"
```

Current response example:

```json
{
  "wifi_mode": "station",
  "wpa_state": "completed",
  "route_mode": "eth0_first",
  "wifi_ip": "10.10.40.93",
  "wifi_mac": "2c:7b:a0:4e:86:58",
  "ssid": "AutoXing",
  "routes": [
    "default via 192.168.25.2 dev eth0 proto static metric 101",
    "default via 10.10.40.1 dev wlP4p65s0 proto dhcp metric 600"
  ],
  "active_access_point": {
    "ssid": "AutoXing",
    "hw_address": "90:5d:7c:a0:9d:a0",
    "strength": 86
  },
  "last_wifi_connect_result": {}
}
```

## Raw REST Endpoints Not Wrapped By The Current SDK

The previous version of this page also documented endpoints such as `/device/info/brief`, `/device/available_wifis`, and USB-device inventory APIs. Those endpoints are not currently wrapped by the SDK. They may still be useful for admin tooling, but they should be validated directly on the target build.
