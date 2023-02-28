# Robot Params API

## Get Motion Metrics

```bash
curl http://localhost:8000/robot-params/
```

```json
{
  "/wheel_control/max_forward_velocity": 0.8,
  "/wheel_control/max_backward_velocity": -0.2,
  "/wheel_control/max_forward_acc": 0.26,
  "/wheel_control/max_forward_decel": -2.0,
  "/wheel_control/max_angular_velocity": 0.78,
  "/planning/auto_hold": true
}
```

## Set Motion Metrics

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"/wheel_control/max_forward_velocity": 1.2}'
  http://localhost:8000/robot-params/
```

Multiple params can be updated in one call.
