const { createInitialUiState, renderTableHtml, LEVELS, createRenderCache } = require('./table-ui');
const { fetchPreActionHint, fetchPostActionGrade } = require('./local-coach-adapter');
const { createInMemoryHandHistoryStore } = require('../review/hand-history-store');
const { buildHandReview, renderReviewText } = require('../review/review-module');

function cloneState(state) {
  if (typeof structuredClone === 'function') {
    return structuredClone(state);
  }
  return JSON.parse(JSON.stringify(state));
}

function createTableController(input = {}) {
  const state = createInitialUiState(input);
  const handHistoryStore = input.handHistoryStore || createInMemoryHandHistoryStore();
  const sessionId = input.sessionId || 'session-local';
  const handId = input.handId || `hand-${Date.now()}`;
  const renderCache = createRenderCache();

  handHistoryStore.startHand({
    handId,
    sessionId,
    context: state.context,
  });

  let hasSubmittedAction = false;

  function updateSupportLevel(level) {
    if (!LEVELS.includes(level)) {
      throw new Error('Invalid support level');
    }
    state.level = level;
    return state.level;
  }

  function loadPreActionHint() {
    state.viewStatus = 'loading';
    state.viewError = null;

    try {
      const hint = fetchPreActionHint(state.context);
      state.coachPanel.preActionHint = hint;
      state.viewStatus = hint ? 'ready' : 'empty';

      handHistoryStore.appendCoachLog(handId, {
        type: 'pre_action_hint',
        payload: hint,
      });

      return hint;
    } catch (error) {
      state.viewStatus = 'error';
      state.viewError = error.message;
      throw error;
    }
  }

  function submitAction(playerAction) {
    if (!state.actionControls.includes(playerAction)) {
      throw new Error('Unsupported player action');
    }

    if (hasSubmittedAction) {
      throw new Error('Action already submitted for this hand');
    }

    state.viewStatus = 'loading';
    state.viewError = null;

    try {
      state.coachPanel.postActionGrade = fetchPostActionGrade(playerAction, state.context);

      const heroSeat = state.seats.find((seat) => seat.isHero);
      if (heroSeat && playerAction === 'call') {
        heroSeat.stack = Math.max(0, heroSeat.stack - state.toCall);
        state.pot += state.toCall;
        state.toCall = 0;
        state.context.toCall = 0;
      }

      if (heroSeat && playerAction === 'raise') {
        const raiseSize = state.toCall * 3;
        heroSeat.stack = Math.max(0, heroSeat.stack - raiseSize);
        state.pot += raiseSize;
        state.toCall = 0;
        state.context.toCall = 0;
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

      hasSubmittedAction = true;
      state.viewStatus = 'ready';

      return state.coachPanel.postActionGrade;
    } catch (error) {
      state.viewStatus = 'error';
      state.viewError = error.message;
      throw error;
    }
  }

  function render() {
    return renderTableHtml(state, renderCache);
  }

  function getState() {
    return cloneState(state);
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
