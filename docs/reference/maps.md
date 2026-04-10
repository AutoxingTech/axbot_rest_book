# Map API

The current SDK wraps only the map operations needed for routine lifecycle management:

| SDK helper | Method | Path | Request body |
| --- | --- | --- | --- |
| `saveMappingAsMap(mappingId, mapName)` | `POST` | `/maps/` | `{ "mapping_id": number, "map_name": string }` |
| `deleteMap(mapId)` | `DELETE` | `/maps/{id}` | none |

The robot REST API also exposes map list, detail, create, and patch endpoints, but those are not currently wrapped by `robotApi.ts`. This page keeps the map resource model for reference and marks the raw-only parts clearly.

## Map Resource Shape

The SDK exports a `MapItem` type through `@kingsimba/axbot-sdk/msgs`.

```ts
type MapItem = {
  id: number;
  uid: string;
  map_name: string;
  create_time: number;
  last_modified_time?: number;
  map_version: number;
  overlays_version: number;
  thumbnail_url?: string;
  image_url?: string;
  pbstream_url?: string;
  url?: string;
  grid_origin_x?: number;
  grid_origin_y?: number;
  grid_resolution?: number;
  overlays?: string;
};
```

Common fields:

| Field | Meaning |
| --- | --- |
| `id` | Numeric map identifier |
| `uid` | Stable map UID |
| `map_name` | Human-readable map name |
| `map_version` | Binary map revision |
| `overlays_version` | Overlay revision |
| `grid_origin_x`, `grid_origin_y`, `grid_resolution` | Occupancy-grid placement metadata |
| `image_url` | Rendered PNG map image |
| `pbstream_url` | Binary SLAM/map artifact |
| `overlays` | GeoJSON string for POIs, virtual walls, and related overlays |

## Save Mapping Artifacts As A Map

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mapping_id":48,"map_name":"From Mapping 48"}' \
  "$ROBOT_API_BASE/maps/"
```

The typical response is a newly created map record:

```json
{
  "id": 119,
  "uid": "9b94ac16-239b-11ed-9446-1e49da274768",
  "map_name": "From Mapping 48",
  "create_time": 1657015615,
  "map_version": 1,
  "overlays_version": 1,
  "thumbnail_url": "http://ROBOT_HOST:8090/maps/119/thumbnail",
  "image_url": "http://ROBOT_HOST:8090/maps/119.png",
  "url": "http://ROBOT_HOST:8090/maps/119"
}
```

## Delete A Map

```bash
curl -X DELETE "$ROBOT_API_BASE/maps/18"
```

This is the only destructive map-management operation wrapped by the current SDK.

## Raw REST Endpoints Not Wrapped By The Current SDK

The following endpoints remain useful for admin tools and migration scripts, but they are outside the typed SDK helper layer:

| Endpoint | Status |
| --- | --- |
| `GET /maps/` | Raw REST only |
| `GET /maps/{id}` | Raw REST only |
| `POST /maps/` with `carto_map` and `occupancy_grid` payloads | Raw REST only |
| `POST /maps/` with local file paths | Raw REST only |
| `PATCH /maps/{id}` | Raw REST only |

If you build against those endpoints directly, validate them on the target robot build and keep your own request and response types in sync with the deployed firmware.
