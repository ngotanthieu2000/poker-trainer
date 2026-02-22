# Day 10 - Vietnamese Localization & Poker Terminology Consistency

## Mục tiêu hoàn thành

1. Chuẩn hóa Việt hóa cho các module chính:
   - Table UI (`src/ui/table-ui.js`)
   - Coach panel (text theo level)
   - Review (`src/review/review-module.js`, `src/review/grade-marker.js`)
   - Progress (`src/progress/progress-metrics.js`)

2. Tạo glossary thuật ngữ poker tiếng Việt:
   - `docs/glossary-vi.md`
   - Đồng bộ với source chuẩn trong `src/i18n/messages-vi.js`

3. Tập trung text về một điểm quản lý:
   - Thêm `src/i18n/messages-vi.js`
   - Gom các label/fallback text đang hardcode rải rác

4. Test consistency key labels/text:
   - `tests/day10-vi-localization-consistency.test.js`
   - Bao phủ table/coach/review/progress + glossary source

## Ghi chú

- Logic game/coach không đổi, chỉ refactor text/label.
- `data-action="fold/call/raise"` giữ nguyên để không phá API/controller hiện có.
- Placeholder status ở progress được giữ nguyên contract value `placeholder_until_postflop_review_data`.
