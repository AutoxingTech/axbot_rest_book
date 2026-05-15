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
4. **Link Preservation**: Maintain all internal and external links, ensuring they point to the correct localized version if applicable (e.g., internal links should point to `/zh/...`).

## Workflow

1. **Source Discovery**: Identify the English source file (e.g., `docs/reference/maps.md`).
2. **Target Mapping**: Locate or create the target Chinese file (e.g., `docs/zh/reference/maps.md`).
3. **Verification**: Compare headings and structure between source and target.
4. **Translation**:
   - Translate all prose and headings.
   - Translate table headers and cell content.
   - Translate comments inside code blocks.
   - Ensure technical terms (e.g., "Namespace", "Payload", "Topic") are translated according to established project conventions or industry standards.

## Quality Checklist

- [ ] Are all headings identical in level and order?
- [ ] Are all code blocks present and identical in content (except comments)?
- [ ] Are all images and tables accounted for?
- [ ] Do all internal links resolve correctly to the `/zh/` path?
