# REST API 设计原则

REST API 遵循请求-响应模式。

一个请求包含**目标** (target) 和**动作** (action)。
一个响应包含**状态** (status) 和**数据** (data)。

例如，删除地图 3，使用 `DELETE /maps/3`：

- 请求：动作=`DELETE` 目标=`/maps/3`
- 响应：状态=`204` 数据=`{}` (空 JSON)

REST API 调用示例如下：

```
$ curl -X DELETE -i http://192.168.25.25:8090/maps/3
HTTP/1.1 204 No Content
date: Thu, 17 Mar 2022 05:06:59 GMT
server: uvicorn
Vary: Accept, Cookie
Content-Length: 0
```

204 - No Content 表示对象已成功删除。

## 目标 (TARGET)

有两种类型的**目标**：**列表** (list) 和**单个** (single)。例如：

- **/maps** - 地图列表
- **/maps/3** - 地图 3 (单个)
- **/chassis/moves** - 移动动作列表
- **/chassis/moves/1150** - 移动动作 1150 (单个)
- **/services** - 服务列表
- **/services/imu/recalibrate** - IMU 校准服务 (单个)

## 动作 (ACTION)

常用动作包括 `query` (查询)、`create` (创建)、`delete` (删除)、`modify` (修改) 和 `overwrite` (覆盖)。
对应的 HTTP 请求方法分别为 `GET`、`POST`、`DELETE`、`PATCH` 和 `PUT`。

通用模式总结如下。特别注意：

- 对列表端点执行 `POST` 会创建一个新对象。
- 对列表端点执行 `DELETE` 会删除该列表中的所有对象。

<!-- prettier-ignore -->
| 动作   | 目标    | 描述                         |
| ------ | ------- | ---------------------------- |
| POST   | /maps   | 使用提供的数据创建新地图     |
| GET    | /maps   | 获取所有地图的列表           |
| GET    | /maps/1 | 获取地图 1 的详情            |
| PUT    | /maps/1 | 使用提供的数据覆盖地图 1     |
| PATCH  | /maps/1 | 部分更新地图 1               |
| DELETE | /maps/1 | 删除地图 1                   |
| DELETE | /maps   | 删除所有地图                 |

## 状态 (STATUS)

响应状态码遵循标准 [HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)。

- 2xx 是成功的响应。
- 4xx 是客户端错误响应。
- 5xx 是服务器错误响应。

最常见的状态码包括：

- 200 OK - 成功。
- 201 Created - 对象已创建或服务已执行。
- 204 No Content - 成功删除。
- 400 Bad Request - 请求参数格式错误，或未满足某些前提条件。
- 404 Not Found - 资源不存在 (错误的 URL)。
- 500 Internal Server Error - 服务器遇到错误。

## 数据 (DATA)

响应数据为 JSON 格式，可以是：

- 一个对象
- 一个列表

例如，列出所有地图会返回一个列表：

```bash
curl http://192.168.25.25:8090/maps/ | jq
```

```json
[
  {
    "id": 1,
    "uid": "620620f9c0fd0ecb0f66d981",
    "map_name": "5th Floor",
    "create_time": 1644568815,
    "map_version": 9,
    "overlays_version": 14,
    "thumbnail_url": "http://192.168.25.25:8090/maps/1/thumbnail",
    "image_url": "http://192.168.25.25:8090/maps/1.png",
    "url": "http://192.168.25.25:8090/maps/1"
  },
  {
    "id": 2,
    "uid": "61ee4c3ac0fd0ecb0f66d165",
    "map_name": "Lobby",
    "create_time": 1643007028,
    "map_version": 2,
    "overlays_version": 8,
    "thumbnail_url": "http://192.168.25.25:8090/maps/2/thumbnail",
    "image_url": "http://192.168.25.25:8090/maps/2.png",
    "url": "http://192.168.25.25:8090/maps/2"
  },
  {
    "id": 3,
    "uid": "61e95264c0fd0ecb0f66c71e",
    "map_name": "Hallway",
    "create_time": 1642680851,
    "map_version": 1,
    "overlays_version": 3,
    "thumbnail_url": "http://192.168.25.25:8090/maps/3/thumbnail",
    "image_url": "http://192.168.25.25:8090/maps/3.png",
    "url": "http://192.168.25.25:8090/maps/3"
  }
]
```

请求特定地图的详情会返回一个对象：

```bash
curl http://192.168.25.25:8090/maps/1 | jq
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
  "download_url": "http://192.168.25.25:8090/maps/1/download",
  "pbstream_url": "http://192.168.25.25:8090/maps/1.pbstream"
}
```
