# 开始 Websocket 通讯

在 REST API 之外，还有一套 Websocket 通讯机制。

不同于 REST API 的一问一答机制，Websocket 允许服务器主动下发通知。特别适合实时获取变化的信息，比如：

- 机器人位姿
- 运动状态
- 当前地图
- 当前目标点
- ...

## 获取机器人位姿

为了方便学习，我们使用 `wscat` 工具来测试 websocket。Linux 下，用 `sudo apt install node-ws` 安装。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
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

`/ws/v2/topics` 中的 `v2` 用于指定协议版本。协议是尽量向前兼容的。
但是，偶尔会有不兼容性的改动，所以需要客户端上报期待的协议版本。

上例中，我们使用 `enable_topic` 指令，订阅了 **定位状态** 和 **位姿** 两个频道。
后续，只要有定位状态和位姿的变化，服务器就会主动通知。

## 远程遥控

Websocket 协议也支持简单的问答，问答是并行的、非阻塞的。实时性比 REST API 好。适合用于做远程遥控等操作。

首先切换到远控模式：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "remote"}' \
  http://localhost:8000/services/wheel_control/set_control_mode
```

使用 websocket，下发控制指令：

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
connected (press CTRL+C to quit)
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
```

`linear_velocity: 0, angular_velocity: -0.6522` 表示线速度为 0，角速度为 -0.6522 弧度/s。也就是向右原地旋转。

::: danger
不要一次发送大量 `/twist`。一定要等到收到 `/twist_feedback` 之后，再发出下一个命令。
因为网络有延迟、堆积，可能会导致机器人一直运动。
:::
