const { computeProgressStats } = require('../progress/progress-metrics');

function handleProgressStatsRequest(payload = {}) {
  const hands = payload.hands || [];
  return computeProgressStats(hands);
}

module.exports = {
  handleProgressStatsRequest,
};
