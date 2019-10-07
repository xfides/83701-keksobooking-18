'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var page = window.page;

  function startWorking() {

    // find main pin in DOM  + add event listeners to activate page
    var mapPinMain = CONFIG.mapPinMain.queryDOM;
    function mapPinMainHandler(evt) {

      if (evt.type === 'mousedown' && evt.button === 0) {
        page.turnOn(mapPinMainHandler);
      }

      if (evt.type === 'keydown' && evt.keyCode === CONFIG.keyCodes.ENTER_CODE) {
        page.turnOn(mapPinMainHandler);
      }
    }

    mapPinMain.addEventListener('mousedown', mapPinMainHandler);
    mapPinMain.addEventListener('keydown', mapPinMainHandler);

    // calc CENTER coords of main map pin
    var coordsAddressCenter = HELPERS.get.addressOnCenter(mapPinMain);
    var adForm = CONFIG.adForm.queryDOM;
    var inputAddress = adForm.querySelector('#address');
    inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
    inputAddress.readOnly = true;

  }

  /* -------------------------*/
  /* start execution scripts */
  page.turnOff();
  startWorking();

})();

