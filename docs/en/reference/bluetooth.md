# Bluetooth API

## 连接蓝牙

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://localhost:8000/bluetooth/connect
```

**参数说明**

```ts
class BluetoothConnectRequest {
  address: string; // "00:11:22:33:FF:EE" 形式的地址
}
```

连接蓝牙后，通过 websocket 来通讯。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
> {"enable_topic": "/bluetooth/outbound" }
> {"enable_topic": "/bluetooth_state" }
< {"topic": "/bluetooth_state", "stamp": 1644835395.429, "connected_devices": ["00:11:22:33:FF:EE", ... ] }
> {"topic": "/bluetooth/inbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
< {"topic": "/bluetooth/outbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
< {"topic": "/bluetooth/outbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
< {"topic": "/bluetooth/outbound", "device_address": "00:11:22:33:FF:EE", "data": "..." }
```

- `/bluetooth_state` 用于监控连接状态。
- `/bluetooth/inbound` 用于发送命令。
- `/bluetooth/outbound` 用于接收数据。

发送和接收的数据，都是 json 再编码成字符串。

## 断开蓝牙

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://localhost:8000/bluetooth/disconnect
```

**参数说明**

```ts
class BluetoothDisconnectRequest {
  address: string; // "00:11:22:33:FF:EE" 形式的地址
}
```
