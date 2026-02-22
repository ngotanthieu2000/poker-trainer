# Day 14 — Release Notes nội bộ Sprint 1

## 1) Tóm tắt Sprint 1 đã hoàn thành

Sprint 1 đã hoàn thiện nền tảng end-to-end cho Poker Trainer theo trục:
- Engine baseline + validation action/street
- Bot preflop heuristic + logging
- Coach recommendation (baseline + fallback)
- Realtime coach (pre-action hint + post-action grading)
- Table UI v1 + support level
- Hand history review + EV loss heuristic
- Progress dashboard metrics (position/street/mistakes/recent)
- Việt hóa nhất quán cho UI/coach/review/progress
- Hiệu năng Day 13 (progress aggregation, render cache, status loading/empty/error)

### Các hạng mục chính theo mốc
- Day 3–4: state machine, bot profiles, decision logging
- Day 5–6: GTO baseline preflop + realtime coach v1
- Day 7–8: table UI controller + review pipeline
- Day 9–10: progress dashboard + i18n tiếng Việt
- Day 11–12: QA pass + đóng P1/P2
- Day 13: performance polish + regression update

## 2) Giới hạn hiện tại (known limitations)

1. Phạm vi coach/review tập trung preflop; postflop chưa có dữ liệu chiến lược thực chiến đầy đủ.
2. EV loss đang là heuristic proxy, chưa phải solver EV.
3. Storage hiện tại in-memory cho review/progress demo, chưa có persistence production.
4. UI là bản functional HTML render, chưa phải frontend app hoàn chỉnh (routing/state async phức tạp).
5. Chưa có auth/session multi-user và observability production-grade.

## 3) Cách chạy demo nội bộ

### Cài đặt
```bash
npm install
```

### Chạy regression trước demo
```bash
npm test
```

### Chạy demo flow Sprint 1 (CLI)
```bash
npm run demo:sprint1
```

Script demo sẽ:
1. Tạo controller với bối cảnh preflop mẫu.
2. Render bàn chơi ban đầu.
3. Load pre-action hint từ coach.
4. Submit action (`call`) để nhận post-action grade.
5. Render review text sau action.
6. In nhanh progress stats demo từ sample hand histories.

## 4) Kết luận release nội bộ

- Sprint 1 **đủ điều kiện internal release** cho mục tiêu trình diễn luồng học preflop (play → coach → review → progress).
- Các hạng mục production-hardening và mở rộng postflop được đề xuất vào Sprint 2.
