# UX Principles — Poker Trainer

Version: `v1.0.0`  
Synced date: `2026-02-22`

## Mục tiêu UX
- Giảm ma sát học tập khi người chơi luyện hand.
- Biến trạng thái hệ thống thành thông tin dễ hiểu, có hành động tiếp theo rõ ràng.
- Giữ trải nghiệm nhất quán giữa Table, Coach, Review, Progress.

## Nguyên tắc cốt lõi
1. **Clarity over cleverness**
   - Ưu tiên ngôn ngữ đơn giản, trực tiếp.
   - Mỗi trạng thái chỉ nên có 1 thông điệp chính và tối đa 1 CTA chính.

2. **State transparency**
   - Luôn thể hiện rõ `loading`, `ready`, `empty`, `error`.
   - Không để hai trạng thái mâu thuẫn xuất hiện cùng lúc.

3. **Actionable feedback**
   - Mọi lỗi/empty phải có hướng xử lý cụ thể (`Thử lại`, `Bắt đầu ván mới`, `Xóa bộ lọc`).
   - Tránh copy chung chung kiểu “Có lỗi xảy ra”.

4. **Consistency across surfaces**
   - Cùng một lỗi/cùng một intent phải dùng cùng từ vựng ở mọi màn hình.
   - CTA nhất quán về tên gọi và thứ tự ưu tiên.

5. **Localization-first (VI)**
   - Tiếng Việt là mặc định, không trộn key/English trong UI runtime.
   - Thuật ngữ poker dùng theo glossary hiện có để tránh lệch nghĩa.

6. **Low cognitive load**
   - Ưu tiên phân cấp thị giác rõ: tiêu đề trạng thái → mô tả ngắn → CTA.
   - Tránh nhồi quá nhiều chỉ số khi người dùng đang ở trạng thái lỗi/rỗng.

## Non-goals
- Không mở rộng feature mới ngoài phạm vi UX polish.
- Không thay đổi luật engine/correctness nghiệp vụ trừ phần hiển thị trạng thái.

## UX Acceptance baseline
- 100% màn hình mục tiêu có mapping rõ cho 4 trạng thái `loading|ready|empty|error`.
- 100% empty/error states có ít nhất 1 CTA hữu ích.
- Không còn flicker trạng thái trong luồng chính table → coach → review/progress.