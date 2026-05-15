# 弃用说明

为了确保持续改进，我们的 API 将随着时间的推移而演进。
有时会引入新的 API 来替换现有的 API。
然而，我们保持一个核心承诺：

**旧版 API 将被保留并与其替代品并存至少一个大版本。**

在此期间，较旧的 API 被视为已弃用。我们鼓励用户迁移到新的 API，以利用改进后的功能。

本文档列出了已弃用的 API，并提供了迁移到其替代品的指南。

## 1.8.8

### 弃用 WebSocket 主题：`/chassis/pose`、`/chassis/path`、`/chassis/occupancy_grid`

以前，订阅 `/tracked_pose`、`/path` 或 `/map` 等主题将分别返回标记为 `/chassis/pose`、`/chassis/path` 或 `/chassis/occupancy_grid` 的消息。这种命名不一致的问题现已得到解决。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/chassis/pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

要解决此问题，请将您的 WebSocket 连接路径从 `/ws/topics` 更新为 `/ws/v2/topics`。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/tracked_pose", "pos": [-3.548, -0.288], "ori": -1.28}
```

### 弃用 `PATCH /chassis/status`

此 API 以前用于更改控制模式、设置急停和清除车轮错误。

替代方案：

- `POST /services/wheel_control/set_control_mode` [设置控制模式](../reference/services.md#set-control-mode)
- `POST /services/wheel_control/set_emergency_stop_pressed` [设置急停](../reference/services.md#setclear-emergency-stop)
- `POST /services/wheel_control/clear_errors` [清除车轮错误](../reference/services.md#clear-wheel-errors)

### 弃用 WebSocket 主题：`/chassis_state`

此主题用于监视控制模式和急停状态。
它包含一个不必要的 `parts` 字段。

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

替代方案：

- `/wheel_state`，详见 [车轮状态](../reference/websocket.md#wheel-state)。

## 1.8.0

### 弃用 `POST /device`

此 API 用于 IMU 校准以及重启服务或设备。

替代方案：

- `POST /services/imu/recalibrate` [IMU 校准](../reference/services.md#recalibrate-imu)
- `POST /services/restart_service` [重启服务](../reference/services.md#restart-service)
- `POST /services/baseboard/shutdown` [重启/关机](../reference/services.md#shutdownreboot-device)
