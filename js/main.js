'use strict';
(function () {
  /* ------------------------*/
  /* initialization process */
  var CONFIG = {

    mapPin: {
      templateQueryDOM: document.querySelector('#pin'),
      innerWidth: 50,
      innerHeight: 70,
      className: 'map__pin'
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
      disabledClass: 'ad-form--disabled',
      url: 'https://js.dump.academy/keksobooking'
    },

    filterForm: {
      queryDOM: document.querySelector('.map__filters'),
      disabledClass: ''
    },

    keyCodes: {
      ENTER_CODE: 13,
      ESC: 27
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

      // Object (elemDOM) -> String (msgForElem)-> undefined
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
          'width: 100% ; ' +
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

      // Object (inner) -> Object (newCoords)
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

      // Object (inner) -> Object (newCoords)
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

        // add event listeners for opening corresponding advert
        function openCard(evt) {

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
            lightOffMapPin();
            showCard();
            lightOnMapPin(evt.currentTarget);
            return;
          }

          if (evt.type === 'mousedown' && evt.button === 0) {
            lightOffMapPin();
            showCard();
            lightOnMapPin(evt.currentTarget);
            return;
          }

        }
        buttonPin.addEventListener('mousedown', openCard);
        buttonPin.addEventListener('keydown', openCard);

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

      'capacity': function () {

        var ROOMS_EDGE = 10;
        var adForm = CONFIG.adForm.queryDOM;
        var elemGuest = adForm.querySelector('#capacity');
        var elemRoom = adForm.querySelector('#room_number');
        var selectedRooms = Number(elemRoom.value);
        var selectedGuests = Number(elemGuest.value);
        var resValidity = {
          status: true,
          errorMsg: ''
        };

        if (
          selectedRooms >= ROOMS_EDGE && selectedGuests !== 0
          ||
          selectedGuests === 0 && selectedRooms < ROOMS_EDGE
        ) {
          resValidity = {
            status: false,
            errorMsg: (
              'опции (нет гостей) устанавливается в соответствии с числом' +
              ' комнат > ' + (ROOMS_EDGE - 1)
            )

          };
        }

        if (selectedRooms < selectedGuests) {
          resValidity = {
            status: false,
            errorMsg: (
              'число гостей не должно быть больше числа предоставленных комнат'
            )
          };
        }

        if (!resValidity.status) {
          HELPERS.generate.errBlock(elemGuest, resValidity.errorMsg);
          elemGuest.setCustomValidity(resValidity.errorMsg);
        } else {
          elemGuest.setCustomValidity('');
        }

        return resValidity;


      },

      'title': function () {

        var MIN_LENGTH = 30;
        var MAX_LENGTH = 100;
        var resValidity = {
          status: true,
          errorMsg: ''
        };
        var form = CONFIG.adForm.queryDOM;
        var elemTitle = form.querySelector('#title');
        var valTitle = elemTitle.value.trim();
        var valTitleLength = valTitle.length;

        if (valTitleLength < MIN_LENGTH || valTitleLength > MAX_LENGTH) {
          resValidity = {
            status: false,
            errorMsg: (
              'Длина заголовка должна быть от ' + MIN_LENGTH +
              ' до ' + MAX_LENGTH + '  символов'
            )
          };
        }

        if (!resValidity.status) {
          HELPERS.generate.errBlock(elemTitle, resValidity.errorMsg);
          elemTitle.setCustomValidity(resValidity.errorMsg);
        } else {
          elemTitle.setCustomValidity('');
        }

        return resValidity;
      },

      'timeIn': function (evt) {

        var form = CONFIG.adForm.queryDOM;
        var elemTimeIn = form.querySelector('#timein');
        var elemTimeOut = form.querySelector('#timeout');

        var valElemTimeIn = elemTimeIn.value;
        var valElemTimeOut = elemTimeOut.value;

        if (evt.target === elemTimeIn) {
          elemTimeOut.value = valElemTimeIn;
        }

        if (evt.target === elemTimeOut) {
          elemTimeIn.value = valElemTimeOut;
        }

      },

      'price': function () {

        var minPrice = {
          'bungalo': 0,
          'flat': 1000,
          'house': 5000,
          'palace': 10000
        };

        var resValidity = {
          status: true,
          errorMsg: ''
        };

        var maxPrice = 1000000;

        var form = CONFIG.adForm.queryDOM;
        var elemType = form.querySelector('#type');
        var elemPrice = form.querySelector('#price');
        elemPrice.max = maxPrice;


        var valElemType = elemType.value;
        var elemTypeText =
          elemType.querySelector('[value=' + valElemType + ']').textContent;

        var valElemPrice = Number(elemPrice.value);
        elemPrice.placeholder = minPrice[valElemType];
        elemPrice.min = minPrice[valElemType];

        if (valElemPrice < minPrice[valElemType] || valElemPrice > maxPrice) {
          resValidity = {
            status: false,
            errorMsg: (
              'цена для опции " ' + elemTypeText +
              ' " должна быть от ' + minPrice[valElemType] +
              ' до ' + maxPrice
            )
          };
        }

        if (!resValidity.status) {
          HELPERS.generate.errBlock(elemPrice, resValidity.errorMsg);
          elemPrice.setCustomValidity(resValidity.errorMsg);
        } else {
          elemPrice.setCustomValidity('');
        }


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
    var fakeAds = HELPERS.generate.mockData(map);

    // 3) create DOM nodes (map#pin) based on generated fake ads
    var nodeMapPin = mapPinTemplate.content;
    var wrapMapPins = document.createDocumentFragment();
    var updatedMapPin = null;

    fakeAds.forEach(function (oneAd) {
      updatedMapPin = HELPERS.update.mapPin(nodeMapPin, oneAd);
      wrapMapPins.appendChild(updatedMapPin);
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

  function lightOnMapPin(elemMapPin) {
    if (
      typeof elemMapPin === 'object'
      &&
      HELPERS.check.isVisibleInDOM(elemMapPin)
    ) {
      elemMapPin.classList.add('map__pin--active');
    }
  }

  function lightOffMapPin() {
    var map = CONFIG.map.queryDOM;
    var mapPin = map.querySelector('.map__pin--active');

    if (mapPin) {
      mapPin.classList.remove('map__pin--active');
    }
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

    // generate adverts, place mapPins on map, show/hide selected advert card
    placeAdsOnMap();

    // close advert cards on map in document
    var map = CONFIG.map.queryDOM;

    function closeCard(evt) {

      var cardElemDOM = null;

      if (evt.type === 'mousedown' && evt.button === 0) {
        cardElemDOM = evt.target.closest('.map__card');
        if (
          cardElemDOM !== null
          &&
          evt.target.classList.contains('popup__close')
        ) {
          cardElemDOM.remove();
          lightOffMapPin();
          return;
        }
      }

      if (evt.type === 'keydown' && evt.keyCode === CONFIG.keyCodes.ESC) {
        cardElemDOM = map.querySelector('.map__card');
        if (cardElemDOM) {
          cardElemDOM.remove();
          lightOffMapPin();
          return;
        }
      }

      if (
        evt.type === 'keydown'
        &&
        evt.keyCode === CONFIG.keyCodes.ENTER_CODE
        &&
        evt.target ===  map.querySelector('.popup__close')
      ) {
        cardElemDOM = map.querySelector('.map__card');
        if(cardElemDOM){
          cardElemDOM.remove();
          lightOffMapPin();
          return;
        }
      }

    }

    map.addEventListener('mousedown', closeCard);
    document.addEventListener('keydown', closeCard);

    // delete handler mapPinMainHandler, because turnOnPage function
    // should work only 1 time
    var mapPinMain = CONFIG.mapPinMain.queryDOM;
    mapPinMain.removeEventListener('mousedown', mapPinMainHandler);
    mapPinMain.removeEventListener('keydown', mapPinMainHandler);

    // reaction on form changing - validation fields
    function changeFormHandler(evt) {

      // ==================================================

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
    takeOnMapFaded();

  }

  function startWorking() {

    // find main pin in DOM  + add event listeners to activate page
    var mapPinMain = CONFIG.mapPinMain.queryDOM;
    function mapPinMainHandler(evt) {

      if (evt.type === 'mousedown' && evt.button === 0) {
        turnOnPage(mapPinMainHandler);
      }

      if (evt.type === 'keydown' && evt.keyCode === CONFIG.keyCodes.ENTER_CODE) {
        turnOnPage(mapPinMainHandler);
      }
    }

    mapPinMain.addEventListener('mousedown', mapPinMainHandler);
    mapPinMain.addEventListener('keydown', mapPinMainHandler);

    // calc CENTER coords of main map pin
    var coordsAddressCenter = HELPERS.get.addressOnCenter(mapPinMain);
    var adForm = CONFIG.adForm.queryDOM;
    var inputAddress = adForm.querySelector('#address');
    inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
    inputAddress.readOnly = true;

  }

  /* -------------------------*/
  /* start execution scripts */
  turnOffPage();
  startWorking();

})();

