# RFC-3: Create Map from Local File Paths

**Status**: Implemented  
**Date**: 2026-03-30

---

## Motivation

The existing `POST /maps/` endpoint supports two creation modes: from inline base64-encoded data, or from a `mapping_id`. Both require the map data (`.pbstream` and `.png`) to be serialized into the request body or copied from a mapping record.

When the source files already exist on the local filesystem (e.g. restored from backup, transferred via `scp`, or produced by an external tool), encoding them into base64 is wasteful. A new code path accepts local file paths and creates hard links directly into the map storage folder, avoiding data copying entirely.

---

## API

### `POST /maps/`

**Route selection**: When `mapping_id` is absent and `carto_map_filename` is present, the file-based path is used.

#### Request Body

```json
{
  "map_name": "Floor 1",
  "uid": "9109AE2A-AA51-4DAB-BBDB-36455B6ED36A",
  "map_version": 1,
  "create_time": 1711800000,
  "carto_map_filename": "/path/to/source.pbstream",
  "occupancy_grid_filename": "/path/to/source.png",
  "grid_origin_x": 1.5,
  "grid_origin_y": 2.5,
  "grid_resolution": 0.05,
  "overlays_version": 1,
  "overlays": "{}"
}
```

| Field | Required | Description |
|---|---|---|
| `map_name` | Yes | Unique name for the map |
| `uid` | No | UUID-1 format or 24-char string. Auto-generated if omitted |
| `map_version` | No | Must be ≥ 1. Defaults to 1 |
| `carto_map_filename` | Yes | Absolute path to an existing `.pbstream` file |
| `occupancy_grid_filename` | Yes | Absolute path to an existing `.png` file |
| `grid_origin_x` | No | Grid origin X coordinate |
| `grid_origin_y` | No | Grid origin Y coordinate |
| `grid_resolution` | No | Grid cell size in meters |
| `overlays_version` | No | Defaults to 1 |
| `overlays` | No | JSON string of overlay data |

#### Response — `201 Created`

```json
{
  "id": 42,
  "uid": "9109AE2A-AA51-4DAB-BBDB-36455B6ED36A",
  "map_name": "Floor 1",
  "create_time": 1711800000,
  "map_version": 1,
  "overlays_version": 1
}
```

#### Errors — `400 Bad Request`

- `carto_map_filename`: returned when the file does not exist
- `occupancy_grid_filename`: returned when the file does not exist
- `map_version`: returned when value < 1

---

## Implementation

### `MapCreateWithFileSerializer` (`maps/maps_list_view.py`)

- `carto_map_filename` and `occupancy_grid_filename` are declared as `write_only` `CharField` fields (not model columns).
- Validators confirm both files exist on disk.
- `create()` pops the two filenames from validated data, calls `super().create()` to persist the model (with empty `carto_map` and `occupancy_grid` blobs), then hard-links the source files into `/opt/ax-cache/maps/{id}/`.

### Storage

Files are stored at the same paths as the data-based flow:

- `/opt/ax-cache/maps/{id}/map_{id}.pbstream`
- `/opt/ax-cache/maps/{id}/map_{id}.png`

Hard links (`os.link`) are used instead of copying — the source and destination share the same inode. The source files remain untouched and can be deleted independently.

---

## Backward Compatibility

Additive. Existing creation modes (inline data and `mapping_id`) are unchanged. The file-based path is only activated when `carto_map_filename` is present and `mapping_id` is absent.
