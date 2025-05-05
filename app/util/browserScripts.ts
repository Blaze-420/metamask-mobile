const getWindowInformation = `
  const shortcutIcon = window.document.querySelector('head > link[rel="shortcut icon"]');
  const icon = shortcutIcon || Array.from(window.document.querySelectorAll('head > link[rel="icon"]')).find((icon) => Boolean(icon.href));

  const siteName = document.querySelector('head > meta[property="og:site_name"]');
  const title = siteName || document.querySelector('head > meta[name="title"]');
  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
    {
      type: 'GET_TITLE_FOR_BOOKMARK',
      payload: {
        title: title ? title.content : document.title,
        url: location.href,
        icon: icon && icon.href
      }
    }
  ))
`;

export const SPA_urlChangeListener = `(function () {
  var __mmHistory = window.history;
  var __mmPushState = __mmHistory.pushState;
  var __mmReplaceState = __mmHistory.replaceState;
  function __mm__updateUrl(){
    const siteName = document.querySelector('head > meta[property="og:site_name"]');
    const title = siteName || document.querySelector('head > meta[name="title"]') || document.title;
    const height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);

    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
      {
        type: 'NAV_CHANGE',
        payload: {
          url: location.href,
          title: title,
        }
      }
    ));

    setTimeout(() => {
      const height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
      {
        type: 'GET_HEIGHT',
        payload: {
          height: height
        }
      }))
    }, 500);
  }

  __mmHistory.pushState = function(state) {
    setTimeout(function () {
      __mm__updateUrl();
    }, 100);
    return __mmPushState.apply(history, arguments);
  };

  __mmHistory.replaceState = function(state) {
    setTimeout(function () {
      __mm__updateUrl();
    }, 100);
    return __mmReplaceState.apply(history, arguments);
  };

  window.onpopstate = function(event) {
    __mm__updateUrl();
  };
  })();
`;

export const JS_WINDOW_INFORMATION = `
  (function () {
    ${getWindowInformation}
  })();
`;

export const JS_DESELECT_TEXT = `if (window.getSelection) {window.getSelection().removeAllRanges();}
else if (document.selection) {document.selection.empty();}`;

export const JS_POST_MESSAGE_TO_PROVIDER = (
  message: object,
  origin: string
) => `(function () {
  try {
    // Add special debug logging for eth_requestAccounts responses
    const msg = ${JSON.stringify(message)};
    if (msg && msg.data && (msg.data.method === 'eth_requestAccounts' || 
        (msg.data.id !== undefined && (msg.data.result !== undefined || msg.data.error !== undefined)))) {
      console.log('[METAMASK-DEBUG] 🔴🔴🔴 Injecting message to window:', JSON.stringify(msg));
    }
    
    // Try both formats for critical messages
    if (msg && !msg.name && !msg.target && msg.id !== undefined && 
        (msg.result !== undefined || msg.error !== undefined)) {
      // This appears to be a raw JSON-RPC response, wrap it properly
      console.log('[METAMASK-DEBUG] 🔴🔴🔴 Wrapping raw response before posting');
      window.postMessage({
        name: 'metamask-provider',
        data: msg
      }, '${origin}');
    } else {
      // Standard message posting
      window.postMessage(msg, '${origin}');
    }
  } catch (e) {
    console.error('[METAMASK-DEBUG] 🔴🔴🔴 Error in postMessage:', e);
  }
})()`;

export const JS_IFRAME_POST_MESSAGE_TO_PROVIDER = (
  _message: object,
  _origin: string
) =>
  `(function () {})()`;
/** Disable sending messages to iframes for now
 *
`(function () {
  const iframes = document.getElementsByTagName('iframe');
  for (let frame of iframes){

      try {
        frame.contentWindow.postMessage(${JSON.stringify(_message)}, '${_origin}');
      } catch (e) {
        //Nothing to do
      }

  }
})()`;
 */
