
// ===== GLOSSARY INFO ICON HANDLER =====
window.openGlossary = function(section) {
  const overlay = document.getElementById('glossary-modal-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('active'), 10);
    if (section === 'roi') {
      setTimeout(() => {
        document.querySelector('[data-i18n="glossary_roi_title"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (section === 'underpriced') {
      setTimeout(() => {
        document.querySelector('[data-i18n="glossary_low_value_title"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (section === 'radar') {
      setTimeout(() => {
        document.querySelector('[data-i18n="glossary_radar_title"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
};

// Delegate click on .glossary-info-icon elements (for dynamically created ones)
document.addEventListener('click', (e) => {
  const icon = e.target.closest('.glossary-info-icon');
  if (icon) {
    e.stopPropagation();
    const section = icon.dataset.glossary || 'roi';
    window.openGlossary(section);
  }
});

// ===== HELP TAB PANEL SWITCHER =====
window.switchHelpTab = function(tabName) {
  // Hide all panels
  document.querySelectorAll('.help-tab-panel').forEach(panel => {
    panel.style.display = 'none';
  });
  
  // Remove active class from buttons
  document.querySelectorAll('#help-tab-btn-glossary, #help-tab-btn-guide').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show active panel
  const activePanel = document.getElementById(`help-content-${tabName}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }
  
  // Add active class to clicked button
  const activeBtn = document.getElementById(`help-tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
};
