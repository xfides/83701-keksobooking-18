'use strict';
(function () {

  var CONFIG = window.CONFIG;

  window.HELPERS = {

    generate: {

      // Number (userNumber) -> String (imgPath)
      userImgPath: function (userNumber) {

        window.HELPERS.check.userNumber(userNumber);

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
        window.HELPERS.check.userNumber(userNumber);

        /* input validation: is layer normal for positioning map#pins */
        window.HELPERS.check.isVisibleInDOM(outerLayer);

        /* generate X && Y location coordinates */
        var coords = window.HELPERS.generate.adCoords(outerLayer);

        /* generate allowed features */
        var maxCountAllowedFeatures = window.HELPERS.generate.number(
            0, CONFIG.offerSettings.features.length
        );

        var allowedFeatures = window.HELPERS.generate.arrAdFeatures(
            CONFIG.offerSettings.features, maxCountAllowedFeatures
        );

        /* generate arr with img paths */
        var arrPics = window.HELPERS.generate.arrAdPics(
            CONFIG.offerSettings.photos.arrPics,
            CONFIG.offerSettings.photos.min,
            CONFIG.offerSettings.photos.max
        );

        /* fill data of one user's advert */
        return {
          author: {
            avatar: window.HELPERS.generate.userImgPath(userNumber)
          },

          offer: {
            title: String(
                CONFIG.offerSettings.title[
                window.HELPERS.generate.number(0, CONFIG.offerSettings.title.length - 1)
                ]
            ),
            address: String(coords.x + ', ' + coords.y),
            price: Number(
                window.HELPERS.generate.number(
                    CONFIG.offerSettings.price.min, CONFIG.offerSettings.price.max
                )
            ),
            type: String(CONFIG.offerSettings.type[
              window.HELPERS.generate.number(0, CONFIG.offerSettings.type.length - 1)
            ][0]
            ),
            rooms: Number(
                window.HELPERS.generate.number(
                    CONFIG.offerSettings.rooms.min, CONFIG.offerSettings.rooms.max
                )
            ),
            guests: Number(
                window.HELPERS.generate.number(
                    CONFIG.offerSettings.guests.min, CONFIG.offerSettings.guests.max
                )
            ),
            checkin: String(
                CONFIG.offerSettings.checkin[
                window.HELPERS.generate.number(
                    0, CONFIG.offerSettings.checkin.length - 1
                )]
            ),
            checkout: String(
                CONFIG.offerSettings.checkout[
                window.HELPERS.generate.number(0, CONFIG.offerSettings.checkout.length - 1)
                ]
            ),
            features: Object(allowedFeatures),
            description: String(
                CONFIG.offerSettings.description[
                window.HELPERS.generate.number(0, CONFIG.offerSettings.description.length - 1)
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
              window.HELPERS.generate.number(0, arrAllFeatures.length - 1), 1
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
        var countPics = window.HELPERS.generate.number(minCountPics, maxCountPics);
        var arrAllPicsLength = arrAllPics.length;

        for (var index = 0; index < countPics; index++) {
          arrPics.push(
              arrAllPics[window.HELPERS.generate.number(0, arrAllPicsLength - 1)]
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
          left: window.HELPERS.generate.number(
              outerLayer.left, outerLayer.right - innerWidth
          ),

          top: window.HELPERS.generate.number(
              outerLayer.top - innerHeight, outerLayer.bottom - innerHeight
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
          ads.push(window.HELPERS.generate.oneAd(indexAd, outerLayer));
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
          window.HELPERS.generate.errBlock(elemGuest, resValidity.errorMsg);
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
          window.HELPERS.generate.errBlock(elemTitle, resValidity.errorMsg);
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
          window.HELPERS.generate.errBlock(elemPrice, resValidity.errorMsg);
          elemPrice.setCustomValidity(resValidity.errorMsg);
        } else {
          elemPrice.setCustomValidity('');
        }

        return resValidity;

      }

    },

    throttle: function (func, ms) {

      var isThrottled = false;
      var savedArgs;
      var savedThis;

      /** @this  crap */
      function wrapper() {

        if (isThrottled) {
          savedArgs = arguments;
          savedThis = this;
          return;
        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function () {
          isThrottled = false;
          if (savedArgs) {
            wrapper.apply(savedThis, savedArgs);
            savedArgs = savedThis = null;
          }
        }, ms);
      }

      return wrapper;
    }

  };

})();


