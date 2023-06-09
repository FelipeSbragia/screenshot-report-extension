// Adiciona um ouvinte de eventos para onClicked
chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.captureVisibleTab(null, { format: "png", quality: 100 }, function (image) {
    const date = new Date().toLocaleString();
    const filename = `Screenshot Report - ${date}.txt`;
    const metadata = {
      url: tab.url,
      title: tab.title,
      timestamp: date,
      screenshotUrl: screenshotUrl
    };
    const fileContent = JSON.stringify(metadata, null, 2);

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
  });
});

// Adiciona um ouvinte de eventos para onMessage
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
  if (message === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      const tabInfo = {
        url: tab.url,
        title: tab.title
      };
      sendResponse(tabInfo);
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "generateReport") {
    const report = request.report;
    const content = `URL: ${report.url}\nTitle: ${report.title}\nDate: ${report.date}`;
    chrome.downloads.download({
      url: "data:text/plain;charset=utf-8," + encodeURIComponent(content),
      filename: "report.txt"
    });
  }
});

