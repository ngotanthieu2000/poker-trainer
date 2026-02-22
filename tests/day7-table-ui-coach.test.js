const test = require('node:test');
const assert = require('node:assert/strict');

const { createInitialUiState, renderTableHtml, getCoachViewByLevel } = require('../src/ui/table-ui');
const { createTableController } = require('../src/ui/poker-table-controller');

test('table ui v1 should render 6-max seats, pot and action controls', () => {
  const state = createInitialUiState({ level: 'Beginner' });
  const html = renderTableHtml(state);

  assert.match(html, /Bàn poker 6-max v1/);
  assert.match(html, /Pot: 15/);
  assert.match(html, /Cần theo: 10/);
  assert.equal((html.match(/data-seat=/g) || []).length, 6);
  assert.match(html, /data-action="fold"/);
  assert.match(html, /data-action="call"/);
  assert.match(html, /data-action="raise"/);
  assert.match(html, />Bỏ bài</);
  assert.match(html, />Theo</);
  assert.match(html, />Tố</);
});

test('support level toggle should change coach visibility behavior', () => {
  const coachPanel = {
    preActionHint: {
      source: 'baseline',
      recommendedAction: 'call',
      messageVi: 'Nên call trong spot này.',
      distribution: { call: 0.6, fold: 0.4 },
    },
    postActionGrade: null,
  };

  const beginner = getCoachViewByLevel('Beginner', coachPanel);
  const intermediate = getCoachViewByLevel('Intermediate', coachPanel);
  const pro = getCoachViewByLevel('Pro', coachPanel);

  assert.match(beginner.preActionText, /Nên call/);
  assert.match(beginner.detailText, /Dải tần suất:/);

  assert.match(intermediate.preActionText, /ưu tiên Theo/);
  assert.match(intermediate.detailText, /Nguồn:/);

  assert.match(pro.preActionText, /Ẩn gợi ý trước hành động/);
});

test('controller should connect pre-action hint and post-action grade end-to-end', () => {
  const controller = createTableController({
    level: 'Beginner',
    spot: 'BB_VS_BTN_OPEN_100BB',
    handKey: 'AJo',
    toCall: 10,
    heroStack: 100,
  });

  const hint = controller.loadPreActionHint();
  assert.equal(hint.kind, 'pre_action_hint');
  assert.ok(hint.messageVi.length > 0);

  const grade = controller.submitAction('call');
  assert.equal(grade.kind, 'post_action_grade');
  assert.equal(grade.grade, 'Good');

  const state = controller.getState();
  const hero = state.seats.find((seat) => seat.isHero);
  assert.equal(hero.stack, 90);
  assert.equal(state.pot, 25);

  const html = controller.render();
  assert.match(html, /Coach thời gian thực/);
  assert.match(html, /\[Good\]/);
});
