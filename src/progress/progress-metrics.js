const { VI_MESSAGES } = require('../i18n/messages-vi');

const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
const STREETS = ['preflop', 'flop', 'turn', 'river'];

function round2(value) {
  return Math.round(value * 100) / 100;
}

function isCorrectGrade(grade) {
  return String(grade || '').toLowerCase() === 'good';
}

function getHeroPosition(hand = {}) {
  return hand.context?.position || hand.context?.heroPosition || 'BB';
}

function createAccuracyBuckets(keys) {
  return keys.reduce((acc, key) => {
    acc[key] = { correct: 0, total: 0, accuracy: null };
    return acc;
  }, {});
}

function finalizeAccuracyBuckets(buckets) {
  Object.keys(buckets).forEach((key) => {
    const bucket = buckets[key];
    bucket.accuracy = bucket.total ? round2((bucket.correct / bucket.total) * 100) : null;
  });
  return buckets;
}

function normalizeTimestamp(value) {
  const ts = Date.parse(value || 0);
  return Number.isNaN(ts) ? 0 : ts;
}

function computeProgressStats(hands = []) {
  const handList = Array.isArray(hands) ? hands : [];

  const byPosition = createAccuracyBuckets(POSITIONS);
  const byStreet = createAccuracyBuckets(STREETS);
  const errorCounter = new Map();
  const recentHandsRaw = [];

  for (let handIndex = 0; handIndex < handList.length; handIndex += 1) {
    const hand = handList[handIndex] || {};
    const position = getHeroPosition(hand);

    const coachMessageMap = new Map();
    const coachLogs = hand.coachLogs || [];
    for (let i = 0; i < coachLogs.length; i += 1) {
      const log = coachLogs[i];
      if (log.type !== 'post_action_grade') continue;
      const payload = log.payload || {};
      const key = `${payload.grade || ''}|${payload.recommendedAction || ''}`;
      if (!coachMessageMap.has(key)) {
        coachMessageMap.set(key, payload.messageVi || VI_MESSAGES.progress.defaultRecommendationMismatch);
      }
    }

    const timeline = hand.timeline || [];
    let handCorrect = 0;
    let handTotal = 0;

    for (let i = 0; i < timeline.length; i += 1) {
      const decision = timeline[i];
      if (decision.type !== 'decision') continue;

      handTotal += 1;
      const street = (decision.street || 'preflop').toLowerCase();
      const grade = decision.grade || '';
      const isCorrect = isCorrectGrade(grade);

      if (isCorrect) {
        handCorrect += 1;
      }

      if (byPosition[position]) {
        byPosition[position].total += 1;
        if (isCorrect) byPosition[position].correct += 1;
      }

      if (byStreet[street]) {
        byStreet[street].total += 1;
        if (isCorrect) byStreet[street].correct += 1;
      }

      if (!isCorrect) {
        const recommendedAction = decision.recommendedAction || 'unknown';
        const action = decision.action || 'unknown';
        const key = `${street}|${action}|${recommendedAction}`;
        const item = errorCounter.get(key) || {
          key,
          street,
          action,
          recommendedAction,
          grade,
          count: 0,
          messageVi:
            coachMessageMap.get(`${grade}|${recommendedAction}`) ||
            decision.messageVi ||
            VI_MESSAGES.progress.defaultRecommendationMismatch,
        };
        item.count += 1;
        errorCounter.set(key, item);
      }
    }

    recentHandsRaw.push({
      handId: hand.handId,
      sessionId: hand.sessionId,
      startedAt: hand.startedAt,
      position,
      decisionCount: handTotal,
      accuracy: handTotal ? round2((handCorrect / handTotal) * 100) : null,
      _ts: normalizeTimestamp(hand.startedAt),
    });
  }

  finalizeAccuracyBuckets(byPosition);
  finalizeAccuracyBuckets(byStreet);

  const topErrors = Array.from(errorCounter.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const recentHands = recentHandsRaw
    .sort((a, b) => b._ts - a._ts)
    .slice(0, 50)
    .map(({ _ts, ...item }) => item);

  return {
    summary: {
      totalHands: handList.length,
      totalDecisions: Object.values(byStreet).reduce((sum, item) => sum + item.total, 0),
      placeholderStreetCoverage: ['flop', 'turn', 'river'],
    },
    accuracyByPosition: byPosition,
    accuracyByStreet: {
      preflop: {
        ...byStreet.preflop,
        status: 'implemented',
      },
      flop: {
        ...byStreet.flop,
        status: VI_MESSAGES.progress.accuracyPlaceholderStatus,
      },
      turn: {
        ...byStreet.turn,
        status: VI_MESSAGES.progress.accuracyPlaceholderStatus,
      },
      river: {
        ...byStreet.river,
        status: VI_MESSAGES.progress.accuracyPlaceholderStatus,
      },
    },
    topErrors,
    recentHands,
  };
}

module.exports = {
  POSITIONS,
  STREETS,
  computeProgressStats,
};
