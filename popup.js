document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById('capture');

  captureButton.addEventListener('click', async () => {
    const dataUrl = await captureScreen();
    saveScreenshot(dataUrl);
    generateReport();
  });

  function captureScreen() {
    return html2canvas(document.documentElement);
  }

  function saveScreenshot(dataUrl) {
    chrome.downloads.download({
      url: dataUrl,
      filename: 'screenshot.png',
    });
  }

  function generateReport() {
    const report = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toLocaleString(),
    };

    chrome.storage.local.get('reports', function (data) {
      const reports = data.reports || [];
      reports.unshift(report);
      chrome.storage.local.set({ reports });
    });
  }

  function updateReportList() {
    chrome.storage.local.get('reports', function (data) {
      const reports = data.reports || [];

      const reportList = document.getElementById('report-list');
      reportList.innerHTML = '';

      for (const report of reports) {
        const tr = document.createElement('tr');
        tr.addEventListener('click', function () {
          chrome.downloads.show(report.downloadId);
        });

        const tdTimestamp = document.createElement('td');
        tdTimestamp.innerText = report.timestamp;
        tr.appendChild(tdTimestamp);

        const tdTitle = document.createElement('td');
        tdTitle.innerText = report.title;
        tr.appendChild(tdTitle);

        const tdUrl = document.createElement('td');
        tdUrl.innerText = report.url;
        tr.appendChild(tdUrl);

        const tdScreenshot = document.createElement('td');
        const imgScreenshot = document.createElement('img');
        imgScreenshot.src = report.screenshotUrl;
        tdScreenshot.appendChild(imgScreenshot);
        tr.appendChild(tdScreenshot);

        const tdLink = document.createElement('td');
        const aLink = document.createElement('a');
        aLink.href = report.filename;
        aLink.innerText = report.filename;
        tdLink.appendChild(aLink);
        tr.appendChild(tdLink);

        reportList.appendChild(tr);
      }
    });
  }

  updateReportList();
  chrome.storage.onChanged.addListener(updateReportList);
});
