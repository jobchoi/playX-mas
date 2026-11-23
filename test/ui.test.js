const test = require('node:test');
const assert = require('node:assert/strict');
const cipher = require('../games/cipher.js');
const memory = require('../games/memory.js');

// Minimal DOM for exercising plugin interactions without a browser dependency.
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.attributes = {}; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(key, value) { this.attributes[key] = value; }
}
function withDOM(run) {
  const previous = global.document;
  global.document = {createElement: tag => new Element(tag)};
  try { run(); } finally { global.document = previous; }
}
test('아이용 보기 클릭은 정답·오답을 전달하고 어른과 보기 없는 데이터는 입력을 제공한다', () => withDOM(() => {
  const data = {clue: '암호', answer: '기쁨', choices: ['기쁨', '선물', '별빛']};
  const container = new Element('div'), results = [];
  cipher.mount(container, data, value => results.push(value), {level: 'child'});
  const choices = container.children.filter(node => node.tag === 'button');
  assert.equal(choices.length, 3);
  choices[1].onclick(); choices[0].onclick();
  assert.deepEqual(results, [false, true]);
  for (const [mission, level] of [[data, 'adult'], [{clue: '암호', answer: '기쁨'}, 'child']]) {
    const area = new Element('div');
    cipher.mount(area, mission, value => results.push(value), {level});
    const form = area.children.find(node => node.tag === 'form');
    assert.ok(form);
    form.children[0].children[0].value = '기 쁨';
    form.onsubmit({preventDefault() {}});
    assert.equal(results.at(-1), true);
  }
}));
test('완료 기억 게임은 전체 앞면이며 다시 하기는 뒤집힌 새 게임을 제공한다', () => withDOM(() => {
  const container = new Element('div'), data = {pairs: ['별', '달', '선물']};
  let completions = 0;
  memory.mount(container, data, () => completions++, {completed: true});
  let board = container.children[0];
  assert.equal(board.children.length, 6);
  assert.equal(board.className, 'memory-board');
  assert.ok(board.children.every(node => data.pairs.includes(node.textContent) && node.disabled));
  container.children[1].onclick();
  board = container.children[0];
  assert.ok(board.children.every(node => node.textContent === '★' && !node.disabled));
  board.children[0].onclick();
  assert.ok(data.pairs.includes(board.children[0].textContent));
  assert.equal(board.children.filter(node => node.textContent !== '★').length, 1);
  assert.equal(completions, 0);
}));

test('두 페이지가 존재하는 favicon을 명시한다', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const root = path.join(__dirname, '..');
  for (const page of ['index.html', 'urls.html']) {
    assert.match(fs.readFileSync(path.join(root, page), 'utf8'), /rel="icon" href="favicon\.svg"/);
  }
  assert.match(fs.readFileSync(path.join(root, 'favicon.svg'), 'utf8'), /<svg\b/);
});
