# Day 14 — Sprint Review kỹ thuật (Sprint 1)

## 1) Demo flow kỹ thuật đề xuất

Luồng demo chuẩn (10–15 phút):

1. **Khởi tạo table controller**
   - Input: hero position + stacks + toCall + support level.
   - Kỳ vọng: render HTML có state `ready`, labels tiếng Việt.

2. **Pre-action coaching**
   - Gọi `loadPreActionHint()`.
   - Kỳ vọng: nhận `source`, `recommendedAction`, `distribution`, `messageVi`.

3. **Player action + grading**
   - Gọi `submitAction('call')` (hoặc action khác).
   - Kỳ vọng: cập nhật pot/stack hợp lệ; trả grade `Good/Mistake/Major Mistake`.

4. **Review sau hand**
   - Gọi `renderReview()`.
   - Kỳ vọng: hiển thị marker + `Mất EV` + note tiếng Việt.

5. **Progress stats**
   - Gọi `computeProgressStats(handHistories)` hoặc handler.
   - Kỳ vọng: accuracy theo vị trí/street + top mistakes + recent hands.

## 2) DoD (Definition of Done) — đạt/chưa đạt

### Đã đạt
- [x] Có luồng E2E cơ bản: play → coach → review → progress.
- [x] Regression test tự động pass cho các module chính (`npm test`).
- [x] Đóng các lỗi P1/P2 đã ghi nhận ở Day 11/12.
- [x] Việt hóa nhất quán cho labels cốt lõi.
- [x] Có benchmark/perf tuning cho progress + render (Day 13).
- [x] API progress có status rõ ràng (`ready/empty/error`).

### Chưa đạt / deferred
- [ ] Postflop coaching/review đầy đủ dữ liệu chiến lược.
- [ ] Persistence + migration cho dữ liệu review/progress thực tế.
- [ ] Bộ e2e test/UI test theo user journey thực trình duyệt.
- [ ] Auth/session + phân tách dữ liệu nhiều người dùng.
- [ ] Monitoring/alerting + error budget cho production.

## 3) Rủi ro còn tồn tại

1. **Chiến lược chưa đầy đủ (Correctness risk):** preflop-centric có thể làm quality giảm khi mở rộng hand complexity.
2. **Dữ liệu không bền vững (Reliability risk):** in-memory store mất dữ liệu sau restart.
3. **Độ tin cậy EV metric (Product risk):** heuristic EV loss có thể bị hiểu nhầm là solver truth.
4. **Coverage môi trường thực (Quality risk):** hiện test unit/integration nhẹ; thiếu browser/network variability.
5. **Scalability vận hành (Ops risk):** chưa có observability cho lỗi ngầm và performance drift.

## 4) Kết luận review

Sprint 1 đáp ứng tốt mục tiêu MVP kỹ thuật cho internal demo/feedback loop.
Khuyến nghị chuyển trọng tâm Sprint 2 sang hardening theo thứ tự: **Security → Correctness → UX → Performance**.
