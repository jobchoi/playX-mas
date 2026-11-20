(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else (root.MiniGames ||= {}).memory = factory();
})(globalThis, function () {
  function correct(data, pairs) { return Array.isArray(pairs) && pairs.length === data.pairs.length && new Set(pairs).size === data.pairs.length && data.pairs.every(x => pairs.includes(x)); }
  function mount(container, data, finish) {
    const cards = [...data.pairs, ...data.pairs].map((value, id) => ({value, id}));
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    let open = [], matched = [], locked = false;
    const board = document.createElement('div'); container.append(board);
    function draw() {
      board.replaceChildren();
      cards.forEach(card => { const b = document.createElement('button'); b.type = 'button'; const visible = open.includes(card.id) || matched.includes(card.value); b.textContent = visible ? card.value : '★'; b.setAttribute('aria-label', visible ? card.value : '뒤집힌 카드'); b.disabled = locked || visible; b.onclick = () => {
        open.push(card.id);
        if (open.length === 2) {
          const [a, b] = open.map(id => cards.find(c => c.id === id));
          if (a.value === b.value) { matched.push(a.value); open = []; draw(); if (correct(data, matched)) finish(true); }
          else { locked = true; draw(); setTimeout(() => { open = []; locked = false; draw(); }, 800); }
        } else draw();
      }; board.append(b); });
    }
    draw();
  }
  return {correct, mount};
});
