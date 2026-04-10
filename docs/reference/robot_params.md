# Robot Parameters API

The current SDK no longer uses the legacy `/robot-params` JSON endpoints documented in older versions of this book. Instead, it wraps the YAML parameter-file endpoints under `/device/params/{type}`.

| SDK helper | Method | Path | Return type |
| --- | --- | --- | --- |
| `getDeviceParams(type)` | `GET` | `/device/params/prod` or `/device/params/dev` | YAML text |
| `updateDeviceParams(type, yamlContent)` | `PUT` | `/device/params/prod` or `/device/params/dev` | raw `Response` |

`type` must be either `prod` or `dev`.

## Get Parameter Files

```bash
curl "$ROBOT_API_BASE/device/params/prod"
curl "$ROBOT_API_BASE/device/params/dev"
```

Current robots return YAML, not JSON. Example excerpt:

```yaml
push_handle:
  enable: true
  always_in_push_mode: true

planning:
  planner_name: graph
  use_smac_follow_graph: true
  dwa_v2:
    lookahead_time: 0.5
    linear_interval_low: 0.01
    linear_interval_high: 0.15

lidar:
  enabled_nodes: [lidar_node]
```

## Update Parameter Files

```bash
curl -X PUT \
  -H "Content-Type: text/yaml" \
  --data-binary @prod.yaml \
  "$ROBOT_API_BASE/device/params/prod"
```

The SDK uses `Content-Type: text/yaml` and sends the YAML body unchanged.

## When To Use This API

Use the parameter-file API for low-level platform configuration that is versioned as YAML. For day-to-day runtime tuning and operator-facing configuration, prefer [System Settings](./system_settings.md).

## Legacy `/robot-params` Endpoints

The previous version of this page documented `GET /robot-params`, `POST /robot-params`, and `GET /robot-params/default`. Those endpoints are not part of the current SDK surface and should be considered legacy until verified on the target robot build.
