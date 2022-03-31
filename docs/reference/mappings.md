# 建图 API

## 发起建图

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"continue_mapping": false}' \
  http://localhost:8000/mappings/
```

```
{
   "id":48,
   "thumbnail_url":null,
   "image_url":null,
   "grid_origin_x":0.0,
   "grid_origin_y":0.0,
   "grid_resolution":0.0,
   "url":"http://xxxx:10022/mappings/48",
   "start_time":1647520760,
   "end_time":null,
   "state":"running",
   "bag_id":null,
   "bag_url":null,
   "download_url":null
}
```

**参数**

```ts
interface MappingCreateRequest {
  // true 为增量建图：继承当前地图、当前位姿
  // false 为新建图
  continue_mapping: boolean = false;

  // undefined: 如果是新建图，则用 0, 0, 0 作为起点；如果是增量建图，则等价于 "current_pose"。
  // current_pose: 用当前定位位姿作为起点
  start_pose_type: undefined | 'current_pose';
}
```

## 结束/取消 建图

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"state": "finished"}' \
  http://localhost:8000/mappings/current
```

**参数**

```ts
interface MappingFinishRequest {
  state: 'finished' | 'cancelled'; // 结束建图或者取消建图
  new_map_only: boolean = false; // false，则保存整个地图。true，则只保存增量部分(只对增量建图有效)。
}
```

建图结束后，结果会进入建图列表中。后续可以根据建图任务的 ID，获取建图结果。

## 建图过程回显

建图过程中，使用 websocket 接收回显数据。其中最主要的两条数据是：

**位姿**

```json
{
  "topic": "/chassis/pose",
  "pos": [-0.003, -0.013],
  "ori": 1.57
}
```

**地图**

```json
{
  "topic": "/chassis/occupancy_grid",
  "stamp": 1647520941279,
  "resolution": 0.10000000149011612,
  "size": [166, 129], // 像素 size
  "origin": [-8.3, -6], // 左下角的世界坐标
  "data": "iVBORw0KGgoAAAANSUhEUgAAAKYAAACBBAAAAACqunM..." // Base64 后的 PNG
}
```

## 获取建图成果列表

```bash
curl http://localhost:8000/mappings/
```

```json
[
   {
      "id":48,
      "thumbnail_url":"http://localhost:8000/mappings/48/thumbnail",
      "image_url":"http://localhost:8000/mappings/48.png",
      "grid_origin_x":-8.050000190734863,
      "grid_origin_y":-5.650000095367432,
      "grid_resolution":0.05,
      "url":"http://localhost:8000/mappings/48",
      "start_time":1647520760,
      "end_time":1647520995,
      "state":"finished",
      "bag_id":27,
      "bag_url":"http://localhost:8000/bags/27.bag",
      "download_url":"http://localhost:8000/mappings/48/download"
   },
   {
      "id":47,
      "thumbnail_url":null,
      "image_url":null,
      "grid_origin_x":0.0,
      "grid_origin_y":0.0,
      "grid_resolution":0.0,
      "url":"http://localhost:8000/mappings/47",
      "start_time":1647494329,
      "end_time":null,
      "state":"cancelled",
      "bag_id":null,
      "bag_url":null,
      "download_url":null
   },
```

## 获取建图详情

```bash
curl http://localhost:8000/mappings/48
```

```json
{
  "id": 48,
  "thumbnail_url": "http://localhost:8000/mappings/48/thumbnail",
  "image_url": "http://localhost:8000/mappings/48.png",
  "grid_origin_x": -8.050000190734863,
  "grid_origin_y": -5.650000095367432,
  "grid_resolution": 0.05,
  "url": "http://localhost:8000/mappings/48",
  "start_time": 1647520760,
  "end_time": 1647520995,
  "state": "finished",
  "bag_id": 27,
  "bag_url": "http://localhost:8000/bags/27.bag",
  "download_url": "http://localhost:8000/mappings/48/download"
}
```
