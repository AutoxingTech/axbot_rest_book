---
name: sync-sdk-to-rest-book
description: "Update axbot_rest_book docs with recent axbot-ts-sdk changes. Use when: syncing SDK changelog to REST book, adding new REST API docs, documenting new WebSocket topics, documenting new service endpoints, propagating SDK features to the docs site."
argument-hint: '[changelog entry or feature description]'
---

# Sync SDK Changes to REST Book

Use this skill when the `axbot-ts-sdk` CHANGELOG has entries that are not yet reflected in `axbot_rest_book`.

## Sources to Read

| What | Where |
| --- | --- |
| SDK changelog | `axbot-ts-sdk/CHANGELOG.md` |
| REST API implementation | `axbot-ts-sdk/src/robotApi.ts` |
| WebSocket topic types | `axbot-ts-sdk/src/topicMessages.ts`, `src/wsEventEmitter.ts` |
| Binary frame decoding | `axbot-ts-sdk/src/binaryMessageDecoder.ts` |
| Protobuf definitions | `axbot-ts-sdk/src/proto/*.proto` |
| Forwarded ROS services spec | `/home/simba/ax/build_all/src/ros-message-forwarder/docs/FORWARDED_ROS_SERVICES_API.md` |
| Site-side consumer code | `/home/simba/web/rb-admin/axbot-site/src/` (if relevant) |

## Procedure

### 1. Identify what is missing

Read `axbot-ts-sdk/CHANGELOG.md`. For each recent entry, check whether the corresponding content is already in `axbot_rest_book/docs/`. The book's changelog is at `axbot_rest_book/docs/other/changelog.md`.

### 2. Classify the change

| SDK changelog scope | Likely docs location |
| --- | --- |
| `robotApi: Add ... service` | `docs/reference/services.md` |
| `topicMessages: Add ... emitter` | `docs/reference/websocket.md` |
| `robotApi: Add ... fetch API` (binary/protobuf) | New dedicated page in `docs/reference/` |
| `robotApi: Add ... REST method` | `docs/reference/` — pick the closest existing page |

### 3. Gather implementation details

Read the relevant SDK source files (see Sources table above). For protobuf-based APIs, read the `.proto` file — do **not** copy the message body into the docs; reference the SDK file path instead.

### 4. Write the documentation

- **Existing page**: Add the new section in the correct alphabetical or logical position.
- **New dedicated page** (for major features): Create `docs/reference/<name>.md` and add the entry to the VuePress sidebar in `docs/.vuepress/config.js`.

Follow the style of existing pages:
- Use `curl` examples with `http://192.168.25.25:8090/...`
- Use fenced code blocks with correct language tag.
- For SDK usage, show the TypeScript SDK call alongside the raw HTTP.
- Do not duplicate proto message bodies; point to the `.proto` source file.

### 5. Update changelogs

Add an entry to **both**:
- `axbot_rest_book/CHANGELOG.md` (root, under `## 2.14.0` or appropriate version section)
- `axbot_rest_book/docs/other/changelog.md` (rendered docs changelog)

Entry format: `- YYYY-MM-DD Add [Description](../reference/page.md#anchor)`

### 6. Validate

```bash
cd /home/simba/web/sdk/axbot_rest_book && npm run docs:build
```

Build must complete with `success Generated static files`.

### 7. Commit

Use the `commit-changes` skill. Scope is `docs`. Example:

```
docs: Add <feature> to services/websocket/submaps reference
```

## Key Conventions

- Base URL in examples is always `http://192.168.25.25:8090`.
- Service endpoints are `POST /services/<name>` with no request body unless the SDK impl shows a payload.
- WebSocket topics are enabled with `{"enable_topic": "/topic_name"}`.
- Binary (protobuf) topics are noted with a warning that the payload is not JSON.
- The SDK sub-path import for robotApi is `@kingsimba/axbot-sdk/robotApi`; topic emitters come from `@kingsimba/axbot-sdk`.
