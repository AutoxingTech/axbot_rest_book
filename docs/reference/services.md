# 服务调用 API

## 矫正 IMU

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

## 设置控制模式

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

## 设置/解除急停

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

## 重启服务

重启底盘所有服务。

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"enabled": true}'
  http://localhost:8000/services/restart_service
```

## 系统关机或重启

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

## 清除轮控错误

```bash
curl -X POST http://localhost:8000/services/wheel_control/clear_errors
```

## 清除侧翻错误

Error 8004(严重侧翻错误)，说明机器人有可能已经跌落。需要人工通过监控等方法确认安全后，再调用此接口清除错误。

```bash
curl -X POST http://localhost:8000/services/monitor/clear_flip_error
```

## 开关激光雷达

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

## 开关深度摄像机

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
