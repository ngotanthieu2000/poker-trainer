const { performance } = require('node:perf_hooks');

const { computeProgressStats } = require('../src/progress/progress-metrics');
const { createInitialUiState, renderTableHtml, createRenderCache } = require('../src/ui/table-ui');

function isCorrectGrade(grade) {
  return String(grade || '').toLowerCase() === 'good';
}

function oldComputeProgressStats(hands = []) {
  const handList = Array.isArray(hands) ? hands : [];
  const byStreet = {
    preflop: { correct: 0, total: 0, accuracy: null },
    flop: { correct: 0, total: 0, accuracy: null },
    turn: { correct: 0, total: 0, accuracy: null },
    river: { correct: 0, total: 0, accuracy: null },
  };

  handList.forEach((hand) => {
    const decisions = (hand.timeline || []).filter((event) => event.type === 'decision');
    decisions.forEach((decision) => {
      const street = (decision.street || 'preflop').toLowerCase();
      if (!byStreet[street]) return;
      byStreet[street].total += 1;
      if (isCorrectGrade(decision.grade)) byStreet[street].correct += 1;
    });
  });

  const recentHands = [...handList]
    .sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime())
    .slice(0, 50)
    .map((hand) => {
      const decisions = (hand.timeline || []).filter((event) => event.type === 'decision');
      const correct = decisions.filter((item) => isCorrectGrade(item.grade)).length;
      const total = decisions.length;
      return {
        handId: hand.handId,
        accuracy: total ? (correct / total) * 100 : null,
      };
    });

  return { byStreet, recentHands };
}

function benchmark(name, fn, iterations = 1000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) fn();
  const end = performance.now();
  return {
    name,
    totalMs: Number((end - start).toFixed(2)),
    avgMs: Number(((end - start) / iterations).toFixed(4)),
  };
}

function createHands(totalHands = 2500, decisionsPerHand = 6) {
  return Array.from({ length: totalHands }, (_, h) => ({
    handId: `h-${h}`,
    sessionId: 's-bench',
    startedAt: `2026-02-22T10:${String(h % 60).padStart(2, '0')}:00.000Z`,
    context: { position: 'BB', toCall: 10 },
    timeline: Array.from({ length: decisionsPerHand }, (_, d) => ({
      type: 'decision',
      index: d,
      street: 'preflop',
      action: d % 2 === 0 ? 'call' : 'raise',
      grade: d % 3 === 0 ? 'Good' : 'Mistake',
      recommendedAction: 'call',
      distribution: { call: 0.6, raise: 0.2, fold: 0.2 },
    })),
    coachLogs: [],
  }));
}

const hands = createHands();
const state = createInitialUiState({ level: 'Beginner' });
const cache = createRenderCache();

const results = [
  benchmark('progress_old', () => oldComputeProgressStats(hands), 200),
  benchmark('progress_new', () => computeProgressStats(hands), 200),
  benchmark('render_no_cache', () => renderTableHtml(state), 10000),
  benchmark('render_cached', () => renderTableHtml(state, cache), 10000),
];

console.table(results);
