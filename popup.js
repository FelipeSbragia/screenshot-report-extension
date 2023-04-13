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
    creationDate: null,
    modificationDate: null,
    author: null,
    keywords: null,
    description: null,
    fileSize: null,
    fileType: null,
  };

	if (chrome.scripting && chrome.scripting.executeScript) {
		const { metaTags = [] } = await chrome.scripting.executeScript({
		  target: { tabId: tab.id },
		  func: () => [...document.getElementsByTagName('meta')],
		});

		metadata.metaTags = metaTags.map(({ attributes }) =>
		  [...attributes].reduce((prev, { name, value }) => ({ ...prev, [name]: value }), {})
		);

		const { headers = [] } = await chrome.scripting.executeScript({
		  target: { tabId: tab.id },
		  func: () => [...document.querySelectorAll('head meta')],
		});

console.log('metaTags:');
console.log(metadata.metaTags);
console.log('Headers:');
console.log(headers);

metaTags.forEach((tag) => {
  const name = tag.getAttribute('name') || tag.getAttribute('property');
  const value = tag.getAttribute('content');
  metadata[name] = value;
});

console.log(metadata.description); // Exemplo de Headers em uma página HTML
console.log(metadata.keywords); // HTML, Headers, Exemplo

		if (headers) {
			headers.forEach((header) => {
				const name = header.getAttribute('name')?.toLowerCase();
				if (metadata.hasOwnProperty(name)) {
					metadata[name] = header.getAttribute('content');
				}
			});
		}
	} else {
		console.log('API de script do Chrome não está disponível');
	}

	return metadata;
}

// Exibe os metadados em um relatório
function exibeRelatorio(metadata) {
  const container = document.getElementById('metadata');
  container.innerHTML = `
    <div class="metadata-table">
      <h2>Metadados da página:</h2>
      <table>
        <tr>
          <td>Título:</td>
          <td>${metadata.title || '-'}</td>
        </tr>
        <tr>
          <td>URL:</td>
          <td>${metadata.url || '-'}</td>
        </tr>
        <tr>
          <td colspan="2"><h3>Meta Tags:</h3></td>
        </tr>
        ${metadata.metaTags
          .map(
            (meta, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#fff' : '#f1f1f1'};">
                <td>${meta.name || meta.property || '-'}</td>
                <td>${meta.content || '-'}</td>
              </tr>
            `
          )
          .join('')}
        <tr>
          <td>Data de criação ou modificação da página:</td>
          <td>${metadata.lastModified || '-'}</td>
        </tr>
        <tr>
          <td>Autor ou criador da página:</td>
          <td>${metadata.author || '-'}</td>
        </tr>
        <tr>
          <td>Palavras-chave da página:</td>
          <td>${metadata.keywords || '-'}</td>
        </tr>
        <tr>
          <td>Descrição da página:</td>
          <td>${metadata.description || '-'}</td>
        </tr>
        <tr>
          <td>Tamanho do arquivo da página:</td>
          <td>${metadata.fileSize ? (metadata.fileSize / 1024).toFixed(2) + ' KB' : '-'}</td>
        </tr>
        <tr>
          <td>Tipo de arquivo da página:</td>
          <td>${metadata.fileType || '-'}</td>
        </tr>
      </table>
    </div>
  `;
}

document.getElementById('capturar-tela').addEventListener('click', capturaTela);
