(async function () {
  const app = document.getElementById('app');
  try {
    const [config, missions] = await Promise.all(['config.json', 'missions.json'].map(async path => {
      const response = await fetch(path); if (!response.ok) throw new Error(path); return response.json();
    }));
    document.title = config.title; document.getElementById('title').textContent = config.title;
    let state;
    try { state = Game.normalize(JSON.parse(localStorage.getItem(config.storageKey) || '{}')); }
    catch (_) { state = Game.normalize({}); }
    const save = () => { try { localStorage.setItem(config.storageKey, JSON.stringify(state)); return true; } catch (_) { alert('기기에 저장할 수 없습니다. 종이 진행표를 사용해 주세요.'); return false; } };
    const el = (tag, text, parent, attrs = {}) => { const node = document.createElement(tag); node.textContent = text; Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k,v)); parent.append(node); return node; };
    const id = new URLSearchParams(location.search).get('station');
    const station = missions.find(m => m.id === id);
    let level = 'child';
    function render() {
      app.replaceChildren();
      const teamForm = el('form', '', app); const label = el('label', '팀 이름 (개인 이름은 입력하지 마세요)', teamForm, {for:'team'});
      const input = el('input', '', label, {id:'team', maxlength:'30', required:'', placeholder:'예: 별빛 팀'}); input.value = state.team;
      el('button', '팀 이름 저장', teamForm, {type:'submit'});
      teamForm.addEventListener('submit', e => { e.preventDefault(); const name = input.value.trim(); if (!name) { input.setCustomValidity('팀 이름을 입력해 주세요.'); input.reportValidity(); input.setCustomValidity(''); return; } state.team = name; if (save()) render(); });
      const n = Game.count(state, missions);
      el('p', `아이용 미션 ${n} / ${missions.length} 완료`, app, {class:'progress'});
      if (n === missions.length) el('p', '축하해요! 모든 기본 미션을 완주했어요. 리더에게 보여 주세요.', app, {class:'success'});
      if (id && !station) el('p', '알 수 없는 지점입니다. QR 주소를 확인해 주세요.', app, {class:'error'});
      if (!id || !station) {
        el('h2', '미션 지점', app);
        const list = el('ul', '', app, {class:'stations'});
        missions.forEach(m => { const li = el('li', '', list); el('a', `${m.title} ${state.completed[m.id]?.child ? '✓' : ''}`, li, {href:`?station=${encodeURIComponent(m.id)}`}); });
      } else {
        el('h2', station.title, app); el('p', station.story, app);
        const tabs = el('div', '', app, {class:'tabs'});
        [['child','아이용 기본'],['adult','어른용 심화 (선택)']].forEach(([key, text]) => { const b = el('button', text, tabs, {type:'button', 'aria-pressed':String(level === key)}); b.onclick = () => { level = key; render(); }; });
        const mission = station[level]; el('h3', mission.question, app);
        if (state.completed[station.id]?.[level]) el('p', '이 미션을 완료했어요! ✓', app, {class:'success'});
        const feedback = el('p', '', app, {role:'status'});
        if (mission.type === 'action') {
          el('p', '활동을 마친 뒤 리더가 확인해 주세요.', app);
          const form = el('form', '', app); const l = el('label', '리더 확인 코드', form); const code = el('input', '', l, {type:'password', autocomplete:'off', required:''});
          el('button', '리더 확인', form, {type:'submit'});
          form.onsubmit = e => { e.preventDefault(); if (code.value === config.leaderCode) { state = Game.complete(state, station.id, level); if (save()) render(); } else feedback.textContent = '코드가 맞지 않아요. 리더에게 확인해 주세요.'; };
        } else {
          const form = el('form', '', app);
          mission.options.forEach((option, i) => { const l = el('label', '', form, {class:'option'}); el('input', '', l, {type:'radio', name:'answer', value:String(i), required:''}); l.append(document.createTextNode(option)); });
          el('button', '정답 확인', form, {type:'submit'});
          form.onsubmit = e => { e.preventDefault(); const selected = form.querySelector('input:checked'); if (Game.correct(mission, selected ? Number(selected.value) : NaN)) { state = Game.complete(state, station.id, level); if (save()) render(); } else feedback.textContent = '괜찮아요! 다시 생각해 보세요.'; };
        }
        const details = el('details', '', app); el('summary', '힌트 보기', details); el('p', mission.hint, details);
        const leader = el('details', '', app); el('summary', '리더용 정답 확인', leader); const form = el('form', '', leader); const l = el('label', '리더 확인 코드', form); const code = el('input', '', l, {type:'password', autocomplete:'off', required:''}); el('button', '정답 보기', form, {type:'submit'}); const answer = el('p', '', leader, {role:'status'});
        form.onsubmit = e => { e.preventDefault(); answer.textContent = code.value === config.leaderCode ? `정답: ${mission.type === 'action' ? mission.answer : mission.options[mission.answer]}` : '코드가 맞지 않습니다.'; };
      }
      const reset = el('button', '이 기기의 기록 삭제', app, {type:'button', class:'secondary'}); reset.onclick = () => { if (confirm('팀 이름과 진행 기록을 삭제할까요?')) { state = Game.normalize({}); if (save()) render(); } };
    }
    render();
  } catch (_) { app.textContent = '데이터를 불러오지 못했습니다. 로컬 서버 실행 방법을 확인하고 다시 열어 주세요.'; }
})();
