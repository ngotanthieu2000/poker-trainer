const { createInitialUiState, renderTableHtml, LEVELS } = require('./table-ui');
const { fetchPreActionHint, fetchPostActionGrade } = require('./local-coach-adapter');

function createTableController(input = {}) {
  const state = createInitialUiState(input);

  function updateSupportLevel(level) {
    if (!LEVELS.includes(level)) {
      throw new Error('Invalid support level');
    }
    state.level = level;
    return state.level;
  }

  function loadPreActionHint() {
    state.coachPanel.preActionHint = fetchPreActionHint(state.context);
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

    return state.coachPanel.postActionGrade;
  }

  function render() {
    return renderTableHtml(state);
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  return {
    updateSupportLevel,
    loadPreActionHint,
    submitAction,
    render,
    getState,
  };
}

module.exports = {
  createTableController,
};
