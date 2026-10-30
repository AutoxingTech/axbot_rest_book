# 系统与维护 (System & Maintenance)

管理设备本身：电源状态、时间、软件重启、错误恢复以及 ROS 内省。

## 唤醒设备 (Wake Up the Device) {#wake-up-the-device}

将机器人从睡眠状态唤醒。如果机器人已经处于唤醒状态，此命令无效。

```bash
curl -X POST http://192.168.25.25:8090/services/wake_up_device
```

监控 [传感器管理状态 (Sensor Manager State)](./websocket-system.md#sensor-manager-state) WebSocket Topic 以获取睡眠、唤醒或正在唤醒的状态。

## 重启服务 (Restart Services) {#restart-services}

重启机器人上的所有软件服务。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/restart_service
```

## 关闭或重启设备 (Shutdown or Reboot the Device) {#shutdown-or-reboot-the-device}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"target": "main_power_supply", reboot: false}' \
  http://192.168.25.25:8090/services/baseboard/shutdown
```

**参数**

```ts
class ShutdownRequest {
  target:
    | "main_computing_unit" // 仅重启或关闭主计算板。
    | "main_power_supply"; // 重启或关闭整个设备。
  reboot: boolean; // true 为重启，false 为关机。
}
```

## 校时 (Step Time) {#step-time}

如果系统时间不准确，使用此服务进行校正。

::: warning
`GET` 用于检测时间错误。请勿频繁调用。应使用 WebSocket `/alerts` Topic 监控时间错误。
:::

```bash
curl http://192.168.25.25:8090/services/step_time
```

```json
{
  "should_step": false, // 无需校时
  "message": "there is no need to make step: system time is 0.000253560 seconds fast of NTP time"
}
```

`POST` 用于校正时间。

```bash
curl -X POST http://192.168.25.25:8090/services/step_time
```

```json
{
  "message": "Step time successfully"
}
```

## 重新检查错误 (Recheck Errors) {#recheck-errors}

```
POST /services/monitor_recheck_errors
```

## 重置 USB 设备 (Reset USB Devices) {#reset-usb-devices}

重置 USB 集线器有时可以帮助恢复发生故障的硬件设备。

格式 `"1/3"` 代表设备树中的 `bus_id/dev_id`。更多信息请参见 [列出 USB 设备 (List USB Devices)](./device.md#list-usb-devices)。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"devices_to_reset": ["1/3", "8/1"]}' \
  http://192.168.25.25:8090/services/reset_usb_devices
```

## 清除“系统异常关闭”报警 (Clear "System Down Unexpectedly" Alert) {#clear-system-down-unexpectedly-alert}

![](../../reference/system-down-alert.png)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_system_down_unexpectedly
```

## 清除“距离数据全为零”错误 (Clear "Range Data All Zero" Error) {#clear-range-data-all-zero-error}

如果所有激光雷达点位返回的值均为 0，则表明激光雷达设备发生故障或失效。

此服务会临时清除相关的错误消息。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_range_data_all_zero_error
```

## 清除跌落风险警告 (Clear Fall Risk Warning) {#clear-fall-risk-warning}

```bash
curl -X POST http://192.168.25.25:8090/services/clear_fall_risk_warning
```

## Topic List (主题列表) {#topic-list}

列出当前所有已发布的 ROS 主题，包含类型、发布者数量和订阅者数量。直接查询 ROS master。

### 路由 (Route)

```text
GET /ros/rosmaster/topics
```

### 请求 (Request)

无参数，无请求体。

### 响应 (Response)

`ros_messages.TopicListResponse` — 包含重复的 `TopicInfo`（`name`、`type`、`publisher_count`、`subscriber_count`）。仅包含至少有一个发布者的主题。

参见 [`topics.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/topics.proto)。

### 缓存行为 (Cache behavior)

`Cache-Control: no-cache` — 主题状态是动态的；无 ETag。

### 示例 (Example)

```bash
# protobuf（默认）
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

## Published Topic Names (已发布主题名称) {#published-topic-names}

返回至少有一个发布者的主题名称列表。

### 路由 (Route)

```text
GET /ros/rosmaster/topics/published_names
```

### 请求 (Request)

无参数，无请求体。

### 响应 (Response)

`ros_messages.PublishedTopicNamesResponse` — 包含重复的 `names` 字段。

参见 [`topics.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/topics.proto)。

### 缓存行为 (Cache behavior)

`Cache-Control: no-cache` — 主题状态是动态的。

### 示例 (Example)

```bash
# protobuf（默认）
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
