'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var map = CONFIG.map.queryDOM;

  function takeOffFadeLayer() {
    if (map) {
      map.classList.remove(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  function takeOnFadeLayer() {
    if (map) {
      map.classList.add(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  function clearMap() {
    var mapPins =
      map.querySelectorAll('.map__pin:not(.map__pin--main)');

    mapPins.forEach(function (oneMapPin) {
      oneMapPin.remove();
    });

    var advertCard = map.querySelector('.map__card');
    if (advertCard) {
      advertCard.remove();
    }

  }

  window.map = {
    takeOnFadeLayer: takeOnFadeLayer,
    takeOffFadeLayer: takeOffFadeLayer,
    clearMap: clearMap
  };

})();

