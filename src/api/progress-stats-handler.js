const { computeProgressStats } = require('../progress/progress-metrics');

function handleProgressStatsRequest(payload = {}) {
  try {
    const hands = Array.isArray(payload.hands) ? payload.hands : [];
    if (!hands.length) {
      return {
        status: 'empty',
        ...computeProgressStats([]),
      };
    }

    return {
      status: 'ready',
      ...computeProgressStats(hands),
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      ...computeProgressStats([]),
    };
  }
}

module.exports = {
  handleProgressStatsRequest,
};
