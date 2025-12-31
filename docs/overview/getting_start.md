# Getting Started

## Connecting to the Robot

To control the robot, you must first establish a network connection.

There are two primary ways to connect to the robot:

1. Via the Ethernet (RJ45) port: `http://192.168.25.25:8090`.
2. Via the robot's Access Point (AP): `http://192.168.12.1:8090`.

Throughout this guide, we will use the IP address `192.168.25.25:8090` in our examples.

## Authentication

Assuming a secure local network environment, we utilize a simple HTTP header-based authentication mechanism.
All HTTP requests must include a `Secret` header.

For brevity, this tutorial will not repeat the header in every subsequent example.

## First Request: Querying Device Information

The following command uses `curl` to perform an HTTP request and [jq](https://stedolan.github.io/jq/) to format the JSON output:

```bash
# The secret is masked; replace it with your actual secret.
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://192.168.25.25:8090/device/info | jq
```

::: tip
Requests originating from the following IP ranges do not require a secret header:

```
192.168.25.*   # Added in version 2.7.1
172.16.*       # Added in version 2.7.1
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
