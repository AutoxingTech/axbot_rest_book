# Service API

## Recalibrate IMU

矫正 IMU，必须在水平地面上，并且机器处于静止时，才可发起。

```bash
curl -X POST http://localhost:8000/services/imu/recalibrate
```

本调用只是发起 IMU 矫正，还需要静置 10 秒才能完成。可以通过 `/imu_state` websocket 监控校准过程和结果。监控完毕，可以关闭 `/imu_state` 通道。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
connected (press CTRL+C to quit)
> {"enable_topic": "/imu_state"}
< {"topic": "/imu_state", "calibrate_state": 1, "calibrate_fail_reason": 0, ...}
< {"topic": "/imu_state", "calibrate_state": 1, "calibrate_fail_reason": 0, ...}
< {"topic": "/imu_state", "calibrate_state": 1, "calibrate_fail_reason": 0, ...}
< {"topic": "/imu_state", "calibrate_state": 2, "calibrate_fail_reason": 0, ...}
> {"disable_topic": "/imu_state"}
```

**说明**

| Field                 | 说明                           |
| --------------------- | ------------------------------ |
| calibrate_state       | 1 校准中 2 校准成功 3 校准失败 |
| calibrate_fail_reason | 0 没有失败 1 校准过程中有晃动  |

## Set Control Mode

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"control_mode": "auto"}'
  http://localhost:8000/services/wheel_control/set_control_mode
```

**参数说明**

```ts
class SetControlModeRequest {
  control_mode: 'auto' | 'manual' | 'remote';
}
```

使用 `/wheel_state` topic，可以监控轮控状态。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## Set/Clear Emergency Stop

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"enable": true}'
  http://localhost:8000/services/wheel_control/set_emergency_stop
```

**参数说明**

```ts
class SetEmergencyStopRequest {
  enable: boolean;
}
```

使用 `/wheel_state` topic，可以监控轮控状态。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## Restart Service

重启底盘所有服务。

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"enabled": true}'
  http://localhost:8000/services/restart_service
```

## Shutdown/Reboot Device

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"target": "main_power_supply", reboot: false}'
  http://localhost:8000/services/baseboard/shutdown
```

**参数说明**

```ts
class ShutdownRequest {
  target:
    | 'main_computing_unit' // 只重启/关闭主计算板
    | 'main_power_supply'; // 关闭/重启总电源
  reboot: boolean; // true = 重启， false = 关闭
}
```

## Clear Wheel Errors

```bash
curl -X POST http://localhost:8000/services/wheel_control/clear_errors
```

## Clear Flip Error

Error 8004(严重侧翻错误)，说明机器人有可能已经跌落。需要人工通过监控等方法确认安全后，再调用此接口清除错误。

```bash
curl -X POST http://localhost:8000/services/monitor/clear_flip_error
```

## Clear Slide Error

Error 2008(严重打滑)，说明机器人很可能撞到了无法检测到、也无法通过的障碍。需要人工确认，再调用此接口清除。

```bash
curl -X POST http://localhost:8000/services/monitor/clear_slipping_error
```

## Power On/Off Lidar

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"action": "power_on"}'
  http://localhost:8000/services/baseboard/power_on_lidar
```

**参数说明**

```ts
class PowerOnRequest {
  action: 'power_on' | 'power_off';
}
```

## Power On/Off Depth Camera

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"enabled": true}'
  http://localhost:8000/services/depth_camera/enable_cameras
```

**参数说明**

```ts
class EnableDepthCameraRequest {
  enable: boolean;
}
```

## Setup Wifi

Switch WIFI to Access-Point or Station mode.

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"mode": "station", "ssid":"xxxxxxxxx", "psk": "xxxxx"}'
  http://localhost:8000/services/services
```

**Parameters**

```ts
class SetupWifiRequest {
  mode: 'ap' | 'station';
  ssid?: string; // SSID, required for station mode
  psk?: string; // Wi-Fi Protected Access Pre-Shared Key, required for station mode
}
```

A static HTML page is also provided and can be accessed from local network. http://localhost:8000/wifi_setup

![](./wifi_setup.png)
