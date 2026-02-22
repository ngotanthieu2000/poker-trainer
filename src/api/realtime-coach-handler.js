const { getPreActionHint, getPostActionGrade } = require('../coach/realtime-coach-service');

function handleRealtimeCoachRequest(payload = {}) {
  const { mode } = payload;

  if (mode === 'pre_action') {
    return getPreActionHint(payload.context || {});
  }

  if (mode === 'post_action') {
    return getPostActionGrade({
      playerAction: payload.playerAction,
      context: payload.context || {},
    });
  }

  throw new Error('Unsupported mode. Use pre_action or post_action');
}

module.exports = {
  handleRealtimeCoachRequest,
};
