// Cloudflare Worker: Full App with History, Export, Charts, GitHub-ready

// Setup Chart.js in the dashboard UI
// Inject chart block per URL
// Leverage recent history data from STATUS_KV

// Export, manual check, auth logic, and status history already included

// Add HTML generator for dashboard with Chart.js embedded
async function handleDashboard(env) {
  const urls = await getMonitoredURLs(env.URL_KV);
  let html = `
<!DOCTYPE html>
<html class="dark:bg-gray-900 dark:text-white">
<head>
  <meta charset="UTF-8">
  <title>Status Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="p-6 max-w-6xl mx-auto">
  <div class="flex justify-between mb-6">
    <h1 class="text-3xl font-bold">Website Monitoring Dashboard</h1>
    <a href="/export" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Export CSV</a>
  </div>
`;

  for (const url of urls) {
    const raw = await env.STATUS_KV.get(`history:${url}`);
    const data = raw ? JSON.parse(raw) : [];
    const labels = data.map(e => new Date(e.time).toLocaleString()).reverse();
    const upData = data.map(e => e.status ? 1 : 0).reverse();
    const safeData = data.map(e => e.safe ? 1 : 0).reverse();

    html += `
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">${url}</h2>
      <canvas id="chart-${encodeURIComponent(url)}" height="120"></canvas>
      <script>
        const ctx${encodeURIComponent(url)} = document.getElementById("chart-${encodeURIComponent(url)}").getContext("2d");
        new Chart(ctx${encodeURIComponent(url)}, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [
              {
                label: 'Up',
                data: ${JSON.stringify(upData)},
                borderColor: 'green',
                fill: false
              },
              {
                label: 'Safe',
                data: ${JSON.stringify(safeData)},
                borderColor: 'blue',
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  callback: v => v === 1 ? 'Yes' : 'No'
                }
              }
            }
          }
        });
      </script>
    </div>`;
  }

  html += `</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
