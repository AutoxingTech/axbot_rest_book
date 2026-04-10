# Service API

This page tracks the service-style endpoints that are wrapped by the current SDK in `axbot-ts-sdk/src/robotApi.ts`.

Use one of these base URL patterns in the examples below:

```bash
# Direct robot access on a local network
export ROBOT_API_BASE="http://ROBOT_HOST:8090"

# Managed proxy access
export ROBOT_API_BASE="https://rb-admin.autoxing.com/robot_api/v1/ROBOT_SN"
```

## SDK-backed services

| SDK helper | Method | Path | Request body |
| --- | --- | --- | --- |
| `setControlMode(mode)` | `POST` | `/services/wheel_control/set_control_mode` | `{ "control_mode": "auto\|manual\|remote" }` |
| `setEmergencyStop(enable)` | `POST` | `/services/wheel_control/set_emergency_stop` | `{ "enable": true }` |
| `wakeDevice()` | `POST` | `/services/wake_up_device` | `{}` |
| `jackUp()` | `POST` | `/services/jack_up` | `{}` |
| `jackDown()` | `POST` | `/services/jack_down` | `{}` |
| `towingHookLock()` | `POST` | `/services/towing_hook_lock` | `{}` |
| `towingHookRelease()` | `POST` | `/services/towing_hook_release` | `{}` |
| `startCollectingLandmarks()` | `POST` | `/services/start_collecting_landmarks` | `{}` |
| `stopCollectingLandmarks()` | `POST` | `/services/stop_collecting_landmarks` | `{}` |
| `calibrateImuBias()` | `POST` | `/services/imu/recalibrate` | `{}` |
| `probeV2xBeacons()` | `POST` | `/services/probe_v2x_beacons` | `{}` |
| `calibrateGyroScale()` | `POST` | `/services/imu/calibrate_gyro_scale` | `{}` |
| `calibrateDepthCameras()` | `POST` | `/services/calibrate_depth_cameras` | `{}` |
| `calibrateDepthCameraMasks()` | `POST` | `/services/calibrate_depth_camera_masks` | `{}` |
| `calibrateLidarYaws()` | `POST` | `/services/calibrate_lidar_yaws` | `{}` |
| `calibrateDuoLidarPoses()` | `POST` | `/services/calibrate_duo_lidar_poses` | `{}` |
| `calibrateForkliftBackwardCameras()` | `POST` | `/services/calibrate_forklift_backward_camera` | `{}` |
| `calibrateForkliftLidarPoses()` | `POST` | `/services/calibrate_forklift_lidar_poses` | `{}` |
| `shutdownDevice(target, reboot)` | `POST` | `/services/baseboard/shutdown` | `{ "target": "main_computing_unit\|main_power_supply", "reboot": true }` |
| `restartAxbot()` | `POST` | `/services/restart_service` | `{}` |
| `restartPyAxbot()` | `POST` | `/services/restart_py_axbot` | `{}` |
| `startGlobalPositioning()` | `POST` | `/services/start_global_positioning` | `{}` |
| `clearWheelErrors()` | `POST` | `/services/wheel_control/clear_errors` | `{}` |
| `clearShutdownError()` | `POST` | `/services/clear_system_down_unexpectedly` | `{}` |
| `clearSlippingError()` | `POST` | `/services/clear_slipping_error` | `{}` |
| `resetWheels()` | `POST` | `/services/wheel_control/reset_wheels` | `{}` |
| `confirmEstop()` | `POST` | `/services/confirm_estop` | `{}` |
| `resetCostmap()` | `POST` | `/services/occupancy_grid_server/reset` | `{}` |

All SDK helpers above treat HTTP `2xx` as success. Most return `boolean`; `resetCostmap()` returns the raw `Response` in the SDK so callers can inspect the payload if needed.

## Control And Safety

### Set Control Mode

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"control_mode":"auto"}' \
  "$ROBOT_API_BASE/services/wheel_control/set_control_mode"
