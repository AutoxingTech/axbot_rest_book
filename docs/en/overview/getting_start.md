# 初步上手

## 建立连接

要控制机器人，首先要打通和机器人的网络连接。

可以把控制软件直接部署到机器人设备上，用 localhost 和机器人通讯。或者也可以使用外部设备，和机器人建立起有线或者无线网络连接。网络打通后，就可以通过 HTTP 协议和机器人完成通讯。默认端口为 8000。

本教程为了简单说明问题，直接 SSH 到机器人上进行操作。

## 安全验证

我们假定和机器人的通讯是在安全的内网环境，目前只有一个简单的 KEY 验证。所以，只需要增加以下 HTTP header，就可以通过验证。(XXXXXXXXXXXXXXXXX 隐去了真实的 Secret。需要申请获得。)

```
Secret: XXXXXXXXXXXXXXXXX
```

## 第一个请求：获取机器人设备信息

以下命令演示了如何获得设备基础信息。使用 curl 命令来发起 HTTP 请求，并使用 [jq](https://stedolan.github.io/jq/) 来格式化输出：

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
后续请求都需要加 `-H "Secret: XXX"。为了简便，文档中不再重复。
:::
