# Day 12 - P1/P2 Closure + Core Regression Re-run

## 1) Scope
Follow-up from `docs/day11-qa-functional-pass.md` for Day 12 goals:
- Close all remaining P1/P2 bugs.
- Re-run regression checklist for core areas: simulation, coach realtime, review, progress, vi-localization.
- Publish closure/defer status + test evidence.
- Update docs for any UI/API behavior changes.

## 2) Bug Closure Status (from Day 11 triage)

| Bug ID | Severity | Status Day 12 | Notes |
|---|---|---|---|
| BUG-011 | P1 | Closed (already fixed in Day 11, re-verified) | Duplicate `submitAction` still blocked; covered by tests. |
| BUG-012 | P2 | **Closed in Day 12** | Review labels fully Việt hóa: `Xem lại ván`, `Mất EV`, `chip`. |
| BUG-013 | P2 | Closed (already fixed in Day 11, re-verified) | `toCall` reset after call/raise still correct; covered by tests. |

Defer: **None**.

## 3) Implemented Day 12 code changes

### A) Việt hóa review labels (BUG-012)
- File: `src/i18n/messages-vi.js`
  - `review.titlePrefix`: `Review hand` -> `Xem lại ván`
  - `review.evLossLabel`: `EV loss` -> `Mất EV`
  - `review.evLossUnit`: `chips` -> `chip`
  - Vietnamese notes for EV loss also normalized.

### B) Test updates for new expected VI output
- File: `tests/day10-vi-localization-consistency.test.js`
  - Updated review render expectation to VI text.
- File: `tests/day8-hand-history-review.test.js`
  - Updated review render assertion from `EV loss:` to `Mất EV:`.

## 4) Regression checklist re-run (core)

## A. Simulation + Controller
- [x] `submitAction` chỉ cho phép 1 lần/hand, lần 2 throw error  
  Evidence: `tests/day7-table-ui-coach.test.js` (`controller should reject duplicate submitAction in a single hand`)
- [x] `call` cập nhật stack/pot đúng và reset `toCall=0`  
  Evidence: `tests/day7-table-ui-coach.test.js`
- [x] `raise` cập nhật stack/pot đúng và reset `toCall=0`  
  Evidence: `tests/day7-table-ui-coach.test.js`
- [x] `fold/call/raise` ghi timeline + coach log đúng format  
  Evidence: `tests/day8-hand-history-review.test.js`

## B. Realtime Coach
- [x] Pre-action hint có `source/recommendedAction/distribution/messageVi`  
  Evidence: `tests/realtime-coach-v1.test.js`
- [x] Post-action grade phân loại `Good/Mistake/Major Mistake`  
  Evidence: `tests/realtime-coach-v1.test.js`
- [x] Fallback path không crash khi thiếu dữ liệu  
  Evidence: `tests/realtime-coach-v1.test.js`, `tests/preflop-gto-baseline.test.js`

## C. Review
- [x] `buildHandReview` map đủ marker + evLoss metadata  
  Evidence: `tests/day8-hand-history-review.test.js`
- [x] `renderReviewText` render title + decision lines  
  Evidence: `tests/day8-hand-history-review.test.js`, `tests/day10-vi-localization-consistency.test.js`
- [x] EV loss heuristic luôn `>= 0`, có unit + note  
  Evidence: `tests/day8-hand-history-review.test.js`

## D. Progress
- [x] Accuracy theo position đúng trên mixed grade  
  Evidence: `tests/day9-progress-dashboard.test.js`
- [x] Accuracy theo street giữ preflop + postflop placeholder  
  Evidence: `tests/day9-progress-dashboard.test.js`
- [x] Top 3 errors sort giảm dần  
  Evidence: `tests/day9-progress-dashboard.test.js`
- [x] Recent hands max 50, sort mới -> cũ  
  Evidence: `tests/day9-progress-dashboard.test.js`

## E. Việt hóa
- [x] Labels action table: `Bỏ bài/Theo/Tố`  
  Evidence: `tests/day10-vi-localization-consistency.test.js`
- [x] Coach panel messages đúng theo level  
  Evidence: `tests/day10-vi-localization-consistency.test.js`
- [x] Review/progress fallback key i18n thống nhất  
  Evidence: `tests/day10-vi-localization-consistency.test.js`
- [x] Glossary có thuật ngữ cốt lõi  
  Evidence: `tests/day10-vi-localization-consistency.test.js`

## 5) Automated test evidence

Command:
- `npm test`

Result:
- Total: 33
- Passed: 33
- Failed: 0
- Duration: ~0.36s

## 6) UI/API behavior change note

UI text update only (review render labels now full Vietnamese). No API contract/schema change.

- Affected UI copy:
  - `Review hand` -> `Xem lại ván`
  - `EV loss` -> `Mất EV`
  - `chips` -> `chip`

No backend/API breaking changes.
