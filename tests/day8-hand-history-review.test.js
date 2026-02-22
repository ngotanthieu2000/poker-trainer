const test = require('node:test');
const assert = require('node:assert/strict');

const { createInMemoryHandHistoryStore } = require('../src/review/hand-history-store');
const { mapGradeToMarker } = require('../src/review/grade-marker');
const { buildHandReview } = require('../src/review/review-module');
const { createTableController } = require('../src/ui/poker-table-controller');

test('hand history store should save and read timeline events', () => {
  const store = createInMemoryHandHistoryStore();
  store.startHand({
    handId: 'h-day8-1',
    sessionId: 's-day8',
    context: { spot: 'BB_VS_BTN_OPEN_100BB', toCall: 10 },
  });

  store.appendTimelineEvent('h-day8-1', {
    type: 'decision',
    street: 'preflop',
    actor: 'hero',
    action: 'call',
    grade: 'Good',
    recommendedAction: 'call',
  });

  const hand = store.getHand('h-day8-1');
  assert.equal(hand.timeline.length, 1);
  assert.equal(hand.timeline[0].action, 'call');
  assert.equal(hand.timeline[0].index, 0);
});

test('grade marker mapping should map Good / Mistake / Major Mistake correctly', () => {
  assert.deepEqual(mapGradeToMarker('Good'), { key: 'good', label: 'Tốt' });
  assert.deepEqual(mapGradeToMarker('Mistake'), { key: 'mistake', label: 'Lỗi' });
  assert.deepEqual(mapGradeToMarker('Major Mistake'), { key: 'major-mistake', label: 'Lỗi nặng' });
});

test('review output should include evLoss field with heuristic metadata', () => {
  const store = createInMemoryHandHistoryStore();
  store.startHand({
    handId: 'h-day8-2',
    sessionId: 's-day8',
    context: { spot: 'BB_VS_BTN_OPEN_100BB', toCall: 10 },
  });

  store.appendTimelineEvent('h-day8-2', {
    type: 'decision',
    street: 'preflop',
    actor: 'hero',
    action: 'raise',
    grade: 'Major Mistake',
    recommendedAction: 'call',
    distribution: { call: 0.75, fold: 0.25 },
    messageVi: 'raise là lỗi lớn ở spot này',
  });

  const review = buildHandReview(store.getHand('h-day8-2'));
  assert.equal(review.decisions.length, 1);
  assert.equal(typeof review.decisions[0].evLoss.value, 'number');
  assert.ok(review.decisions[0].evLoss.value >= 0);
  assert.equal(review.decisions[0].evLoss.heuristic, true);
});

test('controller should connect gameplay + coach logs into hand review', () => {
  const controller = createTableController({
    handId: 'h-day8-3',
    sessionId: 's-day8',
    spot: 'BB_VS_BTN_OPEN_100BB',
    handKey: 'AJo',
    toCall: 10,
    heroStack: 100,
  });

  controller.loadPreActionHint();
  controller.submitAction('raise');

  const handHistory = controller.getCurrentHandHistory();
  const review = controller.getReview();

  assert.equal(handHistory.timeline.length, 1);
  assert.equal(handHistory.coachLogs.length, 2);
  assert.equal(review.decisions.length, 1);
  assert.ok(['Tốt', 'Lỗi', 'Lỗi nặng'].includes(review.decisions[0].marker.label));
  assert.match(controller.renderReview(), /EV loss:/);
});
