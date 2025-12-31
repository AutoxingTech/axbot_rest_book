# Map API

A map contains the following fields:

| name             | type   | description                                                  |
| ---------------- | ------ | ------------------------------------------------------------ |
| uid              | string | Unique ID.                                                   |
| map_name         | float  | The name of the map.                                         |
| map_version      | int    | The version of the map.                                      |
| create_time      | int    | A Unix timestamp (e.g., 1644568815).                         |
| grid_origin_x    | float  | The X-coordinate of the lower-left corner.                   |
| grid_origin_y    | float  | The Y-coordinate of the lower-left corner.                   |
| grid_resolution  | float  | The size of a single pixel, typically 0.05 m/pixel.          |
| overlays_version | int    | The version of the overlays.                                 |
| overlays         | string | Overlays in GeoJSON format, containing POIs, virtual walls, etc. |
| carto_map        | string | Base64-encoded binary map data (used for positioning).       |
| occupancy_grid   | string | Base64-encoded PNG image data (used for display).            |

## Map List

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
    "url": "http://192.168.25.25:8090/maps/3"
  }
]
```

**Extra Fields**

| name          | description                                                      |
| ------------- | ---------------------------------------------------------------- |
| image_url     | The PNG image representation of the map at its original resolution. |
| thumbnail_url | The PNG image representation of the map at a low resolution (thumbnail). |

## Get Map Detail

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
  "pbstream_url": "http://192.168.25.25:8090/maps/1.pbstream"
}
```

**Extra Fields**

| name          | description                                                   |
| ------------- | ------------------------------------------------------------- |
| image_url     | The URL to retrieve the PNG image of the map at its original resolution. |
| thumbnail_url | The URL to retrieve the thumbnail (PNG) image of the map.      |
| pbstream_url  | The URL to retrieve the binary map data.                      |

## Create a Map

A map can be created by providing the following required fields:

* map_name
* carto_map
* occupancy_grid
* grid_origin_x
* grid_origin_y
* grid_resolution
* overlays_version (optional)
* overlays (optional)
* uid (optional)
* map_version (optional)

```bash
curl -X POST \
    -H "Content-Type: application/json" \
    --data '{"map_name": "xxx", "carto_map": "xxxx", "occupancy_grid": "xxx" ...}' \
    http://192.168.25.25:8090/maps/
```

**Response**

```json
{
  "id": 119, // The ID of the newly created map. Use this ID to load it onto the robot.
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

## Modify Map

Modify the name and overlays.

```bash
curl -X PATCH \
    -H "Content-Type: application/json" \
    -d '{"map_name": "...", "overlays": "..."}' \
    http://192.168.25.25:8090/maps/1 {}
```

## Delete Map

```bash
curl -X DELETE http://192.168.25.25:8090/maps/1
```

## Delete All Maps

```bash
curl -X DELETE http://192.168.25.25:8090/maps
```
