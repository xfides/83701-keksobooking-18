'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var map = CONFIG.map.queryDOM;

  function lightOffMapPin() {
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

  function placeMapPinMainOnCenter() {
    var mapPinMain = CONFIG.mapPinMain.queryDOM;
    var leftPos = CONFIG.mapPinMain.leftInitial + 'px';
    var topPos = CONFIG.mapPinMain.topInitial + 'px';

    mapPinMain.style.left = leftPos;
    mapPinMain.style.top = topPos;
  }

  window.mapPin = {
    lightActiveOn: lightOnMapPin,
    lightActiveOff: lightOffMapPin,
    placeMapPinMainOnCenter: placeMapPinMainOnCenter
  };

})();
