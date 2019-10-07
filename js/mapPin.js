'use strict';
(function () {


  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;

  function lightOffMapPin() {
    var map = CONFIG.map.queryDOM;
    var mapPin = map.querySelector('.map__pin--active');

    if (mapPin) {
      mapPin.classList.remove('map__pin--active');
    }
  }

  function lightOnMapPin(elemMapPin) {
    if (
      typeof elemMapPin === 'object'
      &&
      HELPERS.check.isVisibleInDOM(elemMapPin)
    ) {
      elemMapPin.classList.add('map__pin--active');
    }
  }


  window.mapPin = {
    lightOn: lightOnMapPin,
    lightOff: lightOffMapPin
  };

})();
