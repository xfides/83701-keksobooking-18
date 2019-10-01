'use strict';
(function () {
  /* ------------------------*/
  /* initialization process */
  var CONFIG = {

    mapPin: {
      queryDOM: document.querySelector('#pin'),
      innerWidth: 50,
      innerHeight: 70
    },

    mapPinMain: {
      queryDOM: document.querySelector('.map__pin--main'),
      innerWidth: 65,
      innerHeight: 80
    },

    map: {
      queryDOM: document.querySelector('.map'),
      fadedClass: 'map--faded',
      top: 130,
      bottom: 630,
      left: undefined,
      right: undefined
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
      // type: ['palace', 'flat', 'house', 'bungalo'],
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
      disabledClass: 'ad-form--disabled'
    },

    filterForm: {
      queryDOM: document.querySelector('.map__filters'),
      disabledClass: ''
    },

    keyCodes: {
      ENTER_CODE: 13
    }

  };

  var HELPERS = {

    generate: {

      // Number (userNumber) -> String (imgPath)
      userImgPath: function (userNumber) {

        HELPERS.check.userNumber(userNumber);

        var partOfPath2;
        var DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        if (DIGITS.indexOf(userNumber) === -1) {
          partOfPath2 = userNumber;
        } else {
          partOfPath2 = '0' + userNumber;
        }

        return 'img/avatars/user' + partOfPath2 + '.png';
      },

      // Number (min) -> Number (max)-> Number (randNumber)
      number: function (min, max) {

        /* input validation */
        if (
          typeof min !== 'number' || typeof max !== 'number'
          || !isFinite(min) || !isFinite(max)
        ) {
          throw new Error('min or max - strange numbers');
        }

        if (max < min) {
          throw new Error('max must be >= min');
        }

        /* generate new Number between min and max */
        var rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
      },

      /*
       * Object (DOM element) -> Object (DOM element) ->
       * -> Object (oneAd) || Object (Error)
       */
      oneAd: function (userNumber, outerLayer) {

        /* input validation */
        HELPERS.check.userNumber(userNumber);

        /* input validation: is layer normal for positioning map#pins */
        HELPERS.check.isVisibleInDOM(outerLayer);

        /* generate X && Y location coordinates */
        var coords = HELPERS.generate.adCoords(outerLayer);

        /* generate allowed features */
        var maxCountAllowedFeatures = HELPERS.generate.number(
            0, CONFIG.offerSettings.features.length
        );

        var allowedFeatures = HELPERS.generate.arrAdFeatures(
            CONFIG.offerSettings.features, maxCountAllowedFeatures
        );

        /* generate arr with img paths */
        var arrPics = HELPERS.generate.arrAdPics(
            CONFIG.offerSettings.photos.arrPics,
            CONFIG.offerSettings.photos.min,
            CONFIG.offerSettings.photos.max
        );

        /* fill data of one user's advert */
        return {
          author: {
            avatar: HELPERS.generate.userImgPath(userNumber)
          },

          offer: {
            title: String(
                CONFIG.offerSettings.title[
                HELPERS.generate.number(0, CONFIG.offerSettings.title.length - 1)
                ]
            ),
            address: String(coords.x + ', ' + coords.y),
            price: Number(
                HELPERS.generate.number(
                    CONFIG.offerSettings.price.min, CONFIG.offerSettings.price.max
                )
            ),
            type: String(CONFIG.offerSettings.type[
              HELPERS.generate.number(0, CONFIG.offerSettings.type.length - 1)
            ][0]
            ),
            rooms: Number(
                HELPERS.generate.number(
                    CONFIG.offerSettings.rooms.min, CONFIG.offerSettings.rooms.max
                )
            ),
            guests: Number(
                HELPERS.generate.number(
                    CONFIG.offerSettings.guests.min, CONFIG.offerSettings.guests.max
                )
            ),
            checkin: String(
                CONFIG.offerSettings.checkin[
                HELPERS.generate.number(
                    0, CONFIG.offerSettings.checkin.length - 1
                )]
            ),
            checkout: String(
                CONFIG.offerSettings.checkout[
                HELPERS.generate.number(0, CONFIG.offerSettings.checkout.length - 1)
                ]
            ),
            features: Object(allowedFeatures),
            description: String(
                CONFIG.offerSettings.description[
                HELPERS.generate.number(0, CONFIG.offerSettings.description.length - 1)
                ]
            ),
            photos: Object(arrPics)
          },

          location: {
            x: coords.x,
            y: coords.y
          }
        };

      },

      /*
       * Array [ String (feature) ] -> Number (numberAllowedFeatures) ->
       * -> Array [ String (feature) ] || Object (Error)
       */
      arrAdFeatures: function (arrAllFeatures, numberAllowedFeatures) {

        /* input validation */
        if (!Array.isArray(arrAllFeatures)) {
          throw new Error('you gave bad array of all features');
        }

        if (
          typeof numberAllowedFeatures !== 'number'
          || !isFinite(numberAllowedFeatures)
        ) {
          throw new Error('bad number of allowed Features');
        }

        if (numberAllowedFeatures > arrAllFeatures.length) {
          throw new Error(
              'number of allowed features must be <= length of all Features'
          );
        }

        /* clone input array */
        arrAllFeatures = arrAllFeatures.slice(0);

        /* create && fill array allowedFeatures, made from arrAllFeatures */
        var allowedFeatures = [];
        var checkedFeature;

        for (var index = 0; index < numberAllowedFeatures; index++) {
          checkedFeature = arrAllFeatures.splice(
              HELPERS.generate.number(0, arrAllFeatures.length - 1), 1
          );
          allowedFeatures.push(checkedFeature[0]);
        }

        return allowedFeatures;

      },

      /*
       * Array [ String (pic) ] -> Number (minCountPics) ->
       * -> Number (maxCountPics) -> Array [ String (pic) ] || Object (Error)
       */
      arrAdPics: function (arrAllPics, minCountPics, maxCountPics) {

        /* input validation */
        if (!Array.isArray(arrAllPics)) {
          throw new Error('you gave bad array of img paths');
        }

        if (
          typeof minCountPics !== 'number' || typeof maxCountPics !== 'number'
          || !isFinite(minCountPics) || !isFinite(maxCountPics)
        ) {
          throw new Error('bad numbers of min && max img path');
        }

        if (minCountPics > maxCountPics) {
          throw new Error(
              'number of min img paths must be <= max img paths'
          );
        }

        /* create && fill array of img paths */
        var arrPics = [];
        var countPics = HELPERS.generate.number(minCountPics, maxCountPics);
        var arrAllPicsLength = arrAllPics.length;

        for (var index = 0; index < countPics; index++) {
          arrPics.push(
              arrAllPics[HELPERS.generate.number(0, arrAllPicsLength - 1)]
          );
        }

        return arrPics;
      },

      /*
       * Object (DOM element) -> Object (DOM element | opt) ->
       * -> Object (coords) || Object (Error)
       */
      adCoords: function (outer, inner) {

        /* find outer elemet / layer */
        var outerElem = (outer) ? outer : CONFIG.map.queryDOM;
        if (!outerElem) {
          throw new Error('please, give correct outer layer');
        }

        /* tune up metrics of inner element */
        var innerElem = (inner) ? inner : null;
        var innerWidth = CONFIG.mapPin.innerWidth;
        var innerHeight = CONFIG.mapPin.innerHeight;

        if (innerElem) {
          innerWidth = innerElem.scrollWidth;
          innerHeight = innerElem.scrollHeight;
        }

        /* calc metrics of outer element / layer */
        var outerLayer = {
          top: (CONFIG.map.top) ? CONFIG.map.top : 0,
          left: (CONFIG.map.left) ? CONFIG.map.left : 0,
          right: (CONFIG.map.right) ?
            CONFIG.map.right : outerElem.scrollWidth,
          bottom: (CONFIG.map.bottom) ?
            CONFIG.map.bottom : outerElem.scrollHeight
        };

        /* check if inner element >= outer element / layer */
        if (
          innerWidth > (outerLayer.right - outerLayer.left)
          ||
          innerHeight > (outerLayer.bottom - outerLayer.top)
        ) {
          throw new Error('inner element must be <= outer element / layer');
        }

        /* calc metrics of inner element based on outer element / layer */
        var innerLayer = {
          left: HELPERS.generate.number(
              outerLayer.left, outerLayer.right - innerWidth
          ),

          top: HELPERS.generate.number(
              outerLayer.top, outerLayer.bottom - innerHeight
          )

        };

        return {
          x: Math.floor(innerLayer.left + innerWidth / 2),
          y: innerLayer.top + innerHeight
        };
      },

      errBlock: function (elem, msgForElem) {

        var TIME_SHOW_ERROR = 5000;

        // input validation of parameters
        if (!(typeof elem === 'object') || !(typeof msgForElem === 'string')) {
          throw new Error('bad parameters for creating error DOM element');
        }

        // without message - just outline checked block
        if (msgForElem.length === 0) {

          elem.style.outline = 'thick solid #ffa500';

          setTimeout(function () {
            elem.style.outline = '';
          }, TIME_SHOW_ERROR);

          return;
        }

        // create new DOM elem for error message
        var parentElem = elem.parentElement;
        var elemWidth = elem.scrollWidth;
        var errElem = document.createElement('span');
        errElem.dataset.error = 'error-block';
        errElem.textContent = msgForElem;
        errElem.style.cssText = (
          'outline: 2px solid #ff8c00; ' +
          'background-color: #ffffff; ' +
          'color: #ff8c00; ' +
          'position: absolute; ' +
          'padding: 10px; ' +
          'display: block ; ' +
          'max-width: ' + elemWidth + 'px;'
        );

        // if error block already exist, then delete old error block

        var errElemOld = parentElem.querySelector('[data-error=error-block]');

        if (errElemOld) {
          parentElem.removeChild(errElemOld);
        }

        elem.insertAdjacentElement('afterend', errElem);

        // delete error block with message
        setTimeout(function () {
          if (parentElem.contains(errElem)) {
            parentElem.removeChild(errElem);
          }
        }, TIME_SHOW_ERROR);

      },

      // Object (DOM element) ->  Array [ Object(ad) ]
      mockData: function (outerLayer) {

        var ads = [];
        var indexAd = CONFIG.usersCount.min;

        for (indexAd; indexAd <= CONFIG.usersCount.max; indexAd++) {
          ads.push(HELPERS.generate.oneAd(indexAd, outerLayer));
        }

        return ads;

      }
    },

    check: {

      // Number (userNumber) -> Bool(true) || Object (Error)
      userNumber: function (userNumber) {

        var checkUserNumber =
          (typeof userNumber === 'number') && isFinite(userNumber);

        if (
          !checkUserNumber
          ||
          userNumber > CONFIG.usersCount.max
          ||
          userNumber < CONFIG.usersCount.min
        ) {
          throw new Error('user number is wrong');
        }

        return true;
      },

      // Object (DOM element) -> Bool(true) || Object (Error)
      isVisibleInDOM: function (element) {
        if (
          !document.body.contains(element)
          || !element.clientWidth
          || !element.clientHeight
        ) {
          throw new Error(
              'your element must be DOM element with no zero width / height'
          );
        }

        return true;
      },

      // Object (obj) -> Bool
      isEmptyObj: function (obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            return false;
          }
        }
        return true;
      }

    },

    get: {

      // Object (oldCoords) -> Object (inner) -> Object (newCoords)
      coordsLT: function (addressCoords, inner) {

        var innerElem = (inner) ? inner : null;
        var innerWidth = CONFIG.mapPin.innerWidth;
        var innerHeight = CONFIG.mapPin.innerHeight;

        if (innerElem) {
          innerWidth = innerElem.scrollWidth;
          innerHeight = innerElem.scrollHeight;
        }

        return {
          x: Math.ceil(addressCoords.x - innerWidth / 2),
          y: addressCoords.y - innerHeight
        };

      },

      addressOnCenter: function (inner) {

        var innerElem = (inner) ? inner : null;
        var innerWidth = CONFIG.mapPinMain.innerWidth;
        var innerHeight = CONFIG.mapPinMain.innerHeight;
        var innerLeft = 0;
        var innerTop = 0;

        if (innerElem) {
          /*
           из за того, что svg отмасштабирована и содержит псевдоэлемент -
           данные координаты не совсем верны. Так как они учитывают только
           чистые координаты самой кнопки  .map__pin--main
           */
          // innerWidth = parseInt(window.getComputedStyle(innerElem).width);
          // innerHeight = parseInt(window.getComputedStyle(innerElem).height);
          // innerWidth = innerElem.getBoundingClientRect().width;
          // innerHeight = innerElem.getBoundingClientRect().height;

          /*
           тоже немного "левые координаты"  (так понимаю из-за
           трансоформации и смещения transform-origin ). Но они больше
           похожи на правду чем координаты от  getComputedStyle() или
           getBoundingClientRect()
           */
          innerWidth = innerElem.scrollWidth;
          innerHeight = innerElem.scrollHeight;

          // здесь уже все нормально рассчитывается
          innerLeft = innerElem.offsetLeft;
          innerTop = innerElem.offsetTop;
        }

        return {
          x: Math.ceil(innerLeft + innerWidth / 2),
          y: Math.ceil(innerTop + innerHeight / 2)
        };
      },

      addressOnLB2: function (inner) {

        var innerElem = (inner) ? inner : null;
        var innerWidth = CONFIG.mapPinMain.innerWidth;
        var innerHeight = CONFIG.mapPinMain.innerHeight;
        var innerLeft = 0;
        var innerTop = 0;

        if (innerElem) {

          /*
           данный способ вычисления ширины и высоты элемента
           учитывает вложенный в него псевдоэлемент острого треугольника
           снизу.
           */
          innerWidth = innerElem.scrollWidth;
          innerHeight = innerElem.scrollHeight;

          innerLeft = innerElem.offsetLeft;
          innerTop = innerElem.offsetTop;
        }

        return {
          x: Math.ceil(innerLeft + innerWidth / 2),
          y: Math.ceil(innerTop + innerHeight)
        };
      }

    },

    update: {

      /*
       * Object (nodePin) -> Object (infoAd) ->
       * -> Object (newNodePin) || Object (error)
       */
      mapPin: function (nodePin, infoAd) {

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

        return nodePin;

      },

      wordEnd: function (word, number, specialWord) {
        var WORDS_FOR_CHECK = ['комната', 'гость'];
        var iWord = WORDS_FOR_CHECK.indexOf(word);
        var updatedWord = '';
        var numEnd = number % 10;

        /* input validation */
        if (typeof word !== 'string') {
          throw new Error('you do not give string word');
        }

        if (iWord === -1) {
          throw new Error('unknown word for transform its ending');
        }

        if (
          typeof number !== 'number' || !isFinite(number) || number < 0
        ) {
          throw new Error('count for word ending is strange number');
        }

        /* update word (комната) */
        if (WORDS_FOR_CHECK[iWord] === 'комната') {
          switch (numEnd) {
            case 1:
              updatedWord = 'комната';
              break;
            case 2:
            case 3:
            case 4:
              updatedWord = 'комнаты';
              break;
            default:
              updatedWord = 'комнат';
          }
          if (number === 0) {
            updatedWord = 'комнат нет';
          }
          if (number === 11 || number === 12 || number === 13 || number === 14) {
            updatedWord = 'комнат';
          }
          if (typeof specialWord === 'string') {
            updatedWord = specialWord;
          }
        }

        /* update word (гость) */
        if (WORDS_FOR_CHECK[iWord] === 'гость') {
          switch (numEnd) {
            case 1:
              updatedWord = 'гостя';
              break;
            default:
              updatedWord = 'гостей';
          }
          if (number === 0) {
            updatedWord = 'отсутствующих гостей';
          }
          if (number === 11) {
            updatedWord = 'гостей';
          }
          if (typeof specialWord === 'string') {
            updatedWord = specialWord;
          }
        }

        /* check work of function */
        if (updatedWord === '') {
          throw new Error('function updatedWord worked bad!!!');
        }

        return updatedWord;

      }

    },

    validate: {
      'roomsGuests': function (elemRoom, elemGuest) {

        var selectedRooms = Number(elemRoom.value);
        var selectedGuests = Number(elemGuest.value);

        if (
          selectedRooms >= 10 && selectedGuests !== 0
          ||
          selectedGuests === 0 && selectedRooms < 10
        ) {
          return {
            status: false,
            errorMsg: 'число комнат > 9 допускается только для опциии "нет гостей"'
          };
        }

        if (selectedRooms < selectedGuests) {
          return {
            status: false,
            errorMsg: 'число комнат должно быть больше или равно числу гостей'
          };
        }

        return {
          status: true,
          errorMsg: ''
        };

      }
    }

  };

  function takeOffMapFaded() {
    var map = CONFIG.map.queryDOM;
    if (map) {
      map.classList.remove(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  function takeOnMapFaded() {
    var map = CONFIG.map.queryDOM;
    if (map) {
      map.classList.add(CONFIG.map.fadedClass);
      return true;
    }
    throw new Error('no map exist');
  }

  /*

   // DO NOT DELETE!!!

   function placeAdsOnMap() {

   // 1) find map and map#pin template
   var map = CONFIG.map.queryDOM.querySelector('.map__pins');
   var mapPinTemplate = CONFIG.mapPin.queryDOM;

   if (!map) {
   throw new Error('no map exist');
   }

   if (!mapPinTemplate) {
   throw new Error('no map pin template exist');
   }

   // 2) generate fake ads
   var fakeAds = HELPERS.generate.mockData(map);

   // 3) create DOM nodes (map#pin) based on generated fake ads
   var nodeMapPin = mapPinTemplate.content;
   var wrapMapPins = document.createDocumentFragment();

   fakeAds.forEach(function (oneAd) {
   wrapMapPins.appendChild(HELPERS.update.mapPin(nodeMapPin, oneAd));
   });

   // 4) insert DOM nodes (map#pin) in map
   map.appendChild(wrapMapPins);

   return fakeAds;

   }

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
   // cardElem.querySelector('.map__card').removeChild(cardDomElems.features);
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

   */

  /*
   // DO NOT DELETE!!! first tasks before events
   takeOffMapFaded();

   var fakeAdverts = placeAdsOnMap();

   makeAdCard(fakeAdverts[0]);
   */

  function turnOnPage() {

    // turn on (advert form) and it's all fields
    var adForm = CONFIG.adForm.queryDOM;
    var adFieldSets = adForm.querySelectorAll('fieldset');

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
    takeOffMapFaded();

    // recalculate (left, Bottom/2) coords of main map pin after turnOnPage
    // 300ms - animation time from css. I have 350ms for more safety
    setTimeout(function () {
      var coordsAddressCenter = HELPERS.get.addressOnLB2(
          CONFIG.mapPinMain.queryDOM
      );
      var inputAddress = adForm.querySelector('#address');
      inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
    }, 350);

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

    // remover fade layer over the map
    takeOnMapFaded();

  }

  function startWorking() {

    // find main pin in DOM
    var mapPinMain = CONFIG.mapPinMain.queryDOM;

    // add event listeners to activate page
    mapPinMain.addEventListener('mousedown', function () {
      turnOnPage();
    });
    mapPinMain.addEventListener('keydown', function (evt) {
      if (
        evt.keyCode === CONFIG.keyCodes.ENTER_CODE
        &&
        evt.target === CONFIG.mapPinMain.queryDOM
      ) {
        turnOnPage();
      }
    });

    // calc CENTER coords of main map pin
    var coordsAddressCenter = HELPERS.get.addressOnCenter(mapPinMain);
    var adForm = CONFIG.adForm.queryDOM;
    var inputAddress = adForm.querySelector('#address');
    inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;

    // get guests select for checking
    var guestsElem = adForm.querySelector('#capacity');

    // check if user chose number user guests correctly
    function checkRoomsGuests() {

      var resultValidity = {};
      var elemRoomsDOM = adForm.querySelector('#room_number');
      var elemGuestsDOM = adForm.querySelector('#capacity');
      resultValidity = HELPERS.validate.roomsGuests(elemRoomsDOM, elemGuestsDOM);

      if (!resultValidity.status) {

        // just outline checked block
        HELPERS.generate.errBlock(elemGuestsDOM, '');
        // on target block show error message
        HELPERS.generate.errBlock(elemGuestsDOM, resultValidity.errorMsg);
        // set validity HTML5
        elemGuestsDOM.setCustomValidity(resultValidity.errorMsg);

      } else {
        elemGuestsDOM.setCustomValidity('');
      }

      return resultValidity;

    }

    // reaction on form submitting
    function submitFormHandler(evt) {

      var resultValidity = checkRoomsGuests();
      if (resultValidity.status === false) {
        evt.preventDefault();
      }

    }

    // make reaction validity on change guests (capacity) select
    guestsElem.addEventListener('change', checkRoomsGuests);

    // make some actions on form submitting
    adForm.addEventListener('submit', submitFormHandler);

  }

  /* -------------------------*/
  /* start execution scripts */
  turnOffPage();
  startWorking();

})();

