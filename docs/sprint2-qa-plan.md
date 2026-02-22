# Sprint 2 QA Plan — UX package compliance

Version aligned: `UX v1.0.0`  
Last sync: `2026-02-22`

## 1) QA objective
Xác nhận implementation bám đúng UX package trong `docs/ux/` cho toàn bộ flow mục tiêu.

## 2) Test matrix theo flow

### Flow A — Table + Coach
- Case A1: loading hiển thị đúng copy.
- Case A2: ready không còn banner dư.
- Case A3: network error hiển thị CTA `Thử lại`.
- Case A4: retry thành công quay lại ready.
- Case A5: không flicker khi chuyển trạng thái nhanh.

### Flow B — Review
- Case B1: có dữ liệu -> render list/detail.
- Case B2: empty -> message + CTA `Bắt đầu ván mới`.
- Case B3: error -> CTA `Tải lại` hoạt động.

### Flow C — Progress
- Case C1: `NO_HANDS` -> guidance đúng.
- Case C2: `FILTERED_EMPTY` -> CTA `Xóa bộ lọc`.
- Case C3: `PROCESSING_ERROR` -> fallback error đúng.

### Flow D — Localization VI
- Case D1: tất cả string trạng thái lấy từ i18n.
- Case D2: không có English/hard-coded lọt UI.

## 3) Pass criteria
- 100% case critical (A1-A5, B2, C1-C3, D1) pass.
- Không còn defect P1 liên quan UX state/copy.
- Regression suite liên quan pass.

## 4) Evidence required
- Output test command và file test liên quan.
- Screenshot/log cho mỗi case fail.
- Mapping defect -> file UX source bị vi phạm.

## 5) Exit gate
- Dev + QA cùng sign-off checklist `docs/ux/handoff-checklist-dev.md`.
- Tài liệu thực thi và UX package cùng version/date sync.