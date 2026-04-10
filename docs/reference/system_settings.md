# System Settings

The current SDK wraps the schema, effective settings, and user-settings patch endpoints.

| SDK helper | Method | Path | Return type |
| --- | --- | --- | --- |
| `getSettingsSchema()` | `GET` | `/system/settings/schema` | raw `Response` |
| `getEffectiveSettings()` | `GET` | `/system/settings/effective` | raw `Response` |
| `patchUserSettings(changes)` | `PATCH` | `/system/settings/user` | raw `Response` |

System settings are the preferred interface for runtime tuning. They are structured JSON documents rather than the lower-level YAML parameter files described in [Robot Parameters](./robot_params.md).

## Settings Layout

The robot maintains four logical documents:

| Document | Writable | Purpose |
| --- | --- | --- |
| `schema` | No | Describes every setting, its type, defaults, and constraints |
| `default` | No | Factory defaults |
| `user` | Yes | User-provided overrides |
| `effective` | No | Final values after applying `user` on top of `default` |

Only `user` is intended to be changed by clients.

## Get The Schema

```bash
curl "$ROBOT_API_BASE/system/settings/schema"
```

A current robot returns records like these:

```json
{
  "ax": [
    {
      "name": "robot.footprint",
      "title": "Robot: Footprint",
      "type": "array",
      "default": [[0, -0.369], [0.14, -0.366], [0.2, -0.346]]
    },
    {
      "name": "control.max_forward_velocity",
      "title": "Control: Max Forward Velocity",
      "type": "number",
      "default": 1.2,
      "range": "[0.05, 2.0]"
    },
    {
      "name": "control.emergency_stop_button_behavior",
      "title": "Control: Emergency Stop Button Behavior",
      "type": "option",
      "default": "bounce_up",
      "options": ["bounce_up", "manual_release", "manual_release_safe"]
    }
  ]
}
```

Compared with older robot releases, current schema payloads use generic type labels such as `array`, `number`, `bool`, and `option`.

## Get Effective Settings

```bash
curl "$ROBOT_API_BASE/system/settings/effective"
```

Example excerpt:

```json
{
  "robot.footprint": [[0, -0.369], [0.14, -0.366], [0.2, -0.346]],
  "control.auto_hold": true,
  "control.emergency_stop_button_behavior": "manual_release",
  "control.max_forward_velocity": 0.81,
  "control.max_backward_velocity": -0.5,
  "bump_based_speed_limit.enable": false,
  "rack.specs": [
    {
      "width": 0.66,
      "depth": 0.7,
      "margin": [0, 0, 0, 0],
      "alignment": "center",
      "alignment_margin_back": 0.02
    }
  ]
}
```

## Patch User Settings

```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"control.max_forward_velocity":0.9,"control.auto_hold":true}' \
  "$ROBOT_API_BASE/system/settings/user"
```

The SDK leaves response parsing to the caller by returning the raw `Response`.

## Common Setting Groups

| Prefix | Meaning |
| --- | --- |
| `robot.` | Physical geometry and safety margins |
| `control.` | Motion limits, holding behavior, estop settings |
| `navigation.` | Planner and smoother settings |
| `bump_based_speed_limit.` | Slowdown behavior on rough terrain |
| `rack.` | Rack dimensions and loading geometry |
| `forklift.` | Cargo-handling behavior on forklift-style robots |

## Raw REST Endpoints Not Wrapped By The Current SDK

Older docs also referenced `GET /system/settings/default` and `GET /system/settings/user`. Those endpoints may still be available on the robot, but they are not wrapped by the current SDK and should be treated as raw REST integrations.
