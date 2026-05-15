# WebSocket 入门指南

除了 REST API 之外，我们还提供 WebSocket 以获取实时信息。

与 REST API 的“请求-响应”模式不同，WebSocket 允许客户端与服务器（机器人）之间进行持续的双向通信。
这对于报告快速变化的信息特别有用，例如：

- 机器人的位姿
- 规划状态
- 当前地图
- 当前目标
- ...

## 获取机器人位姿

为了进行演示，我们将使用 `wscat` 来测试 WebSocket 连接。
在 Ubuntu 上，您可以使用 `sudo apt install node-ws` 安装它。或者，如果您安装了 Node.js，可以使用 `sudo npm install -g wscat`。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
connected (press CTRL+C to quit)
> {"enable_topic": "/slam/state"}
< {"enabled_topics": ["/slam/state"]}
> {"enable_topic": "/tracked_pose"}
< {"enabled_topics": ["/tracked_pose", "/slam/state"]}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
< {"topic": "/slam/state", "state": "positioning", "reliable": true}
< {"topic": "/tracked_pose", "pos": [-3.553, -0.285], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.553, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.548, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
```

`/ws/v2/topics` 中的 `v2` 代表 WebSocket API 版本。
目前，`v2` 是唯一可用的版本。我们致力于维持 API 的稳定性；然而，如果需要进行重大更改，我们将提供更新的版本。

在上述示例中，订阅了两个主题：

- `/slam/state`: 用于定位状态更新。
- `/tracked_pose`: 用于位姿更新。

订阅之后，每当定位状态或机器人位姿发生变化时，服务器都会主动通知您。

## 远程控制

WebSocket 比 REST API 响应更迅速，因此更适合遥测遥控等实时操作。

首先，将控制模式切换为 `remote`（远程）：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "remote"}' \
  http://192.168.25.25:8090/services/wheel_control/set_control_mode
```

然后，使用 WebSocket 发送控制指令：

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
connected (press CTRL+C to quit)
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
```

`linear_velocity: 0, angular_velocity: -0.6522` 指挥机器人保持原位（线速度为 0），同时向右旋转（角速度为 -0.6522 弧度/秒）。

::: danger 危险
避免快速连续发送大量的 `/twist` 指令。您应该在发送下一条指令前等待 `/twist_feedback` 消息。
如果网络连接缓慢或不稳定，这一点尤为重要。

指令可能会堆积在 Socket 缓冲区中。
即使您停止发送指令，机器人仍会继续接收并处理缓冲区中已有的指令。
这可能导致机器人在停止操作后仍继续移动较长时间，直到执行完所有缓冲的指令。
:::
