# Move API

The move endpoints below are the ones wrapped by the current SDK. The SDK also exports `MoveActionType` and `MoveAction` from `@kingsimba/axbot-sdk/msgs`, which are useful when you consume raw REST responses.

## SDK-backed endpoints

| SDK helper | Method | Path | Notes |
| --- | --- | --- | --- |
| `createMove(opts)` | `POST` | `/chassis/moves` | Creates a move action |
| `getMoves()` | `GET` | `/chassis/moves` | Returns the move history |
| `getMoveById(id)` | `GET` | `/chassis/moves/{id}` | Returns one action or `null` in the SDK helper |
| `cancelCurrentMove()` | `PATCH` | `/chassis/moves/current` | Sends `{ "state": "cancelled" }` |

## Create Move

The SDK helper currently forwards this request shape:

```ts
interface CreateMoveOptions {
  type?: 'standard' | 'charge' | 'return_to_elevator_waiting_point' | 'enter_elevator' | 'leave_elevator' | 'along_given_route' | 'align_with_rack' | 'to_unload_point' | 'follow_target';
  target_x?: number;
  target_y?: number;
  target_ori?: number;
  charge_retry_count?: number;
  rack_area_id?: string;
}
```

Example:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"standard","target_x":1.25,"target_y":-0.8,"target_ori":1.57}' \
  "$ROBOT_API_BASE/chassis/moves"
```

The live REST API usually returns a JSON object for the new action. The SDK helper only exposes success as `true` or `false`, so use the raw endpoint directly if you need the returned ID immediately.

## Move Types

The current SDK exports these action types:

| Type | Meaning |
| --- | --- |
| `standard` | Drive to a target pose |
| `charge` | Go to the charger and dock |
| `return_to_elevator_waiting_point` | Retreat to the waiting point used by elevator workflows |
| `enter_elevator` | Enter an elevator |
| `leave_elevator` | Legacy action type retained for compatibility |
| `along_given_route` | Follow a predefined route |
| `align_with_rack` | Crawl under a rack before lifting it |
| `to_unload_point` | Drive to an unloading point |
| `follow_target` | Follow a continuously updated target |

## Get Move History

```bash
curl "$ROBOT_API_BASE/chassis/moves"
```

The SDK types describe each item like this:

```ts
interface MoveAction {
  id: number;
  creator: string;
  type: MoveActionType;
  state: 'idle' | 'moving' | 'succeeded' | 'failed' | 'cancelled';
  target_x?: number;
  target_y?: number;
  target_ori?: number;
  target_accuracy?: number;
  route_coordinates?: string;
  detour_tolerance?: number;
  use_target_zone?: boolean;
  charge_retry_count?: number;
  rack_area_id?: string;
  properties?: Record<string, any>;
  create_time: number;
  last_modified_time: number;
  fail_reason: number;
  fail_reason_str: string;
  fail_message: string;
}
```

Example response:

```json
{
  "id": 4409,
  "creator": "robot-admin-web",
  "state": "cancelled",
  "type": "standard",
  "target_x": 0.731,
  "target_y": -1.525,
  "target_ori": null,
  "charge_retry_count": 0,
  "fail_reason": 0,
  "fail_reason_str": "None - None",
  "fail_message": "",
  "create_time": 1647509573,
  "last_modified_time": 1647509573
}
```

## Get One Move

```bash
curl "$ROBOT_API_BASE/chassis/moves/4409"
```

The payload shape is the same as the list item.

## Cancel Current Move

```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"state":"cancelled"}' \
  "$ROBOT_API_BASE/chassis/moves/current"
```

## Real-time Monitoring

Use [Planning State](./websocket.md#planning-state) to monitor the currently executing move.

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
  "going_back_to_charger": false
}
```

Some robot builds publish additional fields such as `action_id`, `remaining_distance`, or `fail_reason_str`. Those fields are useful, but they are not currently part of the SDK's `PlanningStateMsg` type.

## Rack Workflow

For rack-handling robots, a typical workflow is:

1. Create a move with `type="align_with_rack"`.
2. Wait for the move to succeed.
3. Call `/services/jack_up`.
4. Wait for [Jack State](./websocket.md#jack-state) to report completion.
5. Create the transport move, usually `type="to_unload_point"`.
6. Call `/services/jack_down` at the unload position.

The robot footprint may expand after loading cargo. Monitor [Robot Model](./websocket.md#robot-model) if your client renders clearance or path overlays.

## Raw REST Fields Not Exposed By The Current SDK Helper

Older versions of this page documented fields such as `target_accuracy`, `route_coordinates`, `detour_tolerance`, `use_target_zone`, and structured `properties`. The SDK still exposes these fields in the `MoveAction` type, but the convenience helper `createMove()` does not currently provide first-class arguments for them.

If you rely on those fields, use the raw REST endpoint directly and validate the payload on the target robot build.
