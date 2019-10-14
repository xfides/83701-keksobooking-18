'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var mapModule = window.map;
  var adCardModule = window.advertCard;
  var ajax = window.ajax;

  function placeAdsOnMap() {

    // 1) find map and map#pin template
    var map = CONFIG.map.queryDOM.querySelector('.map__pins');
    var mapPinTemplate = CONFIG.mapPin.templateQueryDOM;

    if (!map) {
      throw new Error('no map exist');
    }

    if (!mapPinTemplate) {
      throw new Error('no map pin template exist');
    }

    // 2) generate fake ads
    // var fakeAds = HELPERS.generate.mockData(map);

    var CONFIG_XHR = {
      url: 'https://js.dump.academy/keksobooking/data',
      method: 'GET',
      responseType: 'json',
      timeout: 3000
    };

    function success(data) {

      // 3) create DOM nodes (map#pin) based on received data
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

      // 4) insert DOM nodes (map#pin) in map
      map.appendChild(wrapMapPins);

      return data;

    }

    function showErrXHRBlock() {

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

    function error() {
      showErrXHRBlock();
    }

    function timeout() {
      showErrXHRBlock();
    }

    ajax.useXHR(CONFIG_XHR, success, error, timeout);

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

    // turn on (advert form) and it's all fields
    var adForm = CONFIG.adForm.queryDOM;
    var adFieldSets = adForm.querySelectorAll('fieldset');

    adForm.action = CONFIG.adForm.url;
    adFieldSets.forEach(function (adFieldSet) {
      adFieldSet.disabled = false;
    });
    adForm.classList.remove(CONFIG.adForm.disabledClass);

    // turn on (filter map Form) form and it's all fields
    var filterForm = CONFIG.filterForm.queryDOM;
    var filterFormSelects = filterForm.querySelectorAll('select');
    var filterFormFieldSets = filterForm.querySelectorAll('fieldset');

    filterFormSelects.forEach(function (filterFormSelect) {
      filterFormSelect.disabled = false;
    });
    filterFormFieldSets.forEach(function (filterFormFieldSet) {
      filterFormFieldSet.disabled = false;
    });

    // remover fade layer from the map
    mapModule.takeOffMapFaded();

    // recalculate (left, Bottom/2) coords of main map pin after turnOnPage
    // 300ms - animation time from css. I have 350ms for more safety
    setTimeout(function () {
      var coordsAddressCenter = HELPERS.get.addressOnLB2(
          CONFIG.mapPinMain.queryDOM
      );
      var inputAddress = adForm.querySelector('#address');
      inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
    }, 350);

    // generate adverts, place mapPins on map, show/hide selected advert card
    placeAdsOnMap();

    // close advert cards on map in document
    var map = CONFIG.map.queryDOM;

    map.addEventListener('mousedown', adCardModule.closeCardHandler);
    document.addEventListener('keydown', adCardModule.closeCardHandler);

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

    // reaction on form changing - validation fields
    function changeFormHandler(evt) {
      var FIELDS = ['title', 'price', 'type', 'timein', 'timeout', 'capacity', 'rooms'];

      if (!evt.target.name || FIELDS.indexOf(evt.target.name) === -1) {
        return;
      }

      switch (evt.target.name) {
        case 'title':
          HELPERS.validate.title();
          break;

        case 'type':
        case 'price':
          HELPERS.validate.price();
          break;

        case 'timein':
        case 'timeout':
          HELPERS.validate.timeIn(evt);
          break;

        case 'capacity':
        case 'rooms':
          HELPERS.validate.capacity();
          break;
      }

    }

    adForm.addEventListener('change', changeFormHandler);

    // validation before submit form
    function submitFormHandler(evt) {

      var arrResValidates = [];
      arrResValidates.push(HELPERS.validate.title());
      arrResValidates.push(HELPERS.validate.price());
      arrResValidates.push(HELPERS.validate.capacity());

      var arrResValidatesLength = arrResValidates.length;

      for (var iRes = 0; iRes < arrResValidatesLength; iRes++) {
        if (!arrResValidates[iRes].status) {
          evt.preventDefault();
          return;
        }
      }

    }

    adForm.addEventListener('submit', submitFormHandler);

  }

  function turnOffPage() {

    // turn off (advert form) and it's all fields
    var adForm = CONFIG.adForm.queryDOM;
    var adFieldSets = adForm.querySelectorAll('fieldset');
    adFieldSets.forEach(function (adFieldSet) {
      adFieldSet.disabled = true;
    });
    adForm.classList.add(CONFIG.adForm.disabledClass);

    // turn off (filter map Form) form and it's all fields
    var filterForm = CONFIG.filterForm.queryDOM;
    var filterFormSelects = filterForm.querySelectorAll('select');
    var filterFormFieldSets = filterForm.querySelectorAll('fieldset');

    filterFormSelects.forEach(function (filterFormSelect) {
      filterFormSelect.disabled = true;
    });
    filterFormFieldSets.forEach(function (filterFormFieldSet) {
      filterFormFieldSet.disabled = true;
    });

    // setup fade layer over the map
    mapModule.takeOnMapFaded();

  }

  window.page = {
    turnOn: turnOnPage,
    turnOff: turnOffPage
  };

})();
