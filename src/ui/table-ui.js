const LEVELS = ['Beginner', 'Intermediate', 'Pro'];

function createDefaultSeats(heroStack = 1000) {
  return [
    { seat: 1, position: 'UTG', name: 'Bot UTG', stack: 980, isHero: false, isActive: false },
    { seat: 2, position: 'HJ', name: 'Bot HJ', stack: 1020, isHero: false, isActive: false },
    { seat: 3, position: 'CO', name: 'Bot CO', stack: 1010, isHero: false, isActive: false },
    { seat: 4, position: 'BTN', name: 'Bot BTN', stack: 1000, isHero: false, isActive: false },
    { seat: 5, position: 'SB', name: 'Bot SB', stack: 995, isHero: false, isActive: false },
    { seat: 6, position: 'BB', name: 'Hero', stack: heroStack, isHero: true, isActive: true },
  ];
}

function createInitialUiState(input = {}) {
  const level = input.level || 'Beginner';

  if (!LEVELS.includes(level)) {
    throw new Error('Invalid support level');
  }

  return {
    level,
    pot: input.pot ?? 15,
    toCall: input.toCall ?? 10,
    context: {
      spot: input.spot || 'BB_VS_BTN_OPEN_100BB',
      handKey: input.handKey || 'AJo',
      toCall: input.toCall ?? 10,
      position: input.position || input.heroPosition || 'BB',
    },
    seats: input.seats || createDefaultSeats(input.heroStack),
    actionControls: ['fold', 'call', 'raise'],
    coachPanel: {
      preActionHint: null,
      postActionGrade: null,
    },
  };
}

function formatDistribution(distribution = {}) {
  const keys = Object.keys(distribution);
  if (!keys.length) {
    return 'n/a';
  }

  return keys
    .map((key) => `${key}:${Math.round(distribution[key] * 100)}%`)
    .join(' | ');
}

function getCoachViewByLevel(level, coachPanel = {}) {
  const preActionHint = coachPanel.preActionHint;
  const postActionGrade = coachPanel.postActionGrade;

  if (level === 'Pro') {
    return {
      preActionText: 'Pro mode: Ẩn gợi ý pre-action để tự quyết định.',
      postActionText: postActionGrade ? `[${postActionGrade.grade}] ${postActionGrade.messageVi}` : 'Chưa có đánh giá action.',
      detailText: postActionGrade ? `Recommended: ${postActionGrade.recommendedAction}` : null,
    };
  }

  if (level === 'Intermediate') {
    return {
      preActionText: preActionHint
        ? `Hint: ưu tiên ${preActionHint.recommendedAction}`
        : 'Chưa có hint pre-action.',
      postActionText: postActionGrade ? `[${postActionGrade.grade}] ${postActionGrade.messageVi}` : 'Chưa có đánh giá action.',
      detailText: preActionHint ? `Source: ${preActionHint.source}` : null,
    };
  }

  return {
    preActionText: preActionHint ? preActionHint.messageVi : 'Chưa có hint pre-action.',
    postActionText: postActionGrade ? `[${postActionGrade.grade}] ${postActionGrade.messageVi}` : 'Chưa có đánh giá action.',
    detailText: preActionHint
      ? `Range: ${formatDistribution(preActionHint.distribution)}`
      : null,
  };
}

function renderTableHtml(state) {
  const seatsHtml = state.seats
    .map((seat) => {
      const tags = [seat.position, `stack:${seat.stack}`];
      if (seat.isHero) tags.push('HERO');
      if (seat.isActive) tags.push('ACT');
      return `<li data-seat="${seat.seat}">${seat.name} (${tags.join(' | ')})</li>`;
    })
    .join('');

  const actionControls = state.actionControls
    .map((action) => `<button data-action="${action}">${action.toUpperCase()}</button>`)
    .join('');

  const coachView = getCoachViewByLevel(state.level, state.coachPanel);

  return [
    `<section id="table-v1" data-level="${state.level}">`,
    `<h2>6-Max Table v1</h2>`,
    `<div class="pot">Pot: ${state.pot}</div>`,
    `<div class="to-call">To call: ${state.toCall}</div>`,
    `<ul class="seats">${seatsHtml}</ul>`,
    `<div class="action-controls">${actionControls}</div>`,
    `<aside class="coach-panel">`,
    `<h3>Coach realtime</h3>`,
    `<p class="pre-action">${coachView.preActionText}</p>`,
    `<p class="post-action">${coachView.postActionText}</p>`,
    coachView.detailText ? `<p class="coach-detail">${coachView.detailText}</p>` : '',
    `</aside>`,
    `</section>`,
  ].join('');
}

module.exports = {
  LEVELS,
  createDefaultSeats,
  createInitialUiState,
  getCoachViewByLevel,
  renderTableHtml,
};
