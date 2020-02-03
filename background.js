let storedCookieValue;

browser.cookies.onChanged.addListener(function(changeInfo) {
  if(changeInfo.cookie.name == "PREF" && changeInfo.cookie.value != storedCookieValue)
    setCookie();
});

function setCookie() {
  browser.cookies.getAllCookieStores().then(
    (cookieStores) => {
      for (let store of cookieStores){
        browser.cookies.getAll({name:"PREF", domain: ".youtube.com"}).then(
          (cookies) => {
            if(cookies[0])  // Check if cookie exists
              storedCookieValue = patchCookieValue(cookies[0].value);
            else
              storedCookieValue = "f6=400";
            browser.cookies.set({name: "PREF", url: "http://.youtube.com/", value: storedCookieValue, storeId: store.id});
          }
        );
      }
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

setCookie();  // Run once when add-on starts
