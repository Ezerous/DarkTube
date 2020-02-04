browser.cookies.onChanged.addListener(function(changeInfo) {
  const cookie = changeInfo.cookie;
  if(cookie.name == "PREF"
    && ((!cookie.value.includes("f6=400") || (!cookie.value.includes("f5=")))
      || changeInfo.removed))
      setCookie(cookie.storeId);
});

function setCookie(storeId) {
  browser.cookies.getAll({name:"PREF", domain:".youtube.com", storeId:storeId}).then(
    (cookies) => {
      if(cookies[0])  // Check if cookie exists (just in case)
        patchedCookieValue = patchCookieValue(cookies[0].value);
      else
        patchedCookieValue = "f6=400";
      browser.cookies.set({name:"PREF", url: "https://.youtube.com/", value:patchedCookieValue, storeId:storeId});
    }
  );
}

// Patches cookie value for dark theme (f6) and autoplay (f5)
function patchCookieValue(value) {
  if(!value)
    value = "f6=400&f5=30000";
  else {
    value = value.replace(/f6=\d+/, "f6=400");
    if (!value.includes("f6"))
      value = value + "&f6=400";
    if(!value.includes("f5"))  // User hasn't made yet his own choice about autoplay
      value = value + "&f5=30000";  // Disable it
  }
  return value;
}

function setCookieToAllStores(){
  browser.cookies.getAllCookieStores().then(
    (cookieStores) => {
      for (let store of cookieStores)
        setCookie(store.id);
    }
  );
}

// Set cookies when a new window is created
browser.windows.onCreated.addListener(() => {
  setCookieToAllStores();
});

// Set cookies once when the extension starts
setCookieToAllStores();
