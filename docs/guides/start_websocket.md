# Start Websocket

Besides REST API, we have websocket for realtime information.

Unlike REST API's request/response behavior, Websocket allows constantly two-way communication between the client and the server(robot).
This is especially useful when the robot needs to report back fast changing information, such as:

- The pose of the robot
- Planning state
- Current map
- Current target
- ...

## Get the Pose of the Robot

For studying purpose, we use `wscat` to test Websocket.
On Ubuntu, use `sudo apt install node-ws` to install it. Or with NodeJS, use `sudo npm -g i wscat`.

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
connected (press CTRL+C to quit)
> {"enable_topic": "/slam/state"}
< {"enabled_topics": ["/slam/state"]}
> {"enable_topic": "/tracked_pose"}
< {"enabled_topics": ["/tracked_pose", "/slam/state"]}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
< {"topic": "/slam/state", "state": "positioning", "reliable": true}
< {"topic": "/tracked_pose", "pos": [-3.553, -0.285], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.553, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.548, -0.288], "ori": -1.28}
< {"topic": "/tracked_pose", "pos": [-3.55, -0.285], "ori": -1.28}
```

The `v2` in `/ws/v2/topics` is the Websocket API version.
For now, `v2` is the only version. We tried to maintain a stable API, but if major change happens and API must be changed,
we shall provide a updated version.

In the example above, two topics are subscribed:

- `/slam/state` for positioning state update.
- `/tracked_pose` for pose update.

Afterwards when positioning state or robot pose changes, the server will notify use actively.

## Remote Control

Websocket is more responsive than REST API. It's more suitable for realtime activities, such as remote control.

First, we need to switch control mode to `remote`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "remote"}' \
  http://192.168.25.25:8090/services/wheel_control/set_control_mode
```

And then, use websocket to send control commands:

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
connected (press CTRL+C to quit)
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
```

`linear_velocity: 0, angular_velocity: -0.6522` means stay on the same spot(linear velocity 0) and rotate to the right(with angular velocity -0.6522 radian / second).

::: danger
Don't send lots of `/twist` commands. One must wait for `/twist_feedback` before sending another twist.
It's especially important for Internet that goes sluggish.

Commands tends to pile up in socket buffer.
Even when you stop sending commands, buffered commands will still be received on the remote side.
The robot will move for a very long time until all commands are consumed.
:::
