# Day 11 - QA Functional Pass (Day 1-10 Scope)

## 1) Scope & Method

Phạm vi QA functional pass cho các phần đã build Day 1-10:
- Simulation flow (engine + table controller)
- Coach realtime (pre-action hint, post-action grade)
- Review (hand history + review rendering + EV loss heuristic)
- Progress dashboard metrics
- Việt hóa (table/coach/review/progress/glossary)

Môi trường chạy:
- Branch: `day11/qa-functional-pass-triage`
- Runtime: Node.js `v22.22.0`
- Test command: `npm test`

---

## 2) Test Results Summary

- Total automated tests: **33**
- Passed: **33**
- Failed: **0**
- Duration: ~0.44s

Kết quả: `npm test` pass full sau cập nhật Day 11.

---

## 3) Functional Pass Matrix

| Area | Cases | Result | Notes |
|---|---|---|---|
| Simulation flow | Street transition guard, action validation, table action submit | PASS | Engine constraints ổn định; table controller có guard mới chống submit lặp trong cùng hand |
| Coach realtime | Pre-action hint, post-action grade, fallback path | PASS | Dữ liệu baseline + fallback hoạt động đúng |
| Review | Timeline -> decision review, grade marker, EV loss field/render | PASS | Review render đầy đủ dữ liệu quyết định |
| Progress | Accuracy theo vị trí/street, top errors, recent hands | PASS | Tính toán ổn định, giữ placeholder cho postflop |
| Việt hóa | Table labels, coach texts, review/progress fallback, glossary terms | PASS (with minor gaps) | Có 1 số text review còn dạng Anh-Việt trộn (triage P2) |

---

## 4) Bug Triage (P0/P1/P2)

### P0
- Không ghi nhận bug P0 trong vòng QA này.

### P1

#### BUG-011 (ĐÃ FIX)
- **Severity:** P1
- **Title:** Cho phép submit nhiều action liên tiếp trong cùng một hand ở table controller
- **Bước tái hiện:**
  1. Tạo controller bằng `createTableController(...)`
  2. Gọi `submitAction('call')`
  3. Gọi tiếp `submitAction('fold')`
- **Expected:** Hand hiện tại chỉ chấp nhận 1 quyết định hero trong flow v1, lần submit tiếp theo bị chặn.
- **Actual (trước fix):** Vẫn chấp nhận action thứ 2, làm sai timeline/pot/stack trong cùng hand.
- **Đề xuất fix:** Khóa submit sau action đầu tiên (`hasSubmittedAction`) và throw error rõ ràng.
- **Trạng thái:** Fixed trong Day 11.

### P2

#### BUG-012
- **Severity:** P2
- **Title:** Một số label review chưa Việt hóa hoàn toàn
- **Bước tái hiện:**
  1. Chạy flow review (`controller.renderReview()`)
  2. Quan sát title/field label
- **Expected:** Label hiển thị đồng nhất tiếng Việt.
- **Actual:** Có label đang để `Review hand`, `EV loss`, `chips`.
- **Đề xuất fix:** Chuẩn hóa key i18n review sang tiếng Việt hoặc hỗ trợ locale map đầy đủ.

#### BUG-013
- **Severity:** P2
- **Title:** `state.toCall` không reset sau call/raise (UI state drift)
- **Bước tái hiện:**
  1. Tạo controller với `toCall=10`
  2. `submitAction('call')`
  3. Đọc `controller.getState().toCall`
- **Expected:** Sau khi hero đã call/raise trong hand v1, `toCall` về 0.
- **Actual (trước fix):** `toCall` vẫn giữ giá trị cũ.
- **Đề xuất fix:** Reset `state.toCall` và `state.context.toCall` về 0 sau call/raise.
- **Trạng thái:** Fixed trong Day 11.

---

## 5) Regression Checklist (Core re-run after fixes)

### A. Simulation + Controller
- [ ] `submitAction` chỉ cho phép 1 lần/hand, lần 2 phải throw error
- [ ] `call` cập nhật stack/pot đúng và reset `toCall=0`
- [ ] `raise` cập nhật stack/pot đúng và reset `toCall=0`
- [ ] `fold/call/raise` đều ghi timeline event + coach log đúng format

### B. Realtime Coach
- [ ] Pre-action hint trả về đủ `source/recommendedAction/distribution/messageVi`
- [ ] Post-action grade phân loại đúng `Good/Mistake/Major Mistake`
- [ ] Fallback path không crash khi thiếu spot/hand data

### C. Review
- [ ] `buildHandReview` map đầy đủ marker + evLoss metadata
- [ ] `renderReviewText` render được tối thiểu title + decision lines
- [ ] EV loss heuristic luôn >= 0, có unit + note

### D. Progress
- [ ] Accuracy theo position tính đúng trên dữ liệu mixed grade
- [ ] Accuracy theo street giữ preflop implemented + postflop placeholder
- [ ] Top 3 errors sort theo tần suất giảm dần
- [ ] Recent hands giới hạn tối đa 50 và sort mới -> cũ

### E. Việt hóa
- [ ] Labels action table: `Bỏ bài/Theo/Tố`
- [ ] Coach panel messages hiển thị đúng theo level
- [ ] Review/progress fallback message thống nhất key i18n
- [ ] Glossary gồm các thuật ngữ cốt lõi (Fold/Call/Raise/EV/GTO...)

---

## 6) Changes made in Day 11

### Fixes implemented in code
- `src/ui/poker-table-controller.js`
  - Thêm guard chống submit action lặp trong cùng hand
  - Reset `toCall` về 0 sau `call/raise`
- `tests/day7-table-ui-coach.test.js`
  - Bổ sung assertion `toCall=0` sau call
  - Thêm test reject duplicate `submitAction`

### Quick-fix scope note
Các fix trên là bug nhỏ, gói gọn trong controller/test hiện có, không mở rộng phạm vi kiến trúc.
