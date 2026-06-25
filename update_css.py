with open(r'css/style.css', 'r', encoding='utf-8') as f:
    existing = f.read()

extra_css = """
/* --- Glossary Info Icon --- */
.glossary-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-gradient, linear-gradient(135deg, #ff2a5f, #ff6b6b));
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  cursor: pointer;
  margin-left: 5px;
  vertical-align: middle;
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(255,42,95,0.3);
}
.glossary-info-icon:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(255,42,95,0.5);
}
.stat-label {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* --- Heatmap Tooltip --- */
.heatmap-tooltip {
  background: rgba(15, 23, 42, 0.9) !important;
  border: none !important;
  color: #f8fafc !important;
  font-family: 'Outfit', sans-serif !important;
  font-weight: 700 !important;
  font-size: 0.8rem !important;
  border-radius: 8px !important;
  padding: 6px 10px !important;
  backdrop-filter: blur(8px);
}
.heatmap-tooltip::before {
  display: none;
}

/* --- Legend Dot --- */
.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

/* Real-time indicator for analytics */
.analytics-live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 800;
  color: #10b981;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.analytics-live-indicator::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
}
"""

# Only add if not already present
if '.glossary-info-icon' not in existing:
    with open(r'css/style.css', 'a', encoding='utf-8') as f:
        f.write(extra_css)
    print('CSS added')
else:
    print('CSS already present')
