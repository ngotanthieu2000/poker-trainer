# Content Guidelines (VI) — UX States

Version: `v1.0.0`  
Synced date: `2026-02-22`

## Giọng điệu
- Rõ ràng, ngắn gọn, hỗ trợ hành động.
- Tránh đổ lỗi người dùng.
- Tránh thuật ngữ kỹ thuật nội bộ.

## Cấu trúc copy cho state
1. **Headline** (tối đa ~60 ký tự)
2. **Mô tả ngắn** (1 câu)
3. **CTA chính** (động từ + mục tiêu rõ)

## Chuẩn câu chữ
- Dùng: `Thử lại`, `Tải lại`, `Bắt đầu ván mới`, `Xóa bộ lọc`.
- Tránh: `Retry`, `Refresh`, `Oops...`.

## Error copy patterns
- Network: `Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.`
- Timeout: `Hệ thống phản hồi chậm. Bạn có thể thử lại ngay.`
- Invalid action: `Hành động không hợp lệ ở thời điểm này.`
- Unknown: `Đã xảy ra lỗi ngoài dự kiến.`

## Empty copy patterns
- No hands: `Bạn chưa có hand nào để xem lại.`
- Filtered empty: `Không có dữ liệu phù hợp bộ lọc hiện tại.`

## i18n rules
- Không hard-code string trong component.
- Mỗi key i18n phải có fallback hợp lệ.
- Thuật ngữ poker bám `docs/glossary-vi.md`.