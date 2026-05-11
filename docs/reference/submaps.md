# Submaps

Submap rendering is an advanced alternative to the [`/map_v2` WebSocket topic](./websocket.md) for displaying a robot's map. Instead of receiving the entire map as a single PNG, the client composites the map from many small, overlapping PNG images — one per cartographer submap. Unlike regular image tiles, submaps can overlap and vary in size. This approach is necessary for very large maps (> 2–3 km²) where a single full-resolution PNG becomes impractical.

Submap rendering uses two pieces that are designed to work together:

- The WebSocket topic `/submap_list` publishes the current list of cartographer submaps, including pose, version, and the SLAM session UUID.
- The HTTP endpoint `GET /ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}` forwards the ROS service `/submap_query_v2` and returns the binary protobuf payload for one submap.

The intended consumer flow is:

1. Subscribe to `/submap_list`.
2. Track each submap by `(uuid, trajectory_id, submap_index, submap_version)`.
3. When a submap is new or its `submap_version` changes, fetch the corresponding `SubmapQueryV2` payload.
4. Decode the returned protobuf and render its `textures`.

This is a major mapping surface. The WebSocket topic gives you discovery and invalidation. The HTTP API gives you the actual texture payload.

## Submap Rendering vs. `/map_v2`

Submap rendering is an alternative to subscribing to the `/map_v2` WebSocket topic.

**`/map_v2`** publishes the entire occupancy grid as a single PNG covering the whole map. It is straightforward to implement and the payload is usually small. However, as the map grows beyond roughly 2–3 km², storing the full resolution (normally 0.05 m/pixel) in a single image becomes impractical — the pixel count explodes. Even dropping to 0.1 m/pixel only delays the problem.

**Submap rendering** represents the map as many small, overlapping PNGs — one per cartographer submap. Unlike uniform image tiles, submaps can overlap and are not equal-sized. This scales to arbitrarily large environments because each image is bounded in size. The trade-off is added complexity: you must maintain a per-submap cache, handle individual network requests, and composite potentially overlapping images at render time. The total number of PNG downloads also increases memory usage.

| | `/map_v2` (single PNG) | Submap rendering |
| --- | --- | --- |
| Implementation complexity | Low | High |
| Typical payload for a small map | ~100 KB (one download) | ~1 MB total (e.g. 100 submaps × 10 KB each) |
| Supports very large maps (> 2–3 km²) | No | Yes |
| Memory usage | Low for small maps | Higher (many images in cache) |
| Network traffic | One large download | Many small downloads |
| Image layout | Non-overlapping | Overlapping, variable size |

Choose `/map_v2` for typical indoor environments. Switch to submap rendering when you expect maps that exceed a few square kilometres.

## `/submap_list` WebSocket Topic

Enable the topic with the normal topic WebSocket endpoint:

```json
{"enable_topic": "/submap_list"}
```

Example payload:

```json
{
  "topic": "/submap_list",
  "slam_state": "positioning",
  "uuid": "681dc447472ac49d7b074fa1",
  "submap": [
    {
      "trajectory_id": 12,
      "submap_index": 3,
      "submap_version": 42,
      "pose_position_x": 1.25,
      "pose_position_y": -3.5,
      "pose_position_z": 0,
      "pose_orientation_x": 0,
      "pose_orientation_y": 0,
      "pose_orientation_z": 0.7071,
      "pose_orientation_w": 0.7071,
      "is_frozen": true,
      "is_incremental_submap": false,
      "is_nearby_map": false
    }
  ]
}
```

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `slam_state` | string | One of `invalid`, `slam`, or `positioning`. |
| `uuid` | string | SLAM session identifier. This is part of the HTTP fetch key. |
| `submap` | array | Current submap entries. Each entry is one cartographer submap. |

Each entry in `submap` contains:

| Field | Type | Notes |
| --- | --- | --- |
| `trajectory_id` | integer | Cartographer trajectory ID. |
| `submap_index` | integer | Submap index within the trajectory. |
| `submap_version` | integer | Incrementing content version. Refetch textures when this changes. |
| `pose_position_x`, `pose_position_y`, `pose_position_z` | number | Submap position in world coordinates. |
| `pose_orientation_x`, `pose_orientation_y`, `pose_orientation_z`, `pose_orientation_w` | number | Submap orientation quaternion. |
| `is_frozen` | boolean | Whether the submap is frozen. |
| `is_incremental_submap` | boolean | Whether the submap belongs to incremental mapping output. |
| `is_nearby_map` | boolean | Whether the submap comes from a nearby map source. |

### Usage Notes

- `uuid` changes when the SLAM session changes. Treat this as a cache boundary.
- `submap_version` is the invalidation token for the texture payload.
- The topic does not include the raster cells. It only tells you what to fetch and how to place it.

## `SubmapQueryV2` HTTP API

The texture payload is fetched through the forwarded ROS service endpoint:

```text
GET /ros/slam/submaps/{uuid}/{trajectory_id}/{submap_index}?ver={submap_version}
```

Example request:

```bash
curl \
  -H "Accept: application/x-protobuf" \
  "http://192.168.25.25:8090/ros/slam/submaps/681dc447472ac49d7b074fa1/12/3?ver=42" \
  -o submap_query.pb
```

### Path Parameters

| Name | Type | Notes |
| --- | --- | --- |
| `uuid` | string | Must match the `uuid` from `/submap_list`. |
| `trajectory_id` | integer | From the submap entry. |
| `submap_index` | integer | From the submap entry. |

