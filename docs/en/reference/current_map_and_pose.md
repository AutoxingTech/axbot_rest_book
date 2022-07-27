# Current Map and Pose API

## 设置当前地图

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"map_id": 286}' \
  http://localhost:8000/chassis/current-map
```

**参数说明**

```ts
class SetCurrentMapRequest {
  map_id: number;
}
```

## 获取当前地图

```bash
curl http://localhost:8000/chassis/current-map
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

`id`，对应 `/maps` [地图列表](./maps.md#获取地图列表)中的数据。

可以通过监控 websocket `/map/info` 获得地图切换通知。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
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

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"position": [0, 0, 0], "ori": 1.57}' \
  http://localhost:8000/chassis/pose
```

**参数说明**

```ts
class SetPoseRequest {
  position: [number, number, number]; // 坐标 x, y, z。 z永远为0。
  ori: number; // 位姿朝向。弧度。地图的右边是 ori=0。逆时针旋转。
}
```

## 位姿反馈

可以通过监控 websocket `/tracked_pose` 获得位姿变化通知。

```bash
$ wscat -c ws://localhost:8000/ws/v2/topics
> {"enable_topic": "/tracked_pose"}
< {"topic": "/tracked_pose", "pos": [-3.553, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
```
