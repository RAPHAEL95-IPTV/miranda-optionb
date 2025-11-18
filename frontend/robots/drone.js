(function(){
 // Drone compatible avec la sim 3D existante (uses addRobot)
 let tries = 0;
 const maxTries = 50; // 50 * 100ms = 5s max d'attente
 const iv = setInterval(() => {
 if (typeof addRobot === 'function') {
 try {
 const id = addRobot(0, 1.2, 0);
 window.Simulator = window.Simulator || {};
 window.Simulator.droneId = id;
 console.log('drone.js: drone created id=', id);
 } catch (e) {
 console.error('drone.js: erreur lors de addRobot', e);
 }
 clearInterval(iv);
 return;
 }
 tries++;
 if (tries >= maxTries) {
 console.warn('drone.js: addRobot introuvable après attente — le script a abandonné');
 clearInterval(iv);
 }
 }, 100);
})();