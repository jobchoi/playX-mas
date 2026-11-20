(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Game = factory();
})(globalThis, function () {
  function normalize(data) {
    return {completed: data && data.completed && typeof data.completed === 'object' ? data.completed : {}};
  }
  function complete(data, station, level) {
    const state = normalize(data);
    return {completed: {...state.completed, [station.id]: {...state.completed[station.id], [level]: true}}};
  }
  function collected(data, stations) {
    const state = normalize(data);
    return stations.filter(s => s.fragment && state.completed[s.id]?.child === true).map(s => s.fragment).sort((a, b) => a.order - b.order);
  }
  function finale(data, stations) {
    const required = stations.filter(s => !s.bonus && s.fragment);
    return required.length > 0 && required.every(s => normalize(data).completed[s.id]?.child === true);
  }
  return {normalize, complete, collected, finale};
});
