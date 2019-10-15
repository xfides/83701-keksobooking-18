'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var adForm = CONFIG.adForm.queryDOM;
  var filterForm = CONFIG.filterForm.queryDOM;
  var popUps = window.popUps;
  var mapModule = window.map;
  var mapPinModule = window.mapPin;
  var mapPinMain = CONFIG.mapPinMain.queryDOM;
  var ajax = window.ajax;
  var adFormConfigXHR = {
    url: 'https://js.dump.academy/keksobooking',
    method: 'POST',
    responseType: '',
    timeout: 3000
  };

  // turn on (advert form) and it's all fields
  function turnOnAdvertForm() {
    var adFieldSets = adForm.querySelectorAll('fieldset');

    adForm.action = CONFIG.adForm.url;
    adFieldSets.forEach(function (adFieldSet) {
      adFieldSet.disabled = false;
    });
    adForm.classList.remove(CONFIG.adForm.disabledClass);
  }

  // turn off (advert form) and it's all fields
  function turnOffAdvertForm() {
    adForm.reset();
    var adFieldSets = adForm.querySelectorAll('fieldset');
    adFieldSets.forEach(function (adFieldSet) {
      adFieldSet.disabled = true;
    });
    adForm.classList.add(CONFIG.adForm.disabledClass);
  }

  // turn on (filter map Form) form and it's all fields
  function turnOnFilterForm() {

    filterForm.reset();
    var filterFormSelects = filterForm.querySelectorAll('select');
    var filterFormFieldSets = filterForm.querySelectorAll('fieldset');

    filterFormSelects.forEach(function (filterFormSelect) {
      filterFormSelect.disabled = false;
    });
    filterFormFieldSets.forEach(function (filterFormFieldSet) {
      filterFormFieldSet.disabled = false;
    });
  }

  // turn off (filter map Form) form and it's all fields
  function turnOffFilterForm() {
    var filterFormSelects = filterForm.querySelectorAll('select');
    var filterFormFieldSets = filterForm.querySelectorAll('fieldset');

    filterFormSelects.forEach(function (filterFormSelect) {
      filterFormSelect.disabled = true;
    });
    filterFormFieldSets.forEach(function (filterFormFieldSet) {
      filterFormFieldSet.disabled = true;
    });
  }

  // reaction on form changing - validation fields
  function changeFormHandler(evt) {
    var FIELDS = [
      'title',
      'price',
      'type',
      'timein',
      'timeout',
      'capacity',
      'rooms'
    ];

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

  function setCenterPinAddress() {
    setTimeout(function () {
      var coordsAddressCenter = HELPERS.get.addressOnCenter(mapPinMain);
      var inputAddress = adForm.querySelector('#address');
      inputAddress.value =
        coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
      inputAddress.readOnly = true;
    }, 350);
  }

  function enableStartPinHandler() {

    var startPinHandler =
      CONFIG.mapPinMain.disabledHandlers['startPinHandler'];

    CONFIG.mapPinMain.disabledHandlers['startPinHandler'] = undefined;

    CONFIG.mapPinMain.enabledHandlers['startPinHandler'] =
      startPinHandler;

    mapPinMain.addEventListener('mousedown', startPinHandler);
    mapPinMain.addEventListener('keydown', startPinHandler);

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

    evt.preventDefault();
    adFormConfigXHR.body = new FormData(adForm);

    ajax.useXHR(
        adFormConfigXHR,
        doInitialState.bind(
            null, [popUps.showOk, mapModule.takeOnFadeLayer]
        ),
        popUps.showError,
        popUps.showError
    );

  }

  function doInitialState(extraActions) {

    turnOffAdvertForm();
    turnOffFilterForm();
    mapModule.clearMap();
    mapPinModule.placeMapPinMainOnCenter();
    setCenterPinAddress();
    enableStartPinHandler();

    // --- 3 - perform additional actions/functions
    if (!Array.isArray(extraActions)) {
      return;
    }
    extraActions.forEach(function (oneExtraAction) {
      oneExtraAction();
    });

  }

  adForm.addEventListener('submit', submitFormHandler);

  window.forms = {
    advertForm: {
      queryDOM: adForm,
      turnOn: turnOnAdvertForm,
      turnOff: turnOffAdvertForm,
      setCenterPinAddress: setCenterPinAddress
    },
    filterForm: {
      queryDOM: filterForm,
      turnOn: turnOnFilterForm,
      turnOff: turnOffFilterForm
    }
  };

})();
