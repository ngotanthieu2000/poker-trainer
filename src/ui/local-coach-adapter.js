const { handleRealtimeCoachRequest } = require('../api/realtime-coach-handler');

function fetchPreActionHint(context = {}) {
  return handleRealtimeCoachRequest({
    mode: 'pre_action',
    context,
  });
}

function fetchPostActionGrade(playerAction, context = {}) {
  return handleRealtimeCoachRequest({
    mode: 'post_action',
    playerAction,
    context,
  });
}

module.exports = {
  fetchPreActionHint,
  fetchPostActionGrade,
};
