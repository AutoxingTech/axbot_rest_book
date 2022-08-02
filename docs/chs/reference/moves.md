# 运动控制 API

## 创建 Move Action

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"creator": "xxx", "type": "standard" ...}'
  http://localhost:8000/chassis/moves
```

**返回**

```json
{
  "id": 5 // 返回新创建的id
}
```

**参数说明**

```ts
interface MoveActionCreate {
  creator: string; // 创建者，用于后续确定谁创建的任务，方便调试
  type:
    | 'standard' // 一般运动
    | 'charge' // 充电
    | 'return_to_elevator_waiting_point' // 返回电梯待梯点
    | 'enter_elevator' // 进电梯
    | 'leave_elevator'; // 出电梯
  target_x?: number;
  target_y?: number;
  target_z?: number;
  target_ori?: number;
  target_accuracy?: number; // 如果不提供，则使用默认的精度。
  use_target_zone?: boolean = false; // 如果为 true，则进入 target_accuracy 的范围就立刻停车。
  charge_retry_count?: number; // 充电重试次数。只有当 type = "charge" 时有效。
}
```

## 获取 Move Action 详情

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

**返回值说明**

```ts
interface MoveAction extends MoveActionCreate {
  state: 'idle' | 'moving' | 'succeeded' | 'failed' | 'cancelled';
  create_time: number; // unix timestamp, like 1647509573
  last_modified_time: number; // unix timestamp, like 1647509573
  fail_reason: number; // 失败错误码，当 state="failed" 时有效
  fail_reason_str: string; // 内部失败错误信息-用于调试，当 state="failed" 时有效
  fail_message: string; // 中文的失败错误信息-用于调试，当 state="failed" 时有效
}
```

## 查看所有 Move Actions

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

## 运动状态反馈

使用 websocket 的 `/planning_state` 频道，获取运动状态更新。

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
  "action_id": 4410,
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

## 取消当前运动

```bash
curl -X PATCH \
  -H "Content-Type: application/json"
  -d '{state: "cancelled"}'
  http://localhost:8000/chassis/moves/current
```

```json
{ "state": "cancelled" }
```
