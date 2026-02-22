const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getPreflopGtoRecommendation,
  cardsToHandKey,
} = require('../src/coach/preflop-gto-baseline');
const { getCoachPreflopRecommendation } = require('../src/coach/preflop-coach-service');

function sumDistribution(distribution) {
  return Object.values(distribution).reduce((acc, n) => acc + n, 0);
}

test('spot with baseline data should return mapped action distribution', () => {
  const recommendation = getPreflopGtoRecommendation({
    spot: 'BTN_OPEN_100BB',
    holeCards: [
      { rank: 'A', suit: 's' },
      { rank: 'K', suit: 's' },
    ],
  });

  assert.equal(cardsToHandKey([{ rank: 'A', suit: 's' }, { rank: 'K', suit: 's' }]), 'AKs');
  assert.equal(recommendation.source, 'baseline');
  assert.equal(recommendation.handKey, 'AKs');
  assert.equal(recommendation.recommendedAction, 'raise');
  assert.deepEqual(recommendation.distribution, { raise: 0.8, call: 0.2 });
});

test('missing spot/hand data should use safe fallback (no crash)', () => {
  const recommendation = getCoachPreflopRecommendation({
    spot: 'CO_OPEN_100BB',
    holeCards: [
      { rank: '9', suit: 'd' },
      { rank: '4', suit: 'c' },
    ],
    toCall: 100,
  });

  assert.equal(recommendation.source, 'fallback');
  assert.equal(recommendation.recommendedAction, 'fold');
  assert.match(recommendation.reason, /Safe fallback/);
  assert.deepEqual(recommendation.distribution, { fold: 0.9, call: 0.1 });
});

test('returned distribution should be valid (sum approx 1)', () => {
  const recommendation = getPreflopGtoRecommendation({
    spot: 'BB_VS_BTN_OPEN_100BB',
    handKey: 'AJo',
  });

  const sum = sumDistribution(recommendation.distribution);
  assert.ok(sum > 0.999 && sum < 1.001, `distribution sum out of range: ${sum}`);
});
