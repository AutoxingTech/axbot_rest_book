# 当前地图和位姿 API

## 设置当前地图

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"map_id": 286}' \
  http://localhost:8000/chassis/current_map
```

**参数说明**

```ts
class SetCurrentMapRequest {
  map_id: number;
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
