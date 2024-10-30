# IoT Devices

The robot can talk to auto-doors, elevators, gateways in two protocols: 
[ESP-NOW](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_now.html) or BLE.

It's recommended to use ESP-NOW. Because it allows connection-less communication between dozens of devices
and the signal strength is higher than that of the BLE.

## Auto Door and Gateway

Auto door and gateway are essentially the same device. A robot can open them automatically when it moves.

A hardware controller must be installed so the door can talk to nearby robots.
Each controller has a MAC address. In the [`overlay` field](../reference/overlays.md#auto-door) of the map, the MAC address and whereabouts of the door (modeled as a polygon) should be provided.

With this information, here is how the robots talk to a door:

* From the robot side:
  * The robot check whether it will go through an auto-door very soon, by detecting whether the [global path](../reference/websocket.md#global-path) ahead crosses the polygon of a auto-door.
  * If a door is on the global path ahead, the robot will broadcast `Open Door {MAC} for {ROBOT SN}` at regular interval.
  * If the door's state is 'open', it will be able to pass it. Otherwise, the polygon of the door become impassable.
  * When the robot has passed the door, it will stop requesting it.
* From the door side:
  * The door broadcasts its status(open/closed/opening/closing) and ETC(estimated time of closeing) at regular interval. Examples are:
    * `Door {MAC} is closed`
    * `Door {MAC} is opening`
    * `Door {MAC} is open, ETC in 3 seconds`    
    * `Door {MAC} is closing`
  * If it recreives any open-door command, it will open the door.
  * If no open-door command is received for 3 seconds, it will close the door.

::: tip
The nearby auto-doors and theirs states can be visualized with Websocket [Nearby Auto Doors](../reference/websocket.md#nearby-auto-doors)
:::

## Bluetooth API

Unlike ESP-NOW IoT devices, the robot can't operate Bluetooth based IoT devices directly.
The Bluetooth APIs only help establishing a communication channel.
So that the user and the device can talk in their predefined protocol.

### Connect Bluetooth

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://192.168.25.25:8090/bluetooth/connect
```

**Parameters**

```ts
class BluetoothConnectRequest {
  address: string; // address, in form of "00:11:22:33:FF:EE"
}
```

When bluetooth is connected. Use Websocket to communicate with device.

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

- `/bluetooth_state` The bluetooth connection state
- `/bluetooth/inbound` Send data from the robot to connected BLE device.
- `/bluetooth/outbound` The data received from BLE device.

### Disconnect

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://192.168.25.25:8090/bluetooth/disconnect
```

**Parameters**

```ts
class BluetoothDisconnectRequest {
  address: string; // Mac address, in form of "00:11:22:33:FF:EE"
}
```
