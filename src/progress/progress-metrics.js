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

function getDecisionEvents(hand = {}) {
  return (hand.timeline || []).filter((event) => event.type === 'decision');
}

function getCoachLogMessageMap(hand = {}) {
  const map = new Map();
  (hand.coachLogs || []).forEach((log) => {
    if (log.type !== 'post_action_grade') return;
    const payload = log.payload || {};
    const key = `${payload.grade || ''}|${payload.recommendedAction || ''}`;
    if (!map.has(key)) {
      map.set(key, payload.messageVi || 'Không theo action khuyến nghị');
    }
  });
  return map;
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

function computeProgressStats(hands = []) {
  const handList = Array.isArray(hands) ? hands : [];

  const byPosition = createAccuracyBuckets(POSITIONS);
  const byStreet = createAccuracyBuckets(STREETS);

  const errorCounter = new Map();

  handList.forEach((hand) => {
    const position = getHeroPosition(hand);
    const coachMessageMap = getCoachLogMessageMap(hand);

    getDecisionEvents(hand).forEach((decision) => {
      const street = (decision.street || 'preflop').toLowerCase();
      const grade = decision.grade || '';
      const isCorrect = isCorrectGrade(grade);

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
            'Không theo action khuyến nghị',
        };
        item.count += 1;
        errorCounter.set(key, item);
      }
    });
  });

  finalizeAccuracyBuckets(byPosition);
  finalizeAccuracyBuckets(byStreet);

  const topErrors = Array.from(errorCounter.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const recentHands = [...handList]
    .sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime())
    .slice(0, 50)
    .map((hand) => {
      const decisions = getDecisionEvents(hand);
      const correct = decisions.filter((item) => isCorrectGrade(item.grade)).length;
      const total = decisions.length;

      return {
        handId: hand.handId,
        sessionId: hand.sessionId,
        startedAt: hand.startedAt,
        position: getHeroPosition(hand),
        decisionCount: total,
        accuracy: total ? round2((correct / total) * 100) : null,
      };
    });

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
        status: 'placeholder_until_postflop_review_data',
      },
      turn: {
        ...byStreet.turn,
        status: 'placeholder_until_postflop_review_data',
      },
      river: {
        ...byStreet.river,
        status: 'placeholder_until_postflop_review_data',
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
