# 设备信息

```bash
curl http://localhost:8000/device/info
curl http://localhost:8000/device/info/brief # for less information
```

```json
{
  "rosversion": "1.15.11",
  "rosdistro": "noetic",
  "axbot_version": "1.9.x", // 软件版本号
  "device": {
    "model": "hygeia", // 设备型号 hygeia/waiter/hotel/tray/longtray
    "sn": "71822043000350z", // SN码
    "name": "71822043000350z" // 设备 SN
  },
  "baseboard": {
    "firmware_version": "22a32218" // 主板固件版本
  },
  "wheel_control": {
    "device_type": "amps",
    "firmware_version": "amps_20211103" // 轮控固件版本
  },
  "lidar": {
    "model": "ld06"
  },
  "robot": {
    "footprint": [],
    "inscribed_radius": 0.248,
    "height": 1.2,
    "thickness": 0.546,
    "wheel_distance": 0.36,
    "width": 0.496
  },
  "caps": {
    "supportsImuRecalibrateService": true, // 是否支持 /services/imu/recalibrate
    "supportsShutdownService": true, // 是否支持 /services/baseboard/shutdown
    "supportsRestartService": true, // 是否支持 /services/restart_service
    "supportsResetOccupancyGridService": true, // 是否支持 /services/occupancy_grid_server/reset
    "supportsImuRecalibrationFeedback": true, // 是否支持 /imu_state WebSocket 频道
    "supportsSetControlModeService": true, // 是否支持 /services/wheel_control/set_control_mode
    "supportsSetEmergencyStopService": true, // 是否支持 /services/wheel_control/set_emergency_stop
    "supportsWheelStateTopic": true, // 是否支持 /wheel_state WebSocket 频道
    "supportsWsV2": true, // 是否支持 ws://HOST/ws/v2/topics
    "supportsRgbCamera": true // 是否支持 RGB 监控摄像头
  },
  "remote_params": {
    "tags": [
      "ihawk_crossfire",
      "RGB_external",
      "strongest_lidar_match",
      "mute_baseboard_com_output"
    ]
  }
}
```
