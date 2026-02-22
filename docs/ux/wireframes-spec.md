# Wireframes Spec (Textual) — Sprint 2

Version: `v1.0.0`  
Synced date: `2026-02-22`

## 1) Table + Coach panel

### 1.1 Loading
- Header: tên bàn + phase.
- Body: skeleton bàn + coach panel disabled.
- Banner trạng thái: `Đang chuẩn bị bàn chơi...`

### 1.2 Ready
- Bàn chơi tương tác đầy đủ.
- Coach panel hiển thị recommendation + confidence.
- Không hiển thị banner trạng thái global.

### 1.3 Error
- Inline banner trên cùng vùng nội dung.
- Cấu trúc: `Title` + `Mô tả ngắn` + `CTA`.
- CTA chính: `Thử lại`.

## 2) Review screen

### 2.1 Ready
- Cột trái: danh sách hand.
- Cột phải: chi tiết hand đã chọn.

### 2.2 Empty
- Icon neutral.
- Headline: `Chưa có hand để xem lại`.
- Copy: `Hãy chơi thêm để có dữ liệu phân tích.`
- CTA: `Bắt đầu ván mới`.

### 2.3 Error
- Banner lỗi ở vùng nội dung review.
- CTA: `Tải lại`.

## 3) Progress dashboard

### 3.1 Ready
- KPI cards (VPIP/PFR/Winrate...) + trend mini.
- Filter bar rõ trạng thái đang áp dụng.

### 3.2 Empty (NO_HANDS)
- Message: chưa có dữ liệu luyện tập.
- CTA: `Bắt đầu ván mới`.

### 3.3 Empty (FILTERED_EMPTY)
- Message: không có dữ liệu phù hợp bộ lọc.
- CTA: `Xóa bộ lọc`.

### 3.4 Error
- Message: không tải được thống kê.
- CTA: `Thử lại`.

## Quy tắc layout chung
- Mọi trạng thái dùng cùng spacing scale + typography token.
- CTA chính đặt ngay dưới thông điệp, không đẩy xuống ngoài viewport đầu.
- Màu semantic theo token (info/warn/error/success), không hardcode.