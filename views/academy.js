export function renderAcademyView() {
  return `
<section class="view academy-view-container" id="view-academy" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; height: 100dvh; z-index: 50000; background: var(--bg); display: none; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; touch-action: pan-y; margin: 0; padding: 0;">
        <style>
          #view-academy * { box-sizing: border-box; }
          
          /* Sticky Top Header */
          .academy-header {
            position: sticky;
            top: 0;
            height: 56px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 1000;
          }
          
          .academy-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .academy-header-icon {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #111;
            font-weight: 900;
            font-size: 0.72rem;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 10px rgba(212, 175, 55, 0.25);
          }
          
          .academy-header-title {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--text);
            letter-spacing: -0.3px;
          }
          
          .academy-close-btn {
            background: var(--surface2);
            border: 1px solid var(--border);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text2);
            transition: all 0.2s ease;
            flex-shrink: 0;
          }
          .academy-close-btn:hover {
            color: var(--text);
            background: var(--border);
          }

          /* Sticky Mobile Horizontal Pill Nav */
          .academy-mobile-pills {
            display: none;
            position: sticky;
            top: 56px;
            z-index: 999;
            gap: 8px;
            overflow-x: auto;
            padding: 10px 16px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .academy-mobile-pills::-webkit-scrollbar { display: none; }

          .academy-pill-btn {
            white-space: nowrap;
            padding: 7px 14px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            background: var(--surface2);
            color: var(--text2);
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }
          .academy-pill-btn.active {
            background: var(--text);
            color: var(--bg);
            border-color: var(--text);
          }

          /* Main Body Layout - MINIMAL BOTTOM PADDING */
          .academy-body-layout {
            display: flex;
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            padding: 24px 16px 36px 16px;
            gap: 28px;
          }

          /* Desktop Sidebar Sticky */
          .academy-desktop-sidebar {
            width: 250px;
            flex-shrink: 0;
            position: sticky;
            top: 76px;
            height: fit-content;
            background: var(--surface2);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 14px 10px;
          }

          .academy-tab-btn {
            width: 100%;
            text-align: left;
            padding: 10px 12px;
            background: transparent;
            border: none;
            border-radius: 10px;
            color: var(--text2);
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 3px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
          }
          .academy-tab-btn:hover {
            background: var(--surface);
            color: var(--text);
          }
          .academy-tab-btn.active {
            background: var(--surface);
            color: var(--text);
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border-left: 3px solid #10b981;
            font-weight: 700;
          }
          .academy-tab-btn[data-target^="academy-broker"].active {
            border-left-color: #D4AF37;
            color: #D4AF37;
            background: rgba(212, 175, 55, 0.08);
          }
          .academy-tab-btn[data-target^="academy-analytics"].active {
            border-left-color: #10b981;
            color: #10b981;
            background: rgba(16, 185, 129, 0.08);
          }

          /* Content Area */
          .academy-content-area {
            flex: 1;
            min-width: 0;
          }

          .academy-panel {
            display: none;
            animation: academyFadeIn 0.25s ease;
          }
          .academy-panel.active {
            display: block;
          }
          @keyframes academyFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Typography & Grid */
          .academy-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }
          .academy-tag.gold { background: rgba(212, 175, 55, 0.12); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.25); }
          .academy-tag.emerald { background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }

          .academy-h1 {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: clamp(1.35rem, 3.5vw, 2.1rem);
            font-weight: 900;
            line-height: 1.25;
            color: var(--text);
            margin: 0 0 12px 0;
            letter-spacing: -0.4px;
          }

          .academy-lead-text {
            color: var(--text2);
            font-size: clamp(0.88rem, 2vw, 0.98rem);
            line-height: 1.6;
            margin-bottom: 22px;
          }

          .academy-section-title {
            font-size: 1.02rem;
            font-weight: 800;
            color: var(--text);
            margin: 24px 0 12px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .academy-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          }

          .academy-step-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 22px;
          }

          .academy-step-item {
            background: var(--surface2);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }

          .academy-step-num {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: #D4AF37;
            color: #111;
            font-weight: 900;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .academy-step-num.emerald {
            background: #10b981;
            color: white;
          }

          .academy-step-content {
            flex: 1;
            font-size: 0.86rem;
            line-height: 1.5;
            color: var(--text2);
          }
          .academy-step-content strong {
            color: var(--text);
          }

          .academy-btn-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px 24px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 0.95rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            margin-top: 10px;
          }
          .academy-btn-action.gold {
            background: linear-gradient(135deg, #D4AF37 0%, #b89423 100%);
            color: #111;
            box-shadow: 0 6px 18px rgba(212, 175, 55, 0.2);
          }
          .academy-btn-action.emerald {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            box-shadow: 0 6px 18px rgba(16, 185, 129, 0.2);
          }

          .academy-source-box {
            background: var(--surface2);
            border: 1px solid var(--border);
            border-left: 4px solid #10b981;
            border-radius: 12px;
            padding: 14px;
            margin: 14px 0;
          }

          /* Mobile Layout (< 768px) */
          @media (max-width: 768px) {
            .academy-desktop-sidebar {
              display: none;
            }
            .academy-mobile-pills {
              display: flex;
            }
            .academy-body-layout {
              padding: 16px 12px 40px 12px;
            }
            .academy-grid {
              grid-template-columns: 1fr;
              gap: 18px;
            }
          }
        </style>

        <!-- Sticky Header with RELIABLE window.closeAcademy() handler -->
        <div class="academy-header">
          <div class="academy-header-left">
            <div class="academy-header-icon">PRO</div>
            <div class="academy-header-title">Centro de Aprendizaje</div>
          </div>
          <button class="academy-close-btn" onclick="window.closeAcademy();" aria-label="Cerrar Tutorial">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Sticky Mobile Horizontal Pills for 10 Modules -->
        <div class="academy-mobile-pills" id="academy-mobile-pills-bar">
          <button class="academy-pill-btn active" data-target="academy-broker-leads" onclick="switchAcademyTab('academy-broker-leads', this)">1. Leads en Vivo</button>
          <button class="academy-pill-btn" data-target="academy-broker-crm" onclick="switchAcademyTab('academy-broker-crm', this)">2. CRM & Agenda</button>
          <button class="academy-pill-btn" data-target="academy-broker-centro" onclick="switchAcademyTab('academy-broker-centro', this)">3. Centro</button>
          <button class="academy-pill-btn" data-target="academy-broker-alertas" onclick="switchAcademyTab('academy-broker-alertas', this)">4. Mis Alertas</button>
          <button class="academy-pill-btn" data-target="academy-broker-tasacion" onclick="switchAcademyTab('academy-broker-tasacion', this)">5. Tasación IA</button>
          <button class="academy-pill-btn" data-target="academy-broker-embudos" onclick="switchAcademyTab('academy-broker-embudos', this)">6. Embudos</button>
          <button class="academy-pill-btn" data-target="academy-analytics-global" onclick="switchAcademyTab('academy-analytics-global', this)">7. Vista Global</button>
          <button class="academy-pill-btn" data-target="academy-analytics-oficial" onclick="switchAcademyTab('academy-analytics-oficial', this)">8. Red Verificada</button>
          <button class="academy-pill-btn" data-target="academy-analytics-radar" onclick="switchAcademyTab('academy-analytics-radar', this)">9. Datos Externos</button>
          <button class="academy-pill-btn" data-target="academy-analytics-locales" onclick="switchAcademyTab('academy-analytics-locales', this)">10. Datos Locales</button>
        </div>

        <!-- Main Body Layout -->
        <div class="academy-body-layout">
          
          <!-- Desktop Sidebar Sticky for 10 Modules -->
          <div class="academy-desktop-sidebar">
            <div style="font-size: 0.72rem; font-weight: 800; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; margin: 4px 8px 8px;">Broker PRO</div>
            <button class="academy-tab-btn active" data-target="academy-broker-leads" onclick="switchAcademyTab('academy-broker-leads', this)">1. Leads en Vivo</button>
            <button class="academy-tab-btn" data-target="academy-broker-crm" onclick="switchAcademyTab('academy-broker-crm', this)">2. CRM & Agenda</button>
            <button class="academy-tab-btn" data-target="academy-broker-centro" onclick="switchAcademyTab('academy-broker-centro', this)">3. Centro</button>
            <button class="academy-tab-btn" data-target="academy-broker-alertas" onclick="switchAcademyTab('academy-broker-alertas', this)">4. Mis Alertas</button>
            <button class="academy-tab-btn" data-target="academy-broker-tasacion" onclick="switchAcademyTab('academy-broker-tasacion', this)">5. Tasación IA</button>
            <button class="academy-tab-btn" data-target="academy-broker-embudos" onclick="switchAcademyTab('academy-broker-embudos', this)">6. Embudos</button>

            <div style="font-size: 0.72rem; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin: 18px 8px 8px;">Análisis de Mercado</div>
            <button class="academy-tab-btn" data-target="academy-analytics-global" onclick="switchAcademyTab('academy-analytics-global', this)">7. Vista Global</button>
            <button class="academy-tab-btn" data-target="academy-analytics-oficial" onclick="switchAcademyTab('academy-analytics-oficial', this)">8. Red Verificada</button>
            <button class="academy-tab-btn" data-target="academy-analytics-radar" onclick="switchAcademyTab('academy-analytics-radar', this)">9. Datos Externos</button>
            <button class="academy-tab-btn" data-target="academy-analytics-locales" onclick="switchAcademyTab('academy-analytics-locales', this)">10. Datos Locales</button>
          </div>

          <!-- Content Area -->
          <div class="academy-content-area">

            <!-- MODULE 1: BROKER PRO -> LEADS EN VIVO -->
            <div class="academy-panel active" id="academy-broker-leads">
              <span class="academy-tag gold">Broker PRO &bull; Sección 1</span>
              <h1 class="academy-h1">Sección: <span style="color: #D4AF37;">Leads en Vivo</span></h1>
              <p class="academy-lead-text">Manual operativo completo de la bolsa de compradores en tiempo real. Aprende a conectarte con usuarios activos que buscan adquirir o alquilar inmuebles en tu zona.</p>

              <div class="academy-section-title">📌 ¿Cómo funciona la sección Leads en Vivo?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num">1</div>
                  <div class="academy-step-content">
                    <strong>Bolsa de Compradores Activos:</strong> Cada vez que un usuario realiza búsquedas, guarda propiedades o solicita tasaciones en la app, se genera una tarjeta de Lead en Vivo con su perfil de demanda.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">2</div>
                  <div class="academy-step-content">
                    <strong>Filtros por Rango de Presupuesto y Zona:</strong> Utiliza los selectores superiores para filtrar los compradores por presupuesto (ej. $80k - $150k USD), ubicación requerida y cantidad de dormitorios.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">3</div>
                  <div class="academy-step-content">
                    <strong>Porcentaje de Coincidencia (Match Score):</strong> El algoritmo calcula qué tan compatible es tu inventario captado contra la búsqueda exacta del comprador (ej. <em>95% de coincidencia</em>).
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">4</div>
                  <div class="academy-step-content">
                    <strong>Contacto Directo por la App:</strong> Haz clic en el botón <em>Contactar Comprador</em> para abrir el chat integrado directo de la plataforma GeoHogar e iniciar la conversación en vivo.
                  </div>
                </div>
              </div>

              <div class="academy-section-title">📊 Ejemplo de Tarjeta en Leads en Vivo</div>
              <div class="academy-card" style="border-left: 4px solid #D4AF37;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: 800; font-size: 0.9rem; color: var(--text);">Comprador Activo: Roberto M.</span>
                  <span style="font-size: 0.75rem; font-weight: 800; color: #10b981; background: rgba(16,185,129,0.1); padding: 2px 8px; border-radius: 6px;">95% Match</span>
                </div>
                <div style="font-size: 0.82rem; color: var(--text2); margin-bottom: 8px;">Busca: Casa 3 Dormitorios en Las Palmas</div>
                <div style="font-size: 0.85rem; color: var(--text); font-weight: 700;">Presupuesto Disponible: $150,000 USD</div>
              </div>

              <button class="academy-btn-action gold" onclick="document.getElementById('btn-activate-premium').click()">Desbloquear Leads en Vivo</button>
            </div>

            <!-- MODULE 2: BROKER PRO -> CRM Y AGENDA -->
            <div class="academy-panel" id="academy-broker-crm">
              <span class="academy-tag gold">Broker PRO &bull; Sección 2</span>
              <h1 class="academy-h1">Sección: <span style="color: #D4AF37;">CRM & Agenda</span></h1>
              <p class="academy-lead-text">Guía de gestión comercial. Administra tus contactos prospectos con control de estados de negociación, notas de ofertas y coordina tu calendario de visitas presenciales.</p>

              <div class="academy-section-title">📌 ¿Cómo operar el CRM y la Agenda?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num">1</div>
                  <div class="academy-step-content">
                    <strong>Control de Estados del Pipeline:</strong> Administra tus prospectos según su fase de venta: <em>Nuevos Leads &rarr; Contactados &rarr; Visita Agendada &rarr; En Negociación &rarr; Cerrado</em>.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">2</div>
                  <div class="academy-step-content">
                    <strong>Gestión de Visitas en Agenda:</strong> Agenda reuniones presenciales vinculando al cliente con la propiedad elegida. La agenda integrada sincroniza fechas y recordatorios de aviso previo.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">3</div>
                  <div class="academy-step-content">
                    <strong>Registro de Notas e Historial:</strong> Guarda fichas técnicas individuales con montos de contraoferta, observaciones de llamadas y estado de las reservas.
                  </div>
                </div>
              </div>

              <div class="academy-section-title">📊 Vista de Muestra del Panel CRM & Agenda</div>
              <div class="academy-card" style="display: flex; flex-direction: column; gap: 8px;">
                <div style="background: var(--surface2); padding: 10px 12px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: var(--text);">
                    <span>Carlos Ruiz</span>
                    <span style="color: #3b82f6;">$120,000 USD</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text2); margin-top: 2px;">Visita Agendada &bull; Agenda: Mañana 15:00 hs</div>
                </div>
              </div>

              <button class="academy-btn-action gold" onclick="document.getElementById('btn-activate-premium').click()">Desbloquear CRM y Agenda</button>
            </div>

            <!-- MODULE 3: BROKER PRO -> CENTRO -->
            <div class="academy-panel" id="academy-broker-centro">
              <span class="academy-tag gold">Broker PRO &bull; Sección 3</span>
              <h1 class="academy-h1">Sección: <span style="color: #D4AF37;">Centro</span></h1>
              <p class="academy-lead-text">Centro de operaciones unificado donde se centralizan las notificaciones, actividad reciente de tus publicaciones y mensajes del sistema.</p>

              <div class="academy-section-title">📌 Funciones del Centro de Operaciones</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num">1</div>
                  <div class="academy-step-content">
                    <strong>Bandeja Unificada de Notificaciones:</strong> Recibe alertas en tiempo real sobre nuevos contactos recibidos, cambios de estado en tus listados e interacciones de usuarios.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">2</div>
                  <div class="academy-step-content">
                    <strong>Resumen Diario de Métricas:</strong> Revisa el conteo de visitas que recibieron tus propiedades publicadas en las últimas 24 horas.
                  </div>
                </div>
              </div>

              <button class="academy-btn-action gold" onclick="document.getElementById('btn-activate-premium').click()">Ver Centro de Operaciones</button>
            </div>

            <!-- MODULE 4: BROKER PRO -> MIS ALERTAS -->
            <div class="academy-panel" id="academy-broker-alertas">
              <span class="academy-tag gold">Broker PRO &bull; Sección 4</span>
              <h1 class="academy-h1">Sección: <span style="color: #D4AF37;">Mis Alertas</span></h1>
              <p class="academy-lead-text">Configura los parámetros automáticos para recibir avisos cuando aparezcan inmuebles que coincidan con la búsqueda de tus inversores.</p>

              <div class="academy-section-title">📌 ¿Cómo configurar tus reglas de alerta?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num">1</div>
                  <div class="academy-step-content">
                    <strong>Establecer Zona y Tipo de Inmueble:</strong> Selecciona los barrios de interés (ej. Palermo, Centro, Las Palmas) y tipología (Casas, Deptos, Terrenos).
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">2</div>
                  <div class="academy-step-content">
                    <strong>Definir Umbral de Descuento:</strong> Elige recibir notificaciones solo cuando una propiedad se publique con un porcentaje de descuento superior a tu meta (ej. &gt;15%).
                  </div>
                </div>
              </div>

              <button class="academy-btn-action gold" onclick="document.getElementById('btn-activate-premium').click()">Configurar Mis Alertas</button>
            </div>

            <!-- MODULE 5: BROKER PRO -> TASACIÓN IA -->
            <div class="academy-panel" id="academy-broker-tasacion">
              <span class="academy-tag gold">Broker PRO &bull; Sección 5</span>
              <h1 class="academy-h1">Sección: <span style="color: #D4AF37;">Tasación IA</span></h1>
              <p class="academy-lead-text">Herramienta de avalúo mediante Inteligencia Artificial para generar Informes de Valoración Profesional en PDF con Análisis Comparativo de Mercado (CMA).</p>

              <div class="academy-section-title">📌 ¿Cómo usar la herramienta de Tasación IA?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num">1</div>
                  <div class="academy-step-content">
                    <strong>Ingreso de Datos de la Propiedad:</strong> Carga la dirección, metros cuadrados cubiertos, superficie total, estado de conservación y comodidades.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">2</div>
                  <div class="academy-step-content">
                    <strong>Cálculo de Algoritmo IA:</strong> El motor procesa ventas recientes en la misma manzana y ajusta el valor m² según la oferta comparativa.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">3</div>
                  <div class="academy-step-content">
                    <strong>Descarga de PDF de 4 Páginas:</strong> Genera un documento listo para imprimir o enviar al propietario con tu logo e información de contacto.
                  </div>
                </div>
              </div>

              <button class="academy-btn-action gold" onclick="document.getElementById('btn-activate-premium').click()">Probar Tasación IA</button>
            </div>

            <!-- MODULE 6: BROKER PRO -> EMBUDOS -->
            <div class="academy-panel" id="academy-broker-embudos">
              <span class="academy-tag gold">Broker PRO &bull; Sección 6</span>
              <h1 class="academy-h1">Sección: <span style="color: #D4AF37;">Embudos</span></h1>
              <p class="academy-lead-text">Creación y administración de Landing Pages y Embudos Marca Blanca para captar propietarios interesados en tasar su casa gratis.</p>

              <div class="academy-section-title">📌 ¿Cómo funcionan tus Embudos de Captación?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num">1</div>
                  <div class="academy-step-content">
                    <strong>Personalización de Landing Page:</strong> Sube tu logo institucional y selecciona el dominio de captación.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num">2</div>
                  <div class="academy-step-content">
                    <strong>Captura Automática de Contactos:</strong> Los propietarios tasan su propiedad y el embudo captura sus datos de contacto antes de entregar el informe.
                  </div>
                </div>
              </div>

              <button class="academy-btn-action gold" onclick="document.getElementById('btn-activate-premium').click()">Crear Embudos</button>
            </div>

            <!-- MODULE 7: ANALYTICS -> VISTA GLOBAL (ACCURATE CONGLOMERATE DEFINITION) -->
            <div class="academy-panel" id="academy-analytics-global">
              <span class="academy-tag emerald">Análisis de Mercado &bull; Sección 1</span>
              <h1 class="academy-h1">Sección: <span style="color: #10b981;">Vista Global</span></h1>
              <p class="academy-lead-text">La Vista Global es el <strong>conglomerado consolidado 360°</strong> de TODAS las fuentes de información del mercado. Combina en un solo panel los datos de la app, la Red Verificada oficial y los rastreos externos.</p>

              <div class="academy-section-title">📌 ¿Para qué sirve la Vista Global?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">1</div>
                  <div class="academy-step-content">
                    <strong>Consolidado Total del Mercado:</strong> Muestra el panorama completo sin restringir la información a un solo origen. Al seleccionar esta pestaña, el Mapa de Calor y los gráficos analizan el total acumulado.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">2</div>
                  <div class="academy-step-content">
                    <strong>Mapa de Calor Consolidado:</strong> Permite alternar capas entre <em>Demanda de Alquiler</em>, <em>Precios por m²</em> y <em>Rendimiento ROI</em> basándose en el universo completo de datos.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">3</div>
                  <div class="academy-step-content">
                    <strong>Métricas Macro 360°:</strong> Reúne en tiempo real los 4 KPIs clave de la ciudad (m² promedio, retorno Cap Rate, oportunidades con descuento y Riesgo País EMBI).
                  </div>
                </div>
              </div>

              <button class="academy-btn-action emerald" onclick="document.getElementById('btn-activate-premium').click()">Ver Vista Global</button>
            </div>

            <!-- MODULE 8: ANALYTICS -> RED VERIFICADA (OFFICIAL SOURCES FILTER) -->
            <div class="academy-panel" id="academy-analytics-oficial">
              <span class="academy-tag emerald">Análisis de Mercado &bull; Sección 2</span>
              <h1 class="academy-h1">Sección: <span style="color: #10b981;">Red Verificada</span></h1>
              <p class="academy-lead-text">Filtro de inteligencia de mercado enfocado <strong>exclusivamente en datos de fuentes oficiales, gubernamentales e institucionales auditadas</strong>.</p>

              <div class="academy-section-title">🏛️ Fuentes Institucionales de la Red Verificada</div>
              <div class="academy-source-box">
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--text); margin-bottom: 6px;">1. Banco Central del Paraguay (BCP)</div>
                <div style="font-size: 0.82rem; color: var(--text2); line-height: 1.5;">Registros oficiales de Inversión Extranjera Directa (IED Inmobiliaria USD 931M), tasa de inflación y tasas hipotecarias del sistema bancario.</div>
              </div>

              <div class="academy-source-box">
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--text); margin-bottom: 6px;">2. JP Morgan & Moody's (Rating Internacional)</div>
                <div style="font-size: 0.82rem; color: var(--text2); line-height: 1.5;">Medición de Riesgo País (EMBI ~150 pts) y calificación oficial de Grado de Inversión (Baa3).</div>
              </div>

              <div class="academy-source-box">
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--text); margin-bottom: 6px;">3. Dirección Nacional de Catastro & CAPACO</div>
                <div style="font-size: 0.82rem; color: var(--text2); line-height: 1.5;">Precios formales de escrituración pública y costo por m² de construcción de la Cámara Vial y de la Construcción.</div>
              </div>

              <button class="academy-btn-action emerald" onclick="document.getElementById('btn-activate-premium').click()">Ver Red Verificada</button>
            </div>

            <!-- MODULE 9: ANALYTICS -> DATOS EXTERNOS (EXTERNAL SCANNING FILTER) -->
            <div class="academy-panel" id="academy-analytics-radar">
              <span class="academy-tag emerald">Análisis de Mercado &bull; Sección 3</span>
              <h1 class="academy-h1">Sección: <span style="color: #10b981;">Datos Externos</span></h1>
              <p class="academy-lead-text">Filtro de información centrado <strong>exclusivamente en ofertas recopiladas fuera de la plataforma GeoHogar</strong> mediante el Algoritmo Radar.</p>

              <div class="academy-section-title">📌 ¿Para qué sirven los Datos Externos?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">1</div>
                  <div class="academy-step-content">
                    <strong>Rastreo de la Competencia Externa:</strong> Analiza publicaciones en portales de terceros, clasificadoras privadas, anuncios de prensa y foros del sector.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">2</div>
                  <div class="academy-step-content">
                    <strong>Detección de Sobreprecios Externos:</strong> Compara si las propiedades publicadas fuera de la app tienen precios por m² sobrevaluados respecto al valor real de la demanda.
                  </div>
                </div>
              </div>

              <button class="academy-btn-action emerald" onclick="document.getElementById('btn-activate-premium').click()">Ver Datos Externos</button>
            </div>

            <!-- MODULE 10: ANALYTICS -> DATOS LOCALES (APP INTERNAL DATA FILTER) -->
            <div class="academy-panel" id="academy-analytics-locales">
              <span class="academy-tag emerald">Análisis de Mercado &bull; Sección 4</span>
              <h1 class="academy-h1">Sección: <span style="color: #10b981;">Datos Locales</span></h1>
              <p class="academy-lead-text">Filtro de métricas enfocado <strong>única y exclusivamente en los datos generados dentro de la aplicación GeoHogar</strong>.</p>

              <div class="academy-section-title">📌 ¿Para qué sirven los Datos Locales?</div>
              <div class="academy-step-list">
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">1</div>
                  <div class="academy-step-content">
                    <strong>Actividad Directa en la App:</strong> Evalúa las búsquedas activas de los usuarios, solicitudes de tasación y ofertas publicadas dentro de la plataforma.
                  </div>
                </div>
                <div class="academy-step-item">
                  <div class="academy-step-num emerald">2</div>
                  <div class="academy-step-content">
                    <strong>Análisis Micro-Zonal por Manzana:</strong> Muestra la dispersión de valores m² en un radio cercano (300 metros) y calcula el ROI Neto deduciendo impuestos y comisiones.
                  </div>
                </div>
              </div>

              <button class="academy-btn-action emerald" onclick="document.getElementById('btn-activate-premium').click()">Ver Datos Locales</button>
            </div>

          </div>
        </div>

        <script>
          function switchAcademyTab(targetId, btn) {
            // Update Tab active states (Desktop & Mobile)
            document.querySelectorAll('.academy-tab-btn, .academy-pill-btn').forEach(el => {
              if (el.getAttribute('data-target') === targetId) {
                el.classList.add('active');
              } else {
                el.classList.remove('active');
              }
            });

            // Switch Panels
            document.querySelectorAll('.academy-panel').forEach(panel => {
              panel.classList.remove('active');
            });
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
              targetPanel.classList.add('active');
            }

            // Scroll #view-academy container directly to top!
            const academyOverlay = document.getElementById('view-academy');
            if (academyOverlay) {
              academyOverlay.scrollTop = 0;
            }
          }
        </script>
      </section>
`;
}
