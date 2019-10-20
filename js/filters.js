'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var filterForm = CONFIG.filterForm.queryDOM;
  var featuresBlock = filterForm.querySelector('#housing-features');
  var housingTypeBlock = filterForm.querySelector('#housing-type');
  var roomsBlock = filterForm.querySelector('#housing-rooms');
  var guestsBlock = filterForm.querySelector('#housing-guests');
  var priceBlock = filterForm.querySelector('#housing-price');

  function filterFeatures(prevArrAdverts) {

    // --- 1 - get users choice in checked features
    var arrCheckedFeaturesDOM = featuresBlock.querySelectorAll('input:checked');
    var arrCheckedFeatures = [];
    arrCheckedFeaturesDOM.forEach(function (oneFeatureDOM) {
      arrCheckedFeatures.push(oneFeatureDOM.value);
    });

    // --- 2 - analize one advert for user checked features
    function filterOneAd(oneAd) {

      var featuresOneAd = oneAd.offer.features;

      for (
        var iCheckedFeat = 0;
        iCheckedFeat < arrCheckedFeatures.length;
        iCheckedFeat++
      ) {

        if (featuresOneAd.indexOf(arrCheckedFeatures[iCheckedFeat]) === -1) {
          return false;
        }

      }

      return true;

    }

    // --- 3 - return filtered adverts
    return prevArrAdverts.filter(filterOneAd);

  }

  function filterHouseType(prevArrAdverts) {

    var housingTypeVal = housingTypeBlock.value;

    var filteredAds = prevArrAdverts.filter(
        function (oneAd) {
          return (
            oneAd.offer.type === housingTypeVal || housingTypeVal === 'any'
          );
        }
    );

    return filteredAds;

  }

  function filterRooms(prevArrAdverts) {

    var roomsVal = roomsBlock.value;

    var filteredAds = prevArrAdverts.filter(function (oneAd) {
      if (roomsVal === 'any') {
        return true;
      }

      roomsVal = parseInt(roomsVal, 10);

      if (isNaN(roomsVal)) {
        return false;
      }

      return (oneAd.offer.rooms === roomsVal);

    });

    return filteredAds;

  }

  function filterGuests(prevArrAdverts) {

    var guestsVal = guestsBlock.value;

    var filteredAds = prevArrAdverts.filter(function (oneAd) {

      if (guestsVal === 'any') {
        return true;
      }

      guestsVal = parseInt(guestsVal, 10);

      if (isNaN(guestsVal)) {
        return false;
      }

      return oneAd.offer.guests === guestsVal;

    });

    return filteredAds;

  }

  function filterPrice(prevArrAdverts) {
    var priceVal = priceBlock.value;
    var priceText =
      priceBlock.querySelector('[value=' + priceVal + ']').textContent;

    var priceMin = 0;
    var priceMax = 0;
    var numberRegExp = /[0-9]+/g;

    var filteredAds = prevArrAdverts.filter(function (oneAd) {

      if (priceVal === 'any') {
        return true;
      }

      if (priceVal === 'low') {
        priceMin = 0;
        priceMax = parseInt(priceText.match(numberRegExp)[0], 10) - 1;

        return (oneAd.offer.price >= priceMin && oneAd.offer.price <= priceMax);

      }

      if (priceVal === 'high') {
        priceMax = Infinity;
        priceMin = parseInt(priceText.match(numberRegExp)[0], 10);

        return (oneAd.offer.price >= priceMin && oneAd.offer.price <= priceMax);
      }

      if (priceVal === 'middle') {
        priceMin = parseInt(priceText.match(numberRegExp)[0], 10);
        priceMax = parseInt(priceText.match(numberRegExp)[1], 10) - 1;

        if (priceMin > priceMax) {
          priceMax = [priceMin, priceMin = priceMax][0];
        }

        return (oneAd.offer.price >= priceMin && oneAd.offer.price <= priceMax);

      }

      return false;
    });

    return filteredAds;

  }

  function applyFiltersForAds() {

    var allFilters = [
      filterFeatures,
      filterHouseType,
      filterRooms,
      filterGuests,
      filterPrice
    ];
    var arrAdverts = CONFIG.adverts;

    var filteredAds = allFilters.reduce(
        function (accArrAdverts, curFilter) {
          return curFilter(accArrAdverts);
        }, arrAdverts
    );

    return filteredAds;

  }

  window.filters = {
    apply: applyFiltersForAds
  };

})();

