# Getting Started

## Connect to Robot

To control the robot, first we must establish a connection.

There are two ways to connect to the robot:

1. Deploy your control program on the robot's main board. Use `http://localhost:8000`.
2. Use a wired or wifi connection to connect to the robot and form a local network. Use `http://192.168.12.1:8000`.

In this document, we shall login onto the robot and use `localhost:8000`.

## Authentication

A secure local network is assumed, so we only have a simple HTTP header based authentication.
(The real secret is masked as XXXXXXXXXXXXXXXXX)

```
Secret: XXXXXXXXXXXXXXXXX
```

## First Request: Query Device Info

The following command uses `curl` to make a HTTP request, and use [jq](https://stedolan.github.io/jq/) to format the output：

```bash
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://localhost:8000/device/status | jq
```

```json
{
  "time": "2022/03/17 12:28:21",
  "version": "1.8.x",
  "sn": "618111110000110",
  "nickname": "proto_pi_1000"
}
```

::: tip
All request must have `-H "Secret: XXX". But for simplicity, in this tutorial, we will not repeat it anymore.
:::
