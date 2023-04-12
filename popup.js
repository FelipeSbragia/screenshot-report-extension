// Captura a tela ao clicar no botão e armazena na memória local
async function capturaTela() {
  chrome.tabs.captureVisibleTab(async (screenshotUrl) => {
    await chrome.storage.local.set({ screenshot: screenshotUrl });
    const metadata = await getMetadata();
    await chrome.storage.local.set({ metadata });
    exibeRelatorio(metadata);
  });
}

// Obtém os metadados da página
async function getMetadata() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const { title, url } = tab;
  const metadata = {
    title,
    url,
    metaTags: [],
  };

  const metaTags = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => [...document.getElementsByTagName('meta')],
  });

  metadata.metaTags = metaTags.result.map(({ attributes }) =>
    [...attributes].reduce((prev, curr) => ({ ...prev, [curr.name]: curr.value }), {})
  );

  return metadata;
}

// Exibe os metadados em um relatório
function exibeRelatorio(metadata) {
  const container = document.getElementById('metadata');
  container.innerHTML = `
    <h2>Metadados da página:</h2>
    <div><strong>Título:</strong> ${metadata.title}</div>
    <div><strong>URL:</strong> ${metadata.url}</div>
    <h3>Meta Tags:</h3>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Conteúdo</th>
        </tr>
      </thead>
      <tbody>
        ${metadata.metaTags
          .map(
            (meta) => `
            <tr>
              <td>${meta.name || meta.property || '-'}</td>
              <td>${meta.content || '-'}</td>
            </tr>
          `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

document.getElementById('capturar-tela').addEventListener('click', capturaTela);
