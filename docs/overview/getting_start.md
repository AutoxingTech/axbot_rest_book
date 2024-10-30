# Getting Started

## Connect to Robot

To control the robot, first we must establish a connection.

There are two ways to connect to the robot:

1. Connect to the robot with Ethernet RJ45 port. Use `http://192.168.25.25:8090`.
2. Connect to the AP of the robot. Use `http://192.168.12.1:8090`.

In this document, we shall connect to the robot and use `192.168.25.25:8090`.

## Authentication

A secure local network is assumed, so we only have a simple HTTP header based authentication.
All HTTP requests must have a header `Secret`.

But for simplicity, in this tutorial, we will not repeat it everywhere.

## First Request: Query Device Info

The following command uses `curl` to make a HTTP request, and use [jq](https://stedolan.github.io/jq/) to format the output：

```bash
# The secret is hidden. The real one must be requested.
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://192.168.25.25:8090/device/info | jq
```

::: tip
Requests from the following IPs doesn't require a secret.

```
192.168.25.*   # added since 2.7.1
172.16.*       # added since 2.7.1
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
