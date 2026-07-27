export function renderGlossaryView() {
  return `
<section class="view" id="view-glossary">
        <div class="explore-hero-card" style="margin-bottom: 2rem;">
          <div class="hero-bg-shapes">
            <div class="hero-shape shape-1"></div>
            <div class="hero-shape shape-2"></div>
          </div>
          <div class="hero-content">
            <h1 data-i18n="help_title" style="margin: 0 0 6px 0;">Glosario & Manual de Uso</h1>
            <p class="hero-subtitle" data-i18n="help_subtitle" style="margin-bottom: 0;">Todo lo que necesitas saber
              sobre los tecnicismos inmobiliarios y cómo dominar GeoHogar.</p>
          </div>
        </div>

        <div class="feed-toggle-container" style="margin-bottom: 2rem; display: flex; gap: 10px;">
          <button class="feed-toggle-btn active" id="help-tab-btn-glossary" onclick="window.switchHelpTab('glossary')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"
              style="display:inline-block;vertical-align:middle;margin-right:8px">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span data-i18n="help_tab_glossary">Glosario de Términos</span>
          </button>
          <button class="feed-toggle-btn" id="help-tab-btn-guide" onclick="window.switchHelpTab('guide')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"
              style="display:inline-block;vertical-align:middle;margin-right:8px">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span data-i18n="help_tab_guide">Manual de la App</span>
          </button>
        </div>

        <!-- Tab: Glossary of Terms -->
        <div id="help-content-glossary" class="help-tab-panel">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">

            <div
              style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span data-i18n="glossary_header_basics">Terminologías y Tecnicismos Básicos</span>
            </div>

            <!-- ROI -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #10b981; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <span data-i18n="glossary_roi_title">ROI (Retorno de Inversión)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_roi_desc">
                Mide la rentabilidad anual bruta estimada del alquiler en relación al precio de compra de la propiedad.
                Fórmula: (Alquiler Mensual × 12) / Precio de Compra. Un ROI mayor al 7.0% anual se considera un
                rendimiento alto y óptimo para inversiones inmobiliarias en Paraguay.
              </p>
            </div>

            <!-- Bajo Valor de Mercado -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #f59e0b; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span data-i18n="glossary_low_value_title">Bajo Valor de Mercado (Oportunidad)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_low_value_desc">
                Indica que el precio por metro cuadrado (USD/m²) de la propiedad está sustancialmente por debajo del
                promedio histórico estimado para esa misma zona y categoría de inmueble. Representa una compra con
                descuento inmediato y potencial de plusvalía a corto plazo.
              </p>
            </div>

            <!-- Radar de Oportunidades -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #6366f1; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span data-i18n="glossary_radar_title">Radar de Oportunidades</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_radar_desc">
                Algoritmo inteligente de GeoHogar que escanea, procesa y filtra publicaciones de múltiples portales en
                tiempo real. Clasifica las propiedades destacando automáticamente aquellas subvaluadas o con altas tasas
                de retorno de inversión antes que nadie en el mercado.
              </p>
            </div>

            <!-- Cap Rate -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #06b6d4; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span data-i18n="glossary_cap_rate_title">Cap Rate (Tasa de Capitalización)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_cap_rate_desc">
                Indica el rendimiento neto anual de una propiedad alquilada. A diferencia del ROI bruto, el Cap Rate
                deduce todos los costos operativos (mantenimiento, expensas, impuestos e inactividad) del ingreso bruto
                anual. Fórmula: Ingreso Operativo Neto (NOI) / Valor del Inmueble.
              </p>
            </div>

            <!-- Flipping Inmobiliario -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #ec4899; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span data-i18n="glossary_flipping_title">Flipping Inmobiliario</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_flipping_desc">
                Estrategia de inversión que consiste en adquirir inmuebles con alto descuento (comúnmente por debajo del
                valor de tasación) o que requieren reformas estéticas, para luego revenderlas a su verdadero valor de
                mercado en el menor tiempo posible, capturando una ganancia neta rápida.
              </p>
            </div>

            <!-- Validador Inteligente -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #8b5cf6; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="12" y2="14" />
                </svg>
                <span data-i18n="glossary_val_title">Validador Inteligente</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_val_desc">
                Algoritmo predictivo de tasación automática basado en IA. Analiza las dimensiones, ambientes y ubicación
                de cualquier propiedad para calcular su desvío porcentual respecto a la media de la zona, estimar el
                tiempo de venta promedio en días y emitir un veredicto de inversión.
              </p>
            </div>

            <!-- Valor m2 -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #14b8a6; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                </svg>
                <span data-i18n="glossary_m2_title">Valor del Metro Cuadrado (USD/m²)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_m2_desc">
                Métrica de comparación estándar en el rubro inmobiliario. Permite evaluar objetivamente la relación
                precio-tamaño de diferentes inmuebles eliminando el sesgo de la superficie total, permitiendo comparar
                de forma homogénea distintas ofertas de una misma zona.
              </p>
            </div>

            <!-- Pulso de Mercado -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #3b82f6; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span data-i18n="glossary_pulse_title">Muestra y Pulso del Mercado</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_pulse_desc">
                Indicadores estadísticos del comportamiento del mercado inmobiliario. Se alimentan de la agregación de
                cientos de anuncios en vivo en Paraguay para establecer el precio promedio real de cada barrio, tasas de
                demanda y variaciones porcentuales mensuales.
              </p>
            </div>

            <div
              style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-top: 1.5rem; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4AF37" stroke-width="2.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z">
                </path>
              </svg>
              <span data-i18n="glossary_header_premium">Servicios del Modo de Pago (Plan Inversor Premium)</span>
            </div>

            <!-- Membresia Premium -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #D4AF37; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span data-i18n="glossary_premium_title">Membresía Inversor Premium</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_premium_desc">
                Plan de suscripción diseñado para compradores e inversores inmobiliarios. Desbloquea el acceso ilimitado
                al Radar de Oportunidades (anuncios web externos filtrados por ROI y descuento), el Validador de Precios
                detallado con desglose de mercado, alertas de flipping y el Mapa de Calor de demanda.
              </p>
            </div>

            <!-- Radar PRO -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #D4AF37; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span data-i18n="glossary_premium_radar_title">Radar PRO sin límites</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_premium_radar_desc">
                Accede al catálogo de propiedades analizadas y extraídas de múltiples portales externos en Paraguay.
                Filtra sin restricciones las oportunidades con ROI superior al 7% o descuentos superiores al 10% del
                precio de mercado.
              </p>
            </div>

            <!-- Heatmaps Premium -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #D4AF37; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span data-i18n="glossary_premium_heatmap_title">Mapas de Calor Avanzados</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_premium_heatmap_desc">
                Visualiza de forma gráfica en el mapa interactivo las zonas calientes de Asunción y principales urbes de
                Paraguay. Alterna capas de densidad de demanda de alquileres, precios por metro cuadrado y rendimientos
                promedio de rentabilidad.
              </p>
            </div>

            <div
              style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-top: 1.5rem; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#b45309" stroke-width="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span data-i18n="glossary_header_broker">Herramientas para Profesionales (Plan Broker PRO)</span>
            </div>

            <!-- Plan Broker PRO -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #b45309; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span data-i18n="glossary_broker_title">Plan Broker PRO</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_broker_desc">
                Herramienta profesional avanzada diseñada exclusivamente para agentes inmobiliarios y brokers. Ofrece
                embudos de captación de propiedades directas de dueños, acceso directo a la bolsa de compradores en
                tiempo real, pines dorados de alta prioridad y herramientas de prospección comercial.
              </p>
            </div>

            <!-- Bolsa de Compradores -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #b45309; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span data-i18n="glossary_broker_leads_title">Bolsa de Compradores (Leads en Vivo)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_broker_leads_desc">
                Permite a los brokers ver en tiempo real qué tipo de propiedades están buscando los usuarios de GeoHogar
                en el mapa. Incluye detalles de presupuesto, zona de interés, y opción de contacto directo para ofrecer
                inmuebles de su propia cartera.
              </p>
            </div>

            <!-- Funnel tasacion -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #b45309; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                <span data-i18n="glossary_broker_funnel_title">Embudo de Tasación Marca Blanca</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_broker_funnel_desc">
                Enlace web personalizable que el Broker puede compartir en sus redes sociales. Permite a los
                propietarios tasar su inmueble gratis con la IA de GeoHogar. A cambio, los datos de contacto del
                propietario y la tasación se envían en exclusiva al Broker para captar la propiedad.
              </p>
            </div>

            <!-- Pines Dorados -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #b45309; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span data-i18n="glossary_broker_pines_title">Pines de Ubicación Dorados</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_broker_pines_desc">
                Los anuncios publicados por Brokers PRO se destacan con un marcador dorado premium en el mapa principal
                y se posicionan al principio de la lista del explorador de propiedades, maximizando la exposición y
                clics de potenciales compradores.
              </p>
            </div>

            <!-- Radar Predictivo -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #b45309; border-radius: 12px; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #b45309; font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span data-i18n="glossary_broker_radar_title">Radar Predictivo de Prospección</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_broker_radar_desc">
                Panel de analíticas avanzadas que muestra el balance entre oferta (propiedades en venta/alquiler) y
                demanda (búsquedas activas) en cada barrio, permitiendo identificar zonas de alta demanda insatisfecha
                para enfocar la captación de exclusivas.
              </p>
            </div>
            <div
              style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-top: 1.5rem; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span data-i18n="glossary_section_tags_title">Significado de Etiquetas y Distintivos</span>
            </div>

            <!-- ROI Tag -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #10b981; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <span class="clean-badge badge-premium-green"
                  style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>ROI %</span>
                <span data-i18n="glossary_tag_roi_title">Etiqueta de Alta Rentabilidad (Verde)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_roi_desc">
                Esta etiqueta verde en las tarjetas de propiedades destaca que el inmueble tiene un retorno de inversión
                anual estimado superior al 7.0%. Ideal para inversores que buscan flujo de caja rápido.
              </p>
            </div>

            <!-- Discount Tag -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #f59e0b; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <span class="clean-badge badge-premium-orange"
                  style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 22l10-4 10 4L12 2z" />
                  </svg>-%</span>
                <span data-i18n="glossary_tag_discount_title">Etiqueta de Bajo Precio (Naranja)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_discount_desc">
                Indica el porcentaje de descuento de la propiedad respecto al promedio por m² en la misma zona. Un valor
                de -15% significa que la propiedad está listada 15% más barata que la media del barrio.
              </p>
            </div>

            <!-- GF Badge -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #D4AF37; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <span class="clean-badge badge-gf-gold"
                  style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><svg
                    width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>GF</span>
                <span data-i18n="glossary_tag_gf_title">Insignia GF (Broker PRO)</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_gf_desc">
                Identifica las propiedades publicadas por agentes inmobiliarios suscritos a Broker PRO. Garantiza que la
                propiedad tiene intermediación profesional, documentación pre-verificada y respuesta rápida.
              </p>
            </div>

            <!-- Premium Badge -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #8b5cf6; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <span class="clean-badge badge-premium-gold"
                  style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; background: linear-gradient(135deg, #FFE07D, #D4AF37); color: #0f172a; display: inline-block;">Premium</span>
                <span data-i18n="glossary_tag_premium_title">Insignia Inversor Premium</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_premium_desc">
                Distingue los anuncios publicados por usuarios con membresía Inversor Premium. Estas propiedades suelen
                contar con análisis de mercado adjuntos y priorización de contacto directo.
              </p>
            </div>

            <!-- Type Badge -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #6b7280; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <span class="clean-badge badge-type"
                  style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-block; background: var(--surface2); color: var(--text2);">Departamento</span>
                <span data-i18n="glossary_tag_type_title">Etiqueta de Tipo de Inmueble</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_type_desc">
                Etiqueta gris que indica el tipo de construcción o categoría del inmueble (Casa, Departamento, Dúplex,
                Terreno, Galpón, Oficina, etc.).
              </p>
            </div>

            <!-- Operation Badge -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #3b82f6; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <span class="clean-badge badge-op bg-red-soft"
                  style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-block; color: #ff2a5f; background: rgba(255, 42, 95, 0.1);">Venta</span>
                <span data-i18n="glossary_tag_op_title">Etiqueta de Tipo de Operación</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_op_desc">
                Diferencia visualmente entre inmuebles en Venta (color rojo suave) y Alquiler (color azul suave),
                permitiendo una rápida identificación en el feed o mapa.
              </p>
            </div>

            <!-- Verified Badge -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #3b82f6; border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="none"
                  style="display: inline-block; vertical-align: middle;">
                  <path
                    d="M12 2l2.36 1.48L17 3.03l1.16 2.65L20.88 7l-.6 2.87L22 12l-1.72 2.13.6 2.87-2.72 1.32L17 20.97l-2.64-.45L12 22l-2.36-1.48L7 20.97l-1.16-2.65L3.12 17l.6-2.87L2 12l1.72-2.13-.6-2.87 2.72-1.32L7 3.03l2.64.45L12 2z"
                    fill="#3b82f6" />
                  <path d="M9.5 12l1.83 1.83L15.5 9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span data-i18n="glossary_tag_verified_title">Sello de Verificación de Identidad</span>
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="glossary_tag_verified_desc">
                Sello azul de verificación que aparece junto al nombre del publicador. Garantiza que GeoHogar ha
                validado la identidad del anunciante como Broker Verificado o Inversor Verificado.
              </p>
            </div>


          </div>
        </div>

        <!-- Tab: User Guide -->
        <div id="help-content-guide" class="help-tab-panel" style="display: none;">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Step 1 -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--accent); font-size: 1.15rem; margin-bottom: 10px;"
                data-i18n="guide_step1_title">
                1. Buscar y Filtrar Oportunidades
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="guide_step1_desc">
                En el feed principal, puedes buscar por barrio o aplicar filtros independientes. El botón de **Alta
                Rentabilidad** destaca propiedades con ROI >7%, y el de **Bajo Valor** muestra inmuebles rebajados
                respecto al promedio.
              </p>
            </div>

            <!-- Step 2 -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--accent); font-size: 1.15rem; margin-bottom: 10px;"
                data-i18n="guide_step2_title">
                2. Análisis en el Mapa y Heatmaps
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="guide_step2_desc">
                Usa la vista de Mapa para ubicar propiedades visualmente. Activa la capa de **Zonas de demanda
                (Heatmap)** para visualizar los barrios con mayor actividad, precios de metro cuadrado más altos o
                retornos de alquiler más convenientes.
              </p>
            </div>

            <!-- Step 3 -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--accent); font-size: 1.15rem; margin-bottom: 10px;"
                data-i18n="guide_step3_title">
                3. Centro de Alertas en Tiempo Real
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="guide_step3_desc">
                Configura alertas para tus zonas preferidas. Elige qué te interesa (baja de precio de favoritos, nuevas
                propiedades, o alertas de flipping) y recibe avisos inmediatos en tu panel y correo para actuar antes
                que otros compradores.
              </p>
            </div>

            <!-- Step 4 -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--accent); font-size: 1.15rem; margin-bottom: 10px;"
                data-i18n="guide_step4_title">
                4. Publicar y Sincronización Masiva
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="guide_step4_desc">
                Puedes publicar tus propiedades de forma individual llenando el formulario, o usar la opción PRO de
                **Sincronización con Google Sheets**. Simplemente publica tu planilla como CSV en la web y pégala para
                cargar todo tu catálogo en segundos.
              </p>
            </div>

            <!-- Step 5 -->
            <div
              style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-sm);">
              <h3
                style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--accent); font-size: 1.15rem; margin-bottom: 10px;"
                data-i18n="guide_step5_title">
                5. Broker PRO y Tasador Inteligente
              </h3>
              <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;"
                data-i18n="guide_step5_desc">
                Como Broker PRO, accede al listado de compradores activos buscando propiedades, o usa tu enlace de
                tasación de marca blanca. Compártelo en tus redes; los dueños tasarán sus casas gratis con IA y sus
                datos te llegarán directamente a ti.
              </p>
            </div>
          </div>
        </div>
      </section>
`;
}
