'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var mapModule = window.mapModule;
  var forms = window.forms;
  var popUps = window.popUps;
  var ajax = window.ajax;
  var CONFIG_XHR = {
    url: 'https://js.dump.academy/keksobooking/data',
    method: 'GET',
    responseType: 'json',
    timeout: 3000
  };

  function turnOnPage() {

    // --- 1 -
    forms.advertForm.turnOn();
    forms.filterForm.turnOn();

    // --- 2 -
    mapModule.takeOffFadeLayer();

    // --- 3 - recalculate (left, Bottom/2) coords of main map pin
    // 300ms - animation css time after turnOn page. 350ms - for more safety
    setTimeout(function () {
      var coordsAddressCenter = HELPERS.get.addressOnLB2(
          CONFIG.mapPinMain.queryDOM
      );
      var inputAddress = forms.advertForm.queryDOM.querySelector('#address');
      inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
    }, 350);

    // --- 4 - get XHR adverts, place pins on map, show/hide advert card
    function processAdverts(data) {
      CONFIG.adverts = data;
      mapModule.drawMapPins(data);
    }

    ajax.useXHR(
        CONFIG_XHR, processAdverts, popUps.showError, popUps.showError
    );

  }

  function turnOffPage() {

    forms.advertForm.turnOff();
    forms.filterForm.turnOff();
    mapModule.takeOnFadeLayer();

  }

  window.page = {
    turnOn: turnOnPage,
    turnOff: turnOffPage
  };


})();
