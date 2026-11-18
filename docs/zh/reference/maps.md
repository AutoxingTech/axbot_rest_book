# 地图 (Map) API

地图包含以下字段：

<!-- prettier-ignore -->
| 名称             | 类型   | 描述                                                         |
| ---------------- | ------ | ------------------------------------------------------------ |
| uid              | string | 唯一 ID。                                                    |
| map_name         | string | 地图名称。                                                   |
| map_version      | int    | 地图版本。                                                   |
| create_time      | int    | Unix 时间戳 (例如：1644568815)。                             |
| grid_origin_x    | float  | 左下角的 X 坐标。                                            |
| grid_origin_y    | float  | 左下角的 Y 坐标。                                            |
| grid_resolution  | float  | 单个像素的大小，通常为 0.05 米/像素。                        |
| overlays_version | int    | 叠加层 (overlays) 的版本。                                   |
| overlays         | string | GeoJSON 格式的叠加层，包含兴趣点 (POI)、虚拟墙等。           |
| carto_map        | string | Base64 编码的二进制地图数据（用于定位）。                    |
| occupancy_grid   | string | Base64 编码的 PNG 图像数据（用于显示）。                    |

## 地图列表 {#map-list}

```bash
curl http://192.168.25.25:8090/maps/
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
    "thumbnail_url": "http://192.168.25.25:8090/maps/1/thumbnail",
    "image_url": "http://192.168.25.25:8090/maps/1.png",
    "image_size": 1048576, // PNG 图像大小，单位：字节
    "pbstream_url": "http://192.168.25.25:8090/maps/1.pbstream",
    "pbstream_size": 8354678, // pbstream 文件大小，单位：字节
    "url": "http://192.168.25.25:8090/maps/1"
  },
  {
    "id": 2,
    "uid": "61ee4c3ac0fd0ecb0f66d165",
    "map_name": "前台大厅",
    "create_time": 1643007028,
    "map_version": 2,
    "overlays_version": 8,
    "thumbnail_url": "http://192.168.25.25:8090/maps/2/thumbnail",
    "image_url": "http://192.168.25.25:8090/maps/2.png",
    "image_size": 524288, // PNG 图像大小，单位：字节
    "pbstream_url": "http://192.168.25.25:8090/maps/2.pbstream",
    "pbstream_size": 4177339, // pbstream 文件大小，单位：字节
    "url": "http://192.168.25.25:8090/maps/2"
  },
  {
    "id": 3,
    "uid": "61e95264c0fd0ecb0f66c71e",
    "map_name": "楼道大图",
    "create_time": 1642680851,
    "map_version": 1,
    "overlays_version": 3,
    "thumbnail_url": "http://192.168.25.25:8090/maps/3/thumbnail",
    "image_url": "http://192.168.25.25:8090/maps/3.png",
    "image_size": 2097152, // PNG 图像大小，单位：字节
    "pbstream_url": "http://192.168.25.25:8090/maps/3.pbstream",
    "pbstream_size": 16709356, // pbstream 文件大小，单位：字节
    "url": "http://192.168.25.25:8090/maps/3"
  }
]
```

**额外字段**

<!-- prettier-ignore -->
| 名称          | 描述                                       |
| ------------- | ------------------------------------------ |
| image_url     | 地图原始分辨率的 PNG 图像。                |
| thumbnail_url | 地图低分辨率的 PNG 图像（缩略图）。        |
| pbstream_url  | 获取二进制地图数据 (`.pbstream`) 的 URL。  |
| pbstream_size | pbstream 文件大小，单位：字节。不可用时为 `null`。 |
| image_size    | PNG 图像大小，单位：字节。不可用时为 `null`。 |

## 获取地图详情 {#get-map-detail}

```bash
curl http://192.168.25.25:8090/maps/1
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
  "thumbnail_url": "http://192.168.25.25:8090/maps/1/thumbnail",
  "image_url": "http://192.168.25.25:8090/maps/1.png",
  "image_size": 1048576, // PNG 图像大小，单位：字节
  "pbstream_url": "http://192.168.25.25:8090/maps/1.pbstream",
  "pbstream_size": 8354678 // pbstream 文件大小，单位：字节
}
```

**额外字段**

<!-- prettier-ignore -->
| 名称          | 描述                                     |
| ------------- | ---------------------------------------- |
| image_url     | 获取地图原始分辨率 PNG 图像的 URL。      |
| thumbnail_url | 获取地图缩略图 (PNG) 的 URL。            |
| pbstream_url  | 获取二进制地图数据的 URL。               |
| pbstream_size | pbstream 文件大小，单位：字节。不可用时为 `null`。 |
| image_size    | PNG 图像大小，单位：字节。不可用时为 `null`。 |

## 创建地图 {#create-a-map}

