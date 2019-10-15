'use strict';
(function () {

  window.CONFIG = {

    mapPin: {
      templateQueryDOM: document.querySelector('#pin'),
      innerWidth: 50,
      innerHeight: 70,
      className: 'map__pin'
    },

    mapPinMain: {
      queryDOM: document.querySelector('.map__pin--main'),
      innerWidth: 65,
      innerHeight: 80,
      enabledHandlers: {},
      disabledHandlers: {},
      throttleDragTime: 20,
      leftInitial: 570,
      topInitial: 375
    },

    map: {
      queryDOM: document.querySelector('.map'),
      fadedClass: 'map--faded',
      top: 130,
      bottom: 630,
      left: undefined,
      right: undefined
    },

    main: {
      queryDOM: document.querySelector('main')
    },

    usersCount: {
      min: 1,
      max: 8
    },

    offerSettings: {
      title: ['Offer1', 'Offer2', 'Offer3', 'Offer4', 'Offer5'],
      address: undefined,
      price: {
        min: 1000,
        max: 10000
      },
      type: [
        ['palace', 'Дворец '],
        ['flat', 'Квартира '],
        ['house', 'Дом '],
        ['bungalo', 'Бунгало ']
      ],
      rooms: {
        min: 1,
        max: 4
      },
      guests: {
        min: 1,
        max: 4
      },
      checkin: ['12:00', '13:00', '14:00'],
      checkout: ['12:00', '13:00', '14:00'],
      features: [
        'wifi', 'dishwasher', 'parking',
        'washer', 'elevator', 'conditioner'
      ],
      description: ['description1', 'description2', 'description3'],
      photos: {
        min: 0,
        max: 7,
        arrPics: [
          'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
        ]
      }
    },

    adForm: {
      queryDOM: document.querySelector('.ad-form'),
      disabledClass: 'ad-form--disabled',
      url: 'https://js.dump.academy/keksobooking'
    },

    filterForm: {
      queryDOM: document.querySelector('.map__filters'),
      disabledClass: ''
    },

    keyCodes: {
      ENTER: 13,
      ESC: 27
    }

  };

})();
