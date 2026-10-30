# 货物搬运 (Cargo Handling)

操作顶升、辊道、牵引钩和货物装卸机构。

## 顶升设备上、下、自检 (Jack Device Up, Down, Self-Check) {#jack-device-up-down-self-check}

升高或降低顶升设备。顶升设备的状态可以通过 WebSocket [顶升状态 (Jack State)](./websocket-cargo.md#jack-state) 获取。

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

## 清除顶升错误 (Clear Jack Errors) {#clear-jack-errors}

如果顶升设备过载，它将报告错误。

发生这种情况时，大多数顶升型号仍可接受新命令。然而，一些罕见的型号要求在接受进一步命令之前手动清除错误。

```bash
curl -X POST http://192.168.25.25:8090/services/clear_jack_errors
```

## 用辊道装卸货物 (Load/Unload Cargo with Roller) {#load-unload-cargo-with-roller}

自 2.9.0 起。

辊道的状态通过 WebSocket [辊道状态 (Roller State)](./websocket-cargo.md#roller-state) 获取。

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

## 装卸货物 (Load/Unload Cargo) {#load-unload-cargo}

触发通过机器人的货物搬运机构进行货物的装载或卸载。

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

## 牵引钩锁定 (Towing Hook Lock) {#towing-hook-lock}

锁定牵引钩以固定挂载的挂车。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/towing_hook_lock
```

## 牵引钩释放 (Towing Hook Release) {#towing-hook-release}

释放牵引钩以卸下挂载的挂车。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/towing_hook_release
```

## 清除牵引钩错误 (Clear Towing Hook Error) {#clear-towing-hook-error}

清除由牵引钩设备报告的错误。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/clear_towing_hook_error
```

## 启动货架尺寸检测 (Start Rack Size Detection) {#start-rack-size-detection}

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/start_rack_size_detection

curl -X POST \
  -H "Content-Type: application/json" \
  http://192.168.25.25:8090/services/stop_rack_size_detection
```

使用机器人的激光扫描仪检测货架的宽度和深度。

:::warning
通常参考货架的技术规格或使用尺子手动测量更为准确。仅在最后手段时使用此服务。
:::

使用步骤：

1. 将机器人正对着货架停放。
2. 调用 `/start_rack_size_detection`。
3. 订阅 [/detected_rack WebSocket Topic](./websocket-cargo.md#detected-rack)。
4. 缓慢将机器人推入货架下方。
5. 成功检测后，停止推动并记录货架尺寸。
6. 在 [系统设置 (system settings)](./system_settings.md#rack-specs) 中输入宽度和深度。
