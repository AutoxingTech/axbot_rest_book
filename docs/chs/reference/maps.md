# 地图 API

## 获取地图列表

```bash
curl http://localhost:8000/maps/
```

```json
[
  {
    "id": 1,
    "uid": "620620f9c0fd0ecb0f66d981",
    "map_name": "5层地图",
    "create_time": 1644568815,
    "map_version": 9,
    "overlays_version": 14,
    "thumbnail_url": "http://localhost:8000/maps/1/thumbnail",
    "image_url": "http://localhost:8000/maps/1.png",
    "url": "http://localhost:8000/maps/1"
  },
  {
    "id": 2,
    "uid": "61ee4c3ac0fd0ecb0f66d165",
    "map_name": "前台大厅",
    "create_time": 1643007028,
    "map_version": 2,
    "overlays_version": 8,
    "thumbnail_url": "http://localhost:8000/maps/2/thumbnail",
    "image_url": "http://localhost:8000/maps/2.png",
    "url": "http://localhost:8000/maps/2"
  },
  {
    "id": 3,
    "uid": "61e95264c0fd0ecb0f66c71e",
    "map_name": "楼道大图",
    "create_time": 1642680851,
    "map_version": 1,
    "overlays_version": 3,
    "thumbnail_url": "http://localhost:8000/maps/3/thumbnail",
    "image_url": "http://localhost:8000/maps/3.png",
    "url": "http://localhost:8000/maps/3"
  }
]
```

**重点字段说明**

| name             | description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| uid              | 全局唯一 ID。唯一标识这个地图。它的坐标系是固定的，即使增量建图也不会改变。 |
| map_version      | 地图版本号。如果增量建图，版本号会增加                                      |
| overlays_version | 地图叠加层的版本号。如果叠加层变化，版本号增加。                            |
| image_url        | 地图图片                                                                    |
| thumbnail_url    | 地图缩略图图片                                                              |

## 删除全部地图

```bash
curl -X DELETE http://localhost:8000/maps
```

## 获取地图详情

```bash
curl http://localhost:8000/maps/1
```

```json
{
  "id": 1,
  "map_name": "5层地图",
  "uid": "620620f9c0fd0ecb0f66d981",
  "map_version": 9,
  "create_time": 1644568815,
  "last_modified_time": 1647333821,
  "grid_origin_x": -53.1968,
  "grid_origin_y": -25.0135,
  "grid_resolution": 0.05,
  "overlays_version": 14,
  "overlays": "{\"type\": \"FeatureCollection\", \"features\": [{\"id\": ...",
  "thumbnail_url": "http://localhost:8000/maps/1/thumbnail",
  "image_url": "http://localhost:8000/maps/1.png",
  "download_url": "http://localhost:8000/maps/1/download",
  "pbstream_url": "http://localhost:8000/maps/1.pbstream"
}
```

**重点字段说明**

| name            | description                                        |
| --------------- | -------------------------------------------------- |
| grid_origin_x   | 地图图片左下角像素的世界坐标 X。                   |
| grid_origin_y   | 地图图片左下角像素的世界坐标 Y。                   |
| grid_resolution | 每个像素代表的世界距离。一般是 0.05，表示 5 厘米。 |
| overlays        | GeoJson 格式的地图叠加物。                         |

## 修改地图

```bash
curl -X PATCH \
    -H "Content-Type: application/json" \
    http://localhost:8000/maps/1
```

**参数**

可以修改以下一个或多个字段。

| name             | type   | description                                        |
| ---------------- | ------ | -------------------------------------------------- |
| map_name         | float  | 地图名称                                           |
| map_version      | int    | 地图版本                                           |
| grid_origin_x    | float  | 地图图片左下角像素的世界坐标 X                     |
| grid_origin_y    | float  | 地图图片左下角像素的世界坐标 Y                     |
| grid_resolution  | float  | 每个像素代表的世界距离。一般是 0.05，表示 5 厘米。 |
| overlays_version | int    | 地图叠加物版本                                     |
| overlays         | string | 地图叠加物。GeoJSON 编码成 string                  |
| carto_map        | string | base64 后的地图数据                                |
| occupancy_grid   | string | base64 后的地图 PNG 图像数据                       |
