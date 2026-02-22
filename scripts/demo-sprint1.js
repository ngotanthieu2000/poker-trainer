const { createTableController } = require('../src/ui/poker-table-controller');
const { computeProgressStats } = require('../src/progress/progress-metrics');

function runDemo() {
  console.log('=== Poker Trainer - Sprint 1 Internal Demo ===');

  const controller = createTableController({
    context: {
      spot: 'btn-open-100bb',
      heroHand: 'AKo',
      toCall: 2,
      pot: 3,
      heroPosition: 'BTN',
    },
    level: 'Beginner',
  });

  console.log('\n1) Render table (initial)');
  console.log(controller.render());

  console.log('\n2) Load pre-action hint');
  const hint = controller.loadPreActionHint();
  console.log(hint);

  console.log('\n3) Submit action: call');
  const grade = controller.submitAction('call');
  console.log(grade);

  console.log('\n4) Render review');
  console.log(controller.renderReview());

  console.log('\n5) Progress stats sample');
  const handHistories = [
    controller.getCurrentHandHistory(),
    {
      handId: 'sample-2',
      startedAt: '2026-02-20T10:00:00.000Z',
      timeline: [
        {
          type: 'decision',
          street: 'preflop',
          actor: 'hero',
          action: 'raise',
          grade: 'Mistake',
          recommendedAction: 'call',
          messageVi: 'Tố hơi mỏng ở spot này',
          heroPosition: 'CO',
        },
      ],
    },
  ];

  const stats = computeProgressStats(handHistories);
  console.log(JSON.stringify(stats, null, 2));

  console.log('\n=== Demo completed ===');
}

runDemo();
