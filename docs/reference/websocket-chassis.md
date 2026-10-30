# Chassis & Safety

Low-level drive and safety telemetry: wheels, odometry, IMU, bumper, and push handle.

## Wheel State {#wheel-state}

```json
{
  "topic": "/wheel_state",
  "control_mode": "auto", // auto/remote/manual
  "emergency_stop_pressed": true, // Whether in emergency stop mode.

  // Optional. Only supported by specific robot models.
  // Some wheels have a release-wheels wire.
  // This flag reflects whether the wire is active.
  "wheels_released": true
}
```

## Odom State {#odom-state}

A debug topic, to visualize covariance of lidar odom。

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

## Fused Sensor State {#fused-sensor-state}

```json
{
  "topic": "/fused_sensor_state",
  "slipping": false,
  "major_slipping": false,
  "pushed": false,
  "accelerability": 1,
  "suggested_speed": 0.5,
  "is_still": true, // Both odom_still and imu_still.
  "odom_still": true, // Wheel encoder readings are zero or near-zero.
  "imu_still": true // The integral of gyro readings over the last N seconds is below a threshold on all axes.
}
```

## IMU State {#imu-state}

Raw inertial data from the IMU sensor.

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

  "gyro_bias": [0.00123, 0.00235, 0.00346], // current bias

  // when gyro_calibrating is true,
  // gyro_bias will move slowly towards it
  "gyro_bias_target": [0.00457, 0.00568, 0.00679]
}
```

## Bumper State {#bumper-state}

Since 2.9.0

The state of the bumper sensors around the robot.

```json
{
  "topic": "/bumper_state",
  "front_bumper_pressed": false,
  "rear_bumper_pressed": false
}
```

## Push Handle State {#push-handle-state}

```json
{
  "topic": "/push_handle_state",
  "mode": "idle", // idle, push, drive
  "left_activated": false,
  "right_activated": false,
  "calibrating": true // Optional. Only present when true
}
```
