const { VI_MESSAGES } = require('../i18n/messages-vi');

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
    viewStatus: input.viewStatus || 'ready',
    viewError: null,
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

function getActionLabel(action) {
  return VI_MESSAGES.ui.actions[action] || action;
}

function getCoachViewByLevel(level, coachPanel = {}) {
  const preActionHint = coachPanel.preActionHint;
  const postActionGrade = coachPanel.postActionGrade;

  if (level === 'Pro') {
    return {
      preActionText: VI_MESSAGES.ui.coach.proHiddenHint,
      postActionText: postActionGrade
        ? `[${postActionGrade.grade}] ${postActionGrade.messageVi}`
        : VI_MESSAGES.ui.coach.noPostActionGrade,
      detailText: postActionGrade
        ? `${VI_MESSAGES.ui.coach.recommendedActionPrefix}: ${getActionLabel(postActionGrade.recommendedAction)}`
        : null,
    };
  }

  if (level === 'Intermediate') {
    return {
      preActionText: preActionHint
        ? `${VI_MESSAGES.ui.coach.intermediateHintPrefix} ${getActionLabel(preActionHint.recommendedAction)}`
        : VI_MESSAGES.ui.coach.noPreActionHint,
      postActionText: postActionGrade
        ? `[${postActionGrade.grade}] ${postActionGrade.messageVi}`
        : VI_MESSAGES.ui.coach.noPostActionGrade,
      detailText: preActionHint ? `${VI_MESSAGES.ui.coach.intermediateSourcePrefix}: ${preActionHint.source}` : null,
    };
  }

  return {
    preActionText: preActionHint ? preActionHint.messageVi : VI_MESSAGES.ui.coach.noPreActionHint,
    postActionText: postActionGrade
      ? `[${postActionGrade.grade}] ${postActionGrade.messageVi}`
      : VI_MESSAGES.ui.coach.noPostActionGrade,
    detailText: preActionHint
      ? `${VI_MESSAGES.ui.coach.beginnerRangePrefix}: ${formatDistribution(preActionHint.distribution)}`
      : null,
  };
}

function renderStatusBanner(state) {
  if (state.viewStatus === 'loading') {
    return `<div class="view-status is-loading">${VI_MESSAGES.ui.loadingLabel}</div>`;
  }

  if (state.viewStatus === 'empty') {
    return `<div class="view-status is-empty">${VI_MESSAGES.ui.emptyLabel}</div>`;
  }

  if (state.viewStatus === 'error') {
    const detail = state.viewError || 'unknown';
    return `<div class="view-status is-error">${VI_MESSAGES.ui.errorPrefix}: ${detail}</div>`;
  }

  return '';
}

function createRenderCache() {
  const actionControlHtml = ['fold', 'call', 'raise']
    .map((action) => `<button data-action="${action}">${getActionLabel(action)}</button>`)
    .join('');

  let seatsKey = '';
  let seatsHtml = '';

  function getSeatsHtml(seats = []) {
    const nextKey = seats
      .map((seat) => `${seat.seat}:${seat.stack}:${seat.isHero ? 1 : 0}:${seat.isActive ? 1 : 0}`)
      .join(';');

    if (nextKey === seatsKey) {
      return seatsHtml;
    }

    seatsKey = nextKey;
    seatsHtml = seats
      .map((seat) => {
        const tags = [seat.position, `stack:${seat.stack}`];
        if (seat.isHero) tags.push('HERO');
        if (seat.isActive) tags.push('ACT');
        return `<li data-seat="${seat.seat}">${seat.name} (${tags.join(' | ')})</li>`;
      })
      .join('');

    return seatsHtml;
  }

  return {
    actionControlHtml,
    getSeatsHtml,
  };
}

function renderTableHtml(state, renderCache = null) {
  const cache = renderCache || createRenderCache();
  const coachView = getCoachViewByLevel(state.level, state.coachPanel);

  return [
    `<section id="table-v1" data-level="${state.level}">`,
    `<h2>${VI_MESSAGES.ui.tableTitle}</h2>`,
    `<div class="support-level">${VI_MESSAGES.ui.supportLevelLabel}: ${VI_MESSAGES.ui.supportLevels[state.level] || state.level}</div>`,
    `<div class="hand-status">${VI_MESSAGES.ui.handStatusLabel}: ${state.viewStatus}</div>`,
    renderStatusBanner(state),
    `<div class="pot">${VI_MESSAGES.ui.potLabel}: ${state.pot}</div>`,
    `<div class="to-call">${VI_MESSAGES.ui.toCallLabel}: ${state.toCall}</div>`,
    `<ul class="seats">${cache.getSeatsHtml(state.seats)}</ul>`,
    `<div class="action-controls">${cache.actionControlHtml}</div>`,
    `<aside class="coach-panel">`,
    `<h3>${VI_MESSAGES.ui.coachPanelTitle}</h3>`,
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
  getActionLabel,
  createRenderCache,
  renderTableHtml,
};
