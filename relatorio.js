chrome.storage.local.get('screenshot', function(data) {
  if (data && data.screenshot) {
    // Exibe o screenshot na página
    document.getElementById('screenshot').src = data.screenshot;
  }
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0];
  var metadados = tab && tab.metaTags;

  // Exibe os metadados na página
  var metadadosDiv = document.getElementById('metadados');
  for (var propriedade in metadados) {
    var valor = metadados[propriedade];
    var paragrafo = document.createElement('p');
    paragrafo.innerHTML = propriedade + ': ' + valor;
    metadadosDiv.appendChild(paragrafo);
  }
});
