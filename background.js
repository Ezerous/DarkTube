let storedCookieValue;

browser.cookies.onChanged.addListener(function(changeInfo) {
  if(changeInfo.cookie.name == "PREF" && changeInfo.cookie.value != storedCookieValue)
    setCookie();
});

// For incognito mode
browser.webRequest.onBeforeSendHeaders.addListener(setCookieHeader,
                                          {urls: ["*://*.youtube.com/*"]},
                                          ["blocking", "requestHeaders"]);

function setCookie() {
  browser.cookies.getAll({name:"PREF", domain: ".youtube.com"}).then(
    (cookies) => {
      if(cookies[0])  // Check if cookie exists
        storedCookieValue = patchCookieValue(cookies[0].value);
      else
        storedCookieValue = "f6=400";
      browser.cookies.getAllCookieStores().then(
        (cookieStores) => {
          for (let store of cookieStores)
            browser.cookies.set({name: "PREF", url: "http://.youtube.com/", value: storedCookieValue, storeId: store.id});
        }
      );
    }
  );
}

// Patches cookie value for dark theme
function patchCookieValue(value) {
  value = value.replace(/&?f6=\d+/, "");
  if(!value)
    return "f6=400";
  if(value.startsWith('&'))
    value = value.substr(1);
  return value + "&f6=400";
}

// Patches cookie value for dark theme
function patchCookieHeaderValue(value) {
  if(!value)
    return 'PREF=f6=400';
  if(!value.includes('PREF=')){
    return value +'; PREF=f6=400';
  }
  if(value.includes("f6=400"))
    return value;
  //Remove any f6
  value = value.replace(/(.*PREF=)f6=\d+&?(.*)/, "$1$2");
  value = value.replace(/(.*PREF=.*)&f6=\d+(.*)/, "$1$2");
  //Add patched f6
  value = value.replace(/(.*PREF=)([a-zA-Z].*)/, "$1f6=400&$2");
  value = value.replace(/(.*PREF=)([^a-zA-Z].*)/, "$1f6=400$2");
  return value;
}

// Adds cookie in header if it doesn't exist (for incognito mode)
function setCookieHeader(e) {
  let headers = e.requestHeaders;
  const index = headers.findIndex((header) => (header.name.toLowerCase() === "cookie"));

  if(index>=0)
    headers[index]={name: "Cookie", value: patchCookieHeaderValue(headers[index].value)};
  else
    headers.push({name: "Cookie", value: "PREF=f6=400"});

  return {requestHeaders: headers};
}

setCookie();  // Run once when add-on starts
