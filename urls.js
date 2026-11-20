(async function () {
  const target = document.getElementById('urls');
  try {
    const response = await fetch('missions.json'); if (!response.ok) throw new Error();
    const missions = await response.json(); target.replaceChildren();
    const list = document.createElement('ul');
    const entries = [{title:'시작', id:null}, ...missions];
    entries.forEach(m => { const url = new URL('index.html', location.href); if (m.id !== null) url.searchParams.set('station', m.id); const li = document.createElement('li'); const strong = document.createElement('strong'); strong.textContent = m.title + ': '; const a = document.createElement('a'); a.href = url.href; a.textContent = url.href; li.append(strong, a); list.append(li); }); target.append(list);
  } catch (_) { target.textContent = '주소 목록을 불러오지 못했습니다. 로컬 서버를 확인해 주세요.'; }
})();
