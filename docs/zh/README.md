---
home: true
title: 景行慧动机器人 REST API
heroText: 景行慧动机器人 REST API
tagline: 一套简洁、类型完备的机器人接口，完成建图、导航与 IoT 设备协同。
heroImage: /images/hero.svg
heroHeight: 420
footerHtml: true
footer: >-
  <span>景行慧动机器人 REST API</span> ·
  <a href="https://github.com/AutoxingTech/axbot_rest_book" target="_blank" rel="noopener">GitHub</a> ·
  <a href="https://rb-admin.autoxing.com" target="_blank" rel="noopener">Robot Admin</a>
actions:
  - text: 快速开始
    link: /zh/overview/getting_start.md
    type: primary
  - text: 参考手册
    link: /zh/reference/maps.md
    type: secondary
features:
  - title: REST API
    details: 通过 HTTP 与 JSON 查询设备状态、下发任务 —— 地图、移动、覆盖层、服务与系统设置。
  - title: WebSocket 话题
    details: 订阅位姿、底盘、载具、感知与系统状态等实时话题，机器人上报即刻推送。
  - title: TypeScript SDK
    details: '@kingsimba/axbot-sdk 封装了全部端点与话题，提供完整的请求、响应类型定义。'
  - title: Robot Admin
    details: 在地图与车辆管理平台 rb-admin.autoxing.com 中完成调度配置，与本手册同源。
---

## 一次请求即可开始

每台机器人都在本地网络中提供 HTTP API，无需经过云端中转。
带上 `Secret` 请求头，先让机器人介绍一下自己：

```bash
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://192.168.25.25:8090/device/info | jq
```

接下来可以阅读[入门指南](/zh/overview/getting_start.md)，了解如何连接设备、建图并下发第一个移动任务。

## TypeScript SDK

我们提供了一个强类型的 TypeScript 客户端：[`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk)。它封装了本手册中描述的 REST 端点和 WebSocket 主题，并为所有请求和响应格式提了卓越的 TypeScript 类型支持。

基于该 SDK 构建的交互式演示程序可在 [`axbot-ts-sdk-demo`](https://github.com/AutoxingTech/axbot-ts-sdk-demo) 找到。它展示了 REST 和 WebSocket 的实时使用方法，是进行自定义集成的良好起点。

该 TypeScript SDK 驱动着机器人监控平台 [rb-admin.autoxing.com](https://rb-admin.autoxing.com)。SDK 与平台同步开发 —— 新增接口、协议变更与新能力总是先在 SDK 中实现，平台随即接入。
