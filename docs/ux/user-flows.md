# User Flows — Sprint 2 UX Package

Version: `v1.0.0`  
Synced date: `2026-02-22`

## Flow 1 — Play hand with realtime coach
1. User vào bàn chơi.
2. Hệ thống hiển thị `loading` ngắn khi nạp state.
3. User thực hiện action.
4. Coach phản hồi gợi ý + đánh giá.
5. Kết thúc hand, có thể chuyển sang review.

**Trạng thái bắt buộc**
- Loading: `Đang chuẩn bị bàn chơi...`
- Error: `Không thể tải bàn chơi` + CTA `Thử lại`
- Empty (ít gặp ở flow này): `Chưa có dữ liệu hand` + CTA `Bắt đầu ván mới`

## Flow 2 — Review hand history
1. User mở Review.
2. Nếu có hand: hiển thị danh sách + chi tiết.
3. Nếu chưa có hand: hiển thị empty guidance.

**Empty guidance chuẩn**
- Message: `Bạn chưa có hand nào để xem lại.`
- CTA chính: `Bắt đầu ván mới`
- CTA phụ (nếu có): `Tải lại`

## Flow 3 — Progress dashboard
1. User vào Dashboard tiến độ.
2. Hệ thống tải thống kê.
3. Render theo `ready|empty|error`.

**Reason mapping (non-breaking API extension)**
- `NO_HANDS`: chưa có dữ liệu luyện tập.
- `FILTERED_EMPTY`: bộ lọc làm rỗng kết quả.
- `PROCESSING_ERROR`: lỗi xử lý dữ liệu.

## Flow 4 — Error recovery
1. Xảy ra lỗi mạng hoặc timeout.
2. Hiển thị thông điệp dễ hiểu + 1 CTA rõ.
3. Retry theo idempotent path.
4. Nếu retry fail nhiều lần, đưa user về trạng thái an toàn.

## Flow 5 — Localization consistency
1. User dùng giao diện tiếng Việt.
2. Mọi trạng thái và CTA hiển thị đúng key VI.
3. Không còn string hard-coded không qua i18n.

## Edge cases cần cover
- Transition nhanh `loading -> ready -> loading` không gây flicker khó hiểu.
- `loading` và `empty` không cùng xuất hiện.
- Unknown error có fallback message thống nhất.