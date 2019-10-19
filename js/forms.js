'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var filterForm = CONFIG.filterForm.queryDOM;
  var popUps = window.popUps;
  var mapModule = window.mapModule;
  var mapPinMain = CONFIG.mapPinMain.queryDOM;
  var ajax = window.ajax;
  var adFormConfigXHR = {
    url: 'https://js.dump.academy/keksobooking',
    method: 'POST',
    responseType: '',
    timeout: 3000
  };
  var adForm = CONFIG.adForm.queryDOM;
  var inputAddress = adForm.querySelector('#address');
  inputAddress.readOnly = true;
  inputAddress.required = true;

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

  function setCenterPinAddress() {
    setTimeout(function () {
      var coordsAddressCenter = HELPERS.get.addressOnCenter(mapPinMain);
      inputAddress.value =
        coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
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

  // --- change Adverts form - validation process
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

  adForm.addEventListener('change', changeFormHandler);

  // --- validation + submit Adverts form -
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
        doInitialState,
        popUps.showError,
        popUps.showError
    );

  }

  function doInitialState(extraActions) {

    turnOffAdvertForm();
    turnOffFilterForm();
    mapModule.clearMap();
    mapModule.placeMapPinMainOnCenter();
    setCenterPinAddress();
    enableStartPinHandler();
    mapModule.takeOnFadeLayer();
    popUps.showOk();

    // --- 3 - perform additional actions/functions
    if (!Array.isArray(extraActions)) {
      return;
    }
    extraActions.forEach(function (oneExtraAction) {
      oneExtraAction();
    });

  }

  adForm.addEventListener('submit', submitFormHandler);

  // --- reset forms -
  function resetForms() {
    var resetBtn = adForm.querySelector('.ad-form__reset');
    resetBtn.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      turnOffAdvertForm();
      turnOffFilterForm();
      mapModule.clearMap();
      mapModule.placeMapPinMainOnCenter();
      setCenterPinAddress();
      enableStartPinHandler();
      mapModule.takeOnFadeLayer();
    });
  }

  resetForms();

  // ##############################################


  function changeFiltersHandler(evt) {
    var typeBlock = filterForm.querySelector('#housing-type');
    var typeBlockVal = typeBlock.value;

    if (evt.target !== typeBlock) {
      return;
    }

    if (evt.target.value === 'any') {
      mapModule.drawMapPins(CONFIG.adverts);
      return;
    }

    var adsByType = CONFIG.adverts.filter(function (oneAdvert) {
      if (oneAdvert.offer.type === typeBlockVal) {
        return true;
      }
      return false;
    });

    mapModule.drawMapPins(adsByType);
  }


  filterForm.addEventListener('change', changeFiltersHandler);

  // ##############################################

  // --- export -
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
