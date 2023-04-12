chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { capturar: true });
  });
});

chrome.runtime.onMessage.addListener((mensagem, sender) => {
  if (sender.tab && mensagem.screenshot) {
    const img = document.createElement("img");
    img.src = mensagem.screenshot;
    document.body.appendChild(img);
  }
});
