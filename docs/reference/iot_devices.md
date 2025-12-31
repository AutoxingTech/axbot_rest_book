# IoT Devices

The robot can communicate with automatic doors, elevators, and gateways using two protocols: 
[ESP-NOW](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_now.html) or BLE.

We recommend using ESP-NOW, as it enables connectionless communication between dozens of devices and typically offers better signal strength than BLE.

## Automatic Doors and Gateways

Automatic doors and gateways are functionally identical from the robot's perspective; the robot can trigger them to open automatically during navigation.

A hardware controller must be installed on the door to enable communication with nearby robots.
Each controller is identified by a MAC address. The door's MAC address and its physical location (modeled as a polygon) must be specified in the map's [`overlay` field](../reference/overlays.md#auto-door).

Using this information, the robot interacts with the door as follows:

* **From the robot side:**
  * The robot continuously checks if its [global path](../reference/websocket.md#global-path) intersects with an automatic door's polygon.
  * If a door is detected on the path ahead, the robot broadcasts an `Open Door {MAC} for {ROBOT SN}` command at regular intervals.
  * If the door reports its state as 'open', the robot proceeds. Otherwise, the door's polygon is treated as an impassable obstacle.
  * Once the robot has successfully passed through, it stops sending the open-door request.
* **From the door side:**
  * The door periodically broadcasts its status (open, closed, opening, or closing) and an Estimated Time of Closing (ETC). Examples include:
    * `Door {MAC} is closed`
    * `Door {MAC} is opening`
    * `Door {MAC} is open, ETC in 3 seconds`    
    * `Door {MAC} is closing`
  * If the door controller receives an open-door command, it triggers the door to open.
  * If no open-door commands are received for three seconds, the door will automatically close.

::: tip
The status of nearby automatic doors can be monitored via the [Nearby Auto Doors](../reference/websocket.md#nearby-auto-doors) WebSocket topic.
:::

## Bluetooth API

Unlike ESP-NOW devices, the robot does not interact with Bluetooth-based IoT devices directly.
Instead, the Bluetooth APIs facilitate the establishment of a communication channel.
This allows the user and the device to communicate using their own predefined protocol.

### Connect to a Bluetooth Device

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://192.168.25.25:8090/bluetooth/connect
```

**Parameters**

```ts
class BluetoothConnectRequest {
  address: string; // The MAC address of the device (e.g., "00:11:22:33:FF:EE").
}
```

Once the Bluetooth connection is established, use WebSockets to communicate with the device.

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

- `/bluetooth_state`: The current Bluetooth connection state.
- `/bluetooth/inbound`: Sends data from the robot to the connected BLE device.
- `/bluetooth/outbound`: Data received from the BLE device.

### Disconnect from a Bluetooth Device

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"address": "00:11:22:33:FF:EE"}' \
  http://192.168.25.25:8090/bluetooth/disconnect
```

**Parameters**

```ts
class BluetoothDisconnectRequest {
  address: string; // The MAC address of the device (e.g., "00:11:22:33:FF:EE").
}
```
