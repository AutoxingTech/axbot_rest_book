# 当前地图与位姿 API

## 设置当前地图

有几种方式可以设置当前地图：

- 使用 `map_id` 或 `map_uid`。
- 直接提供地图数据（自 2.7.0 版本起可用）。
- 从本地文件加载（自 2.11.0 版本起可用）。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"map_id": 286}' \
  http://192.168.25.25:8090/chassis/current-map
```

**请求参数**

```ts
class SetCurrentMapRequest {
  map_id?: number; // 必须提供 'map_id' 或 'map_uid' 之一。

  // 自 2.5.2 版本起可用。地图可以通过其 "uid" 标识。
  // 在早期版本中，仅支持 'map_id'。
  map_uid?: string;
}
```

### 使用数据设置当前地图

从 2.7.0 版本起，您可以使用以下 `POST` 请求直接设置当前地图。
**注意：** 对于大地图，此方法可能会非常缓慢。

```ts
class SetCurrentMapWithDataRequest {
  map_name: string;
  occupancy_grid: string; // Base64 编码的 PNG 图像。
  carto_map: string; // 二进制地图数据。
  grid_resolution: number; // 例如：0.05
  grid_origin_x: number; // PNG 地图左下角的 X 坐标。
  grid_origin_y: number; // PNG 地图左下角的 Y 坐标。
  overlays: string; // 请参阅关于叠加层 (overlays) 的文档。
}
```

### 通过加载本地文件设置当前地图

从 2.11.0 版本起，可以直接从机器人上的本地文件加载当前地图。

```bash
curl -X POST http://localhost:8090/chassis/current-map \
  -H "Content-Type: application/json"
  --data '{"data_url":"file:///home/simba/tmp_map/map_73.pbstream", "map_name": "xxx"}'
```

需要以下三个文件：

```
/home/simba/tmp_map/map_73.pbstream
/home/simba/tmp_map/map_73.png
/home/simba/tmp_map/map_73.yaml
```

YAML 文件应包含以下结构：

```yaml
uid: 62202f9fed0883652d08ad5c
grid_origin_x: -5.900000095367432
grid_origin_y: -9.199999809265137
grid_resolution: 0.05
map_version: 3
overlays_version: 1
overlays: { "map_uid": "62202f9fed0883652d08ad5c", "features": [] }
```

## 获取当前地图

```bash
curl http://192.168.25.25:8090/chassis/current-map
```

```json
{
  "id": 287,
  "uid": "62202f9fed0883652d08ad5c",
  "map_name": "26层",
  "create_time": 1647862075,
  "map_version": 15,
  "overlays_version": 25
}
```

`id` 对应于[地图列表](./maps.md#map-list)中的条目。
如果当前地图是直接通过数据设置的，则 `id` 将为 `-1`。

锁存型 (latched) WebSocket 话题 `/map/info` 包含当前活动地图的信息。
每当当前地图发生变化时，该话题都会广播一条新消息。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/map/info"}
< {
  "topic": "/map/info",
  "name": "26层",
  "uid": "62202f9fed0883652d08ad5c",
  "map_version": 15,
  "overlays_version": 25,
  "overlays": {...}
}
```

## 设置位姿

在当前地图上设置机器人的位姿（位置和朝向）。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"position": [0, 0, 0], "ori": 1.57}' \
  http://192.168.25.25:8090/chassis/pose
```

**请求参数**

```ts
class SetPoseRequest {
  position: [number, number, number]; // 坐标 [x, y, z]。注意 `z` 始终为 0。
  ori: number; // 机器人的航向（弧度），逆时针测量。0 值对应于 X 轴正方向。

  // [可选]
  // 如果为 true，系统将尝试在较小区域内纠正初始位置误差。
  // 如果为 false，系统将不尝试任何纠正。
  // 如果未提供，其行为未定义，可能会根据软件版本、环境和全局设置而变化。
  adjust_position?: boolean;
}
```

当 `adjust_position` 设置为 `true` 时，系统会根据激光雷达 (Lidar) 的观测值检测并纠正初始位置误差。
例如，如果机器人的航向被错误分配，系统将尽力纠正它。

<!-- prettier-ignore -->
| 纠正前                       | 纠正后                      |
| ---------------------------- | --------------------------- |
| ![](../../reference/correction-before.png) | ![](../../reference/correction-after.png) |

:::warning 注意
纠正算法偶尔会被环境的变化所误导。
因此，如果您确定初始位姿是正确的——特别是在可能存在误导性特征的环境中——请确保将 `adjust_position` 设置为 `false`。
:::

## 位姿反馈

锁存型 (latched) WebSocket 话题 `/tracked_pose` 提供最新的机器人位姿。

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/tracked_pose", "pos": [-3.553, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
```
