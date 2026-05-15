# 入门指南

## 连接到机器人

要控制机器人，您必须首先建立网络连接。

连接到机器人的主要方式有两种：

1. 通过以太网 (RJ45) 端口：`http://192.168.25.25:8090`。
2. 通过机器人的热点 (AP)：`http://192.168.12.1:8090`。

在本指南的所有示例中，我们将使用 IP 地址 `192.168.25.25:8090`。

## 身份验证

假设在安全的局域网环境下，我们使用一种简单的基于 HTTP Header 的身份验证机制。
所有 HTTP 请求都必须包含 `Secret` 请求头。

为简洁起见，本教程在后续的示例中将不再重复提及该请求头。

## 第一个请求：查询设备信息

以下命令使用 `curl` 执行 HTTP 请求，并使用 [jq](https://stedolan.github.io/jq/) 格式化 JSON 输出：

```bash
# secret 已被屏蔽；请替换为您实际的 secret。
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://192.168.25.25:8090/device/info | jq
```

::: tip
来自以下 IP 范围的请求不需要 secret 请求头：

```
192.168.25.*   # 在 2.7.1 版本中添加
172.16.*       # 在 2.7.1 版本中添加
```

:::

```json
{
  "rosversion": "1.15.11",
  "rosdistro": "noetic",
  "axbot_version": "1.8.8-rc4-pi64",
  "device": {
    "model": "hygeia",
    "sn": "718xxxxxxx",
    "name": "718xxxxxxxx",
    "nickname": "hygeia_1016"
  },
  "baseboard": { "firmware_version": "22a32218" },
  "wheel_control": { "firmware_version": "amps_20211103" },
  "robot": {
    "inscribed_radius": 0.248,
    "height": 1.2,
    "thickness": 0.546,
    "wheel_distance": 0.36,
    "width": 0.496
  },
  "caps": {
    "supportsImuRecalibrateService": true,
    "supportsShutdownService": true,
    "supportsRestartService": true,
    "supportsResetOccupancyGridService": true,
    "supportsImuRecalibrationFeedback": true,
    "supportsSetControlModeService": true,
    "supportsSetEmergencyStopService": true,
    "supportsWheelStateTopic": true,
    "supportsWsV2": true,
    "supportsRgbCamera": true,
    "supportsExternalRgbCamera": true,
    "supportsVisionBasedDetector": true
  },
  "time": "2022/08/02 16:46:58"
}
```
