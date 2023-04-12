chrome.runtime.onMessage.addListener((mensagem, sender, sendResponse) => {
  if (mensagem.capturar) {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (imagem) => {
      sendResponse({ screenshot: imagem });
    });
    return true;
  }
});
