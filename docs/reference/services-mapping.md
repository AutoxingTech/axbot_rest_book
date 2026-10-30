# Mapping

Create and edit map data, and read the SLAM map from the robot.

## Auto-Mapping {#auto-mapping}

:::warning
Experimental Feature
:::

When auto-mapping is enabled, the robot will automatically explore and map its environment.
This feature is only available while the robot is in mapping mode.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"enable": true}' \
  http://192.168.25.25:8090/services/enable_auto_mapping
```

**Parameters**

```ts
interface EnableAutoMappingRequest {
  enable: boolean;
}
```

## Collect Landmarks {#collect-landmarks}

This service is used to collect landmarks for an existing map.

```bash
curl -X POST http://192.168.25.25:8090/services/start_collecting_landmarks
curl -X POST http://192.168.25.25:8090/services/stop_collecting_landmarks
```

The result is stored at:

```bash
curl http://192.168.25.25:8090/collected_data
```

The collected data serves as raw material. Developers must manually insert these landmarks into [overlays](./overlays.md#landmarks) for them to be used.

## Map Overlays {#map-overlays}

Reads or replaces the dynamic map overlays as a GeoJSON `FeatureCollection`. This is a raw JSON endpoint — the `Accept` header is ignored and the response is always `application/json`.

### Get overlays {#get-overlays}

Proxies to the `/get_map_overlays` ROS service (`ax_msgs/GetMapOverlays`).

#### Route

```text
GET /ros/map/overlays
```

#### Request

No parameters, no request body.

#### Response

`200` `application/json` — the overlays as a GeoJSON `FeatureCollection`, passed through verbatim from the service.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0]
          ]
        ]
      },
      "properties": { "kind": "speed_limit_zone" }
    }
  ]
}
```

#### Cache behavior

`Cache-Control: no-cache` — overlays are dynamic state.

#### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `500`  | `map_server` returned `success = false`; body is its `message` |

#### Example

```bash
curl http://192.168.25.25:8090/ros/map/overlays > overlays.json
```

### Set overlays {#set-overlays}

Proxies to the `/set_map_overlays` ROS service (`ax_msgs/SetMapOverlays`).

#### Route

```text
PUT /ros/map/overlays
```

#### Request

The body is the overlays as a GeoJSON `FeatureCollection` with `Content-Type: application/json`. The body is sent verbatim as the `overlays` string to the ROS service.

<!-- prettier-ignore -->
| `Content-Type` request header | Body                        |
| ----------------------------- | --------------------------- |
| `application/json`            | GeoJSON `FeatureCollection` |
| (any other)                   | `415 Unsupported Media Type`|

#### Response

`200` `application/json`:

```json
{ "success": true, "message": "" }
```

#### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `400`  | Malformed request body (invalid JSON)                         |
| `415`  | Unsupported request `Content-Type`                            |
| `500`  | `map_server` returned `success = false`; body is its `message` |

#### Example

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  --data-binary @overlays.json \
  http://192.168.25.25:8090/ros/map/overlays
```

### SDK usage

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";
import type { FeatureCollection } from "@kingsimba/axbot-sdk/geojson";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });

// Read the current overlays
const overlays: FeatureCollection = await api.getMapOverlays();

// Replace the overlays
await api.setMapOverlays(overlays);
```

---

## Traffic Info {#traffic-info}

Reads or replaces the dynamic traffic info (no-passing zones) of the currently loaded map, as a lightweight JSON document. This is a raw JSON endpoint — the `Accept` header is ignored and the response is always `application/json`.

