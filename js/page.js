'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var mapModule = window.map;
  var adCardModule = window.advertCard;
  var forms = window.forms;
  var ajax = window.ajax;
  var CONFIG_XHR = {
    url: 'https://js.dump.academy/keksobooking/data',
    method: 'GET',
    responseType: 'json',
    timeout: 3000
  };

  function placeAdsOnMap() {

    // --- 1 - find map and map#pin template
    var map = CONFIG.map.queryDOM.querySelector('.map__pins');
    var mapPinTemplate = CONFIG.mapPin.templateQueryDOM;

    if (!map) {
      throw new Error('no map exist');
    }

    if (!mapPinTemplate) {
      throw new Error('no map pin template exist');
    }

    // --- 2 - get adverts from server via ajax

    function drawMapPins(data) {

      // --- 3 - create DOM nodes (map#pin) based on received data
      var nodeMapPin = mapPinTemplate.content;
      var wrapMapPins = document.createDocumentFragment();
      var updatedMapPin = null;

      data.forEach(function (oneAd) {

        if (oneAd.offer === undefined) {
          return;
        }

        updatedMapPin = updateMapPin(nodeMapPin, oneAd);
        wrapMapPins.appendChild(updatedMapPin);
      });

      // --- 4 - delete all old previous map pins

      var oldMapPins = map.querySelectorAll(
          '.map__pin:not(.map__pin--main)'
      );

      oldMapPins.forEach(function (oneOldMapPin) {
        oneOldMapPin.remove();
      });

      // --- 5 - insert DOM nodes (map#pin) in map
      map.appendChild(wrapMapPins);

    }

    function showPopUpError() {

      var mainBlock = CONFIG.main.queryDOM;
      var errBlockTemplate = document.querySelector('#error').content;
      var errBlock = errBlockTemplate.querySelector('.error');
      var errBlockBtn = errBlock.querySelector('.error__button');

      function closeErrBlock(evt) {

        if (
          evt.type === 'mousedown' &&
          evt.button === 0 &&
          evt.target === errBlock
        ) {
          errBlock.remove();
        }

        if (
          evt.type === 'mousedown' &&
          evt.button === 0 &&
          evt.target === errBlockBtn
        ) {
          errBlock.remove();
        }

        if (
          evt.type === 'keydown' &&
          evt.keyCode === CONFIG.keyCodes.ESC
        ) {
          errBlock.remove();
        }

      }

      errBlock.addEventListener('mousedown', closeErrBlock);
      document.addEventListener('keydown', closeErrBlock);

      mainBlock.appendChild(errBlock);

    }

    ajax.useXHR(
        CONFIG_XHR, drawMapPins, showPopUpError, showPopUpError
    );

  }

  /*
   * Object (nodePin) -> Object (infoAd) ->
   * -> Object (newNodePin) || Object (error)
   */
  function updateMapPin(nodePin, infoAd) {

    /* input validation */
    if (typeof nodePin !== 'object' || typeof infoAd !== 'object') {
      throw new Error('map pin and info of advert must be Object type');
    }

    if (window.HELPERS.check.isEmptyObj(infoAd)) {
      throw new Error('info of advert is empty');
    }

    // clone original node
    nodePin = nodePin.cloneNode(true);

    // update style (top left position)
    var buttonPin = nodePin.querySelector('.map__pin');
    var newCoordsLT = window.HELPERS.get.coordsLT(infoAd.location);
    buttonPin.style.left = newCoordsLT.x + 'px';
    buttonPin.style.top = newCoordsLT.y + 'px';

    //  update img src / alt attributes
    var imgPin = nodePin.querySelector('img');
    imgPin.src = infoAd.author.avatar;
    imgPin.alt = infoAd.offer.title;

    // add event listeners for opening corresponding advert

    buttonPin.addEventListener(
        'mousedown', adCardModule.openCardHandler.bind(null, infoAd)
    );
    buttonPin.addEventListener(
        'keydown', adCardModule.openCardHandler.bind(null, infoAd)
    );

    return nodePin;

  }

  function turnOnPage(mapPinMainHandler) {

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
    placeAdsOnMap();

    // --- 5 - delete activation map mousedown handler
    /*
     delete handler mapPinMainHandler, because turnOnPage function
     should work only 1 time. setTimeout needs fo correct detection
     of deleting mapPinMainHandler (for next drag&drop)
     */
    var mapPinMain = CONFIG.mapPinMain.queryDOM;
    mapPinMain.removeEventListener('mousedown', mapPinMainHandler);
    setTimeout(function () {
      var iHandler =
        CONFIG.mapPinMain.allowedHandlers.indexOf(mapPinMainHandler);
      if (iHandler !== -1) {
        CONFIG.mapPinMain.allowedHandlers.splice(iHandler, 1);
      }
    }, 0);
    mapPinMain.removeEventListener('keydown', mapPinMainHandler);

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
