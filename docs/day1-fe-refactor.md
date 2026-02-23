# Day 1 FE Refactor - Next.js Foundation

Branch: `refactor-fe/day1-nextjs-foundation`

## Scope hoàn thành

1. Dựng frontend framework mới bằng **Next.js + TypeScript + App Router** trong `apps/web`.
2. Thiết lập **TailwindCSS v4** + base shell layout.
3. Tạo route khung: `/table`, `/review`, `/progress`.
4. Tạo API client layer typed tối thiểu tại `src/lib/api`.
5. Tích hợp i18n nền tảng tiếng Việt qua dictionary loader ở `src/lib/i18n`.
6. Tạo adapter bridge để reuse module UI hiện có từ codebase cũ:
   - `src/ui/table-ui.js`
   - `src/review/review-module.js`
   - `src/progress/progress-metrics.js`

## Cấu trúc thư mục FE

```txt
apps/web/src
├── app
│   ├── page.tsx
│   ├── table/page.tsx
│   ├── review/page.tsx
│   └── progress/page.tsx
├── components/layout
├── features/{table,review,progress}
├── lib
│   ├── adapters
│   ├── api
│   └── i18n
└── types
```

## Run local

Từ root repo:

```bash
npm run fe:install
npm run fe:dev
```

Build check:

```bash
npm run fe:build
```

Lint check:

```bash
npm run fe:lint
```

## Ghi chú migration

- Day 1 chỉ dựng nền móng và adapter, chưa migrate full interaction logic sang React components.
- Legacy renderer/review/progress vẫn chạy thông qua adapter layer để giảm risk khi chuyển kiến trúc.
