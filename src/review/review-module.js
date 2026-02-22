const { mapGradeToMarker } = require('./grade-marker');
const { VI_MESSAGES } = require('../i18n/messages-vi');

function round2(value) {
  return Math.round(value * 100) / 100;
}

function estimateEvLoss(input = {}) {
  const {
    grade,
    playerAction,
    recommendedAction,
    distribution = {},
    toCall = 10,
  } = input;

  if (grade === 'Good') {
    return {
      value: 0,
      unit: VI_MESSAGES.review.evLossUnit,
      heuristic: true,
      note: VI_MESSAGES.review.noteZeroLoss,
    };
  }

  const playerFreq = distribution[playerAction] || 0;
  const bestFreq = distribution[recommendedAction] || 1;
  const freqGap = Math.max(0.05, bestFreq - playerFreq);

  const base = Math.max(1, toCall);
  const multiplier = grade === 'Major Mistake' ? 1.2 : 0.45;
  const evLoss = round2(base * freqGap * multiplier);

  return {
    value: evLoss,
    unit: VI_MESSAGES.review.evLossUnit,
    heuristic: true,
    note: VI_MESSAGES.review.noteEstimatedLoss,
  };
}

function createDecisionReview(decision = {}, handContext = {}) {
  const marker = mapGradeToMarker(decision.grade);
  const evLoss = estimateEvLoss({
    ...decision,
    toCall: handContext.toCall,
  });

  return {
    index: decision.index,
    street: decision.street || 'preflop',
    actor: decision.actor || 'hero',
    action: decision.action,
    grade: decision.grade,
    marker,
    messageVi: decision.messageVi,
    recommendedAction: decision.recommendedAction,
    evLoss,
    at: decision.at,
  };
}

function buildHandReview(handHistory = {}) {
  const timeline = handHistory.timeline || [];
  const decisionTimeline = timeline.filter((event) => event.type === 'decision');

  return {
    handId: handHistory.handId,
    sessionId: handHistory.sessionId,
    context: handHistory.context || {},
    decisions: decisionTimeline.map((decision) => createDecisionReview(decision, handHistory.context || {})),
    coachLogs: handHistory.coachLogs || [],
  };
}

function renderReviewText(review = {}) {
  const lines = (review.decisions || []).map((entry) => {
    return `#${entry.index} ${entry.actor} ${entry.action} | ${entry.marker.label} | ${VI_MESSAGES.review.evLossLabel}: ${entry.evLoss.value} ${entry.evLoss.unit}`;
  });

  return [`${VI_MESSAGES.review.titlePrefix} ${review.handId || 'n/a'}`, ...lines].join('\n');
}

module.exports = {
  estimateEvLoss,
  buildHandReview,
  renderReviewText,
};
