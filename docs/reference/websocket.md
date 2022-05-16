# Websocket 频道参考

## `/wheel_state`

```json
{
  "topic": "/wheel_state",
  "control_mode": "auto", // auto/remote/manual，对应自动、手推、远控
  "emergency_stop_pressed": true // 急停是否按下
}
```

## `/vision_detected_objects`

::: warning
还在开发中。
:::

```json
{
  "topic": "/vision_detected_objects",
  "boxes": [
    {
      "pose": { "pos": [0.32, 0.97], "ori": 0.0 }, // 物体的位置和朝向
      "dimensions": [0.0, 0.0, 0.0], // 物体的宽、长、高
      "value": 0.8005573153495789,
      "label": 1 // 物体类型 1 - 人
    },
    {
      "pose": { "pos": [0.63, 1.08], "ori": 0.0 },
      "dimensions": [0.0, 0.0, 0.0],
      "value": 0.5348057150840759,
      "label": 1
    },
    {
      "pose": { "pos": [0.51, 0.74], "ori": 0.0 },
      "dimensions": [0.0, 0.0, 0.0],
      "value": 0.41888049244880676,
      "label": 1
    }
  ]
}
```
