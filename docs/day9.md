# Day 9 - Progress Tracking Dashboard Data

## Mục tiêu đã làm

1. Implement module tính progress stats cho dashboard:
   - File: `src/progress/progress-metrics.js`
   - Bao gồm:
     - Accuracy theo position: `UTG/HJ/CO/BTN/SB/BB`
     - Accuracy theo street: `preflop/flop/turn/river`
     - Top 3 lỗi thường gặp
     - Danh sách 50 hand gần nhất (hoặc ít hơn nếu chưa đủ data)

2. Nối dữ liệu từ hand history + coach grading/review:
   - Dùng nguồn từ `hand.timeline` (decision events) + `coachLogs` (`post_action_grade`)
   - Từ đó tổng hợp các metric accuracy + lỗi lặp lại

3. Expose API/handler tối thiểu cho UI:
   - File: `src/api/progress-stats-handler.js`
   - Hàm: `handleProgressStatsRequest(payload)`

4. Tests Day 9:
   - File: `tests/day9-progress-dashboard.test.js`
   - Bao phủ:
     - tính accuracy theo position/street + top errors
     - edge case: không có data
     - edge case: ít hơn 50 hand
     - contract cơ bản của API handler

## Trạng thái implement (fully vs placeholder)

### Fully implemented
- Accuracy theo **position** (dựa trên decision grade Good/Mistake/Major Mistake).
- Accuracy theo **preflop**.
- Top 3 lỗi thường gặp (dựa trên pattern street/action/recommendedAction).
- Recent hands list giới hạn tối đa 50 item.
- API handler trả về object stats cho UI gọi trực tiếp.

### Placeholder rõ ràng
- Street `flop/turn/river` hiện trả về field `status: placeholder_until_postflop_review_data`.
- Lý do: pipeline review hiện tại mới có preflop đầy đủ theo Day 8/9 scope.

## Ghi chú kỹ thuật

- Accuracy được tính theo `% Good / total decisions` (làm tròn 2 chữ số).
- Nếu bucket chưa có decision thì `accuracy = null` để UI phân biệt với `0%`.
- Context hand đã bổ sung `position` tại `src/ui/table-ui.js` để thuận tiện aggregate theo vị trí hero.
