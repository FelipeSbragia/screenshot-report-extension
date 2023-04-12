console.log('Popup foi aberto!'); // Adicionando um console.log() para verificar se o arquivo está sendo executado

function getReports() {
  chrome.storage.local.get('reports', function(data) {
    var reports = data.reports || [];
    var reportList = document.getElementById('report-list');
    reportList.innerHTML = '';
    reports.forEach(function(report) {
      var tr = document.createElement('tr');
      tr.addEventListener('click', function() {
        chrome.downloads.show(report.downloadId);
      });
      var tdTimestamp = document.createElement('td');
      tdTimestamp.innerText = report.timestamp;
      tr.appendChild(tdTimestamp);
      var tdTitle = document.createElement('td');
      tdTitle.innerText = report.title;
      tr.appendChild(tdTitle);
      var tdUrl = document.createElement('td');
      tdUrl.innerText = report.url;
      tr.appendChild(tdUrl);
      var tdScreenshot = document.createElement('td');
      var imgScreenshot = document.createElement('img');
      imgScreenshot.src = report.screenshotUrl;
      tdScreenshot.appendChild(imgScreenshot);
      tr.appendChild(tdScreenshot);
      var tdLink = document.createElement('td');
      var aLink = document.createElement('a');
      aLink.href = report.filename;
      aLink.innerText = report.filename;
      tdLink.appendChild(aLink);
      tr.appendChild(tdLink);
      reportList.appendChild(tr);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getReports();
  chrome.storage.onChanged.addListener(getReports);
});

document.getElementById("capture").addEventListener("click", async () => {
  const dataUrl = await captureScreen();
  saveScreenshot(dataUrl);
  generateReport();
});

async function captureScreen() {
  const tab = await getCurrentTab();
  const dataUrl = await html2canvas(tab);
  return dataUrl;
}

function saveScreenshot(dataUrl) {
  chrome.downloads.download({
    url: dataUrl,
    filename: "screenshot.png"
  });
}

function generateReport() {
  const report = {
    url: window.location.href,
    title: document.title,
    date: new Date().toLocaleString()
  };
  chrome.runtime.sendMessage({ action: "generateReport", report });
}