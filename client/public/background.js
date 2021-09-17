/* global chrome */

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    console.log(`URL change to ${changeInfo.url}`);
    const { hostname, pathname, searchParams } = new URL(changeInfo.url);
    if (hostname === "www.youtube.com" && pathname === "/watch" && searchParams.get("v")) {
      console.log("valide ID", searchParams.get("v"));
      chrome.tabs.sendMessage(tabId, {
        action: "info",
        url: changeInfo.url,
      });
    }
  }
});
