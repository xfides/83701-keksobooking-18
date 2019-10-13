'use strict';
(function () {

  // --- 1.0 - default params
  var XHR_URL = 'https://js.dump.academy/keksobooking/data';
  var XHR_METHOD = 'GET';
  var XHR_RESPONSE_TYPE = '';
  var XHR_TIMEOUT = 10000;

  // helpers
  function isFunction(functionToCheck) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === '[object Function]'
    );
  }

  function useXHR(configXHR, successCB, errorCB, timeoutCB) {

    // --- 1.1 - validation preliminary settings
    if (typeof configXHR !== 'object') {
      throw new Error('invalid config XHR object');
    }

    if (!isFunction(successCB) || !isFunction(errorCB)) {
      throw new Error(
          'XHR request must have success and error function handlers'
      );
    }

    // --- 1.2 - tune up params of XHR object
    XHR_URL = (configXHR.url) ? configXHR.url : XHR_URL;
    XHR_METHOD = (configXHR.method) ? configXHR.method : XHR_METHOD;
    XHR_RESPONSE_TYPE = (configXHR.responseType) ?
      configXHR.responseType : XHR_RESPONSE_TYPE;
    XHR_TIMEOUT = (configXHR.timeout) ? configXHR.timeout : XHR_TIMEOUT;

    // --- 2 - create & initialize XHR object
    var xhr = new XMLHttpRequest();
    xhr.timeout = XHR_TIMEOUT;
    xhr.responseType = XHR_RESPONSE_TYPE;

    // --- 3 - prepare event handlers
    function xhrSuccessHandler() {
      if (xhr.status === 200) {
        successCB(xhr.response);
        return;
      }
      errorCB();
    }

    function xhrErrorHandler() {
      errorCB();
    }

    function xhrTimeoutHandler() {
      if (isFunction(timeoutCB)) {
        timeoutCB();
      }
    }

    xhr.addEventListener('load', xhrSuccessHandler);
    xhr.addEventListener('error', xhrErrorHandler);
    xhr.addEventListener('timeout', xhrTimeoutHandler);

    // --- 4 - send HTTP request
    xhr.open(XHR_METHOD, XHR_URL);
    xhr.send();
  }

  // --- 5 - export ajax functionality
  window.ajax = {
    useXHR: useXHR
  };

})();
