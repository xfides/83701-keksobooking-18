'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var adForm = CONFIG.adForm.queryDOM;
  var filterForm = CONFIG.filterForm.queryDOM;

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
    var adFieldSets = adForm.querySelectorAll('fieldset');
    adFieldSets.forEach(function (adFieldSet) {
      adFieldSet.disabled = true;
    });
    adForm.classList.add(CONFIG.adForm.disabledClass);
  }

  // turn on (filter map Form) form and it's all fields
  function turnOnFilterForm() {

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

  window.forms = {
    advertForm: {
      queryDOM: adForm,
      turnOn: turnOnAdvertForm,
      turnOff: turnOffAdvertForm
    },
    filterForm: {
      queryDOM: filterForm,
      turnOn: turnOnFilterForm,
      turnOff: turnOffFilterForm
    }
  };

})();
