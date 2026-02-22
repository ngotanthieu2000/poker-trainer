const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createInitialHandState,
  transitionToStreet,
  submitAction,
} = require('../src/engine/state-machine');

test('should follow ordered street transitions from preflop to showdown', () => {
  let state = createInitialHandState();
  assert.equal(state.street, 'preflop');
  assert.equal(state.isTerminal, false);

  state = transitionToStreet(state, 'flop');
  assert.equal(state.street, 'flop');

  state = transitionToStreet(state, 'turn');
  assert.equal(state.street, 'turn');

  state = transitionToStreet(state, 'river');
  assert.equal(state.street, 'river');

  state = transitionToStreet(state, 'showdown');
  assert.equal(state.street, 'showdown');
  assert.equal(state.isTerminal, true);
});

test('should reject invalid transition order', () => {
  const state = createInitialHandState();

  assert.throws(() => transitionToStreet(state, 'turn'), {
    message: 'Invalid street transition: preflop -> turn',
  });
});

test('should accept valid minimal action', () => {
  const state = createInitialHandState();
  const updated = submitAction(state, { type: 'check' });

  assert.equal(updated.actions.length, 1);
  assert.deepEqual(updated.actions[0], { type: 'check' });
});

test('should reject invalid action type', () => {
  const state = createInitialHandState();

  assert.throws(() => submitAction(state, { type: 'jam' }), {
    message: 'Invalid action type: jam',
  });
});

test('should require positive amount for bet/raise/all_in', () => {
  const state = createInitialHandState();

  assert.throws(() => submitAction(state, { type: 'bet' }), {
    message: 'Action bet requires a positive amount',
  });

  assert.throws(() => submitAction(state, { type: 'raise', amount: 0 }), {
    message: 'Action raise requires a positive amount',
  });
});
