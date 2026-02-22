const test = require('node:test');
const assert = require('node:assert/strict');

const { createInitialHandState } = require('../src/engine/state-machine');
const { applyBotPreflopDecision } = require('../src/engine/bot-decision');
const { createDecisionLogger } = require('../src/logging/decision-logger');

test('applyBotPreflopDecision should append action and emit structured log', () => {
  const state = createInitialHandState();
  const logger = createDecisionLogger([]);

  const result = applyBotPreflopDecision(
    state,
    {
      profile: 'tag',
      holeCards: [
        { rank: 'A', suit: 's' },
        { rank: 'K', suit: 's' },
      ],
      toCall: 0,
      bigBlind: 100,
    },
    {
      sessionId: 's-001',
      handId: 'h-001',
      actor: 'bot-tag-1',
      logger,
      timestamp: '2026-02-22T13:00:00.000Z',
    }
  );

  assert.equal(result.state.actions.length, 1);
  assert.equal(result.state.actions[0].type, 'raise');

  assert.equal(logger.sink.length, 1);
  assert.deepEqual(logger.sink[0], {
    sessionId: 's-001',
    handId: 'h-001',
    round: 'preflop',
    actor: 'bot-tag-1',
    action: 'raise',
    reason: 'TAG: strong range -> aggressive raise',
    timestamp: '2026-02-22T13:00:00.000Z',
  });
});

test('applyBotPreflopDecision should reject non-preflop streets', () => {
  assert.throws(
    () =>
      applyBotPreflopDecision(
        { street: 'flop', isTerminal: false, actions: [] },
        {
          profile: 'nit',
          holeCards: [
            { rank: 'A', suit: 'h' },
            { rank: 'A', suit: 'd' },
          ],
        }
      ),
    {
      message: 'Bot v1 only supports preflop decisions',
    }
  );
});
