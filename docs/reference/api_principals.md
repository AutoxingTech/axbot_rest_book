# REST API Principles

REST APIs follow a request-response pattern.

A request contains a **target** and an **action**.
A response contains a **status** and **data**.

For example, to delete map 3, use `DELETE /maps/3`:

- Request: action=`DELETE` target=`/maps/3`
- Response: status=`204` data=`{}` (empty JSON)

The REST API call is:

```
$ curl -X DELETE -i http://192.168.25.25:8090/maps/3
HTTP/1.1 204 No Content
date: Thu, 17 Mar 2022 05:06:59 GMT
server: uvicorn
Vary: Accept, Cookie
Content-Length: 0
```

204 - No Content means an object was deleted successfully.

## TARGET

There are two types of **targets**: **list** and **single**. For example:

- **/maps** - Map list
- **/maps/3** - Map 3 (single)
- **/chassis/moves** - Move action list
- **/chassis/moves/1150** - Move action 1150 (single)
- **/services** - Service list
- **/services/imu/recalibrate** - IMU calibration service (single)

## ACTION

Common actions are `query`, `create`, `delete`, `modify`, and `overwrite`.
The corresponding HTTP request methods are `GET`, `POST`, `DELETE`, `PATCH`, and `PUT`.

The common patterns are summarized below. In particular:

- `POST` to a list endpoint creates a new object.
- `DELETE` a list endpoint deletes all objects in that list.

| Action | Target  | Description                         |
| ------ | ------- | ----------------------------------- |
| POST   | /maps   | Create a new map with provided data |
| GET    | /maps   | Get the list of all maps            |
| GET    | /maps/1 | Get the detail of map 1             |
| PUT    | /maps/1 | Overwrite map 1 with provided data  |
| PATCH  | /maps/1 | Partially update map 1              |
| DELETE | /maps/1 | Delete map 1                        |
| DELETE | /maps   | Delete all maps                     |

## STATUS

Response status codes follow the standard [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

- 2xx are successful responses.
- 4xx are client error responses.
- 5xx are server error responses.

The most common status codes are:

- 200 OK
- 201 Created - The object was created or the service was executed.
- 204 No Content - Deleted successfully.
- 400 Bad Request - The request parameters are malformed, or some other precondition was not met.
- 404 Not Found - The resource doesn't exist (Bad URL).
- 500 Internal Server Error - The server encountered an error.

## DATA

Response data is in JSON format and can be:

- An object
- A list

For example, listing all maps returns a list:

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

Requesting the details of a specific map returns an object:

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
