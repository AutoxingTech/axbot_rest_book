# Deprecations

To ensure continuous improvement, our APIs will evolve over time.
Occasionally, new APIs are introduced to replace existing ones.
However, we maintain a core commitment:

**Legacy APIs will be maintained and coexist with their replacements for at least one major version.**

During this period, the older APIs are considered deprecated. We encourage our users to migrate to the newer APIs to take advantage of improvements.

This document lists deprecated APIs and provides guidance on migrating to their replacements.

## 1.8.8

### Deprecate WebSocket Topics: `/chassis/pose`, `/chassis/path`, `/chassis/occupancy_grid`

Previously, subscribing to topics like `/tracked_pose`, `/path`, or `/map` would return messages labeled as `/chassis/pose`, `/chassis/path`, or `/chassis/occupancy_grid`, respectively. This inconsistency in naming has been addressed.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/chassis/pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

To resolve this, please update your WebSocket connection path from `/ws/topics` to `/ws/v2/topics`.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/tracked_pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

### Deprecate `PATCH /chassis/status`

This API was previously used to change the control mode, set the emergency stop, and clear wheel errors.

Replaced by:

- `POST /services/wheel_control/set_control_mode` [Set Control Mode](../reference/services.md#set-control-mode)
- `POST /services/wheel_control/set_emergency_stop_pressed` [Set Emergency Stop](../reference/services.md#setclear-emergency-stop)
- `POST /services/wheel_control/clear_errors` [Clear wheel errors](../reference/services.md#clear-wheel-errors)

### Deprecate WebSocket Topic: `/chassis_state`

This topic was used to monitor the control mode and emergency stop status.
It contained an unnecessary `parts` field.

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

Replaced by:

- `/wheel_state`, see [Wheel State](../reference/websocket.md#wheel-state).

## 1.8.0

### Deprecate `POST /device`

This API was used for IMU calibration and for rebooting the service or the device.

Replaced by:

- `POST /services/imu/recalibrate` [IMU Calibration](../reference/services.md#recalibrate-imu)
- `POST /services/restart_service` [Restart Service](../reference/services.md#restart-service)
- `POST /services/baseboard/shutdown` [Reboot/Power Off](../reference/services.md#shutdownreboot-device)
