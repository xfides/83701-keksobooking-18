'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var HELPERS = window.HELPERS;
  var page = window.page;

  function startWorking() {

    // --- 1 - find main pin + add event listeners to activate page
    var mapPinMain = CONFIG.mapPinMain.queryDOM;

    function mapPinMainHandler(evt) {

      if (evt.type === 'mousedown' && evt.button === 0) {
        page.turnOn(mapPinMainHandler);
      }

      if (evt.type === 'keydown' && evt.keyCode === CONFIG.keyCodes.ENTER) {
        page.turnOn(mapPinMainHandler);
      }
    }

    mapPinMain.addEventListener('mousedown', mapPinMainHandler);
    CONFIG.mapPinMain.allowedHandlers.push(mapPinMainHandler);
    mapPinMain.addEventListener('keydown', mapPinMainHandler);

    // --- 2 - calc CENTER coords of main map pin
    function setupDragAddress(addressElem, mapPinMainElem) {

      var posBlockLeft = parseInt(mapPinMainElem.style.left, 10);
      var posBlockTop = parseInt(mapPinMainElem.style.top, 10);

      var address = {
        x: posBlockLeft + HELPERS.get.addressOnLB2().x,
        y: posBlockTop + HELPERS.get.addressOnLB2().y
      };

      addressElem.value = address.x + ', ' + address.y;
    }

    var coordsAddressCenter = HELPERS.get.addressOnCenter(mapPinMain);
    var adForm = CONFIG.adForm.queryDOM;
    var inputAddress = adForm.querySelector('#address');
    inputAddress.value = coordsAddressCenter.x + ', ' + coordsAddressCenter.y;
    inputAddress.readOnly = true;

    // --- 3 - process of dragging mapPinMain
    function grabPinHandler(evt) {

      // --- 1 - checking dragStart
      if (CONFIG.mapPinMain.allowedHandlers.indexOf(mapPinMainHandler) !== -1) {
        return;
      }

      // --- 2 - calc initial data and coords
      var map = CONFIG.map.queryDOM;
      var mapPinMainConf = CONFIG.mapPinMain;
      var mapEdges = {
        top: CONFIG.map.top,
        bottom: CONFIG.map.bottom,
        left: (CONFIG.map.left) ? CONFIG.map.left : 0,
        right: (CONFIG.map.right) ?
          CONFIG.map.right : parseInt(map.scrollWidth, 10)
      };

      var allowedCoordsLT = {
        minLeft: Math.ceil(mapEdges.left - mapPinMainConf.innerWidth / 2),
        maxLeft: Math.floor(mapEdges.right - mapPinMainConf.innerWidth / 2),
        minTop: mapEdges.top - mapPinMainConf.innerHeight,
        maxTop: mapEdges.bottom - mapPinMainConf.innerHeight
      };

      // --- 2.5 - fix mapPinMain coords on mobile version
      if (mapEdges.right > document.documentElement.clientWidth) {
        allowedCoordsLT.maxLeft =
          Math.floor(
              document.documentElement.clientWidth - mapPinMainConf.innerWidth / 2
          );
      }

      var firstMouseCoords = {
        left: evt.pageX,
        top: evt.pageY
      };
      var firstCoordsLT = {
        left: parseInt(mapPinMain.style.left, 10),
        top: parseInt(mapPinMain.style.top, 10)
      };

      // --- 3 - dragging handler
      var dragPinHandler = HELPERS.throttle(
          function (evtDrag) {

            var newMouseCoords = {
              left: evtDrag.pageX,
              top: evtDrag.pageY
            };

            var diffMouseCoords = {
              left: newMouseCoords.left - firstMouseCoords.left,
              top: newMouseCoords.top - firstMouseCoords.top
            };

            var newCoordsLT = {
              left: firstCoordsLT.left + diffMouseCoords.left,
              top: firstCoordsLT.top + diffMouseCoords.top
            };

            if (newCoordsLT.left <= allowedCoordsLT.minLeft) {
              newCoordsLT.left = allowedCoordsLT.minLeft;
            }

            if (newCoordsLT.top <= allowedCoordsLT.minTop) {
              newCoordsLT.top = allowedCoordsLT.minTop;
            }

            if (newCoordsLT.top >= allowedCoordsLT.maxTop) {
              newCoordsLT.top = allowedCoordsLT.maxTop;
            }

            if (newCoordsLT.left >= allowedCoordsLT.maxLeft) {
              newCoordsLT.left = allowedCoordsLT.maxLeft;
            }

            mapPinMain.style.left = newCoordsLT.left + 'px';
            mapPinMain.style.top = newCoordsLT.top + 'px';

            setupDragAddress(inputAddress, mapPinMain);

          }, CONFIG.mapPinMain.throttleDragTime);

      // --- 4 - mouseup handler
      function releasePinHandler() {
        document.removeEventListener('mousemove', dragPinHandler);
        document.removeEventListener('mouseup', releasePinHandler);

        setupDragAddress(inputAddress, mapPinMain);
      }

      // --- 5 -  adding handlers
      document.addEventListener('mousemove', dragPinHandler);
      document.addEventListener('mouseup', releasePinHandler);

      // --- 6 - disable built-in browser drag event
      mapPinMain.addEventListener('dragstart', function (evtDragStart) {
        evtDragStart.preventDefault();
        return false;
      });

    }

    mapPinMain.addEventListener('mousedown', grabPinHandler);

  }

  /* -------------------------*/
  /* start execution scripts */
  page.turnOff();
  startWorking();

})();

