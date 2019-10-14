'use strict';
(function () {

  var CONFIG = window.CONFIG;

  function takeOffFadeLayer() {
    var map = CONFIG.map.queryDOM;
    if (map) {
      map.classList.remove(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  function takeOnFadeLayer() {
    var map = CONFIG.map.queryDOM;
    if (map) {
      map.classList.add(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }


  window.map = {
    takeOnFadeLayer: takeOnFadeLayer,
    takeOffFadeLayer: takeOffFadeLayer
  };

})();

