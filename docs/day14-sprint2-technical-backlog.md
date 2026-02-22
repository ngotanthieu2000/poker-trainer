# Day 14 — Đề xuất backlog kỹ thuật Sprint 2

Nguyên tắc ưu tiên: **Security → Correctness → UX → Performance**.

## Top 5 ưu tiên Sprint 2

1. **[Security][P0] Session isolation + input hardening cho API handlers**
   - Chuẩn hóa validation/sanitization payload (action, amount, context fields).
   - Chặn invalid/poisoned inputs trước khi vào module coach/review/progress.
   - AC: bộ test negative cho malformed input + schema validation pass.

2. **[Correctness][P0] Mở rộng engine/review correctness cho postflop core paths**
   - Bổ sung rule transition + action legality cho flop/turn/river path quan trọng.
   - Đồng bộ grade/review mapping khi có postflop decisions.
   - AC: test matrix theo street, không còn placeholder logic ở nhánh critical.

3. **[Correctness][P1] Persistence layer cho hand history/progress (SQLite/Postgres adapter nhẹ)**
   - Tách storage interface, thêm adapter bền vững thay cho in-memory.
   - AC: restart không mất dữ liệu demo; migration/versioning tối thiểu.

4. **[UX][P1] Demo-grade UX polish: trạng thái loading/error nhất quán + empty-state guidance**
   - Cải thiện copy/actionable hint khi empty/error.
   - Bổ sung guard hiển thị để tránh trạng thái nhấp nháy/khó hiểu.
   - AC: checklist UX pass cho 5 flow lỗi thường gặp.

5. **[Performance][P2] Regression perf gate cho progress/render**
   - Chuẩn hóa benchmark script + ngưỡng cảnh báo khi regress > X%.
   - AC: CI job benchmark smoke, có output before/after rõ ràng.

## Backlog mở rộng (sau top 5)
- [Security][P1] Logging policy (masking fields nhạy cảm, tránh leak session metadata).
- [UX][P2] Dashboard drill-down theo position/street có giải thích học tập.
- [Performance][P2] Memoization/selective recompute cho panel stats khi state thay đổi nhỏ.
