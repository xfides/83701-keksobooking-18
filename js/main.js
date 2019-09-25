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
        min: 1,
        max: 7,
        arrPics: [
          'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
          'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
        ]
      }
    }

  };

  var HELPERS = {

    generate: {

      // Number (userNumber) -> String (imgPath)
      userImgPath: function (userNumber) {

        HELPERS.check.userNumber(userNumber);

        var partOfPath2;
        var digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        if (digits.indexOf(userNumber) === -1) {
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
          0, CONFIG.offerSettings.features.length - 1
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
      coordsLT: function (oldCoords, inner) {

        var innerElem = (inner) ? inner : null;
        var innerWidth = CONFIG.mapPin.innerWidth;
        var innerHeight = CONFIG.mapPin.innerHeight;

        if (innerElem) {
          innerWidth = innerElem.scrollWidth;
          innerHeight = innerElem.scrollHeight;
        }

        return {
          x: Math.ceil(oldCoords.x - innerWidth / 2),
          y: oldCoords.y - innerHeight
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

      }
    },

    // Object (srcObj) -> Object (target)
    cloneSimpleObj: function (srcObj) {

      function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      }

      function iterationCopy(src) {
        var target = {};
        for (var prop in src) {
          if (src.hasOwnProperty(prop)) {
            if (isObject(src[prop])) {
              target[prop] = iterationCopy(src[prop]);
            } else {
              target[prop] = src[prop];
            }
          }
        }
        return target;
      }

      return iterationCopy(srcObj);
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

    /* console.log(advert);*/

    var cardElem = document.querySelector('#card').content;
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
    cardDomElems.price.textContent = advert.offer.price + ' р/ночь ';
    cardDomElems.features.textContent = advert.offer.features.join(', ');
    cardDomElems.description.textContent = advert.offer.description;
    cardDomElems.avatar.src = advert.author.avatar;

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

    for (var iSrc = 0; iSrc < advert.offer.photos.length; iSrc++) {
      clonePhotoNode = photoNode.cloneNode(true);
      clonePhotoNode.src = advert.offer.photos[iSrc];
      cardDomElems.photos.appendChild(clonePhotoNode);
    }

    console.log(cardElem);

  }

  /* -------------------------*/
  /* start execution scripts */
  takeOffMapFaded();
  var fakeAdverts = placeAdsOnMap();
  makeAdCard(fakeAdverts[0]);

})();

