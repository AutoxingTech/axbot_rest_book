---
description: "Use when: adding new API, service, WebSocket topic, or feature to the docs. Covers keeping both English and Chinese changelogs in sync."
applyTo: "docs/other/changelog.md, docs/zh/other/changelog.md"
---
# Changelog Sync Rules

This project maintains **three** changelogs. All must be updated together when new APIs, WebSocket topics, services, or features are documented.

## Changelog Locations

| Language | File |
|----------|------|
| English (root) | `CHANGELOG.md` |
| English (rendered) | `docs/other/changelog.md` |
| Chinese (rendered) | `docs/zh/other/changelog.md` |

## Rules

- **Always add the same entry to all three files.**
- Each entry must have a date prefix: `- YYYY-MM-DD <description>`
- Link to the relevant reference doc page with anchor: `[text](../reference/page.md#anchor)`
- For Chinese entries, translate the description but keep the same link targets.
- Insert at the top of the current version section (`## 2.14.0` or whichever is latest).
