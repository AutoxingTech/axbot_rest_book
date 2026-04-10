# Mapping API

The current SDK wraps the lifecycle operations for mapping tasks and the shortcut that saves a finished mapping as a map.

## SDK-backed endpoints

| SDK helper | Method | Path | Request body |
| --- | --- | --- | --- |
| `startMapping(continueMapping)` | `POST` | `/mappings/` | `{ "continue_mapping": boolean }` |
| `stopMapping()` | `PATCH` | `/mappings/current` | `{ "state": "finished" }` |
| `abortMapping()` | `PATCH` | `/mappings/current` | `{ "state": "cancelled" }` |
| `deleteMappingTask(mappingId)` | `DELETE` | `/mappings/{id}` | none |
| `saveMappingAsMap(mappingId, mapName)` | `POST` | `/maps/` | `{ "mapping_id": number, "map_name": string }` |

The SDK does not currently wrap mapping list or detail endpoints, but those raw REST endpoints are still commonly used by admin tooling.

## Start Mapping

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"continue_mapping":false}' \
  "$ROBOT_API_BASE/mappings/"
```

`continue_mapping=false` starts a fresh mapping task. `continue_mapping=true` requests incremental mapping on top of the current map.

Older docs mentioned `start_pose_type`; that field is not present in the current SDK helper and should be treated as build-specific.

## Stop Or Abort The Current Task

```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"state":"finished"}' \
  "$ROBOT_API_BASE/mappings/current"

curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"state":"cancelled"}' \
  "$ROBOT_API_BASE/mappings/current"
```

Finishing preserves the mapping artifacts. Cancelling stops the task without promoting it to a navigable map.

## Save A Mapping As A Map

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mapping_id":48,"map_name":"Warehouse A - Rev 2"}' \
  "$ROBOT_API_BASE/maps/"
```

This is the SDK-backed path for turning a finished mapping task into a map that can later be loaded with [Set Current Map](./current_map_and_pose.md#set-current-map).

## Delete A Mapping Task

```bash
curl -X DELETE "$ROBOT_API_BASE/mappings/48"
```

## Real-time Feedback During Mapping

The current SDK exports the WebSocket topic names needed for mapping UIs. The most useful ones are:

| Topic | Purpose |
| --- | --- |
| `/tracked_pose` | Current estimated pose |
| `/map` or `/map_v2` | Current occupancy map |
| `/trajectory` | Mapping trail |
| `/scan_matched_points2` | LiDAR points in the map frame |
| `/maps/5cm/1hz` or `/map/costmap` | Obstacle/cost map |
| `/slam/state` | Mapping versus positioning state |

![](./mapping.png)

## Raw REST Endpoints Not Wrapped By The Current SDK

The following mapping endpoints are still useful, but they are not currently wrapped by `robotApi.ts`:

| Endpoint | Typical use |
| --- | --- |
| `GET /mappings/` | List mapping tasks |
| `GET /mappings/{id}` | Inspect one mapping task |
| `GET /mappings/{id}/trajectories.json` | Retrieve the recorded trajectory |
| `GET /mappings/{id}/landmarks.json` | Retrieve collected landmarks on builds that support it |

Keep these endpoints in mind if you need admin-style tooling, but validate the payloads on the target robot build before coupling strongly to them.
