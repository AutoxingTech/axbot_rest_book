# Lidar 陆标 (Landmarks)

自 2.11.0 版本起可用。

在仓库等货物频繁移动的环境中，货架腿往往是唯一稳定的特征。在这些情况下，可以使用激光雷达 (Lidar) 陆标来增强和稳定定位。

这些陆标通常由反光材料制成，并附着在稳定的结构上（如货架腿）。各种供应商也提供现成的反光圆柱体。

![](../../reference/landmarks.png)

使用陆标的过程如下：

## 部署陆标

- 将陆标附着在永久性结构上，例如墙角或货架腿。
- 相邻陆标应至少间隔 1 米，建议密度为每 10 到 50 米设置一个陆标。

## 采集陆标

采集陆标主要有两种方法：

- **在进行新地图建图任务期间：**
  1. 像往常一样开始建图过程。
     - **可选：** 您可以通过 [`/landmarks`](../reference/websocket.md#landmarks) WebSocket 通道实时预览采集到的陆标。
  2. 完成建图任务。
     - 最终的陆标集合可以通过[建图结果详情](../reference/mappings.md#mapping-detail)中的 `landmark_url` 访问。
- **对于现有地图：**
  1.  使用[采集陆标 (Collect Landmarks)](./services.md#collect-landmarks) 服务。

采集到的陆标不会被直接使用；相反，它们作为原始数据导入到地图的叠加层 (overlays) 中。将陆标保存到叠加层中。更多信息请参阅[叠加层中的陆标](../reference/overlays.md#landmarks)。

## 使用陆标定位

一旦在叠加层中定义了陆标，系统会自动使用它们来增强机器人的定位。

**可选：** 当前正用于定位的活动陆标可以通过 `/constraint_list` WebSocket 通道进行监控。
