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
        const normalize = s => s.normalize('NFD').replace(/[\u0300-\u536f]/g,'').toLowerCase();
        const norm = normalize(lower);
        let navigated = false;

        // ===== GREETINGS & CONVERSATIONAL INTENTS =====
        const greetings = ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'como estas', 'quien sos', 'quien eres', 'quien te creo', 'ayuda', 'gracias', 'que podes hacer', 'que puedes hacer'];
        if (greetings.some(g => norm === g || norm === g + '?' || norm.startsWith(g + ' ') || norm.endsWith(' ' + g))) {
            return false;
        }

        // ===== DIRECCIONAMIENTO DE SECCIONES (NAVEGACIÓN DIRECTA) =====
        if (norm.includes('mercado') || norm.includes('ir al mercado') || norm.includes('ver mercado') || norm.includes('ir a la tienda') || norm.includes('catalogo') || norm.includes('propiedades')) {
            if (window.appRouter) window.appRouter.navigate('explore');
            navigated = true;
            return navigated;
        }
        if (norm.includes('ir al mapa') || norm.includes('ver el mapa') || norm.includes('abrir mapa')) {
            if (window.appRouter) window.appRouter.navigate('map');
            navigated = true;
            return navigated;
        }
        if (norm.includes('ir a broker') || norm.includes('zona broker') || norm.includes('panel broker')) {
            if (window.appRouter) window.appRouter.navigate('broker');
            navigated = true;
            return navigated;
        }
        if (norm.includes('analitica') || norm.includes('estadistica') || norm.includes('metricas')) {
            if (window.appRouter) window.appRouter.navigate('analytics');
            navigated = true;
            return navigated;
        }
        if (norm.includes('mensajes') || norm.includes('mis chats') || norm.includes('ver mensajes')) {
            if (window.appRouter) window.appRouter.navigate('messages');
            navigated = true;
            return navigated;
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
        const hasLocation = locations.some(loc => norm.includes(loc));
        
        // Decidir si es una consulta específica para el mapa o de marcación
        const isMapFilter = norm.includes('mapa') || norm.includes('marcar') || norm.includes('marque') || norm.includes('marca') || norm.includes('plano') || (norm.includes('cerca') && (norm.includes('hospital') || norm.includes('escuela') || norm.includes('universidad') || norm.includes('supermercado') || norm.includes('parque')));

        // Obtener criterios de filtrado
        const criteria = {};
        
        // Precio
        const priceMax = norm.match(/(?:menos de|bajo de|menor a|por debajo de|hasta|maximo|máximo)\s*(?:usd\s*)?(\d[\d.,]*)/i);
        const priceMin = norm.match(/(?:mas de|mayor a|minimo|mínimo|desde|sobre)\s*(?:usd\s*)?(\d[\d.,]*)/i);
        if (priceMax) criteria.maxPrice = parseInt(priceMax[1].replace(/\D/g,''));
        if (priceMin) criteria.minPrice = parseInt(priceMin[1].replace(/\D/g,''));

        // Tipo (Synonyms Expansion)
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

        // Heurística de precio e inversión (contexto de "barato" / "oportunidad")
        if (!criteria.maxPrice && norm.match(/\b(barato|económico|economico|accesible|ganga|oportunidad|descuento)\b/)) {
            criteria.maxPrice = 120000;
        }
        if (!criteria.minPrice && norm.match(/\b(lujo|exclusivo|alta gama|caro|premium)\b/)) {
            criteria.minPrice = 250000;
        }

        // Ambientes / Cuartos (Explícito e Implícito)
        const roomsMatch = norm.match(/(\d+)\s*(?:ambientes?|habitaciones?|cuartos?|dormitorios?)/);
        if (roomsMatch) {
            criteria.rooms = parseInt(roomsMatch[1]);
        }

        // m2
        const m2Max = norm.match(/(?:hasta|menos de|maximo|máximo)\s*(\d+)\s*m/);
        const m2Min = norm.match(/(?:minimo|mínimo|mas de|desde)\s*(\d+)\s*m/);
        if (m2Max) criteria.maxM2 = parseInt(m2Max[1]);
        if (m2Min) criteria.minM2 = parseInt(m2Min[1]);

        // Puntos de Interés (POI) y Entorno
        if (norm.match(/\b(hospital|clinica|clínica|medico|médico|sanatorio)\b/)) criteria.poiType = 'hospital';
        else if (norm.match(/\b(escuela|colegio|facultad|instituto)\b/)) criteria.poiType = 'escuela';
        else if (norm.match(/\b(universidad|facultad)\b/)) criteria.poiType = 'universidad';
        else if (norm.match(/\b(supermercado|comercio|tienda|despensa)\b/)) criteria.poiType = 'supermercado';
        else if (norm.match(/\b(parque|verde|plaza|aire libre|naturaleza)\b/)) criteria.poiType = 'parque';

        // Ubicación / Ciudad / País
        for (const loc of locations) {
            if (norm.includes(loc)) {
                criteria.location = loc;
                break;
            }
        }

        if (isMapFilter) {
            // ===== RUTA 1: FILTRAR Y IR AL MAPA =====
            criteria.highlight = true;
            if (window.appRouter) window.appRouter.navigate('map');
            setTimeout(() => {
                if (window.filterMapMarkers) window.filterMapMarkers(criteria);
            }, 300);
            navigated = true;
        } else if (Object.keys(criteria).length > 0) {
            // ===== RUTA 2: FILTRAR EXPLORADOR PRINCIPAL Y IR A EXPLORAR =====
            if (window.appRouter) window.appRouter.navigate('explore');

            if (criteria.maxPrice) {
                const el = document.getElementById('f-pmax');
                if (el) el.value = criteria.maxPrice;
            }

            if (criteria.rooms) {
                const rPills = document.querySelectorAll('#f-rooms .pill');
                rPills.forEach(p => p.classList.remove('active'));
                const targetPill = document.querySelector(`#f-rooms .pill[data-val="${criteria.rooms}"]`) || document.querySelector(`#f-rooms .pill[data-val="4+"]`);
                if (targetPill) targetPill.classList.add('active');
            } else {
                const rPills = document.querySelectorAll('#f-rooms .pill');
                rPills.forEach(p => p.classList.remove('active'));
                document.querySelector('#f-rooms .pill[data-val=""]')?.classList.add('active');
            }

            // Sincronizar Filtros Inteligentes (ROI, Valor)
            if (norm.match(/\b(inversion|inversin|rentable|roi|negocio|retorno)\b/)) {
                document.getElementById('explore-roi-btn')?.classList.add('active');
                document.getElementById('filter-roi-btn')?.classList.add('active');
            }
            if (norm.match(/\b(oportunidad|ganga|descuento|rebajado)\b/)) {
                document.getElementById('explore-market-value-btn')?.classList.add('active');
                document.getElementById('filter-market-value-btn')?.classList.add('active');
            }

            // 4. Sincronizar buscador global (por ejemplo con la ciudad/barrio o término extra)
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                let query = '';
                // Si hay una localización de ciudad (ej: asuncion, villa morra)
                if (criteria.location && criteria.location !== 'paraguay') {
                    query = criteria.location;
                } else {
                    // Limpiar stop words y ver si queda algún término descriptivo
                    let cleanQuery = norm.replace(/\b(busc\w*|encontr\w*|mu[eǸ]strame|muetrame|quiero ver|mostrar|ense[n]a|las|los|la|el|un|una|unos|unas|en|de|por favor|gracias|ya|ahora|quiero|ver|mapa|aqu[i]|all[i]|casas|casa|propiedades|propiedad|inmuebles|paraguay|departamento|depto|dpto|apartamento|terreno|duplex|penthouse|galpon|estancia|chacra|quinta|campo|tinglado|deposito|oficina|local)\b/ig, ' ').trim().replace(/\s+/g,' ');
                    if (cleanQuery.length >= 2) {
                        query = cleanQuery;
                    }
                }
                searchInput.value = query;
            }

            // 5. Aplicar los filtros unificados
            if (window.applyExploreFilters) {
                window.applyExploreFilters();
            }
            navigated = true;
        }

        // ===== COMANDOS DE NAVEGACIÓN SIMPLE =====
        if (!navigated) {
            if (norm.includes('mapa') || norm.includes('ubicacion') || norm.includes('ubicación')) {
                document.getElementById('nav-map')?.click(); navigated = true;
            } else if (norm.includes('explorar') || norm.includes('inicio') || norm.includes('home') || norm.includes('principal')) {
                document.getElementById('nav-explore')?.click(); navigated = true;
            } else if (norm.includes('favorito') || norm.includes('guardado')) {
                document.getElementById('nav-favorites')?.click(); navigated = true;
            } else if (norm.includes('mensaje') || norm.includes('chat') || norm.includes('hablar')) {
                document.getElementById('nav-messages')?.click(); navigated = true;
            } else if (norm.includes('publicar') || norm.includes('subir') || norm.includes('vender')) {
                document.getElementById('nav-publish')?.click(); navigated = true;
            } else if (norm.includes('mercado') || norm.includes('analitica') || norm.includes('analítica') || norm.includes('estadistica') || norm.includes('tendencia')) {
                document.getElementById('nav-analytics')?.click(); navigated = true;
            } else if (norm.includes('alerta') || norm.includes('zona') || norm.includes('notificac')) {
                document.getElementById('nav-alerts')?.click();
                if (typeof openZoneAlertModal === 'function') openZoneAlertModal();
                navigated = true;
            } else if (norm.includes('glosario') || norm.includes('ayuda') || norm.includes('tecnicism') || norm.includes('manual') || norm.includes('como usar') || norm.includes('guiar') || norm.includes('guia')) {
                document.getElementById('nav-glossary')?.click(); navigated = true;
            }
        }

        return navigated;
    }

    async callAI(prompt) {
        const cleanKey = (window.CONFIG?.GEMINI_API_KEY_1 || window.CONFIG?.GEMINI_API_KEY_2 || '').trim();
        const isKeyValid = cleanKey && !cleanKey.includes('YOUR_') && cleanKey.startsWith('AIza');
        
        if (isKeyValid) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${cleanKey}`;
            const systemPrompt = `Eres el Asistente Inteligente de GeoHogar, la plataforma inmobiliaria de Paraguay.
            Tu objetivo es dialogar de forma amable, clara y útil. Responde en texto plano sin asteriscos ni markdown en 1-2 frases.`;

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

        // Rich Intelligent Offline NLP Engine
        const norm = prompt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        
        if (norm.includes('mercado') || norm.includes('tienda') || norm.includes('comprar')) {
            return "Te he redirigido al mercado principal de propiedades de GeoHogar. Podés explorar todas las opciones disponibles en vivo.";
        }
        if (norm.includes('mapa')) {
            return "Te abrí el mapa interactivo para ver la ubicación geográfica y distribución de valor de los inmuebles.";
        }
        if (norm.includes('hola') || norm.includes('buenas') || norm.includes('que tal') || norm.includes('buenos dias')) {
            return "¡Hola! Soy el asistente de GeoHogar. Puedo ayudarte a buscar propiedades por barrio o precio, mostrarte zonas en el mapa y guiarte por la app. ¿En qué te ayudo?";
        }
        if (norm.includes('quien sos') || norm.includes('quien eres') || norm.includes('que haces')) {
            return "Soy el asistente virtual de GeoHogar, creado para ayudarte a encontrar la propiedad ideal y navegar rápidamente por toda la plataforma.";
        }
        if (norm.includes('gracias')) {
            return "¡De nada! Quedo a tu disposición para ayudarte en tu búsqueda inmobiliaria.";
        }

        return "Entendido. He procesado tu solicitud y podés ver las actualizaciones correspondientes en pantalla.";
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
