chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete') return false;
    if (tab.url.indexOf('http://op1.win007.com/oddslist/') > -1) {
        chrome.tabs.executeScript(null, {file: "content_script.js"});
    }
});
