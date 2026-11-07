'use strict';

// The report stays in a PDF. Enable its links only when a real PDF is present.
async function discoverReport() {
  const view = document.getElementById('pdf-view');
  const download = document.getElementById('pdf-download');
  const status = document.getElementById('pdf-status');
  const badge = document.getElementById('report-badge');
  const url = new URL('lab02/prelab.pdf', document.baseURI);
  if (window.location.protocol === 'file:') {
    status.textContent = 'Coming soon.';
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
    if (response.status === 404) return;
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('application/pdf')) {
      status.textContent = 'Report unavailable.';
      return;
    }
    view.href = url.href;
    view.removeAttribute('aria-disabled');
    view.classList.remove('unavailable');
    download.href = url.href;
    download.hidden = false;
    badge.textContent = 'PRE-LAB';
    const bytes = Number(response.headers.get('content-length'));
    status.textContent = bytes > 0 ? `PDF · ${bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB'}` : 'PDF report';
  } catch {
    status.textContent = 'Could not load the report. Please refresh.';
  } finally {
    clearTimeout(timeout);
  }
}
discoverReport();
