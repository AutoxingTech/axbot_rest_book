# Autoxing Robot REST API

The Autoxing Robot REST API allows you to command the robot to perform tasks such as mapping, moving, and communicating with other IoT devices (such as gateways or elevators).

## TypeScript SDK

A typed TypeScript client is available as [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk). It wraps the REST endpoints and WebSocket topics described in this book and provides first-class TypeScript types for all request and response shapes.

An interactive demo application built on top of the SDK is available at [`axbot-ts-sdk-demo`](https://github.com/AutoxingTech/axbot-ts-sdk-demo). It shows live REST and WebSocket usage and is a useful starting point for custom integrations.

This TypeScript SDK powers the robot monitoring platform [rb-admin.autoxing.com](https://rb-admin.autoxing.com). The SDK and the platform are developed in tandem — API additions, protocol changes, and new capabilities are implemented in the SDK first and consumed by the platform immediately.

## Build

This documentation is built using [VuePress](https://vuepress.vuejs.org/).

Before building, install VuePress and all required dependencies:

```bash
yarn install
```

## Development

To run a local development server:

```bash
yarn run docs:dev
```

Then view the pages at http://localhost:8080/
