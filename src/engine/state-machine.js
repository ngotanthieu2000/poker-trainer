const STREET_ORDER = ['preflop', 'flop', 'turn', 'river', 'showdown'];
const ACTIONS = ['fold', 'check', 'call', 'bet', 'raise', 'all_in'];

/**
 * @typedef {'preflop'|'flop'|'turn'|'river'|'showdown'} Street
 * @typedef {'fold'|'check'|'call'|'bet'|'raise'|'all_in'} ActionType
 */

/**
 * @typedef {Object} HandAction
 * @property {ActionType} type
 * @property {number} [amount]
 */

/**
 * @typedef {Object} HandState
 * @property {Street} street
 * @property {boolean} isTerminal
 * @property {HandAction[]} actions
 */

function createInitialHandState() {
  return {
    street: 'preflop',
    isTerminal: false,
    actions: [],
  };
}

function assertStreet(street) {
  if (!STREET_ORDER.includes(street)) {
    throw new Error(`Invalid street: ${street}`);
  }
}

function transitionToStreet(state, nextStreet) {
  assertStreet(nextStreet);

  if (state.isTerminal) {
    throw new Error('Cannot transition from terminal state');
  }

  const currentIndex = STREET_ORDER.indexOf(state.street);
  const nextIndex = STREET_ORDER.indexOf(nextStreet);

  if (nextIndex !== currentIndex + 1) {
    throw new Error(`Invalid street transition: ${state.street} -> ${nextStreet}`);
  }

  return {
    ...state,
    street: nextStreet,
    isTerminal: nextStreet === 'showdown',
  };
}

function validateAction(action) {
  if (!action || typeof action !== 'object') {
    throw new Error('Action must be an object');
  }

  if (!ACTIONS.includes(action.type)) {
    throw new Error(`Invalid action type: ${action.type}`);
  }

  if (action.amount != null) {
    if (typeof action.amount !== 'number' || Number.isNaN(action.amount) || action.amount < 0) {
      throw new Error('Action amount must be a non-negative number');
    }
  }

  if ((action.type === 'bet' || action.type === 'raise' || action.type === 'all_in') && !(action.amount > 0)) {
    throw new Error(`Action ${action.type} requires a positive amount`);
  }
}

function submitAction(state, action) {
  if (state.isTerminal) {
    throw new Error('Cannot submit action in terminal state');
  }

  validateAction(action);

  return {
    ...state,
    actions: [...state.actions, action],
  };
}

module.exports = {
  STREET_ORDER,
  ACTIONS,
  createInitialHandState,
  transitionToStreet,
  submitAction,
  validateAction,
};
