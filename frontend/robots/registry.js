// Registry minimal pour les robots
window.Simulator = window.Simulator || {};
window.Simulator.robots = window.Simulator.robots || [];

window.Simulator.registerRobot = function(robot) {
  window.Simulator.robots.push(robot);
  if (window.Simulator.onRobotRegistered) window.Simulator.onRobotRegistered(robot);
};

window.Simulator.renderAll = function(container) {
  const root = container || document.getElementById('sim-root');
  if (!root) return;
  root.innerHTML = '';
  window.Simulator.robots.forEach(r => {
    const el = document.createElement('div');
    el.className = 'sim-robot ' + (r.id || '');
    el.style.width = r.width || '60px';
    el.style.height = r.height || '60px';
    el.style.background = r.color || '#c33';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = '#fff';
    el.style.fontFamily = 'sans-serif';
    el.style.margin = '6px';
    el.textContent = r.name || r.id || 'Robot';
    root.appendChild(el);
    if (typeof r.onRender === 'function') r.onRender(el, root);
  });
};