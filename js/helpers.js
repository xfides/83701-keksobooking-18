'use strict';
(function () {

  var CONFIG = window.CONFIG;

  window.HELPERS = {

    generate: {

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

      }

    },

    check: {

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


