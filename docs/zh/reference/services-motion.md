# 运动与底盘控制 (Motion & Chassis Control)

切换驱动模式、触发或释放急停，以及从底盘故障中恢复。

## 设置控制模式 (Set Control Mode) {#set-control-mode}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"control_mode": "auto"}' \
  http://192.168.25.25:8090/services/wheel_control/set_control_mode
```

**参数**

```ts
class SetControlModeRequest {
  control_mode: "auto" | "manual" | "remote";
}
```

使用 `/wheel_state` WebSocket Topic 监控当前的控制模式和车轮状态。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## 设置或清除急停 (Set or Clear Emergency Stop) {#set-or-clear-emergency-stop}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/wheel_control/set_emergency_stop
```

**参数**

```ts
class SetEmergencyStopRequest {
  enable: boolean;
}
```

使用 `/wheel_state` WebSocket Topic 监控急停状态。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/wheel_state"}
< {"topic": "/wheel_state", "control_mode": "auto", "emergency_stop_pressed": true }
```

## 确认急停 (Confirm Emergency Stop) {#confirm-emergency-stop}

当机器人在坡道上或处于指定的坡道区域（在 Overlays 中指定）时，即使按下急停，车轮也不会释放。警告消息将出现在 `/alerts` WebSocket Topic 中：

![](../../reference/estop_warning.png)

如果需要手动推动机器人，请使用以下命令确认释放车轮。

```bash
curl -X POST http://192.168.25.25:8090/services/confirm_estop
```

## 清除车轮错误 (Clear Wheel Errors) {#clear-wheel-errors}

```bash
curl -X POST http://192.168.25.25:8090/services/wheel_control/clear_errors
```

## 清除倾翻错误 (Clear Flip Error) {#clear-flip-error}

错误 `8004` (倾翻错误) 表示发生了严重问题，例如机器人已侧翻。
这需要人工检查。问题解决后，使用此服务清除错误并使机器人恢复运行状态。

```bash
curl -X POST http://192.168.25.25:8090/services/monitor/clear_flip_error
```

## 清除打滑错误 (Clear Slide Error) {#clear-slide-error}

:::warning
实验性功能
:::

错误 `2008` (打滑错误) 表示机器人可能与不可见的障碍物发生了剧烈碰撞。在清除此错误之前需要进行人工检查。

```bash
curl -X POST http://192.168.25.25:8090/services/monitor/clear_slipping_error
```
