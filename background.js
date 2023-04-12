chrome.runtime.onInstalled.addListener(function() {
  // Configura o menu de contexto
  chrome.contextMenus.create({
    id: 'capturar-tela',
    title: 'Capturar Tela',
    contexts: ['all']
  });

  // Configura o atalho de teclado
  chrome.commands.onCommand.addListener(function(command) {
    if (command === 'capturar-tela') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {acao: 'capturar_tela'});
      });
    }
  });
});

// Recebe a mensagem do content script
chrome.runtime.onMessage.addListener(function(mensagem, sender, sendResponse) {
  if (mensagem.acao === 'capturar_tela') {
    chrome.tabs.captureVisibleTab(function(screenshotUrl) {
      // Armazena o screenshot na memória local do Google Chrome
      chrome.storage.local.set({screenshotUrl: screenshotUrl});

      // Envia a mensagem para o content script exibir a prévia do screenshot
      chrome.tabs.sendMessage(sender.tab.id, {acao: 'exibir_preview', screenshotUrl: screenshotUrl});

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
