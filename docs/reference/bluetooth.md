# Bluetooth API

Currently, bluetooth APIs only help establishing a communication channel.
Then the user and the device will talk in their predefined protocol.

## Connect Bluetooth

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://localhost:8000/bluetooth/connect
```

**Parameters**

```ts
class BluetoothConnectRequest {
  address: string; // address, in form of "00:11:22:33:FF:EE"
}
```

When bluetooth is connected. Use Websocket to communicate with device.

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

- `/bluetooth_state` The bluetooth connection state
- `/bluetooth/inbound` For sending data to robot
- `/bluetooth/outbound` For receiving data from robot

## Disconnect

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://localhost:8000/bluetooth/disconnect
```

**Parameters**

```ts
class BluetoothDisconnectRequest {
  address: string; // Mac address, in form of "00:11:22:33:FF:EE"
}
```
