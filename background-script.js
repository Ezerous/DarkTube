let storedCookieValue;

browser.cookies.onChanged.addListener(function(changeInfo) {
  if(changeInfo.cookie.name == "PREF" && changeInfo.cookie.value != storedCookieValue)
    setCookie();
});

// For incognito mode
browser.webRequest.onBeforeSendHeaders.addListener(setCookieHeaderIfMissing,
                                          {urls: ["*://*.youtube.com/*"]},
                                          ["blocking", "requestHeaders"]);

function setCookie() {
  browser.cookies.getAll({name:"PREF", domain: ".youtube.com"}).then(
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
  value = value.replace(/&?f6=\d+/, "");
  if(!value)
    return "f6=400";
  return value + "&f6=400";
}

// Adds cookie in header if it doesn't exist (for incognito mode)
function setCookieHeaderIfMissing(e) {
  let headers = e.requestHeaders;
  const index = headers.findIndex((header) => (header.name.toLowerCase() === "cookie"));

  if(index>=0)
   headers[index]={name: "Cookie", value: patchValue(headers[index].value)};
  else
    headers.push({name: "Cookie", value: "PREF=f6=400;"});
  return {requestHeaders: headers};
}

setCookie();  // Run once when add-on starts
