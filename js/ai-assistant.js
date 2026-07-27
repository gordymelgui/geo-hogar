/**
 * GeoHogar AI Assistant
 * Handles Voice Recognition, AI Chat, and UI Control
 */

class GeoHogarAI {
    constructor() {
        this.apiKey = window.CONFIG?.GEMINI_API_KEY_1 || 'YOUR_GEMINI_API_KEY_1_HERE'; // Gemini API Key Configured
        this.isListening = false;
        this.recognition = null;
        this.messages = [];
        
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupUI();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'es-ES';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceButton(true);
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleUserInput(transcript);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceButton(false);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                this.isListening = false;
                this.updateVoiceButton(false);
            };
        }
    }

    setupUI() {
        // Assistant FAB
        const fab = document.createElement('div');
        fab.className = 'ai-assistant-fab';
        fab.id = 'ai-fab';
        fab.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16.01"/><line x1="16" y1="16" x2="16" y2="16.01"/>
            </svg>
        `;
        document.body.appendChild(fab);

        // Assistant Panel
        const panel = document.createElement('div');
        panel.className = 'ai-panel';
        panel.id = 'ai-panel';
        panel.innerHTML = `
            <div class="ai-header">
                <div class="ai-header-title">
                    <div class="ai-status-indicator"></div>
                    <h3>Asistente GeoHogar</h3>
                </div>
                <button class="ai-close" id="ai-close-btn">✕</button>
            </div>
            <div class="ai-messages" id="ai-messages">
                <div class="ai-msg ai-msg-bot">
                    ¡Hola! Soy tu asistente inteligente. Puedo filtrar el mapa por precio, tipo, cercanía a hospitales, escuelas y más. ¿En qué te ayudo?
                </div>
            </div>
            <div class="ai-input-area">
                <div class="ai-suggestions">
                    <div class="ai-suggestion-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Casas cerca de hospital</div>
                    <div class="ai-suggestion-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Deptos menos de 150k</div>
                    <div class="ai-suggestion-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Cerca de universidad</div>
                    <div class="ai-suggestion-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>Cerca de parque</div>
                    <div class="ai-suggestion-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>Ver alertas de zona</div>
                </div>
                <div class="ai-input-container">
                    <input type="text" id="ai-text-input" placeholder="Ej: casas en el mapa bajo 200k..." autocomplete="off">
                    <button class="ai-voice-btn" id="ai-voice-trigger">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </button>
                    <button class="ai-send-btn" id="ai-send-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Event Listeners
        fab.addEventListener('click', () => this.togglePanel());
        document.getElementById('ai-close-btn').addEventListener('click', () => this.togglePanel(false));
        document.getElementById('ai-voice-trigger').addEventListener('click', () => this.toggleSpeech());
        document.getElementById('ai-send-btn').addEventListener('click', () => this.sendTextMessage());
        document.getElementById('ai-text-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendTextMessage();
        });

        // Suggestions
        document.querySelectorAll('.ai-suggestion-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const text = pill.innerText.replace(/"/g, '');
                this.handleUserInput(text);
            });
        });
    }

    togglePanel(show = null) {
        const panel = document.getElementById('ai-panel');
        if (show === null) {
            panel.classList.toggle('active');
        } else if (show) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    }

    toggleSpeech() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateVoiceButton(isListening) {
        const btn = document.getElementById('ai-voice-trigger');
        const fab = document.getElementById('ai-fab');
        if (isListening) {
            btn.classList.add('active');
            fab.classList.add('listening');
        } else {
            btn.classList.remove('active');
            fab.classList.remove('listening');
        }
    }

    sendTextMessage() {
        const input = document.getElementById('ai-text-input');
        const text = input.value.trim();
        if (text) {
            this.handleUserInput(text);
            input.value = '';
        }
    }

    addMessage(text, isUser = false) {
        const container = document.getElementById('ai-messages');
        const msg = document.createElement('div');
        msg.className = `ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-bot'}`;
        msg.innerText = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
        
        this.messages.push({ role: isUser ? 'user' : 'assistant', content: text });
    }

    async handleUserInput(text) {
        this.addMessage(text, true);
        this.togglePanel(true);

        // 1. Check for UI Commands (Actions) - Hardcoded for speed
        const actionTriggered = this.parseActions(text);
        
        // 2. Call AI for reasoning or description
        this.showTypingIndicator();
        try {
            const response = await this.callAI(text);
            this.removeTypingIndicator();
            this.addMessage(response);
            this.speak(response); // Make the AI speak
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage("Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías repetirlo?");
        }
    }

    speak(text) {
        // Stop any current speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.05; // Un poco más lento para sonar más natural y conversacional
        utterance.pitch = 1.05; // Tono ligeramente ajustado para más calidez
        
        // Buscar la voz más humana disponible (Neural, Natural o Premium)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = 
            voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Online'))) ||
            voices.find(v => v.name.includes('Google') && v.lang.startsWith('es')) || 
            voices.find(v => v.lang.startsWith('es'));
            
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    }
    parseActions(text) {
        const lower = text.toLowerCase();
        const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
        const norm = normalize(lower);
        let navigated = false;

        // ===== GREETINGS & HELP INTENTS =====
        const greetings = ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'como estas', 'quien sos', 'quien eres', 'quien te creo', 'gracias'];
        if (greetings.some(g => norm === g || norm === g + '?' || norm.startsWith(g + ' ') || norm.endsWith(' ' + g))) {
            return false;
        }

        // ===== DIRECCIONAMIENTO DE SECCIONES (NAVEGACIÓN DIRECTA MULTIPANTALLA) =====
        if (norm.includes('mercado') || norm.includes('ir al mercado') || norm.includes('ver mercado') || norm.includes('ir a la tienda') || norm.includes('catalogo') || norm.includes('propiedades') || norm.includes('llevame a explorar') || norm.includes('ir a explorar')) {
            if (window.appRouter) window.appRouter.navigate('explore');
            navigated = true; return navigated;
        }
        if (norm.includes('ir al mapa') || norm.includes('ver el mapa') || norm.includes('abrir mapa') || norm.includes('llevame al mapa') || norm.includes('ir a mapa')) {
            if (window.appRouter) window.appRouter.navigate('map');
            navigated = true; return navigated;
        }
        if (norm.includes('broker') || norm.includes('zona broker') || norm.includes('panel broker') || norm.includes('llevame a broker') || norm.includes('ir a broker') || norm.includes('leads') || norm.includes('tasador')) {
            if (window.appRouter) window.appRouter.navigate('broker');
            navigated = true; return navigated;
        }
        if (norm.includes('analitica') || norm.includes('estadistica') || norm.includes('metricas') || norm.includes('llevame a analiticas') || norm.includes('ir a analiticas') || norm.includes('mapa de calor')) {
            if (window.appRouter) window.appRouter.navigate('analytics');
            navigated = true; return navigated;
        }
        if (norm.includes('mensajes') || norm.includes('mis chats') || norm.includes('ver mensajes') || norm.includes('llevame a mensajes') || norm.includes('ir a mensajes')) {
            if (window.appRouter) window.appRouter.navigate('messages');
            navigated = true; return navigated;
        }
        if (norm.includes('publicar') || norm.includes('subir propiedad') || norm.includes('vender') || norm.includes('llevame a publicar') || norm.includes('ir a publicar')) {
            if (window.appRouter) window.appRouter.navigate('publish');
            navigated = true; return navigated;
        }
        if (norm.includes('favoritos') || norm.includes('guardados') || norm.includes('llevame a favoritos')) {
            if (window.appRouter) window.appRouter.navigate('favorites');
            navigated = true; return navigated;
        }
        if (norm.includes('alertas') || norm.includes('notificaciones') || norm.includes('llevame a alertas')) {
            if (window.appRouter) window.appRouter.navigate('alerts');
            navigated = true; return navigated;
        }

        // ===== CLEAR/RESET FILTERS COMMAND =====
        if (norm.includes('limpiar') || norm.includes('quitar filtro') || norm.includes('limpiar filtro') || norm.includes('mostrar todo') || norm.includes('muestra todo') || norm.includes('ver todo')) {
            if (window.clearMapFilter) {
                window.clearMapFilter();
                const searchInput = document.getElementById('global-search');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                navigated = true;
                return navigated;
            }
        }

        // ===== ACCIONES DE MAPA VS EXPLORAR =====
        const locations = ['asuncion', 'paraguay', 'luque', 'san lorenzo', 'lambare', 'fernando de la mora', 'ciudad del este', 'villa morra', 'carmelitas', 'eje corporativo', 'las mercedes'];
        const isMapFilter = norm.includes('mapa') || norm.includes('marcar') || norm.includes('marque') || norm.includes('marca') || norm.includes('plano') || (norm.includes('cerca') && (norm.includes('hospital') || norm.includes('escuela') || norm.includes('universidad') || norm.includes('supermercado') || norm.includes('parque')));

        const criteria = {};
        
        // Precio
        const priceMax = norm.match(/(?:menos de|bajo de|menor a|por debajo de|hasta|maximo|máximo)\s*(?:usd\s*)?(\d[\d.,]*)/i);
        const priceMin = norm.match(/(?:mas de|mayor a|minimo|mínimo|desde|sobre)\s*(?:usd\s*)?(\d[\d.,]*)/i);
        if (priceMax) criteria.maxPrice = parseInt(priceMax[1].replace(/\D/g,''));
        if (priceMin) criteria.minPrice = parseInt(priceMin[1].replace(/\D/g,''));

        // Tipo
        if (norm.match(/\b(casa|chalet|mansion|residencia|quinta|rancho|villa)\b/))          criteria.type = 'Casa';
        else if (norm.match(/\b(departamento|depto|dpto|apartamento|piso|monoambiente|estudio|loft)\b/)) criteria.type = 'Departamento';
        else if (norm.includes('duplex'))   criteria.type = 'Dúplex';
        else if (norm.includes('penthouse') || norm.includes('atico')) criteria.type = 'Penthouse';
        else if (norm.includes('ph'))       criteria.type = 'PH';
        else if (norm.match(/\b(terreno|lote|parcela|hectarea)\b/))  criteria.type = 'Terreno';
        else if (norm.match(/\b(oficina|consultorio|corporativo|co-working)\b/))  criteria.type = 'Oficina';
        else if (norm.match(/\b(local|comercial|tienda|negocio)\b/))    criteria.type = 'Local';
        else if (norm.match(/\b(galpon|deposito|tinglado)\b/)) criteria.type = 'Galpón';
        else if (norm.match(/\b(estancia|chacra|quinta|campo)\b/)) criteria.type = 'Estancia';

        // Heurística de precio
        if (!criteria.maxPrice && norm.match(/\b(barato|económico|economico|accesible|ganga|oportunidad|descuento)\b/)) {
            criteria.maxPrice = 120000;
        }
        if (!criteria.minPrice && norm.match(/\b(lujo|exclusivo|alta gama|caro|premium)\b/)) {
            criteria.minPrice = 250000;
        }

        // Ambientes
        const roomsMatch = norm.match(/(\d+)\s*(?:ambientes?|habitaciones?|cuartos?|dormitorios?)/);
        if (roomsMatch) criteria.rooms = parseInt(roomsMatch[1]);

        // POI
        if (norm.match(/\b(hospital|clinica|clínica|medico|médico|sanatorio)\b/)) criteria.poiType = 'hospital';
        else if (norm.match(/\b(escuela|colegio|facultad|instituto)\b/)) criteria.poiType = 'escuela';
        else if (norm.match(/\b(universidad|facultad)\b/)) criteria.poiType = 'universidad';
        else if (norm.match(/\b(supermercado|comercio|tienda|despensa)\b/)) criteria.poiType = 'supermercado';
        else if (norm.match(/\b(parque|verde|plaza|aire libre|naturaleza)\b/)) criteria.poiType = 'parque';

        // Ubicación
        for (const loc of locations) {
            if (norm.includes(loc)) {
                criteria.location = loc;
                break;
            }
        }

        if (isMapFilter) {
            criteria.highlight = true;
            document.querySelectorAll('.sidebar-link, .bottom-nav-btn').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.sidebar-link[data-view="map"], .bottom-nav-btn[data-view="map"]').forEach(el => el.classList.add('active'));
            if (window.appRouter) window.appRouter.navigate('map');
            setTimeout(() => {
                if (window.filterMapMarkers) window.filterMapMarkers(criteria);
            }, 300);
            navigated = true;
        } else if (Object.keys(criteria).length > 0) {
            if (window.appRouter) window.appRouter.navigate('explore');
            if (typeof window.applyExploreFilters === 'function') {
                window.applyExploreFilters(true);
            }
            navigated = true;
        }

        return navigated;
    }

    async callAI(prompt) {
        const cleanKey = (window.CONFIG?.GEMINI_API_KEY_1 || window.CONFIG?.GEMINI_API_KEY_2 || 'AIzaSyATmOQwr49aupctjN56M99Ru2-HlTBjir8').trim();
        const isKeyValid = cleanKey && !cleanKey.includes('YOUR_') && cleanKey.startsWith('AIza');
        
        // 1. Gather Live Application State & Context
        const activeView = document.querySelector('.view.active')?.id || 'explore';
        const userName = window.currentUserProfile?.name || window.firebaseAuth?.currentUser?.displayName || 'Usuario';
        const userType = window.currentUserProfile?.userType || 'standard';
        const propCount = window.appData?.properties?.length || 50;
        const pygRate = window.exchangeRates?.PYG || 6053;

        const systemPrompt = `Eres el Asistente Inteligente de IA de GeoHogar (Plataforma Inmobiliaria Premium en Paraguay).
        ESTADO ACTUAL DE LA APP EN VIVO:
        - Usuario: ${userName} (Rol: ${userType})
        - Vista/Sección activa en pantalla: ${activeView}
        - Total de propiedades disponibles en catálogo: ${propCount}
        - Cotización en vivo: 1 USD = ${pygRate} PYG

        INSTRUCCIONES DE RESPUESTA:
        1. Entiende el contexto inmobiliario de Paraguay (Asunción, Luque, San Lorenzo, Villa Morra, Ycuá Satí, ROI, tasaciones m²).
        2. Si el usuario te pide navegar o realizar una acción, indícaselo con entusiasmo y confirma la acción.
        3. Si pregunta sobre lo que ve en pantalla o pide explicaciones sobre ROI, tasación o la app, respóndele de forma inteligente, experta y conversacional.
        4. Tolera errores de tipeo, modismos y modismos paraguayos.
        5. Responde SIEMPRE en texto plano sin asteriscos (*), negritas (**) ni formato markdown.
        6. Responde de forma concisa pero completa (máximo 2 a 3 frases).`;

        if (isKeyValid) {
            const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];
            for (const model of models) {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: systemPrompt + "\n\nUsuario: " + prompt }] }]
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                            let rawText = data.candidates[0].content.parts[0].text;
                            return rawText.replace(/\*/g, '').replace(/_/g, '').trim();
                        }
                    }
                } catch (e) {}
            }
        }

        // Generative Multimodal Live-Context Reasoning Engine (Offline / Fallback)
        const norm = prompt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        
        // Dynamic View Description Lookup
        const viewDescriptions = {
            'explore': `Estás en el Mercado de Propiedades de GeoHogar. Podés explorar ${propCount} inmuebles en vivo, filtrar por tipo o precio y ver análisis de rentabilidad.`,
            'map': `Estás en el Mapa Interactivo. Visualizás la geolocalización de inmuebles, zonas de calor y radios de valor en Asunción y alrededores.`,
            'broker': `Estás en el Panel Broker PRO (${userName}). Contás con herramientas de captación de leads, tasación con IA y reportes PDF.`,
            'analytics': `Estás en Analíticas de Mercado. Mostramos gráficos de tendencia de precios por m² y concentración de demanda urbana.`,
            'messages': `Estás en el Centro de Mensajes Directos. Podés chatear en tiempo real con dueños y brokers con privacidad cifrada.`,
            'publish': `Estás en la sección de Publicar Inmueble. Ingresá los datos, fotos y ubicación para dar visibilidad a tu propiedad.`,
            'favorites': `Estás en tus Propiedades Guardadas. Aquellas publicaciones que marcaste como favoritas para seguimiento.`,
            'alerts': `Estás en Alertas de Zona. Configurá avisos automáticos para recibir ofertas y bajas de precio en tiempo real.`,
            'glossary': `Estás en el Glosario y Guía Inmobiliaria. Encontrás explicaciones sobre términos técnicos, contratos e impuestos.`
        };

        // 1. Help & Capability Intent
        if (norm.includes('en que me podes ayudar') || norm.includes('que podes hacer') || norm.includes('que puedes hacer') || norm.includes('ayuda') || norm.includes('que haces')) {
            return `¡Puedo ayudarte en todo! Puedo navegar a cualquier sección de la app, filtrar el catálogo de ${propCount} propiedades por precio o barrio, tasarte un inmueble o explicarte lo que ves en pantalla.`;
        }

        // 2. Navigation Intent Response
        if (norm.includes('mercado') || norm.includes('tienda') || norm.includes('catalogo') || norm.includes('comprar')) {
            return `Te redirigí al mercado principal de propiedades. Tenés a disposición ${propCount} inmuebles en Paraguay para explorar.`;
        }
        if (norm.includes('mapa')) {
            return `Abrí el mapa interactivo. Podés explorar geográficamente los inmuebles y sus zonas de influencia.`;
        }
        if (norm.includes('broker') || norm.includes('leads') || norm.includes('tasador')) {
            return `Te abrí el Panel Broker PRO con tus herramientas de captación de leads y tasación inteligente.`;
        }
        if (norm.includes('analitica') || norm.includes('metricas') || norm.includes('estadistica')) {
            return `Cargué el panel de analíticas para que consultes las tendencias de precio por m² y demanda.`;
        }
        if (norm.includes('mensajes') || norm.includes('chats')) {
            return `Te llevé a tu centro de mensajes directos en tiempo real.`;
        }

        // 3. Screen Context / "Where am I" / "What is this"
        if (norm.includes('explicame') || norm.includes('explicar') || norm.includes('que es esto') || norm.includes('donde estoy') || norm.includes('pantalla')) {
            return viewDescriptions[activeView] || `Estás usando GeoHogar. Puedo guiarte por el catálogo, mapa o herramientas de tasación.`;
        }

        // 4. In-depth Real Estate Concepts
        if (norm.includes('roi') || norm.includes('rentabilidad')) {
            return `El ROI (Retorno sobre Inversión) indica el rendimiento porcentual anual que genera el alquiler de un inmueble en relación a su costo de adquisición.`;
        }
        if (norm.includes('tasacion') || norm.includes('valuar') || norm.includes('precio m2')) {
            return `El Tasador Inteligente calcula el valor promedio por m² utilizando comparables reales de mercado y nivel de confianza estadístico.`;
        }
        if (norm.includes('oportunidad') || norm.includes('descuento') || norm.includes('barato')) {
            return `Identifica inmuebles cuyo precio m² se encuentra por debajo de la media de la zona, lo que representa una excelente oportunidad de compra.`;
        }

        // 5. Greetings & Conversation
        if (norm.includes('hola') || norm.includes('buenas') || norm.includes('que tal') || norm.includes('buenos dias')) {
            return `¡Hola ${userName}! Soy tu asistente de GeoHogar. ¿Qué propiedad te gustaría buscar o qué sección deseas explorar hoy?`;
        }
        if (norm.includes('gracias')) {
            return `¡Un placer ayudarte! Quedo a tu disposición para lo que necesites en la app.`;
        }

        return `Entendido. He procesado tu solicitud en relación a la sección de ${activeView}. ¿Te gustaría que aplique algún filtro específico o te lleve a otra pantalla?`;
    }
    showTypingIndicator() {
        const container = document.getElementById('ai-messages');
        const typing = document.createElement('div');
        typing.className = 'ai-msg ai-msg-bot typing-indicator';
        typing.id = 'ai-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        typing.style.display = 'flex';
        typing.style.gap = '4px';
        typing.style.padding = '15px';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    removeTypingIndicator() {
        document.getElementById('ai-typing')?.remove();
    }
}

// Typing indicator styles (dynamic)
const style = document.createElement('style');
style.textContent = `
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: var(--text2);
        border-radius: 50%;
        display: inline-block;
        animation: typing 1s infinite;
        opacity: 0.4;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-5px); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize
window.geohogarAI = new GeoHogarAI();
