const test = require('node:test');
const assert = require('node:assert/strict');
const Game = require('../logic.js');
const missions = require('../missions.json');
test('객관식 정답만 통과하고 행동 미션은 자동 통과하지 않는다', () => {
  assert.equal(Game.correct(missions[0].child, 0), true);
  assert.equal(Game.correct(missions[0].child, 1), false);
  assert.equal(Game.correct(missions[4].child, 0), false);
});
test('아이용 완료만 완주에 포함하고 난이도별 기록을 보존한다', () => {
  let state = {team:'별빛', completed:{}};
  state = Game.complete(state, missions[0].id, 'adult');
  assert.equal(Game.count(state, missions), 0);
  for (const mission of missions) state = Game.complete(state, mission.id, 'child');
  assert.equal(Game.count(state, missions), missions.length);
  assert.equal(state.completed[missions[0].id].adult, true);
  assert.equal(state.team, '별빛');
});
test('미션 ID와 문제 데이터가 유효하다', () => {
  assert.equal(new Set(missions.map(m => m.id)).size, missions.length);
  for (const m of missions) for (const level of ['child','adult']) {
    const q = m[level]; assert.ok(q.question && q.hint);
    if (q.type === 'action') assert.equal(typeof q.answer, 'string');
    else assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
  }
});
