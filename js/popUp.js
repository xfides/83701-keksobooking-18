'use strict';
(function () {

  var CONFIG = window.CONFIG;
  var mainBlock = CONFIG.main.queryDOM;

  function showPopUpError() {
    var errBlockTemplate = document.querySelector('#error').content;
    var errBlock = errBlockTemplate.querySelector('.error').cloneNode(true);
    var errBlockBtn = errBlock.querySelector('.error__button');

    function closeErrBlock(evt) {

      if (
        evt.type === 'mousedown' &&
        evt.button === 0 &&
        evt.target === errBlock
      ) {
        errBlock.remove();
      }

      if (
        evt.type === 'mousedown' &&
        evt.button === 0 &&
        evt.target === errBlockBtn
      ) {
        errBlock.remove();
      }

      if (
        evt.type === 'keydown' &&
        evt.keyCode === CONFIG.keyCodes.ESC
      ) {
        errBlock.remove();
      }

    }

    errBlock.addEventListener('mousedown', closeErrBlock);
    document.addEventListener('keydown', closeErrBlock);

    mainBlock.appendChild(errBlock);
  }

  function showPopUpOk() {
    var okBlockTemplate = document.querySelector('#success').content;
    var okBlock = okBlockTemplate.querySelector('.success').cloneNode(true);

    function closeOkBlock(evt) {

      var evtClosestSuccess = evt.target.closest('.success');

      if (
        evt.type === 'mousedown' &&
        evt.button === 0 &&
        evtClosestSuccess !== null
      ) {
        okBlock.remove();
      }

      if (
        evt.type === 'keydown' &&
        evt.keyCode === CONFIG.keyCodes.ESC
      ) {
        okBlock.remove();
      }
    }

    okBlock.addEventListener('mousedown', closeOkBlock);
    document.addEventListener('keydown', closeOkBlock);

    mainBlock.appendChild(okBlock);

  }

  window.popUps = {
    showOk: showPopUpOk,
    showError: showPopUpError
  };

})();
