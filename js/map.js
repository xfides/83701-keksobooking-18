'use strict';
(function () {

  var CONFIG = window.CONFIG;

  function takeOffMapFaded() {
    var map = CONFIG.map.queryDOM;
    if (map) {
      map.classList.remove(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  function takeOnMapFaded() {
    var map = CONFIG.map.queryDOM;
    if (map) {
      map.classList.add(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  window.map = {
    takeOnMapFaded: takeOnMapFaded,
    takeOffMapFaded: takeOffMapFaded
  };

})();

