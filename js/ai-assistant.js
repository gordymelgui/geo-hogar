/**
 * GeoHogar AI Assistant
 * Handles Voice Recognition, AI Chat, and UI Control
 */

class GeoHogarAI {
    constructor() {
        this.apiKey = 'AIzaSyCizkzazOqY-sz5FQMMLWbugZ4pNAnrNog'; // Gemini API Key Configured
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

        // Tipo
        if (norm.includes('casa'))          criteria.type = 'Casa';
        else if (norm.includes('departamento') || norm.includes('depto') || norm.includes('dpto') || norm.includes('apartamento')) criteria.type = 'Departamento';
        else if (norm.includes('duplex'))   criteria.type = 'Dúplex';
        else if (norm.includes('penthouse') || norm.includes('atico')) criteria.type = 'Penthouse';
        else if (norm.includes('ph'))       criteria.type = 'PH';
        else if (norm.includes('terreno'))  criteria.type = 'Terreno';
        else if (norm.includes('oficina'))  criteria.type = 'Oficina';
        else if (norm.includes('local'))    criteria.type = 'Local';
        else if (norm.includes('galpon') || norm.includes('deposito') || norm.includes('tinglado')) criteria.type = 'Galpón';
        else if (norm.includes('estancia') || norm.includes('chacra') || norm.includes('quinta') || norm.includes('campo')) criteria.type = 'Estancia';

        // Operación
        if (norm.includes('alquiler') || norm.includes('alquilar') || norm.includes('arrendar')) criteria.op = 'Alquiler';
        else if (norm.includes('venta') || norm.includes('comprar') || norm.includes('compra')) criteria.op = 'Venta';

        // Ambientes / Cuartos
        const roomsMatch = norm.match(/(\d+)\s*(?:ambientes?|habitaciones?|cuartos?|dormitorios?)/);
        if (roomsMatch) criteria.rooms = parseInt(roomsMatch[1]);

        // m2
        const m2Max = norm.match(/(?:hasta|menos de|maximo|máximo)\s*(\d+)\s*m/);
        const m2Min = norm.match(/(?:minimo|mínimo|mas de|desde)\s*(\d+)\s*m/);
        if (m2Max) criteria.maxM2 = parseInt(m2Max[1]);
        if (m2Min) criteria.minM2 = parseInt(m2Min[1]);

        // Puntos de Interés (POI)
        if (norm.includes('hospital') || norm.includes('clinica') || norm.includes('clínica') || norm.includes('medico') || norm.includes('médico')) criteria.poiType = 'hospital';
        else if (norm.includes('escuela') || norm.includes('colegio') || norm.includes('escuel')) criteria.poiType = 'escuela';
        else if (norm.includes('universidad') || norm.includes('facultad')) criteria.poiType = 'universidad';
        else if (norm.includes('supermercado') || norm.includes('comercio') || norm.includes('tienda')) criteria.poiType = 'supermercado';
        else if (norm.includes('parque') || norm.includes('verde') || norm.includes('plaza')) criteria.poiType = 'parque';

        // Ubicación / Ciudad / País
        for (const loc of locations) {
            if (norm.includes(loc)) {
                criteria.location = loc;
                break;
            }
        }
        if (!criteria.location) {
            const matchEn = norm.match(/(?:en|de)\s+([a-zñáéíóú]+)/i);
            if (matchEn) {
                const candidate = matchEn[1].trim();
                const stopWords = ['el', 'la', 'un', 'una', 'mi', 'mis', 'este', 'esta', 'mapa', 'venta', 'alquiler', 'casa', 'depto', 'departamento', 'ph', 'terreno', 'oficina', 'local', 'duplex', 'penthouse', 'galpon', 'estancia', 'chacra', 'quinta', 'campo', 'tinglado', 'deposito'];
                if (!stopWords.includes(candidate)) {
                    criteria.location = candidate;
                }
            }
        }

        if (isMapFilter) {
            // ===== RUTA 1: FILTRAR Y IR AL MAPA =====
            criteria.highlight = true;
            document.getElementById('nav-map')?.click();
            setTimeout(() => {
                if (window.filterMapMarkers) window.filterMapMarkers(criteria);
            }, 300);
            navigated = true;
        } else if (Object.keys(criteria).length > 0 || norm.includes('buscar') || norm.includes('encontrar') || norm.includes('ver') || norm.includes('mostrar')) {
            // ===== RUTA 2: FILTRAR EXPLORADOR PRINCIPAL Y IR A EXPLORAR =====
            document.getElementById('nav-explore')?.click();

            // 1. Sincronizar pastillas de categorías
            const catValue = criteria.type || '';
            const catBtns = document.querySelectorAll('.cat-btn');
            catBtns.forEach(btn => {
                if ((btn.getAttribute('data-cat') || '').toLowerCase() === catValue.toLowerCase()) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // 2. Sincronizar pastillas de países (siempre Paraguay)
            const countryValue = 'Paraguay';
            const countryPills = document.querySelectorAll('.country-pill');
            countryPills.forEach(pill => {
                if ((pill.getAttribute('data-country') || '') === 'Paraguay') {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });

            // 3. Sincronizar buscador global (por ejemplo con la ciudad/barrio o término extra)
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                let query = '';
                // Si hay una localización de ciudad (ej: asuncion, villa morra)
                if (criteria.location && criteria.location !== 'paraguay') {
                    query = criteria.location;
                } else {
                    // Limpiar stop words y ver si queda algún término descriptivo
                    let cleanQuery = norm.replace(/\b(busc\w*|encontr\w*|mu[eé]strame|muetrame|quiero ver|mostrar|ense[ñn]a|las|los|la|el|un|una|unos|unas|en|de|por favor|gracias|ya|ahora|quiero|ver|mapa|aqu[ií]|all[ií]|casas|casa|propiedades|propiedad|inmuebles|paraguay|departamento|depto|dpto|apartamento|terreno|duplex|penthouse|galpon|estancia|chacra|quinta|campo|tinglado|deposito|oficina|local)\b/ig, ' ').trim().replace(/\s+/g,' ');
                    if (cleanQuery.length >= 2) {
                        query = cleanQuery;
                    }
                }
                searchInput.value = query;
            }

            // 4. Aplicar los filtros unificados
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
        const cleanKey = 'AIzaSyATmOQwr49aupctjN56M99Ru2-HlTBjir8'.trim();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`;
        
        const activeView = document.querySelector('.view.active')?.id || 'explore';
        const isMapRequest = prompt.toLowerCase().includes('mapa');
        const viewText = isMapRequest ? 'el mapa interactivo' : 'la lista de exploración';

        const systemPrompt = `Eres la Inteligencia Artificial integrada DENTRO de la app GeoHogar. 
        El usuario YA ESTÁ usando la app.
        Acción que estás realizando: Filtrando y mostrando los resultados en ${viewText}.
        REGLA DE ORO: NUNCA digas que vas a mostrar algo en el mapa a menos que el usuario te lo pida con la palabra "mapa". Si no, dile que los ves en la lista o explorador principal.
        Si el usuario pregunta sobre noticias inmobiliarias (ej. Forbes, Rediex) o análisis de mercado actual, USA el buscador para obtener los datos más recientes.
        IMPORTANTE: Responde en texto plano. NO uses asteriscos, ni negritas, ni viñetas, ni markdown de ningún tipo.
        Responde de forma natural, directa y conversacional (máximo 2 frases).`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + "\n\nUsuario: " + prompt }] }],
                    tools: [{ google_search: {} }]
                })
            });
            
            const data = await response.json();
            if (data.candidates && data.candidates[0].content) {
                let rawText = data.candidates[0].content.parts[0].text;
                return rawText.replace(/\*/g, '').replace(/_/g, '').trim();
            }
        } catch (e) { console.error(e); }

        return "Filtros aplicados. Echa un vistazo a los resultados.";
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
