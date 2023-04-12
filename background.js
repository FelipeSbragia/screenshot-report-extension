chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.captureVisibleTab(async (screenshotUrl) => {
    await chrome.storage.local.set({ screenshot: screenshotUrl });
    const metadata = await getMetadata();
    await chrome.storage.local.set({ metadata });
    const url = chrome.runtime.getURL('popup.html');
    await chrome.windows.create({ url, type: 'popup', width: 700, height: 600 });
  });
});

async function getMetadata() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const { title, url } = tab;
 
