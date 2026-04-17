# Autoxing Robot REST API

The Autoxing Robot REST API allows you to command the robot to perform tasks such as mapping, moving, and communicating with other IoT devices (such as gateways or elevators).

<video width="100%" controls>
  <source src="./The_Autoxing_API.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## TypeScript SDK

A typed TypeScript client is available as [`@kingsimba/axbot-sdk`](https://www.npmjs.com/package/@kingsimba/axbot-sdk). It wraps the REST endpoints and WebSocket topics described in this book and provides first-class TypeScript types for all request and response shapes.

An interactive demo application built on top of the SDK is available at [`axbot-ts-sdk-demo`](https://github.com/AutoxingTech/axbot-ts-sdk-demo). It shows live REST and WebSocket usage and is a useful starting point for custom integrations.

