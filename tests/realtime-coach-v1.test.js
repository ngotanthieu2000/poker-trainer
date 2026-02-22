const test = require('node:test');
const assert = require('node:assert/strict');

const { getPreActionHint, getPostActionGrade } = require('../src/coach/realtime-coach-service');
const { handleRealtimeCoachRequest } = require('../src/api/realtime-coach-handler');

test('pre-action hint should return valid recommendation payload', () => {
  const result = getPreActionHint({
    spot: 'BTN_OPEN_100BB',
    handKey: 'AKs',
    toCall: 0,
  });

  assert.equal(result.kind, 'pre_action_hint');
  assert.equal(result.recommendedAction, 'raise');
  assert.ok(result.distribution.raise > 0);
  assert.match(result.messageVi, /Nên ưu tiên/);
});

test('post-action grading should classify Good / Mistake / Major Mistake', () => {
  const context = {
    spot: 'BB_VS_BTN_OPEN_100BB',
    handKey: 'AJo',
  };

  const good = getPostActionGrade({ playerAction: 'call', context });
  const mistake = getPostActionGrade({ playerAction: 'fold', context });
  const major = getPostActionGrade({ playerAction: 'raise', context });

  assert.equal(good.grade, 'Good');
  assert.equal(mistake.grade, 'Mistake');
  assert.equal(major.grade, 'Major Mistake');

  assert.match(good.messageVi, /hợp lý/);
  assert.match(mistake.messageVi, /sai lệch nhẹ/);
  assert.match(major.messageVi, /lỗi lớn/);
});

test('fallback path should keep stable Vietnamese message', () => {
  const hint = getPreActionHint({
    spot: 'UNKNOWN_SPOT',
    holeCards: [
      { rank: '7', suit: 'd' },
      { rank: '2', suit: 'c' },
    ],
    toCall: 20,
  });

  assert.equal(hint.source, 'fallback');
  assert.match(hint.messageVi, /Gợi ý tạm thời/);
  assert.match(hint.messageVi, /baseline an toàn/);
});

test('realtime handler should route pre_action and post_action modes', () => {
  const pre = handleRealtimeCoachRequest({
    mode: 'pre_action',
    context: { spot: 'BTN_OPEN_100BB', handKey: 'AKs' },
  });

  const post = handleRealtimeCoachRequest({
    mode: 'post_action',
    playerAction: 'raise',
    context: { spot: 'BTN_OPEN_100BB', handKey: 'AKs' },
  });

  assert.equal(pre.kind, 'pre_action_hint');
  assert.equal(post.kind, 'post_action_grade');
});
