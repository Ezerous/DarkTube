var storedCookieValue;

browser.cookies.onChanged.addListener(function(changeInfo) {
  if(changeInfo.cookie.name === "PREF" && changeInfo.cookie.value !== storedCookieValue)
    setCookie();
});

function setCookie() {
  var cookies = browser.cookies.getAll({name:"PREF", domain: ".youtube.com"}).then(
    (cookies) => {
      if(cookies[0])
        storedCookieValue = patchValue(cookies[0].value);
      else
        storedCookieValue = "f6=400";

      browser.cookies.set({name: "PREF", url: "http://.youtube.com/", value: storedCookieValue});
    }
  );


}

function patchValue(value){
  var regex = /f6=(\d+)/;
  value = value.replace(regex, "");
  return value + "&f6=400"
}

setCookie();
