browser.cookies.onChanged.addListener(function(changeInfo) {
  if(changeInfo.cookie.name == "PREF")
    setCookie(changeInfo.cookie.storeId);
});

function setCookie(storeId) {
  browser.cookies.getAll({name:"PREF", domain:".youtube.com", storeId:storeId}).then(
    (cookies) => {
      if(cookies[0])  // Check if cookie exists
        patchedCookieValue = patchCookieValue(cookies[0].value);
      else
        patchedCookieValue = "f6=400";
      browser.cookies.set({name:"PREF", url: "http://.youtube.com/", value:patchedCookieValue, storeId:storeId});
    }
  );
}

// Patches cookie value for dark theme (f6) and disables autoplay if it is not set by the user (f5)
function patchCookieValue(value) {
  value = value.replace(/&?f6=\d+/, "");
  if(!value)
    value = "f6=400&f5=30000";
  else {
    if(value.startsWith('&'))
      value = value.substr(1);
    value = value + "&f6=400";
    if(!value.includes("f5"))  //User has made his own choice about autoplay
      value = value + "&f5=30000";
  }
  return value;
}

// Run once when add-on starts
browser.cookies.getAllCookieStores().then(
  (cookieStores) => {
    for (let store of cookieStores)
      setCookie(store.id);
  }
);
