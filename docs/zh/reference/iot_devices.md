# 物联网 (IoT) 设备

机器人可以使用两种协议与自动门、电梯和网关进行通信：
[ESP-NOW](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/api-reference/network/esp_now.html) 或 BLE (蓝牙低功耗)。

我们建议使用 ESP-NOW，因为它可以在数十个设备之间实现无连接通信，并且通常比 BLE 提供更好的信号强度。

## 自动门与网关

从机器人的角度来看，自动门和网关在功能上是完全相同的；机器人在导航过程中可以触发它们自动开启。

必须在门上安装硬件控制器，以便与附近的机器人进行通信。
每个控制器由一个 MAC 地址标识。门的 MAC 地址及其物理位置（建模为多边形）必须在地图的 [`overlay` (叠加层) 字段](../reference/overlays.md#auto-door)中指定。

利用这些信息，机器人与门的交互如下：

* **机器人端：**
  * 机器人持续检查其[全局路径](../reference/websocket.md#global-path)是否与自动门的多边形相交。
  * 如果在前方路径上检测到门，机器人会定期广播 `Open Door {MAC} for {ROBOT SN}` (为某 SN 机器人开启某 MAC 地址的门) 命令。
  * 如果门报告其状态为“开启” (open)，机器人则继续前进。否则，门的多边形将被视为不可通过的障碍物。
  * 机器人成功通过后，将停止发送开门请求。
* **门端：**
  * 门会定期广播其状态（开启、关闭、正在开启或正在关闭）以及预计关闭时间 (ETC)。示例包括：
    * `Door {MAC} is closed` (门已关闭)
    * `Door {MAC} is opening` (门正在开启)
    * `Door {MAC} is open, ETC in 3 seconds` (门已开启，3 秒后关闭)
    * `Door {MAC} is closing` (门正在关闭)
  * 如果门控制器收到开门命令，它会触发门开启。
  * 如果连续三秒未收到开门命令，门将自动关闭。

::: tip 提示
附近自动门的状态可以通过 [Nearby Auto Doors (附近自动门)](../reference/websocket.md#nearby-auto-doors) WebSocket 话题进行监控。
:::

## 蓝牙 API

与 ESP-NOW 设备不同，机器人不会直接与基于蓝牙的物联网设备交互。
相反，蓝牙 API 旨在促进通信通道的建立。
这允许用户和设备使用他们自己定义的协议进行通信。

### 连接到蓝牙设备

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://192.168.25.25:8090/bluetooth/connect
```

**参数**

```ts
class BluetoothConnectRequest {
  address: string; // 设备的 MAC 地址 (例如："00:11:22:33:FF:EE")。
}
```

蓝牙连接建立后，使用 WebSockets 与设备通信。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/bluetooth/outbound" }
> {"enable_topic": "/bluetooth_state" }
< {"topic": "/bluetooth_state", "stamp": 1644835395.429, "connected_devices": ["00:11:22:33:FF:EE", ... ] }
> {"topic": "/bluetooth/inbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
< {"topic": "/bluetooth/outbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
< {"topic": "/bluetooth/outbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
< {"topic": "/bluetooth/outbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
```

- `/bluetooth_state`: 当前蓝牙连接状态。
- `/bluetooth/inbound`: 将数据从机器人发送到连接的 BLE 设备。
- `/bluetooth/outbound`: 从 BLE 设备接收到的数据。

### 断开蓝牙设备连接

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://192.168.25.25:8090/bluetooth/disconnect
```

**参数**

```ts
class BluetoothDisconnectRequest {
  address: string; // 设备的 MAC 地址 (例如："00:11:22:33:FF:EE")。
}
```
