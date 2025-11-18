// Drone simple
window.Simulator = window.Simulator || {};

if (window.Simulator.registerRobot) {
  window.Simulator.registerRobot({
    id: 'drone',
    name: 'Drone',
    color: '#2b9',
    width: '80px',
    height: '40px',
    onRender: (el) => {
      el.style.borderRadius = '6px';
      // animation simple de flottement
      if (el.animate) {
        el.animate(
          [{ transform: 'translateY(0px)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0px)' }],
          { duration: 1800, iterations: Infinity, easing: 'ease-in-out' }
        );
      }
    }
  });
}// drone robot placeholder
