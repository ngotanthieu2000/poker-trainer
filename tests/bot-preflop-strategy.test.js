const test = require('node:test');
const assert = require('node:assert/strict');

const { decidePreflopAction } = require('../src/bot/preflop-strategy');

const cards = (a, b) => [a, b];

test('Nit should fold weak offsuit hand when facing bet', () => {
  const decision = decidePreflopAction({
    profile: 'nit',
    holeCards: cards({ rank: '7', suit: 'h' }, { rank: '2', suit: 'c' }),
    toCall: 100,
    bigBlind: 100,
  });

  assert.equal(decision.type, 'fold');
  assert.match(decision.reason, /Nit/);
});

test('TAG should raise strong broadway hand preflop', () => {
  const decision = decidePreflopAction({
    profile: 'tag',
    holeCards: cards({ rank: 'A', suit: 'h' }, { rank: 'Q', suit: 'h' }),
    toCall: 0,
    bigBlind: 100,
  });

  assert.equal(decision.type, 'raise');
  assert.equal(decision.amount, 250);
});

test('LAG should raise wider playable range', () => {
  const decision = decidePreflopAction({
    profile: 'lag',
    holeCards: cards({ rank: '9', suit: 's' }, { rank: '8', suit: 's' }),
    toCall: 0,
    bigBlind: 100,
  });

  assert.equal(decision.type, 'raise');
  assert.match(decision.reason, /wide aggressive/);
});

test('Calling Station should call speculative hand facing bet', () => {
  const decision = decidePreflopAction({
    profile: 'calling_station',
    holeCards: cards({ rank: '9', suit: 'h' }, { rank: '6', suit: 'h' }),
    toCall: 100,
    bigBlind: 100,
  });

  assert.equal(decision.type, 'call');
  assert.match(decision.reason, /call wide/);
});
