const RANK_VALUE = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const VALID_PROFILES = ['nit', 'tag', 'lag', 'calling_station'];

function normalizeProfile(profile) {
  if (!profile) return 'tag';
  return String(profile).toLowerCase().replace(/\s+/g, '_');
}

function getHandFeatures(holeCards) {
  if (!Array.isArray(holeCards) || holeCards.length !== 2) {
    throw new Error('holeCards must contain exactly 2 cards');
  }

  const [c1, c2] = holeCards;
  const r1 = RANK_VALUE[c1.rank];
  const r2 = RANK_VALUE[c2.rank];

  if (!r1 || !r2) {
    throw new Error('Invalid card rank in holeCards');
  }

  const high = Math.max(r1, r2);
  const low = Math.min(r1, r2);
  const pair = r1 === r2;
  const suited = c1.suit === c2.suit;
  const gap = high - low;

  const premium =
    (pair && high >= 12) ||
    (high === 14 && low >= 13) ||
    (high === 14 && low === 12 && suited);

  const strong =
    premium ||
    (pair && high >= 10) ||
    (high === 14 && low >= 11) ||
    (high === 13 && low >= 12) ||
    (high === 12 && low === 11 && suited);

  const playable =
    strong ||
    (pair && high >= 7) ||
    (high === 14 && low >= 9) ||
    (high === 13 && low >= 10) ||
    (high === 12 && low >= 10 && suited) ||
    (suited && gap <= 2 && high >= 9);

  const speculative =
    playable ||
    (pair && high >= 2) ||
    (suited && gap <= 3) ||
    (high >= 10 && gap <= 2);

  return {
    high,
    low,
    pair,
    suited,
    gap,
    premium,
    strong,
    playable,
    speculative,
  };
}

function decidePreflopAction(context) {
  const {
    profile = 'tag',
    holeCards,
    toCall = 0,
    bigBlind = 100,
    hasRaiseBefore = false,
  } = context || {};

  const normalized = normalizeProfile(profile);
  if (!VALID_PROFILES.includes(normalized)) {
    throw new Error(`Unsupported bot profile: ${profile}`);
  }

  const hand = getHandFeatures(holeCards);
  const facingBet = toCall > 0;
  const openRaiseSize = Math.max(bigBlind * 2.5, bigBlind * 2 + toCall);

  if (normalized === 'nit') {
    if (hand.premium) {
      return { type: 'raise', amount: openRaiseSize, reason: 'Nit: premium hand -> value raise' };
    }

    if (facingBet && hand.strong && !hasRaiseBefore) {
      return { type: 'call', reason: 'Nit: strong but non-premium hand -> controlled call' };
    }

    return { type: facingBet ? 'fold' : 'check', reason: 'Nit: hand outside tight range' };
  }

  if (normalized === 'tag') {
    if (hand.strong) {
      return { type: 'raise', amount: openRaiseSize, reason: 'TAG: strong range -> aggressive raise' };
    }

    if (facingBet && hand.playable) {
      return { type: 'call', reason: 'TAG: playable hand facing price' };
    }

    return { type: facingBet ? 'fold' : 'check', reason: 'TAG: fold/check weak preflop combo' };
  }

  if (normalized === 'lag') {
    if (hand.playable || (!facingBet && hand.speculative)) {
      return { type: 'raise', amount: openRaiseSize, reason: 'LAG: wide aggressive opening/pressure range' };
    }

    if (facingBet && hand.speculative) {
      return { type: 'call', reason: 'LAG: defend loose speculative range' };
    }

    return { type: facingBet ? 'fold' : 'check', reason: 'LAG: bottom range fallback' };
  }

  if (hand.strong && !facingBet) {
    return { type: 'raise', amount: openRaiseSize, reason: 'Calling Station: raise only very strong unopened spots' };
  }

  if (facingBet && hand.speculative) {
    return { type: 'call', reason: 'Calling Station: tendency to call wide' };
  }

  return { type: facingBet ? 'fold' : 'check', reason: 'Calling Station: no bet to call, default check' };
}

module.exports = {
  VALID_PROFILES,
  decidePreflopAction,
  getHandFeatures,
};
