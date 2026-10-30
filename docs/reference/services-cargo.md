# Cargo Handling

Operate the jack, roller, towing hook, and cargo-loading mechanisms.

## Jack Device Up, Down, Self-Check {#jack-device-up-down-self-check}

Raise or lower the jack device. The state of the jack device is available via the WebSocket [Jack State](./websocket-cargo.md#jack-state).

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/jack_up
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/jack_down
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/jack_self_check
```

## Clear Jack Errors {#clear-jack-errors}

The jack device will report an error if it becomes overloaded.

When this occurs, most jack models can still accept new commands. However, some rare models require errors to be cleared manually before they will accept further commands.

```bash
curl -X POST http://192.168.25.25:8090/services/clear_jack_errors
```

## Load/Unload Cargo with Roller {#load-unload-cargo-with-roller}

Since 2.9.0.

The state of the roller is available via the WebSocket [Roller State](./websocket-cargo.md#roller-state).

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/roller_load
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/roller_unload
```

## Load/Unload Cargo {#load-unload-cargo}

Triggers loading or unloading of cargo via the robot's cargo handling mechanism.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/load_cargo
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/unload_cargo
```

## Towing Hook Lock {#towing-hook-lock}

Locks the towing hook to secure an attached trailer.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/towing_hook_lock
```

## Towing Hook Release {#towing-hook-release}

Releases the towing hook to detach an attached trailer.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/towing_hook_release
```

## Clear Towing Hook Error {#clear-towing-hook-error}

Clears an error reported by the towing hook device.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_towing_hook_error
```

## Start Rack Size Detection {#start-rack-size-detection}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/start_rack_size_detection

curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/stop_rack_size_detection
```

Detect the width and depth of a rack using the robot's laser scanner.

:::warning
It is generally more accurate to refer to the rack's technical specifications or measure it manually with a ruler. Use this service only as a last resort.
:::

Steps to use:

1. Position the robot directly in front of the rack.
2. Call `/start_rack_size_detection`.
3. Subscribe to the [/detected_rack WebSocket topic](./websocket-cargo.md#detected-rack).
4. Slowly push the robot under the rack.
5. Once successfully detected, stop pushing and record the rack dimensions.
6. Enter the width and depth into the [system settings](./system_settings.md#rack-specs).
