---
description: "Use when: creating or editing any documentation page. Covers keeping English (docs/) and Chinese (docs/zh/) versions in sync."
applyTo: "docs/**"
---

# Bilingual Docs Rules

This project documents all content in **both English and Chinese**. Every page under `docs/` has a matching translation under `docs/zh/`.

## File Mapping

| Language | Path                |
| -------- | ------------------- |
| English  | `docs/<page>.md`    |
| Chinese  | `docs/zh/<page>.md` |

For example, `docs/reference/maps.md` ↔ `docs/zh/reference/maps.md`.

## Rules

- **Always update both the English and Chinese versions of any doc page you touch.**
- When adding a new page, create the English page under `docs/` and the Chinese translation under `docs/zh/` at the same path.
- When adding new fields, examples, API endpoints, WebSocket topics, or services, apply the same change to both files.
- Keep JSON examples, anchors, links, and code blocks identical; translate only prose, comments, and descriptions.
- Also update all changelogs (see [sync-changelogs.instructions.md](sync-changelogs.instructions.md)).
