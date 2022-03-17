# REST API 基本原则

REST API 为**一问一答**的形式。每个请求有一个 Request 和 Response 组成。

Request 包含 **target** 和 **action** 两部分。
Response 包含 **status** 和 **data** 两部分。

比如，获取设备信息 `GET /device/status`，则：

- Request: action=`GET` target=`/device/status`
- Response: status=`200` data=`{"version": "1.8.x", "sn": "618111110000110" ...}`

使用 REST API 就是：

```
$ curl -X DELETE -i http://localhost:8000/mappings/3
HTTP/1.1 204 No Content
date: Thu, 17 Mar 2022 05:06:59 GMT
server: uvicorn
Vary: Accept, Cookie
Content-Length: 0
```

204 - No Content 说明成功删除。

## TARGET

Target 分 **列表** 和 **个体** 两种。以下举例：

- **/maps** - 地图列表
- **/maps/3** - 3 号地图
- **/chassis/moves** - move action 列表
- **/chassis/moves/1150** - 第 1150 号 move action
- **/services** - 服务列表
- **/services/imu/recalibrate** - 校准 IMU 服务

## ACTION

常见 Action 为 查询、创建、删除、修改、覆盖。对应 REST API 为 `GET`、`POST`、`DELETE`、`PUT`、`PATCH`。
以下举例说明。特别注意，对 **列表** 做 `POST`，意味着创建新对象。对 **列表** 做 `DELETE`，意味着删除全部对象。

| Action | Target  | 说明                  |
| ------ | ------- | --------------------- |
| POST   | /maps   | 创建地图              |
| GET    | /maps   | 查看地图列表          |
| GET    | /maps/1 | 查看 1 号地图         |
| PUT    | /maps/1 | 覆盖 1 号地图         |
| PATCH  | /maps/1 | 修改 1 号地图部分字段 |
| DELETE | /maps/1 | 删除 1 号地图         |
| DELETE | /maps   | 删除全部地图          |

## STATUS

返回状态码。状态码遵循 HTTP 状态码的一般规则：

- 2xx 为成功
- 4xx 为请求端问题（缺少字段、URL 错误、资源不存在等）
- 5xx 为服务器端问题。

常见的有:

- 200 OK 成功
- 201 Created 创建成功
- 400 Bad Request
- 404 Not Found 资源不存在
- 500 Internal Server Error 服务器端故障

## DATA

返回的数据为 JSON 格式，有 List 和 Object 两种。

```bash
curl http://localhost:8000/maps/ | jq
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

```bash
curl http://localhost:8000/maps/1 | jq
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
