import re

HTML_PATH = r'c:\Users\jordy\Desktop\app hipo\index.html'
JS_PATH = r'c:\Users\jordy\Desktop\app hipo\js\ui.js'

with open(HTML_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

# Update grid layout for macro charts to be auto-fit
html = html.replace('class="macro-charts-row" style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;"', 
                    'class="macro-charts-row" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;"')

# Add the EMBI card after the ROI card
roi_card = """            <div class="macro-card">
              <div style="display:flex;align-items:center;margin-bottom:1rem;gap:8px;">
                <span style="width:8px;height:8px;border-radius:50%;background:#ff2a5f;display:inline-block;"></span>
                <h4 style="margin:0;font-size:1rem;color:var(--text);font-weight:700;">Comparativa ROI Regional</h4>
              </div>
              <div style="height:220px;position:relative;">
                <canvas id="macro-chart-roi"></canvas>
              </div>
            </div>"""

embi_card = """
            <div class="macro-card">
              <div style="display:flex;align-items:center;margin-bottom:1rem;gap:8px;">
                <span style="width:8px;height:8px;border-radius:50%;background:#3b82f6;display:inline-block;"></span>
                <h4 style="margin:0;font-size:1rem;color:var(--text);font-weight:700;">Riesgo País (EMBI)</h4>
              </div>
              <div style="height:220px;position:relative;">
                <canvas id="macro-chart-embi"></canvas>
              </div>
              <div style="margin-top:8px;font-size:0.75rem;color:var(--text2);text-align:center;">
                Fuente: JP Morgan. Menor es mejor.
              </div>
            </div>"""

html = html.replace(roi_card, roi_card + embi_card)

with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

# Now update js/ui.js
with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Add global var
js = js.replace('let macroRoiChartInstance = null;', 'let macroRoiChartInstance = null;\n  let macroEmbiChartInstance = null;')

# Add the EMBI chart logic right after the ROI chart logic
# The end of the ROI chart block is easily identifiable:
roi_chart_end = """          }
        }
      });
    }"""

embi_chart_js = """
    // Chart 3: EMBI / Riesgo País
    const ctxEmbi = document.getElementById('macro-chart-embi');
    if (ctxEmbi) {
      if (macroEmbiChartInstance) { macroEmbiChartInstance.destroy(); macroEmbiChartInstance = null; }
      macroEmbiChartInstance = new window.Chart(ctxEmbi, {
        type: 'bar',
        data: {
          labels: ['Uruguay', 'Chile', 'Paraguay', 'Brasil', 'Colombia', 'Argentina'],
          datasets: [{
            label: 'Riesgo País (puntos)',
            data: [90, 120, 150, 200, 300, 1200],
            backgroundColor: [
              'rgba(148, 163, 184, 0.3)',
              'rgba(148, 163, 184, 0.3)',
              'rgba(59, 130, 246, 0.85)', /* Highlight Paraguay in Blue */
              'rgba(148, 163, 184, 0.3)',
              'rgba(148, 163, 184, 0.3)',
              'rgba(244, 63, 94, 0.3)'
            ],
            borderColor: [
              'rgba(148, 163, 184, 0)',
              'rgba(148, 163, 184, 0)',
              '#3b82f6',
              'rgba(148, 163, 184, 0)',
              'rgba(148, 163, 184, 0)',
              'rgba(244, 63, 94, 0)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { size: 13, family: 'Inter' },
              bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
              padding: 12,
              cornerRadius: 12,
              callbacks: { label: ctx => ' ' + ctx.parsed.x + ' pts' } 
            }
          },
          scales: { 
            x: { 
              beginAtZero: true, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false, borderDash: [5, 5] }, 
              ticks: { padding: 5, font: { family: 'Inter', weight: '600' }, color: '#64748b' } 
            },
            y: { 
              grid: { display: false, drawTicks: true }, 
              ticks: { font: { family: 'Inter', weight: '600', size: 11 }, color: '#64748b' } 
            } 
          }
        }
      });
    }"""

# Insert EMBI chart code securely
js = js.replace(roi_chart_end, roi_chart_end + '\n' + embi_chart_js, 1) # Only replace the first occurrence (which is the ROI chart)

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write(js)

print("EMBI chart added successfully!")
