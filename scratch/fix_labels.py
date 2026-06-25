import re

with open(r'c:\Users\jordy\Desktop\app hipo\js\ui.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix Chart 1 options
chart1_old = """          scales: { 
            x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: '600' }, color: '#64748b' } },
            y: { 
              beginAtZero: false, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, 
              ticks: { padding: 10, font: { family: 'Inter', weight: '600' }, color: '#64748b', callback: v => v + 'M' } 
            } 
          }"""

chart1_new = """          scales: { 
            x: { 
              grid: { display: false, drawTicks: true }, 
              ticks: { font: { family: 'Inter', weight: '600', size: 11 }, color: '#64748b', maxRotation: 0, autoSkip: true } 
            },
            y: { 
              beginAtZero: false, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, 
              ticks: { padding: 10, font: { family: 'Inter', weight: '600' }, color: '#64748b', callback: v => v + 'M' } 
            } 
          }"""
js = js.replace(chart1_old, chart1_new)

# Fix Chart 2 options
chart2_old = """        options: {
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
              callbacks: { label: ctx => ' ' + ctx.parsed.y + '%' } 
            }
          },
          scales: { 
            x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: '600' }, color: '#64748b' } },
            y: { 
              beginAtZero: true, 
              max: 10, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false, borderDash: [5, 5] }, 
              ticks: { padding: 10, font: { family: 'Inter', weight: '600' }, color: '#64748b', callback: v => v + '%' } 
            } 
          }
        }"""

chart2_new = """        options: {
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
              callbacks: { label: ctx => ' ' + ctx.parsed.x + '%' } 
            }
          },
          scales: { 
            x: { 
              beginAtZero: true, 
              max: 10, 
              grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false, borderDash: [5, 5] }, 
              ticks: { padding: 5, font: { family: 'Inter', weight: '600' }, color: '#64748b', callback: v => v + '%' } 
            },
            y: { 
              grid: { display: false, drawTicks: true }, 
              ticks: { font: { family: 'Inter', weight: '600', size: 11 }, color: '#64748b' } 
            } 
          }
        }"""
js = js.replace(chart2_old, chart2_new)

with open(r'c:\Users\jordy\Desktop\app hipo\js\ui.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("ui.js fixed!")
