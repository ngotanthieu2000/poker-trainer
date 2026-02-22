# Day 5 - Precomputed GTO Baseline (Preflop)

## Scope
Day 5 introduces a **data-driven preflop baseline** (không cần solver realtime) để coach layer có thể hỏi recommendation chuẩn hóa theo spot + hand.

## Added components

- Baseline table (precomputed): `src/data/preflop-gto-baseline.json`
  - Mapping: `spot -> hand -> action distribution`
  - Action distribution dùng các action: `fold/check/call/raise/all_in`

- Recommendation helper/service:
  - `src/coach/preflop-gto-baseline.js`
    - `getPreflopGtoRecommendation(input)`
    - `cardsToHandKey(holeCards)`
    - Chuẩn hóa distribution + chọn recommended action theo tần suất cao nhất
    - Fallback an toàn nếu thiếu data
  - `src/coach/preflop-coach-service.js`
    - `getCoachPreflopRecommendation(context)` để coach layer gọi trực tiếp

## Fallback behavior
Khi thiếu `spot` hoặc thiếu `hand` trong baseline:

- Nếu đang facing bet (`toCall > 0`):
  - distribution fallback: `{ fold: 0.9, call: 0.1 }`
  - reason: safe fallback, ưu tiên tránh spew

- Nếu unopened (`toCall = 0`):
  - distribution fallback: `{ check: 0.8, raise: 0.2 }`
  - reason: safe fallback, giữ mức rủi ro thấp

Mục tiêu là **không crash**, luôn trả về gợi ý có reason.

## Tests
File: `tests/preflop-gto-baseline.test.js`

Covered cases:
1. Spot có data baseline -> trả distribution đúng
2. Spot/hand thiếu data -> dùng fallback + có reason
3. Distribution hợp lệ -> tổng frequency xấp xỉ 1.0
