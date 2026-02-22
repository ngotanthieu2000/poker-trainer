const { createInitialUiState, renderTableHtml, LEVELS } = require('./table-ui');
const { fetchPreActionHint, fetchPostActionGrade } = require('./local-coach-adapter');
const { createInMemoryHandHistoryStore } = require('../review/hand-history-store');
const { buildHandReview, renderReviewText } = require('../review/review-module');

function createTableController(input = {}) {
  const state = createInitialUiState(input);
  const handHistoryStore = input.handHistoryStore || createInMemoryHandHistoryStore();
  const sessionId = input.sessionId || 'session-local';
  const handId = input.handId || `hand-${Date.now()}`;

  handHistoryStore.startHand({
    handId,
    sessionId,
    context: state.context,
  });

  function updateSupportLevel(level) {
    if (!LEVELS.includes(level)) {
      throw new Error('Invalid support level');
    }
    state.level = level;
    return state.level;
  }

  function loadPreActionHint() {
    state.coachPanel.preActionHint = fetchPreActionHint(state.context);

    handHistoryStore.appendCoachLog(handId, {
      type: 'pre_action_hint',
      payload: state.coachPanel.preActionHint,
    });

    return state.coachPanel.preActionHint;
  }

  function submitAction(playerAction) {
    if (!state.actionControls.includes(playerAction)) {
      throw new Error('Unsupported player action');
    }

    state.coachPanel.postActionGrade = fetchPostActionGrade(playerAction, state.context);

    const heroSeat = state.seats.find((seat) => seat.isHero);
    if (heroSeat && playerAction === 'call') {
      heroSeat.stack = Math.max(0, heroSeat.stack - state.toCall);
      state.pot += state.toCall;
    }

    if (heroSeat && playerAction === 'raise') {
      const raiseSize = state.toCall * 3;
      heroSeat.stack = Math.max(0, heroSeat.stack - raiseSize);
      state.pot += raiseSize;
    }

    handHistoryStore.appendTimelineEvent(handId, {
      type: 'decision',
      street: 'preflop',
      actor: 'hero',
      action: playerAction,
      grade: state.coachPanel.postActionGrade.grade,
      recommendedAction: state.coachPanel.postActionGrade.recommendedAction,
      distribution: state.coachPanel.postActionGrade.distribution,
      messageVi: state.coachPanel.postActionGrade.messageVi,
    });

    handHistoryStore.appendCoachLog(handId, {
      type: 'post_action_grade',
      payload: state.coachPanel.postActionGrade,
    });

    return state.coachPanel.postActionGrade;
  }

  function render() {
    return renderTableHtml(state);
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function getCurrentHandHistory() {
    return handHistoryStore.getHand(handId);
  }

  function getReview() {
    return buildHandReview(getCurrentHandHistory());
  }

  function renderReview() {
    return renderReviewText(getReview());
  }

  return {
    updateSupportLevel,
    loadPreActionHint,
    submitAction,
    render,
    getState,
    getCurrentHandHistory,
    getReview,
    renderReview,
  };
}

module.exports = {
  createTableController,
};
