# 初步上手

## 建立连接

要控制机器人，首先要打通和机器人的网络连接。

可以把控制软件直接部署到机器人设备上，用 localhost 和机器人通讯。或者也可以使用外部设备，和机器人建立起有线或者无线网络连接。网络打通后，就可以通过 HTTP 协议和机器人完成通讯。默认端口为 8000。

本教程为了简单说明问题，直接 SSH 到机器人上进行操作。

## 安全验证

我们假定和机器人的通讯是在安全的内网环境，目前只有一个简单的 KEY 验证。
所有 HTTP 请求，都必须带有 `Secret` Header。

但是为了文档简洁，在本文中，往往略去了认证 Header。

## 第一个请求：获取机器人设备信息

以下命令演示了如何获得设备基础信息。使用 curl 命令来发起 HTTP 请求，并使用 [jq](https://stedolan.github.io/jq/) 来格式化输出：

```bash
# XXXXXXXXXXXXXXXXX 隐去了真实的 Secret。需要申请获得。
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://localhost:8000/device/status | jq
```

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
