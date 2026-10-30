# 底盘与安全 (Chassis & Safety)

底层驱动与安全遥测：车轮、里程计、IMU、触碰限位和推手。

## 车轮状态 (Wheel State) {#wheel-state}

```json
{
  "topic": "/wheel_state",
  "control_mode": "auto", // auto/remote/manual (自动/远程/手动)
  "emergency_stop_pressed": true, // 是否处于急停模式。

  // 可选。仅由特定机器人型号支持。
  // 某些车轮带有释放轮子的连线。
  // 此标志反映该连线是否处于激活状态。
  "wheels_released": true
}
```

## 里程计状态 (Odom State) {#odom-state}

一个调试 Topic，用于可视化激光里程计的协方差。

```json
{
  "topic": "/odom_state",
  "lidar_odom_reliable": true,
  "lidar_odom_cov": [
    0.000023889469957794063, -0.00002311983917024918, -0.00002311983917024918,
    0.00005866867650183849
  ]
}
```

## 融合传感器状态 (Fused Sensor State) {#fused-sensor-state}

```json
{
  "topic": "/fused_sensor_state",
  "slipping": false,
  "major_slipping": false,
  "pushed": false,
  "accelerability": 1,
  "suggested_speed": 0.5,
  "is_still": true, // 同时满足 odom_still 和 imu_still
  "odom_still": true, // 轮速计读数为 0 或接近 0
  "imu_still": true // 最近 N 秒内 gyro 各轴积分均低于阈值
}
```

## IMU 状态 (IMU State) {#imu-state}

来自 IMU 传感器的原始惯性数据。

```json
{
  "topic": "/imu_state",
  "calibrate_state": 0,
  "calibrate_fail_reason": 0,
  "temperature": 62.4,
  "angular_velocity_standard_deviation_10s": [0.02175, 0.02393, 0.02442],
  "angular_velocity_avg_10s": [0.00021, 0.00191, -0.00253],
  "linear_acc_standard_deviation_10s": [0.00517, 0.00535, 0.00575],
  "gyro_calibrating": true,

  "gyro_bias": [0.00123, 0.00235, 0.00346], // 当前偏差

  // 当 gyro_calibrating 为 true 时，
  // gyro_bias 将缓慢向此值靠近
  "gyro_bias_target": [0.00457, 0.00568, 0.00679]
}
```

## 触碰限位状态 (Bumper State) {#bumper-state}

自 2.9.0 起

机器人周围防撞条传感器的状态。

```json
{
  "topic": "/bumper_state",
  "front_bumper_pressed": false,
  "rear_bumper_pressed": false
}
```

## 推手状态 (Push Handle State) {#push-handle-state}

```json
{
  "topic": "/push_handle_state",
  "mode": "idle", // idle, push, drive (空闲, 推动, 驱动)
  "left_activated": false,
  "right_activated": false,
  "calibrating": true // 可选。仅在为 true 时存在
}
```
