export const viMessages = {
  nav: {
    home: "Trang chủ",
    table: "Bàn chơi",
    review: "Review",
    progress: "Tiến độ",
  },
  page: {
    title: "Poker Trainer - FE Refactor Day 1",
    subtitle: "Nền tảng Next.js + TypeScript + Tailwind + i18n cho Sprint Refactor FE.",
    underConstruction: "Khung route đã sẵn sàng. Logic migrate sẽ tiếp tục ở Day 2+.",
  },
  section: {
    legacyPreview: "Legacy adapter preview",
  },
} as const;

export type ViMessages = typeof viMessages;
