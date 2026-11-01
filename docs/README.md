---
home: true
title: Autoxing Robot REST API
heroText: Autoxing Robot REST API
tagline: Command mapping, navigation and IoT integrations over one clean, typed robot API.
heroImage: /images/hero.svg
heroHeight: 420
footerHtml: true
footer: >-
  <span>Autoxing Robot REST API</span> ·
  <a href="https://github.com/AutoxingTech/axbot_rest_book" target="_blank" rel="noopener">GitHub</a> ·
  <a href="https://rb-admin.autoxing.com" target="_blank" rel="noopener">Robot Admin</a>
actions:
  - text: Get Started
    link: /overview/getting_start.md
    type: primary
  - text: API Reference
    link: /reference/maps.md
    type: secondary
features:
  - title: REST API
    details: Query device state and drive the robot — maps, moves, overlays, services and settings — with plain JSON over HTTP.
  - title: WebSocket Topics
    details: Subscribe to live pose, chassis, cargo, perception and system telemetry, pushed the moment the robot reports it.
  - title: TypeScript SDK
    details: '@kingsimba/axbot-sdk wraps every endpoint and topic in a fully typed client, with first-class request and response types.'
  - title: Robot Admin
    details: Fleet maps and configuration managed from rb-admin.autoxing.com, built on the same SDK this book documents.
---

## Start in one request

Every robot serves an HTTP API on its local network — no cloud round trip required.
Send the `Secret` header and ask the robot about itself:

```bash
curl -H "Secret: XXXXXXXXXXXXXXXXX" http://192.168.25.25:8090/device/info | jq
```

From there, the [getting started guide](/overview/getting_start.md) walks through connecting, mapping and sending your first move.

## TypeScript SDK

A typed TypeScript client is available as [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk). It wraps the REST endpoints and WebSocket topics described in this book and provides first-class TypeScript types for all request and response shapes.

An interactive demo application built on top of the SDK is available at [`axbot-ts-sdk-demo`](https://github.com/AutoxingTech/axbot-ts-sdk-demo). It shows live REST and WebSocket usage and is a useful starting point for custom integrations.

This TypeScript SDK powers the robot monitoring platform [rb-admin.autoxing.com](https://rb-admin.autoxing.com). The SDK and the platform are developed in tandem — API additions, protocol changes, and new capabilities are implemented in the SDK first and consumed by the platform immediately.
