var storedCookieValue;

browser.cookies.onChanged.addListener(function(changeInfo) {
  if(changeInfo.cookie.name == "PREF" && changeInfo.cookie.value != storedCookieValue)
    setCookie();
});

// For incognito mode
browser.webRequest.onBeforeSendHeaders.addListener(setCookieHeaderIfMissing,
                                          {urls: ["*://*.youtube.com/*"]},
                                          ["blocking", "requestHeaders"]);

function setCookie() {
  var cookies = browser.cookies.getAll({name:"PREF", domain: ".youtube.com"}).then(
    (cookies) => {

      if(cookies[0])  // Check if cookie exists
        storedCookieValue = patchValue(cookies[0].value);
      else
        storedCookieValue = "f6=400";

      browser.cookies.set({name: "PREF", url: "http://.youtube.com/", value: storedCookieValue});
    }
  );
}

// Patches cookie value for dark theme
function patchValue(value) {
  var regex = /f6=(\d+)/;
  value = value.replace(regex, "");
  return value + "&f6=400"
}

// Adds cookie in header if it doesn't exist (for incognito mode)
function setCookieHeaderIfMissing(e) {
  var found;
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "cookie"){
      found=true;
      break;
    }
  }
  if(!found)
    e.requestHeaders.push({name: "Cookie", value: "PREF=f6=400;"});
  return {requestHeaders: e.requestHeaders};
}

setCookie();  // Run once when add-on starts
