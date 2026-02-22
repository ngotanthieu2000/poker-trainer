const test = require('node:test');
const assert = require('node:assert/strict');

const { VI_MESSAGES, POKER_GLOSSARY_VI } = require('../src/i18n/messages-vi');
const { createInitialUiState, renderTableHtml, getCoachViewByLevel } = require('../src/ui/table-ui');
const { renderReviewText } = require('../src/review/review-module');
const { computeProgressStats } = require('../src/progress/progress-metrics');

test('table + coach should use centralized Vietnamese labels', () => {
  const html = renderTableHtml(createInitialUiState({ level: 'Beginner' }));

  assert.match(html, new RegExp(VI_MESSAGES.ui.tableTitle));
  assert.match(html, new RegExp(VI_MESSAGES.ui.coachPanelTitle));
  assert.match(html, /Bỏ bài/);
  assert.match(html, /Theo/);
  assert.match(html, /Tố/);

  const proView = getCoachViewByLevel('Pro', {
    postActionGrade: { grade: 'Good', messageVi: 'Đúng baseline.', recommendedAction: 'call' },
  });
  assert.match(proView.preActionText, /Ẩn gợi ý trước hành động/);
  assert.match(proView.detailText, /Hành động khuyến nghị: Theo/);
});

test('review/progress should reuse Vietnamese fallback terms consistently', () => {
  const reviewText = renderReviewText({
    handId: 'h-day10',
    decisions: [{ index: 0, actor: 'hero', action: 'call', marker: { label: 'Tốt' }, evLoss: { value: 0, unit: 'chip' } }],
  });
  assert.match(reviewText, /Xem lại ván h-day10/);
  assert.match(reviewText, /Mất EV: 0 chip/);

  const stats = computeProgressStats([
    {
      handId: 'h-err',
      sessionId: 's1',
      startedAt: '2026-02-22T10:00:00.000Z',
      context: { position: 'BB' },
      timeline: [{ type: 'decision', street: 'preflop', action: 'raise', grade: 'Mistake', recommendedAction: 'call' }],
      coachLogs: [],
    },
  ]);

  assert.equal(stats.topErrors[0].messageVi, VI_MESSAGES.progress.defaultRecommendationMismatch);
  assert.equal(stats.accuracyByStreet.flop.status, VI_MESSAGES.progress.accuracyPlaceholderStatus);
});

test('glossary source should contain key poker terms', () => {
  const terms = POKER_GLOSSARY_VI.map((item) => item.term);
  assert.ok(terms.includes('Fold (Bỏ bài)'));
  assert.ok(terms.includes('Call (Theo)'));
  assert.ok(terms.includes('Raise (Tố)'));
  assert.ok(terms.includes('GTO baseline'));
});
