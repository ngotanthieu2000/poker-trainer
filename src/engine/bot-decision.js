const { submitAction } = require('./state-machine');
const { decidePreflopAction } = require('../bot/preflop-strategy');
const { createDecisionLogger } = require('../logging/decision-logger');

function applyBotPreflopDecision(state, context, options = {}) {
  if (!state || typeof state !== 'object') {
    throw new Error('state is required');
  }

  if (state.street !== 'preflop') {
    throw new Error('Bot v1 only supports preflop decisions');
  }

  if (state.isTerminal) {
    throw new Error('Cannot apply bot decision in terminal state');
  }

  const decision = decidePreflopAction(context);
  const nextState = submitAction(state, {
    type: decision.type,
    amount: decision.amount,
  });

  const logger = options.logger || createDecisionLogger();
  const logEntry = logger.logDecision({
    sessionId: options.sessionId || 'unknown-session',
    handId: options.handId || 'unknown-hand',
    round: 'preflop',
    actor: options.actor || 'bot',
    action: decision.type,
    reason: decision.reason,
    timestamp: options.timestamp,
  });

  return {
    state: nextState,
    decision,
    logEntry,
  };
}

module.exports = {
  applyBotPreflopDecision,
};
