# Day 6 - Realtime Coach v1

## Scope
Day 6 bổ sung **Coach Realtime v1** cho preflop, gồm:

1. **Pre-action hint**: gợi ý action khuyến nghị trước khi user chọn.
2. **Post-action grading**: chấm `Good / Mistake / Major Mistake` dựa trên distribution từ recommendation.
3. **Giải thích ngắn tiếng Việt** cho hint/grade (1-2 câu).

## Integration với Day 5
Nguồn recommendation lấy từ service Day 5:
- `getCoachPreflopRecommendation(context)`

Nếu thiếu data spot/hand, hệ thống dùng fallback an toàn từ Day 5 và vẫn trả message tiếng Việt ổn định.

## Added components

- Realtime coach service:
  - `src/coach/realtime-coach-service.js`
  - API:
    - `getPreActionHint(context)`
    - `getPostActionGrade({ playerAction, context })`

- Minimal API/handler entry point:
  - `src/api/realtime-coach-handler.js`
  - API:
    - `handleRealtimeCoachRequest(payload)`
    - mode: `pre_action` hoặc `post_action`

## Grading logic v1
- `Good`: user action trùng action có tần suất cao nhất.
- `Mistake`: user action khác best action nhưng còn giữ được >= 50% tần suất so với best action.
- `Major Mistake`: phần còn lại.

## Unit tests
File: `tests/realtime-coach-v1.test.js`

Covered:
1. Pre-action hint trả payload hợp lệ.
2. Post-action grading đủ 3 mức `Good / Mistake / Major Mistake`.
3. Fallback path vẫn trả message tiếng Việt ổn định.
4. Handler route đúng mode pre/post action.
