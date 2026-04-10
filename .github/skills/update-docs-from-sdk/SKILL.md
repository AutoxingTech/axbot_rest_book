---
name: update-docs-from-sdk
description: Update axbot REST API documentation from the sibling axbot-ts-sdk source. Use when syncing docs pages like services.md, websocket.md, moves.md, bags.md, recordings.md, or videos.md to the SDK ground truth.
argument-hint: '[target doc file or api area]'
---

# Update Docs From SDK

Use this skill when maintaining the documentation in `axbot_rest_book` from the SDK source in the sibling repository `axbot-ts-sdk`.

## Ground Truth

- REST endpoints and request/response behavior live in `../axbot-ts-sdk/src/robotApi.ts`.
- WebSocket topics and message shapes live in `../axbot-ts-sdk/src/topicMessages.ts`.
- Barrel exports live in `../axbot-ts-sdk/src/msgs.ts`.
- The SDK package metadata lives in `../axbot-ts-sdk/package.json`.

The SDK is the source of truth. The docs are manually curated and should be updated to match the SDK without removing valid narrative examples.

## File Mapping

- `docs/reference/services.md` <- service methods in `robotApi.ts`
- `docs/reference/websocket.md` <- `TopicNames` and topic message interfaces in `topicMessages.ts`
- `docs/reference/moves.md` <- `createMove`, `getMoves`, `getMoveById`, `cancelCurrentMove`, `MoveActionType`
- `docs/reference/maps.md` <- `deleteMap`, `saveMappingAsMap`
- `docs/reference/mappings.md` <- `startMapping`, `stopMapping`, `abortMapping`, `deleteMappingTask`
- `docs/reference/current_map_and_pose.md` <- `setPose`, `setMap`
- `docs/reference/device.md` <- `getDeviceInfo`, `getBootProgress`, `getWifiInfo`
- `docs/reference/system_settings.md` <- `getSettingsSchema`, `getEffectiveSettings`, `patchUserSettings`
- `docs/reference/robot_params.md` <- `getDeviceParams`, `updateDeviceParams`
- `docs/reference/bags.md` <- `removeBag`, `getBagPlayerMetadata`, `getBagPlayerChunk`, `getBagPlayerChunkStream`
- `docs/reference/recordings.md` <- `saveBag`, `removeRecording`
- `docs/reference/videos.md` <- `removeVideo`

## Workflow

1. Read the target doc page fully.
2. Read the relevant SDK source file sections.
3. Extract the exact HTTP method, path, parameter names, and return behavior from the SDK.
4. Update the target doc page to reflect the SDK.
5. Preserve still-correct prose, examples, and warnings.
6. Add new sections for undocumented SDK capability rather than deleting useful context.
7. Mark deprecated items explicitly when the SDK source or existing docs indicate deprecation.

## Output Rules

- Keep the existing VuePress markdown style.
- Prefer concise tables for endpoint overviews.
- Keep request/response examples realistic and aligned with existing docs tone.
- Do not invent endpoints that are not present in the SDK.
- If a capability is present in docs but not in the SDK, flag it for review instead of silently deleting it.

## Special Notes

- `robotApi.ts` does not include authentication handling. Do not add auth claims to the docs unless they already exist elsewhere in the book.
- `topicMessages.ts` contains many more topic interfaces than some current docs pages mention. Add missing topics conservatively, grouped by function when possible.
- Hidden pages in the VuePress sidebar may still be valid and should be restored if their SDK support exists.