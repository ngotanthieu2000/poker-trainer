const baselineTable = require('../data/preflop-gto-baseline.json');

const VALID_ACTIONS = ['fold', 'check', 'call', 'raise', 'all_in'];
const RANK_ORDER = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const RANK_VALUE = Object.fromEntries(RANK_ORDER.map((r, i) => [r, i + 2]));

function normalizeDistribution(rawDistribution) {
  if (!rawDistribution || typeof rawDistribution !== 'object') {
    return null;
  }

  const normalized = {};
  let sum = 0;

  for (const [action, freq] of Object.entries(rawDistribution)) {
    if (!VALID_ACTIONS.includes(action)) {
      continue;
    }

    if (typeof freq !== 'number' || Number.isNaN(freq) || freq < 0) {
      continue;
    }

    normalized[action] = freq;
    sum += freq;
  }

  if (sum <= 0) {
    return null;
  }

  if (Math.abs(sum - 1) > 1e-9) {
    for (const action of Object.keys(normalized)) {
      normalized[action] = normalized[action] / sum;
    }
  }

  return normalized;
}

function pickHighestFrequencyAction(distribution) {
  return Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0];
}

function cardsToHandKey(holeCards) {
  if (!Array.isArray(holeCards) || holeCards.length !== 2) {
    return null;
  }

  const [c1, c2] = holeCards;
  const r1 = c1 && c1.rank;
  const r2 = c2 && c2.rank;

  if (!RANK_VALUE[r1] || !RANK_VALUE[r2]) {
    return null;
  }

  const suited = c1.suit && c2.suit && c1.suit === c2.suit;

  if (r1 === r2) {
    return `${r1}${r2}`;
  }

  const [high, low] = RANK_VALUE[r1] >= RANK_VALUE[r2] ? [r1, r2] : [r2, r1];
  return `${high}${low}${suited ? 's' : 'o'}`;
}

function buildFallbackDistribution(context = {}) {
  const toCall = typeof context.toCall === 'number' ? context.toCall : 0;

  if (toCall > 0) {
    return {
      distribution: { fold: 0.9, call: 0.1 },
      reason: 'No baseline data for this spot/hand. Safe fallback: mostly fold when facing action.',
    };
  }

  return {
    distribution: { check: 0.8, raise: 0.2 },
    reason: 'No baseline data for this spot/hand. Safe fallback: mostly check in unopened spot.',
  };
}

function getPreflopGtoRecommendation(input = {}) {
  const handKey = input.handKey || cardsToHandKey(input.holeCards);
  const spot = input.spot;

  if (!spot || typeof spot !== 'string') {
    throw new Error('spot is required');
  }

  const spotMap = baselineTable[spot];
  const hasHand = handKey && spotMap && spotMap[handKey];

  if (hasHand) {
    const distribution = normalizeDistribution(spotMap[handKey]);

    if (distribution) {
      return {
        spot,
        handKey,
        source: 'baseline',
        recommendedAction: pickHighestFrequencyAction(distribution),
        distribution,
        reason: 'Precomputed Day-5 preflop GTO baseline.',
      };
    }
  }

  const fallback = buildFallbackDistribution(input);

  return {
    spot,
    handKey: handKey || 'UNKNOWN',
    source: 'fallback',
    recommendedAction: pickHighestFrequencyAction(fallback.distribution),
    distribution: fallback.distribution,
    reason: fallback.reason,
  };
}

module.exports = {
  cardsToHandKey,
  normalizeDistribution,
  getPreflopGtoRecommendation,
};
