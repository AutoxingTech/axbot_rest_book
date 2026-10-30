# 定位 (Localization)

机器人在哪里：SLAM 状态、位姿、全局定位结果，以及用于锚定的条码和地标。

## 定位状态 (Positioning State) {#positioning-state}

```json
{
  "topic": "/slam/state",

  // inactive: 空闲。未在建图，且未设置地图。
  // slam: 正在建图。
  // positioning: 已设置地图，机器人处于定位状态。
  "state": "positioning",

  "nav_sat_state": "no_fix", // 自 3.14 起。no_fix, sat_base 或 rtk_fixed

  "reliable": true, // false 表示位置丢失。

  // "lidar_reliable = False" 表示新创建的观测值（子图）与当前静态地图之间不存在约束。
  //
  // 位置丢失的步骤如下：
  // 1. 不存在约束（在新观测值与静态地图之间）；"lidar_reliable" 变为 false。
  // 2. 机器人进入纯死推（Dead-reckoning）模式，"position_loss_progress" 开始增加。
  // 3. 移动一段距离后，如果创建了新约束，"lidar_reliable" 变为 true。
  //    然而，如果 "position_loss_progress" 达到 1.0，"reliable" 也会变为 false。
  "lidar_reliable": false, // 自 2.11.0-rc18 起
  "position_loss_progress": 0.35, // 自 2.11.0-rc18 起。仅在 lidar_reliable = false 时存在。

  // 定位质量（实验性）。
  //
  // 仅在定位状态下有效。
  // 自 2.3.0 起。
  //  0 - 未知 (unknown)
  //  1 - 丢失 (lost)
  //  3 - 差 (poor)
  //  8 - 好 (good)
  // 10 - 极好 (excellent)
  "position_quality": 10,

  // 当前激光雷达点云与静态地图的匹配程度。
  "lidar_matching_score": 0.545,

  // 其他调试标志。
  "lidar_matched": true,
  "wheel_slipping": false,
  "inter_constraint_count": 27,
  "good_constraint_count": 27
}
```

## 当前位姿 (Current Pose) {#current-pose}

世界坐标系下的当前位姿。

```json
{
  "topic": "/tracked_pose",
  "pos": [3.7325, -10.8525],
  "ori": -1.56 // 朝向。正 X 轴为 0，正 Y 轴为 pi/2。
}
```

## 全局定位状态 (Global Positioning State) {#global-positioning-state}

来自 `POST /services/start_global_positioning` 服务的反馈。

```json
{
  "topic": "/global_positioning_state",
  "state": "succeeded",
  "score": "82.1",

  // 如果为 false，则位姿在全局是唯一的且可信。
  // 如果为 true，则环境匹配度不高，
  // 或者位姿在全局不是唯一的，应由人工操作员验证。
  //
  // 如果结果来自成功的 barcode 匹配，
  // `needs_confirmation` 始终为 true。
  "needs_confirmation": false,
  "pose": { "pos": [0.32, 0.97], "ori": 0.0 }, // 物体的位置和朝向。
  "message": "Succeeded with barcode R25B13_7"
}
```

## 收集的 Barcode (Collected Barcode) {#collected-barcode}

此 Topic 用于收集 barcode。这是一个 latched topic（常驻话题），只要机器人运行中，就会持续监测。
如果没有检测到，status 为 no_result；如果检测到且能准确识别，status 为 ok。
如果检测到，但目标太远或角度不佳，会返回 too_far、unaligned_with_robot 等状态。

```json
{
  "topic": "/collected_barcode",
  "state": "unknown|ok|no_result|not_unique|too_far|unaligned_with_robot",
  "barcode": {
    "id": "D2_125",

    // barcode 的全局位姿，定义为其物理中心。
    // 必须已设置地图和位姿，才会返回全局位姿。
    "pose": { "pos": [-14.842, 17.595], "ori": -1.457 },

    // 自 2.9.1 起
    // 仅在机器人不移动时准确
    "relative_pose": { "pos": [-1.992, -0.092], "ori": -0.312 }
  }
}
```

如果要将收集到的 barcode 用于全局定位或精准对接，需要将其添加到地图的 `overlays` 中。参见 [overlays](./overlays.md#barcode)。添加后即可通过 [`start_global_positioning`](./services-localization.md#start-global-positioning) 使用。

## 地标 (Landmarks) {#landmarks}

自 2.11.0 起

此 Topic 用于可视化在建图过程中识别到的[地标](./landmarks.md)。

```json
{
  "topic": "/landmarks",
  "landmarks": [
    {
      "id": "landmark_1",
      "pos": [0.32, 0.97],
      "in_use": true
    }
  ]
}
```
