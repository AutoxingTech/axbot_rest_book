# 机器人参数 (Robot Parameters) API

:::warning 警告
已废弃：请改用[系统设置](./system_settings.md)。
:::

## 获取参数

```bash
curl http://192.168.25.25:8090/robot-params
```

```json
{
  "/wheel_control/max_forward_velocity": 0.8,
  "/wheel_control/max_backward_velocity": -0.2,
  "/wheel_control/max_forward_acc": 0.26,
  "/wheel_control/max_forward_decel": -2.0,
  "/wheel_control/max_angular_velocity": 0.78,
  "/wheel_control/acc_smoother/smooth_level": "normal", // 自 2.7.0 版本起可用。选项："disabled", "lower", "normal", "higher"。
  "/planning/auto_hold": true, // 自 2.3.0 版本起可用。
  "/control/bump_tolerance": 0.5, // 自 2.4.0 版本起可用。
  "/control/bump_based_speed_limit/enable": true, // 自 2.7.4 版本起可用。
  "/robot/footprint": [[0.248, 0.108], [0.24, 0.174], "...", [0.248, -0.108]] // 自 2.5.0 版本起可用。
}
```

`/planning/auto_hold` 参数决定了机器人在空闲时车轮是锁定还是自由状态。
当 `auto_hold` 被禁用且机器人没有执行任务时，可以自由推行或拖动机器人。
这对于手动调整机器人航向或将其定位以装载货物非常有用。
但是，如果机器人在陡坡上，出于安全考虑，即使禁用了 `auto_hold`，车轮也将保持锁定状态。

`/control/bump_based_speed_limit/enable` 参数决定机器人是否利用检测到的颠簸程度自动减速。
`/control/bump_tolerance` 参数设置机器人对颠簸的敏感度。
其值范围从 0 到 1，0.5 为中性设置。
当检测到的颠簸超过公差级别时，机器人将减速。
系统还会学习地图上的门槛和其他颠簸区域的位置，从而允许机器人提前减速。
较大的值会降低机器人对颠簸的敏感度。
较小的值会导致机器人移动得更加谨慎（遇到门槛和不平整表面时减速更多）。

## 设置参数

可以在单个请求中更新多个参数。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"/wheel_control/max_forward_velocity": 1.2, "/control/bump_tolerance": 0.5}' \
  http://192.168.25.25:8090/robot-params
```

## 获取默认参数

```bash
curl http://192.168.25.25:8090/robot-params/default # 自 2.7.6 版本起可用。
```

## 机器人轮廓 (Robot Footprint)

`/robot/footprint` 参数应准确代表机器人的俯视轮廓。
此轮廓用于碰撞检测，必须正确配置以确保安全运行。
轮廓数据必须遵循以下规则：

1. 原点 (0,0) 必须是机器人的旋转中心。
2. X 轴指向机器人右侧，Y 轴指向机器人前方。
3. 多边形**必须是凸多边形 (CONVEX)**。
4. 多边形不应闭合（即，第一个点不应作为最后一个点重复出现）。

![](../../reference/footprint.png)

从 2.7.0 版本起，您可以使用 [Robot Model Topic (机器人模型话题)](../reference/websocket.md#robot-model) 监控轮廓的实时变化。例如，当挂载货架时，轮廓会自动更新为机器人和货架的合并凸包。
