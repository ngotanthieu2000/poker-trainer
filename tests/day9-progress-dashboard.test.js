const test = require('node:test');
const assert = require('node:assert/strict');

const { computeProgressStats } = require('../src/progress/progress-metrics');
const { handleProgressStatsRequest } = require('../src/api/progress-stats-handler');

function createHand({
  handId,
  startedAt,
  position = 'BB',
  decisions = [],
  coachLogs = [],
}) {
  return {
    handId,
    sessionId: 's-day9',
    startedAt,
    context: { position },
    timeline: decisions.map((decision) => ({ type: 'decision', street: 'preflop', actor: 'hero', ...decision })),
    coachLogs,
  };
}

test('computeProgressStats should aggregate accuracy by position/street and top errors', () => {
  const hands = [
    createHand({
      handId: 'h1',
      startedAt: '2026-02-22T10:00:00.000Z',
      position: 'BB',
      decisions: [
        { action: 'call', grade: 'Good', recommendedAction: 'call' },
        { action: 'raise', grade: 'Mistake', recommendedAction: 'call' },
      ],
      coachLogs: [
        { type: 'post_action_grade', payload: { grade: 'Mistake', recommendedAction: 'call', messageVi: 'raise sai trong spot này' } },
      ],
    }),
    createHand({
      handId: 'h2',
      startedAt: '2026-02-22T10:01:00.000Z',
      position: 'BTN',
      decisions: [
        { action: 'fold', grade: 'Major Mistake', recommendedAction: 'raise' },
      ],
      coachLogs: [
        { type: 'post_action_grade', payload: { grade: 'Major Mistake', recommendedAction: 'raise', messageVi: 'fold là lỗi lớn ở đây' } },
      ],
    }),
  ];

  const stats = computeProgressStats(hands);

  assert.equal(stats.summary.totalHands, 2);
  assert.equal(stats.summary.totalDecisions, 3);

  assert.equal(stats.accuracyByPosition.BB.total, 2);
  assert.equal(stats.accuracyByPosition.BB.correct, 1);
  assert.equal(stats.accuracyByPosition.BB.accuracy, 50);

  assert.equal(stats.accuracyByPosition.BTN.total, 1);
  assert.equal(stats.accuracyByPosition.BTN.correct, 0);
  assert.equal(stats.accuracyByPosition.BTN.accuracy, 0);

  assert.equal(stats.accuracyByStreet.preflop.total, 3);
  assert.equal(stats.accuracyByStreet.preflop.status, 'implemented');
  assert.equal(stats.accuracyByStreet.flop.status, 'placeholder_until_postflop_review_data');

  assert.equal(stats.topErrors.length, 2);
  assert.equal(stats.topErrors[0].count, 1);
});

test('computeProgressStats should handle empty input and keep placeholders clear', () => {
  const stats = computeProgressStats([]);

  assert.equal(stats.summary.totalHands, 0);
  assert.equal(stats.summary.totalDecisions, 0);
  assert.equal(stats.recentHands.length, 0);
  assert.equal(stats.topErrors.length, 0);

  assert.equal(stats.accuracyByPosition.UTG.accuracy, null);
  assert.equal(stats.accuracyByStreet.preflop.accuracy, null);
  assert.equal(stats.accuracyByStreet.turn.status, 'placeholder_until_postflop_review_data');
});

test('computeProgressStats should return at most 50 recent hands ordered desc by startedAt', () => {
  const hands = Array.from({ length: 30 }, (_, i) =>
    createHand({
      handId: `h-${i}`,
      startedAt: `2026-02-22T10:${String(i).padStart(2, '0')}:00.000Z`,
      position: 'CO',
      decisions: [{ action: 'call', grade: 'Good', recommendedAction: 'call' }],
    }),
  );

  const stats = computeProgressStats(hands);

  assert.equal(stats.recentHands.length, 30);
  assert.equal(stats.recentHands[0].handId, 'h-29');
  assert.equal(stats.recentHands[29].handId, 'h-0');
});

test('progress stats handler should expose API-compatible response', () => {
  const payload = {
    hands: [
      createHand({
        handId: 'h-api-1',
        startedAt: '2026-02-22T11:00:00.000Z',
        position: 'SB',
        decisions: [{ action: 'call', grade: 'Good', recommendedAction: 'call' }],
      }),
    ],
  };

  const result = handleProgressStatsRequest(payload);
  assert.equal(result.summary.totalHands, 1);
  assert.equal(result.accuracyByPosition.SB.accuracy, 100);
});
