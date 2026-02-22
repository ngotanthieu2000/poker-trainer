# Sprint 2 Backlog Execution — UX alignment

Version aligned: `UX v1.0.0`  
Last sync: `2026-02-22`

## Epic UX-STATE-01 — Unified state handling
- Priority: P1
- Goal: Đồng nhất trạng thái `loading|ready|empty|error` trên Table/Review/Progress.
- Tasks:
  - Refactor controller transitions (anti-flicker).
  - Tách status banner renderer dùng chung.
  - Thêm guard tránh state conflict.
- AC:
  - Không xuất hiện đồng thời loading+empty.
  - Retry flow hoạt động ổn định.

## Epic UX-CONTENT-02 — Vietnamese content consistency
- Priority: P1
- Goal: Chuẩn hóa copy + CTA theo guideline VI.
- Tasks:
  - Cập nhật i18n keys cho error/empty/loading.
  - Loại bỏ string hard-coded.
- AC:
  - 100% copy trạng thái đi qua i18n.
  - CTA naming nhất quán.

## Epic UX-EMPTY-03 — Actionable empty states
- Priority: P1
- Goal: Empty state có hướng hành động rõ theo nguyên nhân.
- Tasks:
  - Map reasonCode API (non-breaking).
  - Render guidance khác nhau cho `NO_HANDS` vs `FILTERED_EMPTY`.
- AC:
  - User luôn có CTA khả dụng.

## Epic UX-QA-04 — Regression protection
- Priority: P1
- Goal: Có test bảo vệ UX package.
- Tasks:
  - Thêm test transition state.
  - Thêm test 5 lỗi thường gặp.
  - Thêm test i18n consistency.
- AC:
  - Test pass, không flaky.

## Execution order
1. UX-STATE-01
2. UX-EMPTY-03
3. UX-CONTENT-02
4. UX-QA-04

## Risk notes
- Risk: anti-flicker làm trễ hiển thị lỗi.
- Mitigation: deterministic threshold + test timing clearly mocked.
- Risk: reasonCode bị coupling chặt.
- Mitigation: chỉ thêm optional field, fallback an toàn.