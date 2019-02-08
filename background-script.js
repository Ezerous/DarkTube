function rewriteCookieHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "cookie") {
      var regex = /f6=(\d+)/;
      header.value = header.value.replace(regex, "f6=400");
    }
  }
  return {requestHeaders: e.requestHeaders};
}

browser.webRequest.onBeforeSendHeaders.addListener(rewriteCookieHeader,
                                          {urls: ["*://*.youtube.com/*"]},
                                          ["blocking", "requestHeaders"]);