可以使用 Base64 编码的数据创建地图，或直接从服务器上的本地文件路径创建。还有一种从建图任务直接创建地图的方法（参见 [mappings.md](mappings.md#save-mapping-as-map)）。

### 从 Base64 数据创建地图 {#create-from-base64}

可以通过提供以下必填字段来创建地图：

- map_name
- carto_map (Base64 编码的二进制地图数据)
- occupancy_grid (Base64 编码的 PNG 图像数据)
- grid_origin_x
- grid_origin_y
- grid_resolution
- overlays_version (可选)
- overlays (可选)
- uid (可选)
- map_version (可选)

```bash
curl -X POST \
    -H "Content-Type: application/json" \
    --data '{"map_name": "xxx", "carto_map": "xxxx", "occupancy_grid": "xxx" ...}' \
    http://192.168.25.25:8090/maps/
```

### 从本地文件创建地图 {#create-from-local-file}

如果设备上已存在 `.pbstream` 和 `.png` 文件，您可以通过传递绝对文件路径来创建地图，而无需进行 Base64 编码。

:::tip 提示
**相对于 Base64 JSON 的优势：**

- **极速响应**：无 Base64 解码或 Payload 解析开销。
- **几乎零内存占用**：避免在 API 请求期间将巨大的地图文件加载到内存中。
- **不重复存储地图数据**：直接对源文件使用硬链接。元数据和缩略图仍需少量磁盘空间。
  :::

* map_name
* carto_map_filename (源 `.pbstream` 文件的绝对路径)
* occupancy_grid_filename (源 `.png` 文件的绝对路径)
* grid_origin_x
* grid_origin_y
* grid_resolution
* overlays_version (可选)
* overlays (可选)
* uid (可选)
* map_version (可选)

```bash
curl -X POST \
    -H "Content-Type: application/json" \
    --data '{"map_name": "Floor 1", "carto_map_filename": "/path/to/source.pbstream", "occupancy_grid_filename": "/path/to/source.png"}' \
    http://192.168.25.25:8090/maps/
```

**响应**

```json
{
  "id": 119, // 新创建地图的 ID。使用此 ID 将其加载到机器人上。
  "uid": "9b94ac16-239b-11ed-9446-1e49da274768",
  "map_name": "From Mapping 4",
  "create_time": 1657015615,
  "map_version": 1,
  "overlays_version": 1,
  "thumbnail_url": "http://192.168.25.25:8090/maps/119/thumbnail",
  "image_url": "http://192.168.25.25:8090/maps/119.png",
  "url": "http://192.168.25.25:8090/maps/119"
}
```

## 修改地图 {#modify-a-map}

### 直接传入 Base64 数据修改地图（已废弃）

此方式已废弃，请改用本地文件路径。旧方式在请求体中直接传入 Base64 编码的地图数据。

```bash
curl -X PATCH \
    -H "Content-Type: application/json" \
    -d '{"carto_map": "<base64-encoded pbstream data>", "occupancy_grid": "<base64-encoded PNG data>", "grid_origin_x": 1.5, "grid_origin_y": 2.5, "grid_resolution": 0.05, "map_version": 2}' \
    http://192.168.25.25:8090/maps/1
```

### 使用本地文件修改地图（推荐）

要替换已有地图的文件而不进行 Base64 编码，请向 `POST /maps/{id}` 传入本地文件路径。这是部分更新：保留地图 ID，未提供的字段保持不变。`PATCH` 和 `PUT` 也支持这些文件路径字段。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"carto_map_filename": "/path/to/replacement.pbstream", "occupancy_grid_filename": "/path/to/replacement.png", "grid_origin_x": 1.5, "grid_origin_y": 2.5, "grid_resolution": 0.05, "map_version": 2}' \
  http://192.168.25.25:8090/maps/1
```

可以只提供一个文件路径，也可以同时提供两个。如果栅格原点或分辨率发生变化，请同时更新对应字段。提供 `map_version` 或 `overlays_version` 时会执行现有版本校验，版本号不会自动递增。同一个文件不能同时提供路径和 Base64 数据。

**响应：`200 OK`**

```json
{
  "id": 1,
  "uid": "620620f9c0fd0ecb0f66d981",
  "map_name": "5层地图",
  "create_time": 1644568815,
  "map_version": 2,
  "overlays_version": 14
}
```

:::warning 本地文件要求
源文件必须使用设备上的绝对路径，且与地图存储目录（`/opt/ax-cache/maps`）位于同一文件系统。更新使用硬链接，不复制数据；无效路径或跨文件系统的源文件会返回 `400 Bad Request`。元数据和缩略图仍会占用少量磁盘空间。建立硬链接后不要原地修改源文件，否则已保存的地图也会随之改变。删除源文件名不会删除地图的硬链接。
:::

## 删除地图 {#delete-a-map}

```bash
curl -X DELETE http://192.168.25.25:8090/maps/1
```

## 删除所有地图 {#delete-all-maps}

```bash
curl -X DELETE http://192.168.25.25:8090/maps
```
