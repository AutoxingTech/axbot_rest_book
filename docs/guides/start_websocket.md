# Getting Started with WebSockets

In addition to the REST API, we provide WebSockets for real-time information.

Unlike the request-response model of the REST API, WebSockets allow for continuous two-way communication between the client and the server (the robot).
This is particularly useful for reporting rapidly changing information, such as:

- The pose of the robot
- Planning state
- Current map
- Current target
- ...

## Get the Pose of the Robot

For demonstration purposes, we will use `wscat` to test the WebSocket connection.
On Ubuntu, you can install it using `sudo apt install node-ws`. Alternatively, if you have Node.js installed, use `sudo npm install -g wscat`.

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

The `v2` in `/ws/v2/topics` represents the WebSocket API version.
Currently, `v2` is the only version available. We strive to maintain a stable API; however, if significant changes are required, we will provide an updated version.

In the example above, two topics are subscribed:

- `/slam/state` for positioning state updates.
- `/tracked_pose` for pose updates.

Once subscribed, the server will actively notify you whenever the positioning state or robot pose changes.

## Remote Control

WebSockets are more responsive than the REST API, making them better suited for real-time activities like remote control.

First, switch the control mode to `remote`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"mode": "remote"}' \
  http://192.168.25.25:8090/services/wheel_control/set_control_mode
```

Then, use the WebSocket to send control commands:

```bash
$ wscat -c ws://192.168.25.25:8090/ws/v2/topics
connected (press CTRL+C to quit)
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
> {"topic": "/twist", "linear_velocity": 0, "angular_velocity": -0.6522}
< {"topic": "/twist_feedback"}
```

`linear_velocity: 0, angular_velocity: -0.6522` instructs the robot to remain in place (linear velocity of 0) while rotating to the right (with an angular velocity of -0.6522 radians per second).

::: danger
Avoid sending a high volume of `/twist` commands in rapid succession. You should wait for a `/twist_feedback` message before sending the next command.
This is particularly important if the network connection is slow or unstable.

Commands can accumulate in the socket buffer.
Even after you stop sending commands, the robot will continue to receive and process those already in the buffer.
This could cause the robot to continue moving for an extended period until all buffered commands are executed.
:::
