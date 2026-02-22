# Day 8 - Hand History + Review Module (preflop scope)

## Mục tiêu đã làm

1. Implement Hand History lưu timeline action theo từng hand:
   - File: `src/review/hand-history-store.js`
   - Lưu theo `handId`, có `context`, `timeline`, `coachLogs`
   - Có hook mở rộng qua API generic:
     - `appendTimelineEvent(...)`
     - `appendCoachLog(...)`

2. Implement Review module:
   - File: `src/review/review-module.js`
   - Hiển thị timeline từng decision (dưới dạng dữ liệu review + text render)
   - Grade marker mapping:
     - File `src/review/grade-marker.js`
     - `Good / Mistake / Major Mistake`
   - EV loss cơ bản theo heuristic (chưa có solver EV thật), mỗi decision có trường:
     - `evLoss.value`
     - `evLoss.unit`
     - `evLoss.heuristic`
     - `evLoss.note`

3. Nối data gameplay + coach logs:
   - File: `src/ui/poker-table-controller.js`
   - Khi `loadPreActionHint()` -> append coach log `pre_action_hint`
   - Khi `submitAction()` -> append timeline decision + coach log `post_action_grade`
   - Có API để xem lại hand vừa chơi:
     - `getCurrentHandHistory()`
     - `getReview()`
     - `renderReview()`

4. Tests đã thêm:
   - File: `tests/day8-hand-history-review.test.js`
   - Bao phủ:
     - lưu/đọc hand history
     - mapping grade marker đúng
     - review output có EV loss hợp lệ
     - integration: gameplay + coach logs -> review

## Giới hạn hiện tại

- Phạm vi review hiện tại mới cho **preflop flow**.
- EV loss đang là **heuristic proxy**, chưa dùng solver/CFR EV thực.
- Hand history store đang là **in-memory**, chưa persist DB/file.
- Timeline render mới ở dạng text/data module, chưa có màn hình UI frontend riêng.

## Hướng mở rộng gợi ý

- Persist hand history vào DB để replay nhiều phiên.
- Mở rộng timeline qua flop/turn/river/showdown.
- Thay EV heuristic bằng EV thật từ engine/solver hoặc approximation model ổn định hơn.
- Bổ sung review UI component riêng (table + filter + sort).
