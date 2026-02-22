# Day 13 — Performance Polish + UI trạng thái tải/lỗi

## Mục tiêu
- Giảm chi phí xử lý cho dashboard progress khi số hand lớn.
- Tối ưu render HTML ở table UI bằng cache các phần tĩnh/lặp.
- Bổ sung trạng thái view (`loading/empty/error/ready`) để UI/API rõ ràng hơn khi không có dữ liệu hoặc có lỗi.

## Thay đổi chính

### 1) Progress metrics tối ưu vòng lặp
- File: `src/progress/progress-metrics.js`
- Thay thế các chuỗi `filter/map/sort` trung gian bằng vòng `for` để giảm allocation.
- Tính luôn accuracy theo hand trong một pass (`recentHandsRaw`) rồi mới sort/slice.
- Chuẩn hóa timestamp bằng `normalizeTimestamp` để sort ổn định và tránh parse lặp.

### 2) API progress có trạng thái response
- File: `src/api/progress-stats-handler.js`
- Trả thêm `status`:
  - `ready`: có dữ liệu hand
  - `empty`: không có hand
  - `error`: exception khi xử lý
- Vẫn đảm bảo shape thống kê trả về an toàn (fallback từ `computeProgressStats([])`).

### 3) UI table thêm trạng thái tải/rỗng/lỗi + render cache
- File: `src/ui/table-ui.js`, `src/ui/poker-table-controller.js`, `src/i18n/messages-vi.js`
- Bổ sung state:
  - `viewStatus`: `ready | loading | empty | error`
  - `viewError`: chi tiết lỗi
- Bổ sung banner trạng thái hiển thị tiếng Việt.
- Thêm `createRenderCache()` để cache:
  - HTML action controls (tĩnh)
  - HTML seats theo key trạng thái seat (chỉ re-render khi seat thay đổi)
- Controller cập nhật trạng thái khi load hint / submit action và bọc xử lý bằng `try/catch`.

### 4) Review module giảm thao tác tạo mảng
- File: `src/review/review-module.js`
- Dùng vòng `for` để tạo danh sách decision review.
- Tối ưu `renderReviewText` bằng pre-allocated array.

### 5) Cập nhật test hồi quy
- File: `tests/day7-table-ui-coach.test.js`, `tests/day9-progress-dashboard.test.js`
- Cập nhật assertion theo nhãn tiếng Việt mới.
- Thêm test cho banner trạng thái UI.
- Thêm test `status: empty` cho progress stats handler.

## Benchmark Day 13
Script: `node benchmarks/day13-perf-benchmark.js`

Kết quả:
- `progress_old`: `17.7403 ms`/lần
- `progress_new`: `8.3138 ms`/lần
- `render_no_cache`: `0.0200 ms`/lần
- `render_cached`: `0.0064 ms`/lần

### So sánh trước/sau
- Progress stats: nhanh hơn khoảng **2.13x** (~**53.1%** giảm thời gian trung bình).
- Table render: nhanh hơn khoảng **3.13x** (~**68.0%** giảm thời gian trung bình).

## Regression / test
Lệnh: `npm test`
- Total: 35 tests
- Pass: 35
- Fail: 0
- Duration: ~422ms

## Ghi chú
- Đây là tối ưu cấp code-path nóng (loop/allocation/cache render), chưa thay đổi behavior nghiệp vụ chính.
- `benchmarks/day13-perf-benchmark.js` dùng dataset synthetic để so sánh tương đối trước/sau trong cùng môi trường.