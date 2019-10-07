'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var mapPinModule = window.mapPin;


  function makeAdCard(advert) {

    var map = CONFIG.map.queryDOM;
    var placeInsert = map.querySelector('.map__filters-container');
    var cardElem = document.querySelector('#card').content.cloneNode(true);
    var cardDomElems = {
      title: cardElem.querySelector('.popup__title'),
      address: cardElem.querySelector('.popup__text--address'),
      price: cardElem.querySelector('.popup__text--price'),
      type: cardElem.querySelector('.popup__type'),
      capacity: cardElem.querySelector('.popup__text--capacity'),
      checkInOut: cardElem.querySelector('.popup__text--time'),
      features: cardElem.querySelector('.popup__features '),
      description: cardElem.querySelector('.popup__description'),
      photos: cardElem.querySelector('.popup__photos'),
      avatar: cardElem.querySelector('.popup__avatar')
    };

    // setup easy fields of advert
    cardDomElems.title.textContent = advert.offer.title;
    cardDomElems.address.textContent = advert.offer.address;
    cardDomElems.price.textContent = advert.offer.price + ' \u20BD/ночь ';
    cardDomElems.description.textContent = advert.offer.description;
    cardDomElems.avatar.src = advert.author.avatar;

    //  setup features of advert
    var featureDomElem = cardDomElems.features.querySelector('.popup__feature');
    var clonedFeature;
    if (advert.offer.features.length > 0) {
      cardDomElems.features.textContent = '';
      for (var iFeat = 0; iFeat < advert.offer.features.length; iFeat++) {
        clonedFeature = featureDomElem.cloneNode(true);
        clonedFeature.classList.add('popup__feature');
        clonedFeature.classList.add('popup__feature--' + advert.offer.features[iFeat]);
        cardDomElems.features.appendChild(clonedFeature);
      }
    } else {
      cardElem.querySelector('.map__card').removeChild(cardDomElems.features);
    }

    //  setup type place of advert
    var offerTypeEn = advert.offer.type;
    var offerTypeRus = '';
    for (var iType = 0; iType < CONFIG.offerSettings.type.length; iType++) {
      if (offerTypeEn === CONFIG.offerSettings.type[iType][0]) {
        offerTypeRus = CONFIG.offerSettings.type[iType][1];
        break;
      }
    }

    if (offerTypeRus === '') {
      throw new Error('can not find russian type of place in advert ');
    }
    cardDomElems.type.textContent = offerTypeRus;

    //  setup photos of advert
    var photoNode = cardDomElems.photos.querySelector('.popup__photo');
    var clonePhotoNode;
    cardDomElems.photos.removeChild(photoNode);

    if (advert.offer.photos.length > 0) {
      for (var iSrc = 0; iSrc < advert.offer.photos.length; iSrc++) {
        clonePhotoNode = photoNode.cloneNode(true);
        clonePhotoNode.src = advert.offer.photos[iSrc];
        cardDomElems.photos.appendChild(clonePhotoNode);
      }
    } else {
      cardElem.querySelector('.map__card').removeChild(cardDomElems.photos);
    }

    //  setup check In/Out of advert
    cardDomElems.checkInOut.textContent =
      'Заезд после ' +
      advert.offer.checkin +
      ', выезд до ' +
      advert.offer.checkout +
      '.';

    //  setup rooms / guests of advert
    cardDomElems.capacity.textContent =
      advert.offer.rooms +
      ' ' +
      HELPERS.update.wordEnd('комната', advert.offer.rooms) +
      ' для ' +
      advert.offer.guests +
      ' ' +
      HELPERS.update.wordEnd('гость', advert.offer.guests) +
      '.';

    // insert advert in real DOM
    map.insertBefore(cardElem, placeInsert);

  }

  function openCardHandler(infoAd, evt) {

    var map = CONFIG.map.queryDOM;

    function showCard() {
      var cardElemDOM = null;
      var mapPin = evt.target.closest('.map__pin');
      if (mapPin !== null && !mapPin.classList.contains('map__pin--main')) {

        cardElemDOM = map.querySelector('.map__card');
        if (cardElemDOM) {
          cardElemDOM.remove();
        }
        makeAdCard(infoAd);
      }

    }

    if (evt.type === 'keydown' && evt.keyCode === CONFIG.keyCodes.ENTER_CODE) {
      mapPinModule.lightOff();
      showCard();
      mapPinModule.lightOn(evt.currentTarget);
      return;
    }

    if (evt.type === 'mousedown' && evt.button === 0) {
      mapPinModule.lightOff();
      showCard();
      mapPinModule.lightOn(evt.currentTarget);

    }

  }

  function closeCardHandler(evt) {

    var cardElemDOM = null;
    var map = CONFIG.map.queryDOM;

    if (evt.type === 'mousedown' && evt.button === 0) {
      cardElemDOM = evt.target.closest('.map__card');
      if (
        cardElemDOM !== null
        &&
        evt.target.classList.contains('popup__close')
      ) {
        cardElemDOM.remove();
        mapPinModule.lightOff();
        return;
      }
    }

    if (evt.type === 'keydown' && evt.keyCode === CONFIG.keyCodes.ESC) {
      cardElemDOM = map.querySelector('.map__card');
      if (cardElemDOM) {
        cardElemDOM.remove();
        mapPinModule.lightOff();
        return;
      }
    }

    if (
      evt.type === 'keydown'
      &&
      evt.keyCode === CONFIG.keyCodes.ENTER_CODE
      &&
      evt.target === map.querySelector('.popup__close')
    ) {
      cardElemDOM = map.querySelector('.map__card');
      if (cardElemDOM) {
        cardElemDOM.remove();
        mapPinModule.lightOff();
      }
    }

  }


  window.advertCard = {
    make: makeAdCard,
    openCardHandler: openCardHandler,
    closeCardHandler: closeCardHandler
  };


})();

