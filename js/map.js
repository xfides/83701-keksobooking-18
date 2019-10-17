'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var adCardModule = window.advertCard;
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

  function placeMapPinMainOnCenter() {
    var mapPinMain = CONFIG.mapPinMain.queryDOM;
    var leftPos = CONFIG.mapPinMain.leftInitial + 'px';
    var topPos = CONFIG.mapPinMain.topInitial + 'px';

    mapPinMain.style.left = leftPos;
    mapPinMain.style.top = topPos;
  }

  // #################################

  /*
   * Object (nodePin) -> Object (infoAd) ->
   * -> Object (newNodePin) || Object (error)
   */
  function updateMapPin(nodePin, infoAd) {

    /* input validation */
    if (typeof nodePin !== 'object' || typeof infoAd !== 'object') {
      throw new Error('map pin and info of advert must be Object type');
    }

    if (HELPERS.check.isEmptyObj(infoAd)) {
      throw new Error('info of advert is empty');
    }

    // clone original node
    nodePin = nodePin.cloneNode(true);

    // update style (top left position)
    var buttonPin = nodePin.querySelector('.map__pin');
    var newCoordsLT = HELPERS.get.coordsLT(infoAd.location);
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

  function drawMapPins(data) {

    // --- 1 - find map and map#pin template
    var mapBlock = CONFIG.map.queryDOM.querySelector('.map__pins');
    var mapPinTemplate = CONFIG.mapPin.templateQueryDOM;
    var NUMBER_FILTER_ADS = 5;

    if (!mapBlock) {
      throw new Error('no map exist');
    }

    if (!mapPinTemplate) {
      throw new Error('no map pin template exist');
    }

    // --- 2 - create DOM nodes (map#pin) based on received data
    var nodeMapPin = mapPinTemplate.content;
    var wrapMapPins = document.createDocumentFragment();
    var updatedMapPin = null;

    data.forEach(function (oneAd, indexOneAd) {

      if (oneAd.offer === undefined) {
        NUMBER_FILTER_ADS++;
        return;
      }

      if (indexOneAd < NUMBER_FILTER_ADS) {
        updatedMapPin = updateMapPin(nodeMapPin, oneAd);
        wrapMapPins.appendChild(updatedMapPin);
      }

    });

    // --- 3 - delete all old previous map pins

    var oldMapPins = map.querySelectorAll(
        '.map__pin:not(.map__pin--main)'
    );

    oldMapPins.forEach(function (oneOldMapPin) {
      oneOldMapPin.remove();
    });

    // --- 4 - insert DOM nodes (map#pin) in map
    mapBlock.appendChild(wrapMapPins);
  }

  // #################################

  window.mapModule = {
    takeOnFadeLayer: takeOnFadeLayer,
    takeOffFadeLayer: takeOffFadeLayer,
    placeMapPinMainOnCenter: placeMapPinMainOnCenter,
    drawMapPins: drawMapPins,
    clearMap: clearMap
  };

})();

