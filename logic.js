(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Game = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalize(data) {
    return {team: typeof data?.team === 'string' ? data.team : '', completed: data?.completed && typeof data.completed === 'object' ? data.completed : {}};
  }
  function complete(data, id, level) {
    const state = normalize(data);
    return {...state, completed: {...state.completed, [id]: {...state.completed[id], [level]: true}}};
  }
  function count(data, missions) {
    const state = normalize(data);
    return missions.filter(m => state.completed[m.id]?.child === true).length;
  }
  function correct(mission, choice) { return mission.type !== 'action' && Number.isInteger(choice) && choice === mission.answer; }
  return {normalize, complete, count, correct};
});
