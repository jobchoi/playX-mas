(async function () {
  const app = document.getElementById('app');
  try {
    const [config, stations] = await Promise.all(['config.json', 'missions.json'].map(async path => {
      const response = await fetch(path); if (!response.ok) throw new Error(path); return response.json();
    }));
    document.title = config.title; document.getElementById('title').textContent = config.title;
    let state;
    try { state = Game.normalize(JSON.parse(localStorage.getItem(config.storageKey) || '{}')); } catch (_) { state = Game.normalize({}); }
    const save = () => { try { localStorage.setItem(config.storageKey, JSON.stringify(state)); } catch (_) { alert('기기에 저장할 수 없습니다. 종이 진행표를 사용해 주세요.'); } };
    const el = (tag, text, parent, attrs = {}) => { const node = document.createElement(tag); node.textContent = text; Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k,v)); parent.append(node); return node; };
    const id = new URLSearchParams(location.search).get('station');
    const station = stations.find(s => s.id === id);
    let level = 'child';
    async function loadGame(type) {
      if (!/^[a-z][a-z0-9_-]*$/.test(type)) throw new Error('Invalid game');
      if (window.MiniGames?.[type]) return window.MiniGames[type];
      await new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = `games/${type}.js`; script.onload = resolve; script.onerror = reject; document.head.append(script); });
      if (!window.MiniGames?.[type]) throw new Error('Missing game');
      return window.MiniGames[type];
    }
    function collection(parent) {
      const fragments = Game.collected(state, stations);
      el('h2', '말씀 조각 모음함', parent);
      if (!fragments.length) el('p', '아직 조각이 없어요. 지점 게임에 도전해 보세요.', parent);
      const list = el('ol', '', parent);
      stations.filter(s => !s.bonus && s.fragment).sort((a,b) => a.fragment.order - b.fragment.order).forEach(s => el('li', fragments.includes(s.fragment) ? s.fragment.text : '아직 찾지 못한 조각', list));
      stations.filter(s => s.bonus && s.fragment && state.completed[s.id]?.child).forEach(s => el('p', s.fragment.text, parent, {class:'success'}));
      if (Game.finale(state, stations)) {
        const finale = el('section', '', parent, {class:'finale'});
        el('h2', '피날레 · 약속의 말씀', finale); el('p', config.finale, finale);
        el('blockquote', stations.filter(s => !s.bonus && s.fragment).sort((a,b) => a.fragment.order - b.fragment.order).map(s => s.fragment.text).join(' '), finale);
        el('p', config.verseReference, finale);
      }
    }
    async function render() {
      app.replaceChildren();
      if (!id) {
        el('h2', '별빛 편지', app); el('p', config.story, app); el('p', config.safety, app);
        el('h2', '탐험 지점', app); const list = el('ul', '', app, {class:'stations'});
        stations.filter(s => !s.bonus).forEach(s => { const li = el('li', '', list); el('a', `${s.title} ${state.completed[s.id]?.child ? '✓' : ''}`, li, {href:`?station=${encodeURIComponent(s.id)}`}); });
        el('p', '어딘가에 숨겨진 별 QR도 있어요!', app);
      } else if (!station) {
        el('p', '알 수 없는 지점입니다. QR 주소를 확인해 주세요.', app, {class:'error'});
      } else {
        el('h2', station.title, app); if (station.bonus) el('p', '숨겨진 지점을 발견했어요!', app, {class:'success'}); el('p', station.story, app);
        const tabs = el('div', '', app, {class:'tabs'});
        [['child','아이용 기본'],['adult','어른용 심화 (선택)']].forEach(([key, label]) => { const b = el('button', label, tabs, {type:'button', 'aria-pressed':String(level === key)}); b.onclick = () => { level = key; render(); }; });
        const mission = station[level]; el('h3', mission.question, app);
        if (state.completed[station.id]?.[level]) el('p', '이 게임을 완료했어요! ✓', app, {class:'success'});
        const area = el('div', '', app); const feedback = el('p', '', app, {role:'status'});
        const details = el('details', '', app); el('summary', '힌트 보기', details); el('p', mission.hint, details);
        const renderLevel = level;
        try {
          const plugin = await loadGame(station.game);
          if (!area.isConnected) return;
          plugin.mount(area, mission, correct => {
            if (!correct) { feedback.textContent = '괜찮아요! 다시 생각해 보세요.'; return; }
            state = Game.complete(state, station, renderLevel); save(); render();
          });
        } catch (_) { if (area.isConnected) area.textContent = '게임을 불러오지 못했어요. 리더에게 도움을 요청해 주세요.'; }
      }
      collection(app);
      const reset = el('button', '이 기기의 기록 삭제', app, {type:'button', class:'secondary'}); reset.onclick = () => { if (confirm('진행 기록을 삭제할까요?')) { state = Game.normalize({}); save(); render(); } };
    }
    render();
  } catch (_) { app.textContent = '데이터를 불러오지 못했습니다. 로컬 서버 실행 방법을 확인하고 다시 열어 주세요.'; }
})();
