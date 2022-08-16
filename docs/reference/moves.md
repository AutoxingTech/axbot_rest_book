# Move API

## Create Move Action

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"creator": "xxx", "type": "standard" ...}'
  http://localhost:8000/chassis/moves
```

**Returns**

```json
{
  "id": 5 // The Id of the newly created action
}
```

**Request Parameters**

```ts
interface MoveActionCreate {
  creator: string; // Initiator of the action. For diagnosis only.
  type:
    | 'standard'
    | 'charge' // to to charger and docker with it
    | 'return_to_elevator_waiting_point'
    | 'enter_elevator'
    | 'leave_elevator';
  target_x?: number;
  target_y?: number;
  target_z?: number;
  target_ori?: number;
  target_accuracy?: number; // in meters. optional.

  // if true, action will succeed right away
  // when within radius of `target_accuracy`
  use_target_zone?: boolean = false;

  charge_retry_count?: number; // retry times before `charge` action fails.
}
```

## Get Move Action Detail

```bash
curl http://localhost:8000/chassis/moves/4409
```

```json
{
  "id": 4409,
  "creator": "robot-admin-web",
  "state": "cancelled",
  "type": "standard",
  "target_x": 0.7310126134385344,
  "target_y": -1.5250144001960249,
  "target_z": 0.0,
  "target_ori": null,
  "target_accuracy": null,
  "use_target_zone": null,
  "is_charging": null,
  "charge_retry_count": 0,
  "fail_reason": 0,
  "fail_reason_str": "None - None",
  "fail_message": "",
  "create_time": 1647509573,
  "last_modified_time": 1647509573
}
```

**Response Explained**

```ts
interface MoveAction extends MoveActionCreate {
  state: 'idle' | 'moving' | 'succeeded' | 'failed' | 'cancelled';
  create_time: number; // unix timestamp, like 1647509573
  last_modified_time: number; // unix timestamp, like 1647509573
  fail_reason: number; // fail code. Only valid when state="failed"
  // internal fail messge - for debugging. Only valid when state="failed"
  fail_reason_str: string;
  // internal fail message in Chinese
  // for debugging，Only valid when state="failed"
  fail_message: string;
}
```

## Move Action List

The history of all move actions

```bash
curl http://localhost:8000/chassis/moves
```

```json
[
  {
    "id": 4409,
    "creator": "robot-admin-web",
    "state": "cancelled",
    "type": "standard",
    "fail_reason": 0,
    "fail_reason_str": "None - None",
    "fail_message": "",
    "create_time": 1647509573,
    "last_modified_time": 1647509573
  },
  {
    "id": 4408,
    "creator": "control_unit",
    "state": "succeeded",
    "type": "none",
    "fail_reason": 0,
    "fail_reason_str": "None - None",
    "fail_message": "",
    "create_time": 1647427995,
    "last_modified_time": 1647428509
  }
]
```

## Move State Feedback

Use websocket `/planning_state` to get updated of move state.

```json
{
  "topic": "/planning_state",
  "move_state": "moving",
  "target_poses": [
    {
      "pos": [2.3, 20.82],
      "ori": 0
    }
  ],
  "charger_pose": {
    "pos": [0, 0],
    "ori": 0
  },
  "going_back_to_charger": false,
  "action_id": 4410, // The current executing(or last) move action ID.
  "fail_reason": 0,
  "fail_reason_str": "none",
  "remaining_distance": 3.546117067337036,
  "move_intent": "none",
  "intent_target_pose": {
    "pos": [0, 0],
    "ori": 0
  },
  "stuck_state": "none"
}
```

## Cancel Current Move Action

```bash
curl -X PATCH \
  -H "Content-Type: application/json"
  -d '{state: "cancelled"}'
  http://localhost:8000/chassis/moves/current
```

```json
{ "state": "cancelled" }
```
