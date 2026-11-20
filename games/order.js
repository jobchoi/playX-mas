(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else (root.MiniGames ||= {}).order = factory();
})(globalThis, function () {
  function correct(data, answer) { return Array.isArray(answer) && answer.length === data.answer.length && answer.every((item, i) => item === data.answer[i]); }
  function mount(container, data, finish) {
    let selected = [];
    const choices = document.createElement('div'), result = document.createElement('p');
    container.append(choices, result);
    function draw() {
      choices.replaceChildren();
      data.items.forEach(item => { const b = document.createElement('button'); b.type = 'button'; b.textContent = item; b.disabled = selected.includes(item); b.onclick = () => { selected.push(item); draw(); }; choices.append(b); });
      result.textContent = `선택한 순서: ${selected.join(' → ') || '아직 없음'}`;
    }
    draw();
    const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = '다시 고르기'; reset.onclick = () => { selected = []; draw(); }; container.append(reset);
    const check = document.createElement('button'); check.type = 'button'; check.textContent = '정답 확인'; check.onclick = () => finish(correct(data, selected)); container.append(check);
  }
  return {correct, mount};
});
