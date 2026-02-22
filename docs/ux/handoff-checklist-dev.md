# Handoff Checklist — UX Package to Dev

Version: `v1.0.0`  
Synced date: `2026-02-22`

## A. Files & Source of truth
- [x] Có đủ tài liệu trong `docs/ux/`.
- [x] Version và sync date được ghi rõ.
- [x] Mapping tới dev/QA docs Sprint 2.

## B. Implementation readiness
- [ ] Table/Coach có state machine rõ `loading|ready|empty|error`.
- [ ] Progress API giữ backward compatibility khi thêm `reasonCode`.
- [ ] Review/Progress empty-state có CTA theo guideline.
- [ ] i18n key VI đầy đủ, không thiếu key runtime.

## C. Test readiness
- [ ] Unit/integration test cho state transitions.
- [ ] Test cho 5 flow lỗi thường gặp.
- [ ] Test i18n consistency cho copy mới.

## D. QA handoff
- [ ] QA có checklist pass/fail theo từng flow.
- [ ] Có evidence terminal/test output.
- [ ] Có risk notes và fallback plan.

## E. Release gate
- [ ] Không còn bug P0/P1 liên quan trạng thái UX.
- [ ] Regression core flow pass.
- [ ] Tài liệu sprint2 cập nhật theo UX package.