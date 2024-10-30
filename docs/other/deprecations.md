# Deprecations

In order to keep improving, APIs will evolve.
Sometimes, new APIs are added to replace the old ones.
But we will keep a central promise:

**Old APIs will be kept and coexist with new ones for at least 1 major version.**

In this period, old APIs are considered deprecated. And we hope our users can evolve with us and use the new APIs.

This document lists deprecated APIs and how to migrate to new ones.

## 1.8.8

### Deprecate websocket `/chassis/pose`, `/chassis/path`, `/chassis/occupancy_grid`

Previously when using `{"enable_topic": "/tracked_pose"}`, `{"enable_topic": "/path"}`, `{"enable_topic": "/map"}`, but the returned messages are `/chassis/pose`, `/chassis/path`, `/chassis/occupancy_grid`. The names are not consistent.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/chassis/pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

To solve the mess, please update websocket path from `/ws/topics` to `/ws/v2/topics`.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/tracked_pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

### Deprecate `PATCH /chassis/status`

This API was used to change control mode, set emergency stop, clear wheel errors.

Deprecated by:

- `POST /services/wheel_control/set_control_mode` [Set Control Mode](../reference/services.md#set-control-mode)
- `POST /services/wheel_control/set_emergency_stop_pressed` [Set Emergency Stop](../reference/services.md#setclear-emergency-stop)
- `POST /services/wheel_control/clear_errors` [Clear wheel errors](../reference/services.md#clear-wheel-errors)

### Deprecate websocket `/chassis_state`

This topic was used to monitor control mode and emergency stop mode.
There is a weird `parts` field in it.

```
$ wscat -c ws://192.168.25.25:8090/ws/topics
> {"enable_topic": "/chassis_state" }
< {
    "topic": "/chassis_state",
    "control_mode": "auto",
    "emergency_stop_pressed": false,
    "parts": {
      "control_mode": "auto",
      "emergency_stop_pressed": false
    }
  }
```

Deprecated by:

- `/wheel_state`，See [Wheel State](../reference/websocket.md#wheel-state)。

## 1.8.0

### Deprecate `POST /device`

This API was used to calibrate IMU, reboot service or device.

Deprecated by:

- `POST /services/imu/recalibrate` [IMU Calibration](../reference/services.md#recalibrate-imu)
- `POST /services/restart_service` [Restart Service](../reference/services.md#restart-service)
- `POST /services/baseboard/shutdown` [Reboot/Power Off](../reference/services.md#shutdownreboot-device)
