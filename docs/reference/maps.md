# Map API

A map contains the following fields:

<!-- prettier-ignore -->
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
    "image_size": 1048576, // size of the PNG image, in bytes
    "pbstream_url": "http://192.168.25.25:8090/maps/1.pbstream",
    "pbstream_size": 8354678, // size of the pbstream file, in bytes
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
    "image_size": 524288, // size of the PNG image, in bytes
    "pbstream_url": "http://192.168.25.25:8090/maps/2.pbstream",
    "pbstream_size": 4177339, // size of the pbstream file, in bytes
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
    "image_size": 2097152, // size of the PNG image, in bytes
    "pbstream_url": "http://192.168.25.25:8090/maps/3.pbstream",
    "pbstream_size": 16709356, // size of the pbstream file, in bytes
    "url": "http://192.168.25.25:8090/maps/3"
  }
]
```

**Extra Fields**

<!-- prettier-ignore -->
| name          | description                                                      |
| ------------- | ---------------------------------------------------------------- |
| image_url     | The PNG image representation of the map at its original resolution. |
| thumbnail_url | The PNG image representation of the map at a low resolution (thumbnail). |
| pbstream_url  | The URL to retrieve the binary map data (`.pbstream`).           |
| pbstream_size | The size of the pbstream file, in bytes. `null` if unavailable.  |
| image_size    | The size of the PNG image, in bytes. `null` if unavailable.      |

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
  "image_size": 1048576, // size of the PNG image, in bytes
  "pbstream_url": "http://192.168.25.25:8090/maps/1.pbstream",
  "pbstream_size": 8354678 // size of the pbstream file, in bytes
}
```

**Extra Fields**

<!-- prettier-ignore -->
| name          | description                                                   |
| ------------- | ------------------------------------------------------------- |
| image_url     | The URL to retrieve the PNG image of the map at its original resolution. |
| thumbnail_url | The URL to retrieve the thumbnail (PNG) image of the map.      |
| pbstream_url  | The URL to retrieve the binary map data.                      |
| pbstream_size | The size of the pbstream file, in bytes. `null` if unavailable. |
| image_size    | The size of the PNG image, in bytes. `null` if unavailable.   |

## Create a Map

Maps can be created using base64-encoded data or from local file paths directly on the server. There is also a method to create a map directly from a mapping task (see [mappings.md](mappings.md#save-mapping-artifacts-directly-as-a-map)).

### Create Map from Base64 Data

A map can be created by providing the following required fields:

- map_name
- carto_map (Base64-encoded binary map data)
- occupancy_grid (Base64-encoded PNG image data)
- grid_origin_x
- grid_origin_y
- grid_resolution
- overlays_version (optional)
- overlays (optional)
- uid (optional)
- map_version (optional)

```bash
curl -X POST \
    -H "Content-Type: application/json" \
    --data '{"map_name": "xxx", "carto_map": "xxxx", "occupancy_grid": "xxx" ...}' \
    http://192.168.25.25:8090/maps/
```

### Create Map from Local Files

If the `.pbstream` and `.png` files already exist on the device, you can create a map without Base64 encoding by passing absolute file paths.

:::tip
**Advantages over Base64 JSON:**

- **Instant speed**: No base64 decoding or payload parsing overhead.
- **Almost 0 memory usage**: Avoids loading huge map files into memory during the API request.
- **No map data duplication**: Uses hard links to your source files. Metadata and thumbnails still require a small amount of disk space.
:::

* map_name
* carto_map_filename (Absolute path to the source `.pbstream` file)
* occupancy_grid_filename (Absolute path to the source `.png` file)
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
    --data '{"map_name": "Floor 1", "carto_map_filename": "/path/to/source.pbstream", "occupancy_grid_filename": "/path/to/source.png"}' \
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

### Modify Map from Base64 Data (Deprecated)

This method is deprecated. Use local file paths instead. The legacy method sends Base64-encoded map data directly in the request body.

```bash
curl -X PATCH \
    -H "Content-Type: application/json" \
    -d '{"carto_map": "<base64-encoded pbstream data>", "occupancy_grid": "<base64-encoded PNG data>", "grid_origin_x": 1.5, "grid_origin_y": 2.5, "grid_resolution": 0.05, "map_version": 2}' \
    http://192.168.25.25:8090/maps/1
```

### Modify Map from Local Files (Recommended)

To replace an existing map's files without Base64 encoding, send `POST /maps/{id}` with local file paths. This is a partial update: the map ID is preserved and omitted fields remain unchanged. The filename fields are also supported by `PATCH` and `PUT`.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"carto_map_filename": "/path/to/replacement.pbstream", "occupancy_grid_filename": "/path/to/replacement.png", "grid_origin_x": 1.5, "grid_origin_y": 2.5, "grid_resolution": 0.05, "map_version": 2}' \
  http://192.168.25.25:8090/maps/1
```

You may provide either filename or both. Include updated grid coordinates and resolution when they change. `map_version` and `overlays_version` follow the existing version checks when provided; they are not automatically incremented. Do not provide both a filename and Base64 data for the same file.

**Response: `200 OK`**

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

:::warning Local file requirements
Source files must be absolute paths on the device and on the same filesystem as map storage (`/opt/ax-cache/maps`). Updates use hard links, not copies; invalid paths and cross-filesystem sources return `400 Bad Request`. Metadata and thumbnails still consume some disk space. Do not modify source files in place after linking: doing so also changes the stored map. Removing the source filename does not remove the map's hard link.
:::

## Delete Map

```bash
curl -X DELETE http://192.168.25.25:8090/maps/1
```

## Delete All Maps

```bash
curl -X DELETE http://192.168.25.25:8090/maps
```
