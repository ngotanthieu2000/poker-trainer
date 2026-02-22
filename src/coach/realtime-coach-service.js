const { getCoachPreflopRecommendation } = require('./preflop-coach-service');

const VALID_GRADE = ['Good', 'Mistake', 'Major Mistake'];

function buildHintMessage(recommendation) {
  const action = recommendation.recommendedAction;

  if (recommendation.source === 'fallback') {
    return `Gợi ý tạm thời: ${action}. Hiện chưa có dữ liệu spot/hand đầy đủ nên hệ thống đang dùng baseline an toàn.`;
  }

  return `Nên ưu tiên ${action} theo baseline preflop cho spot này. Cân nhắc tần suất action trước khi bấm.`;
}

function buildGradeMessage({ grade, playerAction, recommendation }) {
  const bestAction = recommendation.recommendedAction;

  if (grade === 'Good') {
    return `Bạn chọn ${playerAction} là hợp lý trong spot này. Action này bám sát baseline khuyến nghị.`;
  }

  if (grade === 'Mistake') {
    return `Action ${playerAction} chưa tối ưu bằng ${bestAction}. Đây là sai lệch nhẹ, bạn vẫn giữ được một phần EV.`;
  }

  return `Action ${playerAction} lệch khá xa so với baseline (${bestAction}). Đây là lỗi lớn, nên ưu tiên line an toàn hơn ở spot này.`;
}

function gradeFromDistribution(playerAction, recommendation) {
  const distribution = recommendation.distribution || {};
  const playerFreq = distribution[playerAction] || 0;

  if (playerAction === recommendation.recommendedAction) {
    return 'Good';
  }

  if (playerFreq >= 0.2) {
    return 'Mistake';
  }

  return 'Major Mistake';
}

function getPreActionHint(context = {}) {
  const recommendation = getCoachPreflopRecommendation(context);

  return {
    kind: 'pre_action_hint',
    spot: recommendation.spot,
    handKey: recommendation.handKey,
    source: recommendation.source,
    recommendedAction: recommendation.recommendedAction,
    distribution: recommendation.distribution,
    messageVi: buildHintMessage(recommendation),
  };
}

function getPostActionGrade(input = {}) {
  const { playerAction, context = {} } = input;

  if (!playerAction || typeof playerAction !== 'string') {
    throw new Error('playerAction is required');
  }

  const recommendation = getCoachPreflopRecommendation(context);
  const grade = gradeFromDistribution(playerAction, recommendation);

  if (!VALID_GRADE.includes(grade)) {
    throw new Error('invalid grade');
  }

  return {
    kind: 'post_action_grade',
    grade,
    playerAction,
    recommendedAction: recommendation.recommendedAction,
    source: recommendation.source,
    distribution: recommendation.distribution,
    messageVi: buildGradeMessage({ grade, playerAction, recommendation }),
  };
}

module.exports = {
  getPreActionHint,
  getPostActionGrade,
};