### Query Parameters

| Name | Required | Notes |
| --- | --- | --- |
| `ver` | No | Version token for cache behavior. In normal usage, pass `submap_version`. |

### Response

Successful responses return:

- `200 OK`
- `Content-Type: application/x-protobuf`
- Protobuf message type `ros_messages.SubmapQueryV2Response`

The authoritative protobuf definitions live in the SDK source:

- `axbot-ts-sdk/src/proto/submap_query.proto`
- `axbot-ts-sdk/src/proto/geometry.proto`

Use those files as the source of truth for `ros_messages.SubmapQueryV2Response`, `SubmapTexture`, and `Pose`.

### Texture Semantics

- One HTTP fetch returns all textures for that submap version.
- Most consumers treat `textures` as slice records indexed by slice ID.
- Some submaps may not contain every slice. A missing slice should be handled as absent rather than fatal.
- `cell_format` values currently mirror the protobuf definition:
  - `0`: `LOG_ODDS`
  - `1`: `TSDF_DELTA`
  - `2`: `INTENSITY`

### Cache Behavior

This endpoint is designed for version-aware caching:

- With `?ver=...`: `Cache-Control: public, max-age=31536000, immutable`
- Without `ver`: `Cache-Control: no-cache` with a weak `ETag`
- With matching `If-None-Match`: `304 Not Modified`

In practice, clients should pass `submap_version` as `ver` and cache by:

```text
(uuid, trajectory_id, submap_index, submap_version)
```

### Error Responses

| Status | Meaning |
| --- | --- |
| `400` | Invalid path parameters |
| `404` | ROS service reported the submap was not found |
| `500` | Failed to serialize protobuf response |
| `502` | ROS service call failed |
| `504` | ROS service was unavailable before timeout |

`404` is commonly treated as a cacheable missing result for the specific version key.

## Recommended Client Flow

### Raw API Flow

1. Open the topic WebSocket and enable `/submap_list`.
2. For each entry in `submap`, compare `(uuid, trajectory_id, submap_index, submap_version)` against your cache.
3. Fetch missing versions from `/ros/slam/submaps/...`.
4. Decode `SubmapQueryV2Response`.
5. Render `textures[*]` using the submap pose from `/submap_list` and the per-slice `slice_pose` from the protobuf.
6. Evict older cached versions after the new textures are committed.

### SDK Flow

The TypeScript SDK provides two levels of abstraction.

#### `SubmapCache` (recommended)

`SubmapCache<TSlice>` is a generic cache that handles fetch de-duplication, 404 caching, retry cooldowns, concurrency limiting, and resource lifecycle. You supply an **adapter** that converts a raw `SubmapTexture` into whatever slice type your renderer uses, and disposes it when evicted.

```ts
import { SubmapCache, type SubmapCacheAdapter } from '@kingsimba/axbot-sdk';
import { submapListEvents } from '@kingsimba/axbot-sdk';
import type { ros_messages } from '@kingsimba/axbot-sdk/proto';

// Example: adapter that stores the raw cells as a Uint8Array
const adapter: SubmapCacheAdapter<Uint8Array> = {
  buildSlice(tex: ros_messages.SubmapTexture): Uint8Array | null {
    return tex.cells ? new Uint8Array(tex.cells) : null;
  },
  disposeSlice(_slice: Uint8Array): void {
    // nothing to free for plain buffers
  },
};

const cache = new SubmapCache({ adapter });

submapListEvents.on((msg) => {
  cache.setUuid(msg.uuid);
  for (const submap of msg.submap) {
    cache
      .request(msg.uuid, submap.trajectory_id, submap.submap_index, 0, submap.submap_version)
      .then((cells) => {
        if (!cells) return;
        // render cells...
        cache.evictOldVersions(msg.uuid, submap.trajectory_id, submap.submap_index, 0, submap.submap_version);
      });
  }
});

// When the component/scene is torn down:
cache.dispose();
```

`SubmapCache` options:

| Option | Default | Notes |
| --- | --- | --- |
| `adapter` | required | `buildSlice` + `disposeSlice` callbacks |
| `api` | SDK `robotApi` singleton | Inject a custom object for testing |
| `maxConcurrentFetches` | `4` | Max parallel HTTP requests |
| `failureCooldownMs` | `3000` | Retry backoff per submap after a failed fetch |

#### `RobotApi.getSubmapQueryV2()` (low-level)

For one-off fetches or custom caching strategies, call the method directly:

```ts
import { robotApi } from '@kingsimba/axbot-sdk/robotApi';

const result = await robotApi.getSubmapQueryV2(uuid, trajectoryId, submapIndex, version);
if (result) {
  console.log(result.message.textures.length, result.payloadLength);
}
```

Returns `null` for HTTP `404`, throws on non-OK responses, and throws if the decoded protobuf reports a non-zero status code.

## Integration Notes

- The map renderer should use `/submap_list` as the authoritative list of active submaps.
- The binary payload is not JSON. Request it with `Accept: application/x-protobuf` and decode it as protobuf.
- A new `uuid` should invalidate all previously cached submap textures.
- A rapidly changing `/submap_list` can publish new versions before old fetches finish, so versioned keys are important.
- If you only need the current static map for localization, see [Current Map and Pose](./current_map_and_pose.md). Submaps are the live cartographer slices used for SLAM visualization.