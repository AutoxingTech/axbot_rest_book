# Getting Started

## Connect to Robot

To control the robot, you must first establish a connection.

There are two ways to connect to the robot:

1. Connect to the robot via the Ethernet RJ45 port using `http://192.168.25.25:8090`.
2. Connect to the robot's Access Point (AP) using `http://192.168.12.1:8090`.

In this guide, we will use the IP address `192.168.25.25:8090` for all examples.

## Authentication

Assuming a secure local network, we use a simple HTTP header-based authentication.
All HTTP requests must include a `Secret` header.

For simplicity, this tutorial will not repeat the header in every example.

## First Request: Query Device Info

The following command uses `curl` to make an HTTP request and [jq](https://stedolan.github.io/jq/) to format the output:

```bash
# The secret is masked; you must use your actual secret.
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://192.168.25.25:8090/device/info | jq
```

::: tip
Requests from the following IP ranges do not require a secret:

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
