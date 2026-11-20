(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else (root.MiniGames ||= {}).cipher = factory();
})(globalThis, function () {
  function correct(data, answer) { return typeof answer === 'string' && answer.trim().replace(/\s+/g, '') === data.answer.replace(/\s+/g, ''); }
  function mount(container, data, finish) {
    const p = document.createElement('p'); p.textContent = data.clue; container.append(p);
    const form = document.createElement('form'), label = document.createElement('label'), input = document.createElement('input'), button = document.createElement('button');
    label.textContent = '암호의 답'; input.required = true; label.append(input); button.textContent = '정답 확인'; form.append(label, button); container.append(form);
    form.onsubmit = e => { e.preventDefault(); finish(correct(data, input.value)); };
  }
  return {correct, mount};
});
