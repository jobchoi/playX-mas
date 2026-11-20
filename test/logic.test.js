const test = require('node:test');
const assert = require('node:assert/strict');
const Game = require('../logic.js');
const stations = require('../missions.json');
const order = require('../games/order.js');
const cipher = require('../games/cipher.js');
const memory = require('../games/memory.js');

test('조각은 아이용 성공 시 한 번만 수집되고 순서대로 표시된다', () => {
  let state = Game.complete({}, stations[1], 'adult');
  assert.deepEqual(Game.collected(state, stations), []);
  state = Game.complete(state, stations[1], 'child');
  state = Game.complete(state, stations[1], 'child');
  state = Game.complete(state, stations[0], 'child');
  assert.deepEqual(Game.collected(state, stations).map(f => f.order), [1, 2]);
  assert.equal(state.completed[stations[1].id].adult, true);
});
test('피날레는 모든 기본 조각이 있어야 열리고 보너스는 필수가 아니다', () => {
  let state = Game.complete({}, stations.at(-1), 'child');
  for (const s of stations.filter(s => !s.bonus).slice(0, -1)) state = Game.complete(state, s, 'child');
  assert.equal(Game.finale(state, stations), false);
  state = Game.complete(state, stations.filter(s => !s.bonus).at(-1), 'child');
  assert.equal(Game.finale(state, stations), true);
  assert.equal(Game.finale({}, []), false);
  let withoutBonus = {};
  for (const s of stations.filter(s => !s.bonus)) withoutBonus = Game.complete(withoutBonus, s, 'child');
  assert.equal(Game.finale(withoutBonus, stations), true);
});
test('순서 게임은 정확한 전체 순서만 정답이다', () => {
  const data = stations.find(s => s.game === 'order').child;
  assert.equal(order.correct(data, data.answer), true);
  assert.equal(order.correct(data, [...data.answer].reverse()), false);
  assert.equal(order.correct(data, data.answer.slice(0, -1)), false);
});
test('암호 게임은 공백을 무시하고 정답을 판정한다', () => {
  const data = stations.find(s => s.game === 'cipher').child;
  assert.equal(cipher.correct(data, ' 기 쁨 '), true);
  assert.equal(cipher.correct(data, '슬픔'), false);
});
test('기억 게임은 중복 없이 모든 짝을 찾아야 한다', () => {
  const data = stations.find(s => s.game === 'memory').adult;
  assert.equal(memory.correct(data, [...data.pairs].reverse()), true);
  assert.equal(memory.correct(data, data.pairs.slice(1)), false);
  assert.equal(memory.correct(data, data.pairs.map(() => data.pairs[0])), false);
});
test('모든 지점의 난이도 데이터와 조각 순서가 유효하다', () => {
  assert.equal(new Set(stations.map(s => s.id)).size, stations.length);
  assert.equal(new Set(stations.map(s => s.fragment.order)).size, stations.length);
  const plugins = {order, cipher, memory};
  for (const s of stations) for (const level of ['child','adult']) {
    assert.ok(plugins[s.game] && s[level].question && s[level].hint);
    const d = s[level];
    if (s.game === 'order') { assert.equal(new Set(d.items).size, d.items.length); assert.deepEqual([...d.items].sort(), [...d.answer].sort()); }
    if (s.game === 'cipher') assert.ok(d.clue && d.answer);
    if (s.game === 'memory') assert.equal(new Set(d.pairs).size, d.pairs.length);
  }
});