```

Valid values are `auto`, `manual`, and `remote`.

Monitor [Wheel State](./websocket.md#wheel-state) to confirm the new mode:

```json
{
  "topic": "/wheel_state",
  "control_mode": "auto",
  "emergency_stop_pressed": false,
  "wheels_released": false
}
```

### Set Or Clear Emergency Stop

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable":true}' \
  "$ROBOT_API_BASE/services/wheel_control/set_emergency_stop"
```

`enable=true` requests an emergency stop. `enable=false` requests a resume.

### Wake The Device

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "$ROBOT_API_BASE/services/wake_up_device"
```

Use [Sensor Manager State](./websocket.md#sensor-manager-state) to observe the transition between `sleeping`, `awakening`, and `awake`.

### Clear Runtime Faults

Use the dedicated service that matches the current alert or platform state:

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/wheel_control/clear_errors"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/clear_system_down_unexpectedly"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/clear_slipping_error"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/wheel_control/reset_wheels"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/confirm_estop"
```

## Jack, Towing, And Landmark Services

### Jack Control

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/jack_up"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/jack_down"
```

Monitor [Jack State](./websocket.md#jack-state) for progress and [Robot Model](./websocket.md#robot-model) for the effective footprint after a rack is lifted.

### Towing Hook Control

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/towing_hook_lock"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/towing_hook_release"
```

### Landmark Collection

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/start_collecting_landmarks"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/stop_collecting_landmarks"
```

These services are used while preparing reflector landmarks and other localization references.

## Calibration And Recovery

### IMU Bias Calibration

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "$ROBOT_API_BASE/services/imu/recalibrate"
```

Keep the robot still on a hard, flat surface until the calibration completes. Completion is typically reported on the `/action` topic.

### Other Calibration Services

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/imu/calibrate_gyro_scale"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/calibrate_depth_cameras"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/calibrate_depth_camera_masks"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/calibrate_lidar_yaws"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/calibrate_duo_lidar_poses"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/calibrate_forklift_backward_camera"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/calibrate_forklift_lidar_poses"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/probe_v2x_beacons"
```

These endpoints are intentionally thin wrappers in the SDK. They do not define per-service response models, so operational feedback is usually consumed from WebSocket topics, alerts, or service-specific logs.

### Reset Costmap

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "$ROBOT_API_BASE/services/occupancy_grid_server/reset"
```

Use this when obstacle inflation or stale local-obstacle data needs to be cleared without restarting the stack.

## Lifecycle Services

### Shutdown Or Reboot

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"target":"main_power_supply","reboot":false}' \
  "$ROBOT_API_BASE/services/baseboard/shutdown"
```

Request body:

```ts
interface ShutdownRequest {
  target: 'main_computing_unit' | 'main_power_supply';
  reboot: boolean;
}
```

### Restart Main Services

```bash
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/restart_service"
curl -X POST -H "Content-Type: application/json" -d '{}' "$ROBOT_API_BASE/services/restart_py_axbot"
```

### Start Global Positioning

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "$ROBOT_API_BASE/services/start_global_positioning"
```

The result is published on [Global Positioning State](./websocket.md#global-positioning-state).

## Endpoints Not Wrapped By The Current SDK

The previous version of this page documented several service endpoints that are not present in the current SDK wrapper. They may still exist on some robots, but they are not SDK-backed and should be verified on the target build before use.

| Endpoint | Status |
| --- | --- |
| `/services/setup_wifi` | Present in older docs, not wrapped by current SDK |
| `/services/set_route_mode` | Present in older docs, not wrapped by current SDK |
| `/services/baseboard/power_on_lidar` | Present in older docs, not wrapped by current SDK |
| `/services/depth_camera/enable_cameras` | Present in older docs, not wrapped by current SDK |
| `/services/monitor/clear_flip_error` | Present in older docs, not wrapped by current SDK |
