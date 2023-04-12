chrome.action.onClicked.addListener(function() {
  chrome.tabs.captureVisibleTab(function(screenshotUrl) {
    // Armazena o screenshot na memória local do Google Chrome
    chrome.storage.local.set({screenshotUrl: screenshotUrl});

    // Exibe uma notificação de sucesso
    chrome.notifications.create({
      type: 'basic',
      title: 'Captura de Tela',
      message: 'Screenshot capturado com sucesso!',
      iconUrl: 'icone.png'
    });
  });
});

chrome.runtime.onInstalled.addListener(function() {
  // Cria o menu de contexto para a captura de tela
  chrome.contextMenus.create({
    title: 'Capturar Tela',
    contexts: ['all'],
    onclick: function() {
      chrome.tabs.captureVisibleTab(function(screenshotUrl) {
        // Armazena o screenshot na memória local do Google Chrome
        chrome.storage.local.set({screenshotUrl: screenshotUrl});

        // Exibe uma notificação de sucesso
        chrome.notifications.create({
          type: 'basic',
          title: 'Captura de Tela',
          message: 'Screenshot capturado com sucesso!',
          iconUrl: 'icone.png'
        });
      });
    }
  });
});