Traffic info is stored separately from [Map Overlays](#map-overlays): the server converts each zone into a `Polygon` feature marked `properties.trafficInfo = true` and appends it to the current overlays. Calling `set_map` or `set_map_overlays` discards those generated features.

### Get traffic info {#get-traffic-info}

Proxies to the `/get_traffic_info` ROS service (`ax_msgs/GetTrafficInfo`).

#### Route

```text
GET /ros/map/traffic_info
```

#### Request

No parameters, no request body.

#### Response

`200` `application/json` — the traffic info JSON document.

```jsonc
{
  // Format version; only 1 is supported.
  "version": 1,

  // UID of the map this traffic info belongs to.
  "map_uid": "6246b10c21e1f5ce844af829",

  // No-passing zone list, full-replacement semantics.
  "no_passing_zones": [
    {
      // Unique within the list.
      "id": "npz-001",

      // Vertices as [x, y] pairs in map coordinates, at least 3;
      // the ring is closed automatically.
      "polygon": [
        [1.0, 2.0],
        [3.0, 2.0],
        [3.0, 5.0],
        [1.0, 5.0],
      ],

      // Reserved. Stored but not evaluated in version 1 — zones are always active.
      "time_rules": [],
    },
  ],
}
```

#### Cache behavior

`Cache-Control: no-cache` — traffic info is dynamic state.

#### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `500`  | `map_server` returned `success = false`; body is its `message` |

#### Example

```bash
curl http://192.168.25.25:8090/ros/map/traffic_info > traffic_info.json
```

### Set traffic info {#set-traffic-info}

Proxies to the `/set_traffic_info` ROS service (`ax_msgs/SetTrafficInfo`).

#### Route

```text
PUT /ros/map/traffic_info
```

#### Request

The body is the traffic info JSON document with `Content-Type: application/json`. The body is sent verbatim as the `traffic_info` string to the ROS service.

<!-- prettier-ignore -->
| `Content-Type` request header | Body                        |
| ----------------------------- | --------------------------- |
| `application/json`            | Traffic info JSON           |
| (any other)                   | `415 Unsupported Media Type`|

The call is a **full replacement**: zones omitted from `no_passing_zones` are deleted, and an empty array clears every dynamic no-passing zone. `map_uid` must match the UID of the currently loaded map.

#### Response

`200` `application/json`:

```json
{ "success": true, "message": "" }
```

#### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `400`  | Malformed request body (invalid JSON)                         |
| `415`  | Unsupported request `Content-Type`                            |
| `500`  | `map_server` returned `success = false`; body is its `message` |

`500` covers validation failures such as a missing map, a `map_uid` that does not match the currently loaded map, a duplicate zone `id`, or a polygon with fewer than 3 vertices.

#### Example

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  --data-binary @traffic_info.json \
  http://192.168.25.25:8090/ros/map/traffic_info
```

### SDK usage

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";
import type { TrafficInfo } from "@kingsimba/axbot-sdk/robotApiType";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });

// Read the current traffic info
const trafficInfo: TrafficInfo = await api.getTrafficInfo();

// Replace the no-passing zones
trafficInfo.no_passing_zones = [
  {
    id: "npz-001",
    polygon: [
      [1.0, 2.0],
      [3.0, 2.0],
      [3.0, 5.0],
      [1.0, 5.0],
    ],
  },
];
await api.setTrafficInfo(trafficInfo);
```

---

## Submap Query V2 {#submap-query-v2}

### Route

```text
GET /ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}
```

### Request

<!-- prettier-ignore -->
| Param           | Type    | Where | Notes                                 |
| --------------- | ------- | ----- | ------------------------------------- |
| `uuid`          | string  | path  | Passed through to the ROS request     |
| `trajectory_id` | integer | path  | Decimal integer                       |
| `submap_index`  | integer | path  | Decimal integer                       |
| `ver`           | string  | query | Optional; affects cache behavior only |

No request body.

### Response

`ros_messages.SubmapQueryV2Response` — see [`slam/submap_query.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/slam/submap_query.proto) and [`geometry.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/geometry.proto).

### Cache behavior

- With `?ver=...`: `Cache-Control: public, max-age=31536000, immutable`
- Without `ver`: `Cache-Control: no-cache` + weak `ETag`
- Matching `If-None-Match`: `304 Not Modified`

### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| `404`  | ROS service reported not found             |
| `502`  | ROS service call failed                    |
| `504`  | ROS service was unavailable before timeout |

### Example

```bash
curl -i \
  'http://192.168.25.25:8090/ros/slam/submaps/681dc447472ac49d7b074fa1/12/3?ver=42' \
  -o submap_query.pb
```

---

## SLAM Map Image {#slam-map-image}

Fetches the current SLAM map as a protobuf-encoded PNG image. Proxies to the `/slam/get_image` ROS service.

### Route

```text
GET /ros/slam/map_image
```

### Request

<!-- prettier-ignore -->
| Param              | Type    | Where  | Notes                                         |
| ------------------ | ------- | ------ | --------------------------------------------- |
| `trajectory_id`    | integer | query  | Optional. Filter by trajectory ID.            |
| `resolution`       | number  | query  | Optional. Image resolution in m/pixel.        |
| `new_trajectory_only` | boolean | query | Optional. Only submaps from the newest trajectory. |

No request body.

### Response

`ros_messages.slam.GetMapImageResponse` — see [`slam/map_image.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/slam/map_image.proto) and [`slam/status.proto`](https://github.com/AutoxingTech/axbot-ts-sdk/blob/master/src/proto/slam/status.proto).

The response includes:

<!-- prettier-ignore -->
| Field            | Type       | Notes                                              |
| ---------------- | ---------- | -------------------------------------------------- |
| `origin_x`       | double     | World X-coordinate of the map image origin.        |
| `origin_y`       | double     | World Y-coordinate of the map image origin.        |
| `resolution`     | double     | Map resolution in meters per pixel.                |
| `png_bytes`      | bytes      | PNG-encoded image data.                            |
| `status_code`    | StatusCode | Result status code (see `slam/status.proto`).      |
| `status_message` | string     | Human-readable status message.                     |

### Cache behavior

No caching — the map image is dynamic and reflects the current SLAM state.

### Additional error codes

<!-- prettier-ignore -->
| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| `502`  | ROS service call failed                    |
| `504`  | ROS service was unavailable before timeout |

### Example

```bash
# Fetch as binary protobuf
curl -H "Accept: application/x-protobuf" \
  'http://192.168.25.25:8090/ros/slam/map_image' \
  -o map_image.pb

# Fetch as JSON
curl -H "Accept: application/json" \
  'http://192.168.25.25:8090/ros/slam/map_image' | jq .
```

```json
{
  "origin_x": -8.1,
  "origin_y": -4.8,
  "resolution": 0.05,
  "status_code": "OK",
  "status_message": ""
}
```

### SDK usage

```ts
import { RobotApi } from "@kingsimba/axbot-sdk/robotApi";

const api = new RobotApi({ apiBase: "http://192.168.25.25:8090" });
const result = await api.getMapImage({ resolution: 0.05 });
if (result) {
  const png = new Blob([result.message.png_bytes], { type: "image/png" });
  const url = URL.createObjectURL(png);
  // use url as <img src> or ImageBitmap source
}
```

---
