const VI_MESSAGES = {
  ui: {
    tableTitle: 'Bàn poker 6-max v1',
    potLabel: 'Pot',
    toCallLabel: 'Cần theo',
    coachPanelTitle: 'Coach thời gian thực',
    supportLevels: {
      Beginner: 'Cơ bản',
      Intermediate: 'Trung cấp',
      Pro: 'Nâng cao',
    },
    actions: {
      fold: 'Bỏ bài',
      call: 'Theo',
      raise: 'Tố',
    },
    coach: {
      noPreActionHint: 'Chưa có gợi ý trước hành động.',
      noPostActionGrade: 'Chưa có đánh giá sau hành động.',
      beginnerRangePrefix: 'Dải tần suất',
      intermediateHintPrefix: 'Gợi ý: ưu tiên',
      intermediateSourcePrefix: 'Nguồn',
      proHiddenHint: 'Chế độ nâng cao: Ẩn gợi ý trước hành động để tự quyết định.',
      recommendedActionPrefix: 'Hành động khuyến nghị',
    },
  },
  review: {
    titlePrefix: 'Review hand',
    evLossLabel: 'EV loss',
    evLossUnit: 'chips',
    noteZeroLoss: 'Heuristic proxy EV loss: action khớp baseline nên EV loss = 0.',
    noteEstimatedLoss:
      'Heuristic proxy EV loss dựa trên độ lệch tần suất action so với baseline preflop (chưa phải solver EV thực).',
  },
  progress: {
    defaultRecommendationMismatch: 'Không theo hành động khuyến nghị',
    accuracyPlaceholderStatus: 'placeholder_until_postflop_review_data',
  },
};

const POKER_GLOSSARY_VI = [
  { term: 'Fold (Bỏ bài)', short: 'Bỏ hand hiện tại, không tiếp tục pot.' },
  { term: 'Call (Theo)', short: 'Bỏ chip để theo mức cược hiện tại.' },
  { term: 'Raise (Tố)', short: 'Tăng mức cược so với mức hiện tại.' },
  { term: 'Pot', short: 'Tổng chip đang có trong ván.' },
  { term: 'Preflop', short: 'Vòng cược trước khi chia 3 lá flop.' },
  { term: 'Position (Vị trí)', short: 'Thứ tự hành động trong bàn; vị trí càng muộn thường càng lợi.' },
  { term: 'Range', short: 'Tập hợp các hand có thể chơi trong một tình huống.' },
  { term: 'EV (Expected Value)', short: 'Giá trị kỳ vọng trung bình dài hạn của một quyết định.' },
  { term: 'GTO baseline', short: 'Mốc khuyến nghị cân bằng để so sánh quyết định của người chơi.' },
];

module.exports = {
  VI_MESSAGES,
  POKER_GLOSSARY_VI,
};
