/**
 * crm.js — Sistema CRM & Agenda del Broker PRO
 * Arquitectura SPA resiliente con delegación de eventos y consultas dinámicas al DOM
 */

(function() {
  let calCurrentDate = new Date();
  let filterDate = null; // YYYY-MM-DD
  let currentEditIndex = -1;

  function getLeads() {
    if (window._userCRMLeads && Array.isArray(window._userCRMLeads) && window._userCRMLeads.length > 0) {
      return window._userCRMLeads;
    }
    try {
      const data = localStorage.getItem('geohogar_crm_leads');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error al leer el CRM local:", e);
      return [];
    }
  }

  function saveLeads(leads) {
    localStorage.setItem('geohogar_crm_leads', JSON.stringify(leads));
  }

  function updateKPIs(leads) {
    const kpiTotal = document.getElementById('crm-kpi-total');
    const kpiPending = document.getElementById('crm-kpi-pending');
    const kpiClosed = document.getElementById('crm-kpi-closed');
    if (!kpiTotal) return;
    
    let pending = 0;
    let closed = 0;
    leads.forEach(l => {
      if (l.status === 'Visita Agendada') pending++;
      if (l.status === 'Cerrado') closed++;
    });
    
    kpiTotal.innerText = leads.length;
    if (kpiPending) kpiPending.innerText = pending;
    if (kpiClosed) kpiClosed.innerText = closed;
  }

  function renderCalendar() {
    const calDaysContainer = document.getElementById('crm-cal-days');
    const calMonthText = document.getElementById('crm-cal-month');
    if (!calDaysContainer) return;
    
    calDaysContainer.innerHTML = '';
    const leads = getLeads();
    
    const year = calCurrentDate.getFullYear();
    const month = calCurrentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    if (calMonthText) { const mName = calCurrentDate.toLocaleDateString(window.currentLang || 'es', { month: 'long', year: 'numeric' }); calMonthText.innerText = mName.charAt(0).toUpperCase() + mName.slice(1); }
    
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Días del mes anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const cell = document.createElement('div');
      cell.className = 'crm-cal-day other-month';
      cell.innerText = d;
      calDaysContainer.appendChild(cell);
    }
    
    const eventsSet = new Set(leads.map(l => l.date).filter(Boolean));
    const today = new Date();
    
    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const cell = document.createElement('div');
      cell.className = 'crm-cal-day';
      cell.innerText = i;
      
      const cellDateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === i) {
        cell.classList.add('today');
      }
      if (eventsSet.has(cellDateStr)) {
        cell.classList.add('has-event');
      }
      if (filterDate === cellDateStr) {
        cell.classList.add('selected');
      }
      
      cell.addEventListener('click', () => {
        filterDate = (filterDate === cellDateStr) ? null : cellDateStr;
        renderCalendar();
        renderCRMTable();
      });
      
      calDaysContainer.appendChild(cell);
    }
    
    // Días del próximo mes
    const totalCells = calDaysContainer.children.length;
    const remainingCells = 42 - totalCells;
    if (remainingCells < 14) {
      for (let i = 1; i <= remainingCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'crm-cal-day other-month';
        cell.innerText = i;
        calDaysContainer.appendChild(cell);
      }
    }
  }

  function renderCRMTable() {
    const crmTableBody = document.getElementById('crm-table-body');
    const crmEmptyState = document.getElementById('crm-empty-state');
    const btnShowAll = document.getElementById('btn-show-all-crm');
    const filterLabel = document.getElementById('crm-date-filter-label');
    const filterDateText = document.getElementById('crm-filter-date-text');
    const crmTableEl = document.querySelector('.crm-table');
    
    if (!crmTableBody) return;
    
    let allLeads = getLeads();
    updateKPIs(allLeads);
    
    let leadsToShow = allLeads;
    if (filterDate) {
      leadsToShow = allLeads.filter(l => l.date === filterDate);
      if (btnShowAll) btnShowAll.style.display = 'block';
      if (filterLabel) {
        filterLabel.style.display = 'block';
        const [y, m, d] = filterDate.split('-');
        if (filterDateText) filterDateText.innerText = `${d}/${m}/${y}`;
      }
    } else {
      if (btnShowAll) btnShowAll.style.display = 'none';
      if (filterLabel) filterLabel.style.display = 'none';
    }
    
    crmTableBody.innerHTML = '';
    
    if (leadsToShow.length === 0) {
      if (crmTableEl) crmTableEl.style.display = 'none';
      if (crmEmptyState) {
        crmEmptyState.style.display = 'block';
        const emptyTitle = document.getElementById('crm-empty-title');
        const emptyDesc = document.getElementById('crm-empty-desc');
        if (filterDate) {
          if (emptyTitle) emptyTitle.innerText = 'Sin citas en esta fecha';
          if (emptyDesc) emptyDesc.innerText = 'Prueba seleccionando otro día en el calendario.';
        } else {
          if (emptyTitle) emptyTitle.innerText = 'No tienes clientes en tu agenda';
          if (emptyDesc) emptyDesc.innerText = 'Haz clic en "Añadir Cliente" para registrar tu primer lead.';
        }
      }
      return;
    }
    
    if (crmTableEl) crmTableEl.style.display = 'table';
    if (crmEmptyState) crmEmptyState.style.display = 'none';

    leadsToShow.forEach((lead) => {
      const originalIndex = allLeads.findIndex(l => l === lead);
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border)';
      
      let statusColor = 'var(--text2)';
      let statusBg = 'var(--surface2)';
      
      switch(lead.status) {
        case 'Lead Nuevo': statusColor = '#3b82f6'; statusBg = 'rgba(59, 130, 246, 0.15)'; break;
        case 'Contactado': statusColor = '#f59e0b'; statusBg = 'rgba(245, 158, 11, 0.15)'; break;
        case 'Visita Agendada': statusColor = '#8b5cf6'; statusBg = 'rgba(139, 92, 246, 0.15)'; break;
        case 'Cerrado': statusColor = '#10b981'; statusBg = 'rgba(16, 185, 129, 0.15)'; break;
        case 'Descartado': statusColor = '#ef4444'; statusBg = 'rgba(239, 68, 68, 0.15)'; break;
      }

      tr.innerHTML = `
        <td data-label="Cliente" style="padding:16px; font-weight:600; color:var(--text);">${lead.name}</td>
        <td data-label="Contacto" style="padding:16px; color:var(--text2);">${lead.contact || '-'}</td>
        <td data-label="Interés" style="padding:16px; color:var(--text2);">${lead.interest || '-'}</td>
        <td data-label="Estado" style="padding:16px;">
          <span style="display:inline-block; padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700; color:${statusColor}; background:${statusBg};">
            ${lead.status}
          </span>
        </td>
        <td data-label="Fecha" style="padding:16px; color:var(--text2);">${lead.date || '-'}</td>
        <td data-label="Notas" style="padding:16px; color:var(--text2); max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${lead.notes || ''}">${lead.notes || '-'}</td>
        <td data-label="Acciones" style="padding:16px; display:flex; gap:8px;">
          <button class="crm-edit-btn" data-index="${originalIndex}" style="background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:6px 10px; color:var(--text); cursor:pointer;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="crm-delete-btn" data-index="${originalIndex}" style="background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.2); border-radius:8px; padding:6px 10px; color:#ef4444; cursor:pointer;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </td>
      `;
      crmTableBody.appendChild(tr);
    });

    crmTableBody.querySelectorAll('.crm-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openCrmModal(parseInt(btn.getAttribute('data-index')));
      });
    });

    crmTableBody.querySelectorAll('.crm-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if(confirm('¿Seguro que deseas eliminar este cliente?')) {
          const index = parseInt(btn.getAttribute('data-index'));
          const leads = getLeads();
          const target = leads[index];
          leads.splice(index, 1);
          saveLeads(leads);
          if (target && target.id && window.deleteCRMLead) {
            try {
              await window.deleteCRMLead(target.id);
            } catch (err) {
              console.warn("Could not delete CRM lead from Firestore:", err);
            }
          }
          renderCRMTable();
          renderCalendar();
        }
      });
    });
  }

  function openCrmModal(index = -1) {
    const crmModalOverlay = document.getElementById('crm-modal-overlay');
    const crmLeadForm = document.getElementById('crm-lead-form');
    if (!crmModalOverlay) return;
    currentEditIndex = index;
    const leads = getLeads();
    
    if (index >= 0 && leads[index]) {
      const modalTitle = document.getElementById('crm-modal-title');
      if (modalTitle) modalTitle.innerText = 'Editar Cliente';
      const lead = leads[index];
      const nameEl = document.getElementById('crm-lead-name'); if (nameEl) nameEl.value = lead.name || '';
      const contactEl = document.getElementById('crm-lead-contact'); if (contactEl) contactEl.value = lead.contact || '';
      const interestEl = document.getElementById('crm-lead-interest'); if (interestEl) interestEl.value = lead.interest || '';
      const statusEl = document.getElementById('crm-lead-status'); if (statusEl) statusEl.value = lead.status || 'Lead Nuevo';
      const dateEl = document.getElementById('crm-lead-date'); if (dateEl) dateEl.value = lead.date || '';
      const notesEl = document.getElementById('crm-lead-notes'); if (notesEl) notesEl.value = lead.notes || '';
    } else {
      const modalTitle = document.getElementById('crm-modal-title');
      if (modalTitle) modalTitle.innerText = 'Añadir Cliente';
      if (crmLeadForm) crmLeadForm.reset();
      if (filterDate) {
        const dateEl = document.getElementById('crm-lead-date');
        if (dateEl) dateEl.value = filterDate;
      }
    }
    
    crmModalOverlay.classList.remove('hidden');
    setTimeout(() => crmModalOverlay.classList.add('active'), 10);
    setTimeout(() => {
      const nameEl = document.getElementById('crm-lead-name');
      if (nameEl) nameEl.focus();
    }, 100);
  }

  function closeCrmModal() {
    const crmModalOverlay = document.getElementById('crm-modal-overlay');
    if (crmModalOverlay) {
      crmModalOverlay.classList.remove('active');
      setTimeout(() => crmModalOverlay.classList.add('hidden'), 300);
    }
  }

  window.renderCRM = function() {
    renderCalendar();
    renderCRMTable();
  };

  // Delegación global de eventos para botones del CRM
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#crm-cal-prev')) {
      calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
      renderCalendar();
      return;
    }
    if (e.target.closest('#crm-cal-next')) {
      calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
      renderCalendar();
      return;
    }
    if (e.target.closest('#btn-show-all-crm')) {
      filterDate = null;
      renderCalendar();
      renderCRMTable();
      return;
    }
    if (e.target.closest('#btn-add-crm-lead')) {
      openCrmModal(-1);
      return;
    }
    if (e.target.closest('#crm-modal-close') || e.target === document.getElementById('crm-modal-overlay')) {
      closeCrmModal();
      return;
    }
    if (e.target.closest('#btn-crm-export')) {
      const leads = getLeads();
      if (leads.length === 0) {
        if (window.showToast) window.showToast('No hay clientes para exportar', 'error');
        return;
      }
      const headers = ['Cliente', 'Contacto', 'Interés', 'Estado', 'Fecha', 'Notas'];
      let csvContent = '\uFEFF' + headers.join(',') + '\n';
      leads.forEach(l => {
        const row = [
          `"${(l.name||'').replace(/"/g, '""')}"`,
          `"${(l.contact||'').replace(/"/g, '""')}"`,
          `"${(l.interest||'').replace(/"/g, '""')}"`,
          `"${(l.status||'').replace(/"/g, '""')}"`,
          `"${(l.date||'').replace(/"/g, '""')}"`,
          `"${(l.notes||'').replace(/"/g, '""')}"`
        ];
        csvContent += row.join(',') + '\n';
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GeoHogar_CRM_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      if (window.showToast) window.showToast('CRM exportado a CSV con éxito', 'success');
      return;
    }
    if (e.target.closest('#btn-crm-notify')) {
      if (!('Notification' in window)) {
        if (window.showToast) window.showToast('Tu navegador no soporta notificaciones', 'error');
        return;
      }
      if (Notification.permission === 'granted') {
        if (window.triggerAppNotification) window.triggerAppNotification('Notificaciones Activas', 'El sonido y las notificaciones funcionan perfectamente.');
      } else if (Notification.permission === 'denied') {
        if (window.showToast) window.showToast('Notificaciones bloqueadas. Habilítalas en tu navegador.', 'error');
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted' && window.triggerAppNotification) {
            window.triggerAppNotification('¡Permiso concedido!', 'Ahora recibirás recordatorios del CRM y alertas.');
          }
        });
      }
      return;
    }
  });

  document.body.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'crm-lead-form') {
      e.preventDefault();
      const leads = getLeads();
      const existingLead = currentEditIndex >= 0 ? leads[currentEditIndex] : {};

      const newLead = {
        ...existingLead,
        name: (document.getElementById('crm-lead-name')?.value || '').trim(),
        contact: (document.getElementById('crm-lead-contact')?.value || '').trim(),
        interest: (document.getElementById('crm-lead-interest')?.value || '').trim(),
        status: document.getElementById('crm-lead-status')?.value || 'Lead Nuevo',
        date: document.getElementById('crm-lead-date')?.value || '',
        notes: (document.getElementById('crm-lead-notes')?.value || '').trim()
      };
      
      if (currentEditIndex >= 0) {
        leads[currentEditIndex] = newLead;
      } else {
        leads.unshift(newLead);
      }
      
      saveLeads(leads);
      if (window.saveCRMLead) {
        try {
          await window.saveCRMLead(newLead);
        } catch (err) {
          console.warn("Could not save CRM lead to Firestore, stored locally:", err);
        }
      }

      renderCRMTable();
      renderCalendar();
      closeCrmModal();
      if (window.showToast) window.showToast('Cliente guardado exitosamente', 'success');
    }
  });
})();
