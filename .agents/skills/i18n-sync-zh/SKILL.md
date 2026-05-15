# i18n-sync-zh Skill

Synchronize and translate English documentation to Simplified Chinese (`zh`) for the AxBot REST Book.

## Overview

This skill ensures that the Chinese documentation remains a perfect mirror of the English source documentation in structure and content while providing accurate translations.

## Core Rules

1. **Structural Parity**: The Chinese page must have the exactly same structure as the English page. This includes:
   - Identical Heading levels and order.
   - Identical paragraph counts and layout.
   - Identical tables (translated content).
   - Identical images and links.
2. **Code Block Fidelity**:
   - All code blocks (Shell, JSON, TypeScript, etc.) must be exactly the same as the English version.
   - **Exception**: Translate comments within the code blocks to Simplified Chinese.
3. **Pseudo-code & Schema**: Pseudo-code and JSON examples must remain identical in structure and values.
4. **Explicit Anchor Names**:
   - Every header (Level 1, 2, 3) MUST have an explicit anchor ID appended to it that matches the English slug.
   - Syntax: `## 中文标题 (English Title) {#english-slug}`.
   - This ensures that internal links using `#` (e.g., `./websocket.md#sensor-manager-state`) remain consistent across all languages.
5. **Link Preservation & Asset Paths**:
   - Maintain all internal and external links.
   - Reference original assets in `docs/reference/` or `docs/guides/` using relative paths (e.g., `../../reference/image.png`) to avoid duplication.

## Workflow

1. **Source Discovery**: Identify the English source file (e.g., `docs/reference/maps.md`).
2. **Target Mapping**: Locate or create the target Chinese file (e.g., `docs/zh/reference/maps.md`).
3. **Verification**: Compare headings and structure between source and target.
4. **Translation & Anchor Tagging**:
   - Translate all prose and headings.
   - Append `{#anchor-id}` to every translated heading.
   - Translate table headers and cell content.
   - Translate comments inside code blocks.
5. **Validation**: Run the automated link checker on modified files: `npm run docs:check-links:modified`.

## Quality Checklist

- [ ] Are all headings identical in level and order?
- [ ] Does every heading have a `{#...}` explicit anchor?
- [ ] Are all code blocks present and identical in content (except comments)?
- [ ] Do all image paths point correctly to the common asset directories?
- [ ] Does `npm run docs:check-links` pass with zero internal errors?
