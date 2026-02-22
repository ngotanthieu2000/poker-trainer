# Sprint 2 Dev Plan — 100% aligned with UX package

Version aligned: `UX v1.0.0`  
Last sync: `2026-02-22`

## 1) Scope implementation (in-scope)

### Workstream A — Unified UX states
- Chuẩn hóa state machine cho các màn hình chính: `loading|ready|empty|error`.
- Loại bỏ hiển thị mâu thuẫn trạng thái và flicker.
- Áp dụng copy/CTA theo `docs/ux/content-guidelines-vi.md`.

### Workstream B — Empty/Error guidance
- Review + Progress có actionable guidance theo `docs/ux/user-flows.md`.
- Mapping reason cho empty state (non-breaking):
  - `NO_HANDS`, `FILTERED_EMPTY`, `PROCESSING_ERROR`.

### Workstream C — Token + UI consistency
- Banner/status/CTA bám token trong `docs/ux/design-tokens.md`.
- Không hard-code semantic color hoặc text.

### Workstream D — i18n hardening
- Chuẩn hóa key VI cho toàn bộ state copy.
- Fallback unknown error thống nhất.

### Workstream E — Regression safety
- Test transitions state + error recovery + i18n consistency.

## 2) Proposed code touchpoints
- `src/ui/poker-table-controller.js`
- `src/ui/table-ui.js`
- `src/review/review-module.js`
- `src/progress/progress-metrics.js`
- `src/api/progress-stats-handler.js`
- `src/i18n/messages-vi.js`
- `tests/day7-table-ui-coach.test.js`
- `tests/day9-progress-dashboard.test.js`
- `tests/day10-vi-localization-consistency.test.js`

## 3) Delivery sequence (10 ngày)
1. Chốt state contract + reason mapping.
2. Refactor table/controller anti-flicker.
3. Refactor review/progress empty guidance.
4. Đồng bộ i18n VI + CTA naming.
5. Token alignment cho banner/CTA.
6. Viết regression tests.
7. QA pass + bugfix vòng 1.
8. QA pass + bugfix vòng 2.
9. Freeze docs + evidence.
10. Release gate.

## 4) DoR / DoD

### DoR
- UX package đủ 6 file trong `docs/ux/`.
- Có checklist QA cho 5 flow lỗi.
- Có mapping key i18n và ownership rõ.

### DoD
- Tất cả flow mục tiêu pass theo UX package.
- Không còn bug P1 UX trạng thái.
- Test liên quan pass trong CI/local.
- Docs thực thi (`dev/backlog/qa`) đồng bộ cùng version UX.

## 5) Out of scope
- Mở feature mới ngoài UX polish.
- Thay đổi engine correctness sâu hoặc persistence architecture.
- Thay đổi auth/security không phục vụ trực tiếp UX package.