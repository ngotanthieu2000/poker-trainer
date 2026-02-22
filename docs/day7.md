# Day 7 – Table UI v1 + Realtime Coach Panel

## Scope

Day 7 tập trung vào một luồng UI demo end-to-end (không phụ thuộc framework frontend):

1. **Table UI v1 (6-max)**
   - Render 6 ghế với position cơ bản (UTG/HJ/CO/BTN/SB/BB)
   - Hiển thị pot, to-call, stack hero
   - Action controls tối thiểu: `fold`, `call`, `raise`
2. **Coach panel realtime**
   - Pre-action hint (tiếng Việt)
   - Post-action grade + giải thích (tiếng Việt)
3. **Support level toggle**
   - `Beginner`: full hint + distribution
   - `Intermediate`: hint rút gọn + source
   - `Pro`: ẩn pre-action hint
4. **UI flow nối với API hiện có**
   - Qua local adapter gọi `handleRealtimeCoachRequest`

## Files chính

- `src/ui/table-ui.js`
  - State khởi tạo cho bàn chơi v1
  - Render HTML string cho table + coach panel
  - Quy tắc hiển thị coach theo level
- `src/ui/local-coach-adapter.js`
  - Adapter gọi API handler realtime coach (pre/post action)
- `src/ui/poker-table-controller.js`
  - Điều phối UI state
  - Load pre-action hint
  - Submit action -> nhận post-action grade

## Tests

- `tests/day7-table-ui-coach.test.js`
  - render 6-max + controls
  - level toggle behavior
  - end-to-end controller flow (hint + grade + stack/pot update)

## Demo flow tối thiểu

```js
const { createTableController } = require('./src/ui/poker-table-controller');

const controller = createTableController({ level: 'Beginner' });
controller.loadPreActionHint();
controller.submitAction('call');
console.log(controller.render());
```
