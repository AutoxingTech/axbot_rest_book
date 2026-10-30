# System & Maintenance

Manage the device itself: power state, time, software restarts, error recovery, and ROS introspection.

## Wake Up the Device {#wake-up-the-device}

Wakes the robot from its sleep state. If the robot is already awake, this command has no effect.

```bash
curl -X POST http://192.168.25.25:8090/services/wake_up_device
```

Monitor the [Sensor Manager State](./websocket-system.md#sensor-manager-state) WebSocket topic for sleep, awake, or awakening status.

## Restart Services {#restart-services}

Restarts all software services on the robot.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/restart_service
```

## Shutdown or Reboot the Device {#shutdown-or-reboot-the-device}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"target": "main_power_supply", reboot: false}' \
  http://192.168.25.25:8090/services/baseboard/shutdown
```

**Parameters**

```ts
class ShutdownRequest {
  target:
    | "main_computing_unit" // Reboot or shutdown only the main computing board.
    | "main_power_supply"; // Reboot or shutdown the entire device.
  reboot: boolean; // true to reboot, false to shutdown.
}
```

## Step Time {#step-time}

Use this service to correct the system time if it is inaccurate.

::: warning
`GET` is used to detect time errors. Do not call it frequently. Use the WebSocket `/alerts` topic instead to monitor time errors.
:::

```bash
curl http://192.168.25.25:8090/services/step_time
```

```json
{
  "should_step": false, // No need to correct time
  "message": "there is no need to make step: system time is 0.000253560 seconds fast of NTP time"
}
```

`POST` is used to correct the time.

```bash
curl -X POST http://192.168.25.25:8090/services/step_time
```

```json
{
  "message": "Step time successfully"
}
```

## Recheck Errors {#recheck-errors}

```
POST /services/monitor_recheck_errors
```

## Reset USB Devices {#reset-usb-devices}

Resetting the USB hub can sometimes help recover malfunctioning hardware devices.

The format `"1/3"` represents the `bus_id/dev_id` in the device tree. For more information, see [List USB Devices](./device.md#list-usb-devices).

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"devices_to_reset": ["1/3", "8/1"]}' \
  http://192.168.25.25:8090/services/reset_usb_devices
```

## Clear "System Down Unexpectedly" Alert {#clear-system-down-unexpectedly-alert}

![](./system-down-alert.png)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_system_down_unexpectedly
```

## Clear "Range Data All Zero" Error {#clear-range-data-all-zero-error}

If all Lidar points return a value of 0, it indicates that the Lidar device is malfunctioning or failing.

This service temporarily clears the associated error message.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_range_data_all_zero_error
```

## Clear Fall Risk Warning {#clear-fall-risk-warning}

```bash
curl -X POST http://192.168.25.25:8090/services/clear_fall_risk_warning
```

## Topic List {#topic-list}

Lists all currently published ROS topics with type, publisher count, and subscriber count. Queries the ROS master directly.

### Route

```text
GET /ros/rosmaster/topics
```

### Request

No parameters, no request body.

### Response

`ros_messages.TopicListResponse` — repeated `TopicInfo` (`name`, `type`, `publisher_count`, `subscriber_count`). Only topics with at least one publisher are included.

See [`topics.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/topics.proto).

### Cache behavior

`Cache-Control: no-cache` — topic state is dynamic; no ETags.

### Example

```bash
# protobuf (default)
curl http://192.168.25.25:8090/ros/rosmaster/topics | protoc --decode_raw

# JSON
curl -H "Accept: application/json" \
  http://192.168.25.25:8090/ros/rosmaster/topics | jq .
```

```json
{
  "topics": [
    {
      "name": "/tf",
      "type": "tf2_msgs/TFMessage",
      "publisher_count": 1,
      "subscriber_count": 3
    }
  ]
}
```

---

## Published Topic Names {#published-topic-names}

Returns only the names of topics that have at least one publisher.

### Route

```text
GET /ros/rosmaster/topics/published_names
```

### Request

No parameters, no request body.

### Response

`ros_messages.PublishedTopicNamesResponse` — repeated `names` fields.

See [`topics.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/topics.proto).

### Cache behavior

`Cache-Control: no-cache` — topic state is dynamic.

### Example

```bash
# protobuf (default)
curl http://192.168.25.25:8090/ros/rosmaster/topics/published_names | protoc --decode_raw

# JSON
curl -H "Accept: application/json" \
  http://192.168.25.25:8090/ros/rosmaster/topics/published_names | jq .
```

```json
{
  "names": ["/tf", "/scan", "/odom"]
}
```

---
