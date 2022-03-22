# 版本迁移

目前处于活跃的研发阶段，API 处于不断演进中，并不绝对稳定。

为了提供原则一致，易用的 API，我们往往会 deprecate 老的 API，并提供新的 API。
做这种替代时，我们遵守以下原则：

- 一旦新 API 合并 master，本文档就只描述新 API。
- 会提供至少一个版本的替换期。替换期中，新、旧 API 会共存。

替换期中，希望客户端共同演进，尽早用上新的 API。
以下记录了每个版本的 API 替换注意事项。

## 1.9.0

### Deprecate websocket `/chassis/pose`, `/chassis/path`, `/chassis/occupancy_grid`

之前 `{"enable_topic": "/tracked_pose"}`, `{"enable_topic": "/path"}`, `{"enable_topic": "/map"}`，返回的却是 `/chassis/pose`, `/chassis/path`, `/chassis/occupancy_grid`。收到的消息名字和请求的名字不一致。

把 websocket path 从 `/ws/topics` 升级为 `/ws/v2/topics`。名字就一致了。

```bash
$ wscat -c http://localhost:8000/ws/v2/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/tracked_pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

### Deprecate `PATCH /chassis/status`

之前使用本接口更改控制模式、设置急停、清除轮控错误。

Deprecated by:

- `POST /services/wheel_control/set_control_mode` [设置控制模式](../reference/services.md#设置控制模式)
- `POST /services/wheel_control/set_emergency_stop_pressed` [设置解除急停](../reference/services.md#设置解除急停)
- `POST /services/wheel_control/clear_errors` [清除轮控错误](../reference/services.md#清除轮控错误)

### Deprecate websocket `/chassis_state`

之前使用 `/chassis_state` 来监听远控和急停模式变化。它的返回值中，有一个 `parts` 的重复部分。

```
$ wscat -c http://localhost:8000/ws/topics
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

- `/wheel_state`，参见 [更改控制模式](../reference/services.md#设置控制模式)。

## 1.8.0

### Deprecate `POST /device`

之前使用此接口完成 IMU 矫正、重启服务、重启机器。

Deprecated by:

- `POST /services/imu/recalibrate` [IMU 矫正](../reference/services.md#矫正-imu)
- `POST /services/restart_service` [重启服务](../reference/services.md#重启服务)
- `POST /services/baseboard/shutdown` [系统关机或重启](../reference/services.md#系统关机或重启)
