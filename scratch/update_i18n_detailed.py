import re

def main():
    filepath = r"c:\Users\jordy\Desktop\app hipo\js\i18n.js"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Spanish Replacement
    es_replacement = """    sheets_error_no_id: "No se encontraron anuncios válidos con columna 'id' en la hoja.",
    nav_glossary: "Ayuda & Glosario",
    help_title: "Glosario & Manual de Uso",
    help_subtitle: "Todo lo que necesitas saber sobre los tecnicismos inmobiliarios y cómo dominar GeoFind.",
    help_tab_glossary: "Glosario de Términos",
    help_tab_guide: "Manual de la App",
    
    // Terminologías / Tecnicismos
    glossary_roi_title: "ROI (Retorno de Inversión)",
    glossary_roi_desc: "Mide la rentabilidad anual bruta estimada del alquiler en relación al precio de compra de la propiedad. Fórmula: (Alquiler Mensual × 12) / Precio de Compra. Un ROI mayor al 7.0% anual se considera un rendimiento alto y óptimo para inversiones inmobiliarias en Paraguay.",
    glossary_low_value_title: "Bajo Valor de Mercado (Oportunidad)",
    glossary_low_value_desc: "Indica que el precio por metro cuadrado (USD/m²) de la propiedad está sustancialmente por debajo del promedio histórico estimado para esa misma zona y categoría de inmueble. Representa una compra con descuento inmediato y potencial de plusvalía a corto plazo.",
    glossary_radar_title: "Radar de Oportunidades",
    glossary_radar_desc: "Algoritmo inteligente de GeoFind que escanea, procesa y filtra publicaciones de múltiples portales en tiempo real. Clasifica las propiedades destacando automáticamente aquellas subvaluadas o con altas tasas de retorno de inversión antes que nadie en el mercado.",
    glossary_cap_rate_title: "Cap Rate (Tasa de Capitalización)",
    glossary_cap_rate_desc: "Indica el rendimiento neto anual de una propiedad alquilada. A diferencia del ROI bruto, el Cap Rate deduce todos los costos operativos (mantenimiento, expensas, impuestos e inactividad) del ingreso bruto anual. Fórmula: Ingreso Operativo Neto (NOI) / Valor del Inmueble.",
    glossary_flipping_title: "Flipping Inmobiliario",
    glossary_flipping_desc: "Estrategia de inversión que consiste en adquirir inmuebles con alto descuento (comúnmente por debajo del valor de tasación) o que requieren reformas estéticas, para luego revenderlas a su verdadero valor de mercado en el menor tiempo posible, capturando una ganancia neta rápida.",
    glossary_val_title: "Validador Inteligente",
    glossary_val_desc: "Algoritmo predictivo de tasación automática basado en IA. Analiza las dimensiones, ambientes y ubicación de cualquier propiedad para calcular su desvío porcentual respecto a la media de la zona, estimar el tiempo de venta promedio en días y emitir un veredicto de inversión.",
    glossary_m2_title: "Valor del Metro Cuadrado (USD/m²)",
    glossary_m2_desc: "Métrica de comparación estándar en el rubro inmobiliario. Permite evaluar objetivamente la relación precio-tamaño de diferentes inmuebles eliminando el sesgo de la superficie total, permitiendo comparar de forma homogénea distintas ofertas de una misma zona.",
    glossary_pulse_title: "Muestra y Pulso del Mercado",
    glossary_pulse_desc: "Indicadores estadísticos del comportamiento del mercado inmobiliario. Se alimentan de la agregación de cientos de anuncios en vivo en Paraguay para establecer el precio promedio real de cada barrio, tasas de demanda y variaciones porcentuales mensuales.",

    // Plan Premium (Modo de Pago)
    glossary_premium_title: "Membresía Inversor Premium",
    glossary_premium_desc: "Plan de suscripción diseñado para compradores e inversores inmobiliarios. Desbloquea el acceso ilimitado al Radar de Oportunidades (anuncios web externos filtrados por ROI y descuento), el Validador de Precios detallado con desglose de mercado, alertas de flipping y el Mapa de Calor de demanda.",
    glossary_premium_radar_title: "Radar PRO sin límites",
    glossary_premium_radar_desc: "Accede al catálogo de propiedades analizadas y extraídas de múltiples portales externos en Paraguay. Filtra sin restricciones las oportunidades con ROI superior al 7% o descuentos superiores al 10% del precio de mercado.",
    glossary_premium_heatmap_title: "Mapas de Calor Avanzados",
    glossary_premium_heatmap_desc: "Visualiza de forma gráfica en el mapa interactivo las zonas calientes de Asunción y principales urbes de Paraguay. Alterna capas de densidad de demanda de alquileres, precios por metro cuadrado y rendimientos promedio de rentabilidad.",

    // Broker PRO
    glossary_broker_title: "Plan Broker PRO",
    glossary_broker_desc: "Herramienta profesional avanzada diseñada exclusivamente para agentes inmobiliarios y brokers. Ofrece embudos de captación de propiedades directas de dueños, acceso directo a la bolsa de compradores en tiempo real, pines dorados de alta prioridad y herramientas de prospección comercial.",
    glossary_broker_leads_title: "Bolsa de Compradores (Leads en Vivo)",
    glossary_broker_leads_desc: "Permite a los brokers ver en tiempo real qué tipo de propiedades están buscando los usuarios de GeoFind en el mapa. Incluye detalles de presupuesto, zona de interés, y opción de contacto directo para ofrecer inmuebles de su propia cartera.",
    glossary_broker_funnel_title: "Embudo de Tasación Marca Blanca",
    glossary_broker_funnel_desc: "Enlace web personalizable que el Broker puede compartir en sus redes sociales. Permite a los propietarios tasar su inmueble gratis con la IA de GeoFind. A cambio, los datos de contacto del propietario y la tasación se envían en exclusiva al Broker para captar la propiedad.",
    glossary_broker_pines_title: "Pines de Ubicación Dorados",
    glossary_broker_pines_desc: "Los anuncios publicados por Brokers PRO se destacan con un marcador dorado premium en el mapa principal y se posicionan al principio de la lista del explorador de propiedades, maximizando la exposición y clics de potenciales compradores.",
    glossary_broker_radar_title: "Radar Predictivo de Prospección",
    glossary_broker_radar_desc: "Panel de analíticas avanzadas que muestra el balance entre oferta (propiedades en venta/alquiler) y demanda (búsquedas activas) en cada barrio, permitiendo identificar zonas de alta demanda insatisfecha para enfocar la captación de exclusivas.",

    // Manual de la App
    guide_step1_title: "1. Buscar y Filtrar Oportunidades",
    guide_step1_desc: "En el feed principal, puedes buscar por barrio o aplicar filtros independientes. El botón de **Alta Rentabilidad** destaca propiedades con ROI >7%, y el de **Bajo Valor** muestra inmuebles rebajados respecto al promedio.",
    guide_step2_title: "2. Análisis en el Mapa y Heatmaps",
    guide_step2_desc: "Usa la vista de Mapa para ubicar propiedades visualmente. Activa la capa de **Zonas de demanda (Heatmap)** para visualizar los barrios con mayor actividad, precios de metro cuadrado más altos o retornos de alquiler más convenientes.",
    guide_step3_title: "3. Centro de Alertas en Tiempo Real",
    guide_step3_desc: "Configura alertas para tus zonas preferidas. Elige qué te interesa (baja de precio de favoritos, nuevas propiedades, o alertas de flipping) y recibe avisos inmediatos en tu panel y correo para actuar antes que otros compradores.",
    guide_step4_title: "4. Publicar y Sincronización Masiva",
    guide_step4_desc: "Puedes publicar tus propiedades de forma individual llenando el formulario, o usar la opción PRO de **Sincronización con Google Sheets**. Simplemente publica tu planilla como CSV en la web y pégala para cargar todo tu catálogo en segundos.",
    guide_step5_title: "5. Broker PRO y Tasador Inteligente",
    guide_step5_desc: "Como Broker PRO, accede al listado de compradores activos buscando propiedades, o usa tu enlace de tasación de marca blanca. Compártelo en tus redes; los dueños tasarán sus casas gratis con IA y sus datos te llegarán directamente a ti."
  },"""

    # English Replacement
    en_replacement = """    sheets_error_no_id: "No valid listings with an 'id' column were found in the sheet.",
    nav_glossary: "Help & Glossary",
    help_title: "Glossary & User Guide",
    help_subtitle: "Everything you need to know about real estate technicalities and how to master GeoFind.",
    help_tab_glossary: "Glossary of Terms",
    help_tab_guide: "App User Guide",
    
    // Terminologies / Technicalities
    glossary_roi_title: "ROI (Return on Investment)",
    glossary_roi_desc: "Measures the estimated gross annual rental yield relative to the property's purchase price. Formula: (Monthly Rent × 12) / Purchase Price. An annual ROI above 7.0% is considered high and optimal for real estate investments in Paraguay.",
    glossary_low_value_title: "Under Market Value (Opportunity)",
    glossary_low_value_desc: "Indicates that the property's price per square meter (USD/sqm) is substantially below the historical average estimated for that specific zone and category. Represents an immediate discount purchase with short-term capital gain potential.",
    glossary_radar_title: "Opportunity Radar",
    glossary_radar_desc: "GeoFind's smart algorithm that scans, processes, and filters listings from multiple external portals in real time. It automatically highlights underpriced properties or those with high yields before anyone else in the market.",
    glossary_cap_rate_title: "Cap Rate (Capitalization Rate)",
    glossary_cap_rate_desc: "Indicates the expected net annual yield of a rental property. Unlike gross ROI, Cap Rate deducts all operating expenses (maintenance, fees, taxes, vacancy) from the gross annual income. Formula: Net Operating Income (NOI) / Property Value.",
    glossary_flipping_title: "Real Estate Flipping",
    glossary_flipping_desc: "Investment strategy consisting of acquiring heavily discounted properties (often below appraisal value) or those needing aesthetic renovations, then reselling them at true market value as quickly as possible to capture quick net profits.",
    glossary_val_title: "Smart Validator",
    glossary_val_desc: "Predictive automatic appraisal algorithm powered by AI. Analyzes size, rooms, and location of any property to calculate its percentage deviation from the neighborhood average, estimate average days to sell, and issue an investment verdict.",
    glossary_m2_title: "Price per Square Meter (USD/sqm)",
    glossary_m2_desc: "Standard comparison metric in real estate. Allows for objective evaluation of the price-to-size ratio of different properties, removing total area bias and enabling homogeneous comparison of different offers in the same area.",
    glossary_pulse_title: "Market Sample & Pulse",
    glossary_pulse_desc: "Statistical indicators of real estate market behavior. Fed by the aggregation of hundreds of live listings in Paraguay to establish the true average price of each neighborhood, demand rates, and monthly percentage changes.",

    // Plan Premium (Payment Mode)
    glossary_premium_title: "Premium Investor Membership",
    glossary_premium_desc: "Subscription plan designed for real estate buyers and investors. Unlocks unlimited access to the Opportunity Radar (external web listings filtered by ROI and discount), detailed Price Validator with market breakdown, flipping alerts, and demand Heatmap.",
    glossary_premium_radar_title: "Unlimited PRO Radar",
    glossary_premium_radar_desc: "Access the catalog of properties analyzed and extracted from multiple external portals in Paraguay. Filter without limits opportunities with ROI above 7% or discounts greater than 10% of market price.",
    glossary_premium_heatmap_title: "Advanced Heatmaps",
    glossary_premium_heatmap_desc: "Graphically visualize hot zones of Asuncion and main cities of Paraguay on the interactive map. Toggle layers for rental demand density, average prices per sqm, and average yields.",

    // Broker PRO
    glossary_broker_title: "Broker PRO Plan",
    glossary_broker_desc: "Advanced professional tool designed exclusively for real estate agents and brokers. Offers lead capture funnels direct from owners, real-time buyer directory access, high-priority golden pins, and commercial prospecting tools.",
    glossary_broker_leads_title: "Buyer Marketplace (Live Leads)",
    glossary_broker_leads_desc: "Allows brokers to see in real time what types of properties GeoFind users are searching for on the map. Includes budget details, zone of interest, and direct contact options to offer listings from their own portfolio.",
    glossary_broker_funnel_title: "White-Label Valuation Funnel",
    glossary_broker_funnel_desc: "Customizable web link that the Broker can share on social networks. Allows owners to appraise their property for free with GeoFind's AI. In exchange, the owner's contact details and appraisal are sent exclusively to the Broker to list the property.",
    glossary_broker_pines_title: "Golden Location Pins",
    glossary_broker_pines_desc: "Listings published by Broker PROs are highlighted with a premium golden marker on the main map and positioned at the top of the explorer list, maximizing exposure and clicks from potential buyers.",
    glossary_broker_radar_title: "Predictive Prospecting Radar",
    glossary_broker_radar_desc: "Advanced analytics panel showing the balance between supply (properties for sale/rent) and demand (active searches) in each neighborhood, allowing identification of high-demand zones to focus listing efforts.",

    // Manual de la App
    guide_step1_title: "1. Search and Filter Opportunities",
    guide_step1_desc: "On the main feed, you can search by neighborhood or apply smart filters. The **High Yield** button highlights properties with ROI >7%, and the **Underpriced** button shows properties discounted relative to the average.",
    guide_step2_title: "2. Map Analysis and Heatmaps",
    guide_step2_desc: "Use the Map view to locate properties visually. Activate the **Demand Zones (Heatmap)** layer to visualize neighborhoods with the highest activity, highest prices per sqm, or most convenient rental yields.",
    guide_step3_title: "3. Real-Time Alert Center",
    guide_step3_desc: "Set up alerts for your preferred areas. Choose what interests you (price drop of favorites, new properties, or flipping alerts) and receive immediate notifications in your panel and email to act before other buyers.",
    guide_step4_title: "4. Publish and Bulk Sync",
    guide_step4_desc: "You can publish your properties individually by filling out the form, or use the PRO option **Google Sheets Sync**. Simply publish your sheet as CSV on the web and paste the link to load your entire catalog in seconds.",
    guide_step5_title: "5. Broker PRO & Smart Appraiser",
    guide_step5_desc: "As a Broker PRO, access the list of active buyers searching for properties, or use your white-label appraisal link. Share it on your socials; owners will appraise their homes for free with AI, and their details will go directly to you."
  },"""

    # German Replacement
    de_replacement = """    sheets_error_no_id: "Es wurden keine gültigen Anzeigen mit der Spalte 'id' im Tabellenblatt gefunden.",
    nav_glossary: "Hilfe & Glossar",
    help_title: "Glossar & Benutzerhandbuch",
    help_subtitle: "Alles, was Sie über Immobilienfachbegriffe wissen müssen und wie Sie GeoFind beherrschen.",
    help_tab_glossary: "Glossar der Begriffe",
    help_tab_guide: "App-Handbuch",
    
    // Terminologies / Technicalities
    glossary_roi_title: "ROI (Rendite einer Investition)",
    glossary_roi_desc: "Misst die geschätzte Bruttojahresmietrendite im Verhältnis zum Kaufpreis der Immobilie. Formel: (Monatsmiete × 12) / Kaufpreis. Eine jährliche Rendite von über 7,0 % gilt in Paraguay als hohe und optimale Rendite für Immobilieninvestitionen.",
    glossary_low_value_title: "Unter Marktwert (Gelegenheit)",
    glossary_low_value_desc: "Zeigt an, dass der Quadratmeterpreis (USD/m²) der Immobilie erheblich unter dem historischen Durchschnitt liegt, der für diese spezifische Zone und Immobilienkategorie geschätzt wurde. Stellt einen sofortigen Rabattkauf mit kurzfristigem Wertsteigerungspotenzial dar.",
    glossary_radar_title: "Gelegenheitsradar",
    glossary_radar_desc: "Der intelligente Algorithmus von GeoFind, der Inserate von mehreren externen Portalen in Echtzeit scannt, verarbeitet und filtert. Er markiert automatisch unterbewertete Immobilien oder solche mit hohen Mietrenditen vor allen anderen auf dem Markt.",
    glossary_cap_rate_title: "Cap-Rate (Kapitalisierungsrate)",
    glossary_cap_rate_desc: "Gibt die erwartete Nettomietrendite einer Immobilie an. Im Gegensatz zum Brutto-ROI zieht die Cap-Rate alle Betriebskosten (Instandhaltung, Gebühren, Steuern, Leerstand) von den jährlichen Bruttoeinnahmen ab. Formel: Netto-Betriebsergebnis (NOI) / Immobilienwert.",
    glossary_flipping_title: "Immobilien-Flipping",
    glossary_flipping_desc: "Investitionsstrategie, bei der stark reduzierte Immobilien (oft unter dem Schätzwert) oder renovierungsbedürftige Objekte erworben und so schnell wie möglich zum tatsächlichen Marktwert weiterverkauft werden, um schnelle Nettogewinne zu erzielen.",
    glossary_val_title: "Intelligenter Validator",
    glossary_val_desc: "KI-basierter Algorithmus, der schätzt, ob eine Immobilie einen fairen Preis hat, die prozentuale Abweichung vom Nachbarschaftsdurchschnitt berechnet und die Tage auf dem Markt schätzt.",
    glossary_m2_title: "Quadratmeterpreis (USD/m²)",
    glossary_m2_desc: "Standard-Vergleichsmetrik im Immobilienbereich. Ermöglicht eine objektive Bewertung des Preis-Größen-Verhältnisses verschiedener Immobilien, indem die Verzerrung durch die Gesamtfläche eliminiert wird und ein homogener Vergleich verschiedener Angebote im selben Gebiet möglich ist.",
    glossary_pulse_title: "Marktstichprobe & Puls",
    glossary_pulse_desc: "Statistische Indikatoren für das Verhalten des Immobilienmarktes. Gefüttert durch die Aggregation von Hunderten von Live-Inseraten in Paraguay, um den tatsächlichen Durchschnittspreis jedes Stadtteils, die Nachfrageraten und die monatlichen prozentualen Veränderungen zu ermitteln.",

    // Plan Premium (Payment Mode)
    glossary_premium_title: "Premium-Investorenmitgliedschaft",
    glossary_premium_desc: "Abonnement-Plan für Immobilienkäufer und Investoren. Schaltet den unbegrenzten Zugriff auf den Gelegenheitsradar (externe Inserate gefiltert nach ROI und Rabatt), den detaillierten Preisvalidator mit Marktaufschlüsselung, Flipping-Warnungen und die Nachfrage-Heatmap frei.",
    glossary_premium_radar_title: "Unbegrenzter PRO-Radar",
    glossary_premium_radar_desc: "Greifen Sie auf das Inseratsarchiv analysierter Immobilien zu, die von mehreren externen Portalen in Paraguay erfasst wurden. Filtern Sie ohne Einschränkungen Gelegenheiten mit einer Rendite über 7 % oder Rabatten von mehr als 10 % des Marktpreises.",
    glossary_premium_heatmap_title: "Erweiterte Heatmaps",
    glossary_premium_heatmap_desc: "Visualisieren Sie Hotzones von Asuncion und den wichtigsten Städten Paraguays grafisch auf der interaktiven Karte. Schalten Sie Ebenen für Mietnachfragedichte, Durchschnittspreise pro m² und durchschnittliche Renditen um.",

    // Broker PRO
    glossary_broker_title: "Broker PRO-Plan",
    glossary_broker_desc: "Erweitertes professionelles Tool, das exklusiv für Immobilienmakler entwickelt wurde. Bietet Trichter zur Lead-Erfassung direkt von Eigentümern, direkten Zugriff auf das Echtzeit-Käuferverzeichnis, goldene Pins mit hoher Priorität und Tools zur geschäftlichen Akquise.",
    glossary_broker_leads_title: "Käufermarktplatz (Live-Leads)",
    glossary_broker_leads_desc: "Ermöglicht Maklern zu sehen, nach welchen Immobilienarten GeoFind-Nutzer in Echtzeit auf der Karte suchen. Enthält Budgetdetails, interessante Zonen und direkte Kontaktoptionen, um Objekte aus dem eigenen Portfolio anzubieten.",
    glossary_broker_funnel_title: "White-Label-Bewertungstrichter",
    glossary_broker_funnel_desc: "Anpassbarer Web-Link, den der Broker in sozialen Netzwerken teilen kann. Ermöglicht Eigentümern, ihre Immobilie kostenlos mit der KI von GeoFind bewerten zu lassen. Im Gegenzug werden die Kontaktdaten des Eigentümers und die Bewertung exklusiv an den Broker gesendet, um das Objekt zu erfassen.",
    glossary_broker_pines_title: "Goldene Standort-Pins",
    glossary_broker_pines_desc: "Von Broker PROs veröffentlichte Inserate werden mit einer goldenen Premium-Markierung auf der Hauptkarte hervorgehoben und ganz oben auf der Liste im Explorer positioniert, was die Sichtbarkeit und Klicks von potenziellen Käufern maximiert.",
    glossary_broker_radar_title: "Prädiktiver Akquise-Radar",
    glossary_broker_radar_desc: "Erweitertes Analyse-Panel, das das Gleichgewicht zwischen Angebot (Immobilien zum Verkauf/zur Miete) und Nachfrage (aktive Suchen) in jedem Stadtteil anzeigt, um Zonen mit hoher ungedeckter Nachfrage zu identifizieren, auf die sich die Akquise konzentrieren sollte.",

    // Manual de la App
    guide_step1_title: "1. Suchen und Filtern von Gelegenheiten",
    guide_step1_desc: "Im Haupt-Feed können Sie nach Stadtteilen suchen oder intelligente Filter anwenden. Die Schaltfläche **Hohe Rendite** hebt Immobilien mit einem ROI >7 % hervor, und **Unter Marktwert** zeigt reduzierte Immobilien an.",
    guide_step2_title: "2. Kartenanalyse und Heatmaps",
    guide_step2_desc: "Verwenden Sie die Kartenansicht, um Immobilien visuell zu lokalisieren. Aktivieren Sie die Ebene **Nachfragegebiete (Heatmap)**, um Stadtteile mit der höchsten Aktivität, den höchsten Quadratmeterpreisen oder den günstigsten Mietrenditen anzuzeigen.",
    guide_step3_title: "3. Echtzeit-Warnungscenter",
    guide_step3_desc: "Richten Sie Warnungen für Ihre bevorzugten Gebiete ein. Wählen Sie, was Sie interessiert (Preissenkung von Favoriten, neue Immobilien oder Flipping-Warnungen) und erhalten Sie sofortige Benachrichtigungen im Panel und per E-Mail.",
    guide_step4_title: "4. Veröffentlichen und Massensynchronisierung",
    guide_step4_desc: "Sie können Ihre Immobilien einzeln veröffentlichen, indem Sie das Formular ausfüllen, oder die PRO-Option **Google Sheets-Synchronisierung** nutzen. Veröffentlichen Sie Ihre Tabelle als CSV im Web und fügen Sie den Link ein.",
    guide_step5_title: "5. Broker PRO & Intelligenter Gutachter",
    guide_step5_desc: "Als Broker PRO können Sie auf die Liste der aktiven Käufer zugreifen oder Ihren White-Label-Bewertungslink verwenden. Teilen Sie ihn in Ihren sozialen Netzwerken; Eigentümer bewerten ihr Haus kostenlos mit KI, und die Daten gehen direkt an Sie."
  },"""

    # Portuguese Replacement
    pt_replacement = """    sheets_error_no_id: "Nenhum anúncio válido com a coluna 'id' foi encontrado na planilha.",
    nav_glossary: "Ajuda e Glossário",
    help_title: "Glossário e Manual do Usuário",
    help_subtitle: "Tudo o que você precisa saber sobre termos técnicos imobiliários e como dominar o GeoFind.",
    help_tab_glossary: "Glossário de Termos",
    help_tab_guide: "Manual do App",
    
    // Terminologies / Technicalities
    glossary_roi_title: "ROI (Retorno sobre o Investimento)",
    glossary_roi_desc: "Mede a rentabilidade anual bruta estimada do aluguel em relação ao preço de compra do imóvel. Fórmula: (Aluguel Mensal × 12) / Preço de Compra. Um ROI anual acima de 7,0% é considerado alto e ideal para investimentos imobiliários no Paraguai.",
    glossary_low_value_title: "Baixo Valor de Mercado (Oportunidade)",
    glossary_low_value_desc: "Indica que o preço por metro quadrado (USD/m²) do imóvel está substancialmente abaixo da média histórica estimada para a mesma zona e categoria. Representa uma compra com desconto imediato e potencial de ganho de capital a curto prazo.",
    glossary_radar_title: "Radar de Oportunidades",
    glossary_radar_desc: "Algoritmo inteligente do GeoFind que rastreia, processa e filtra anúncios de múltiplos portais externos em tempo real. Destaca automaticamente imóveis subvalorizados ou com altas taxas de retorno antes de qualquer outra pessoa no mercado.",
    glossary_cap_rate_title: "Cap Rate (Taxa de Capitalização)",
    glossary_cap_rate_desc: "Indica o rendimento líquido anual esperado de um imóvel de aluguel. Ao contrário do ROI bruto, o Cap Rate deduz todos os custos operacionais (manutenção, taxas, impostos, vacância) da receita bruta anual. Fórmula: Receita Operacional Líquida (NOI) / Valor do Imóvel.",
    glossary_flipping_title: "Flipping Imobiliário",
    glossary_flipping_desc: "Estratégia de investimento que consiste em adquirir imóveis com grande desconto (frequentemente abaixo do valor de avaliação) ou que necessitam de reformas estéticas, para depois revendê-los pelo valor real de mercado o mais rápido possível, capturando lucros líquidos rápidos.",
    glossary_val_title: "Validador Inteligente",
    glossary_val_desc: "Algoritmo preditivo de avaliação automática baseado em IA. Analisa o tamanho, cômodos e localização de qualquer imóvel para calcular seu desvio percentual em relação à média do bairro, estimar a média de dias para venda e emitir um veredicto de investimento.",
    glossary_m2_title: "Preço por Metro Quadrado (USD/m²)",
    glossary_m2_desc: "Métrica padrão de comparação no setor imobiliário. Permite avaliar objetivamente a relação preço-tamanho de diferentes imóveis, eliminando o viés da área total e possibilitando uma comparação homogênea de diferentes ofertas na mesma zona.",
    glossary_pulse_title: "Amostra e Pulso do Mercado",
    glossary_pulse_desc: "Indicadores estatísticos do comportamento do mercado imobiliário. Alimentados pela agregação de centenas de anúncios ao vivo no Paraguai para estabelecer o preço médio real de cada bairro, taxas de demanda e variações percentuais mensais.",

    // Plan Premium (Payment Mode)
    glossary_premium_title: "Assinatura Investidor Premium",
    glossary_premium_desc: "Plano de assinatura projetado para compradores e investidores imobiliários. Desbloqueia acesso ilimitado ao Radar de Oportunidades (anúncios externos filtrados por ROI e desconto), Validador de Preços detalhado com detalhamento de mercado, alertas de flipping e Heatmap de demanda.",
    glossary_premium_radar_title: "Radar PRO Sem Limites",
    glossary_premium_radar_desc: "Aceda ao catálogo de imóveis analisados reunidos de múltiplos portais externos no Paraguai. Filtre sem limites oportunidades com ROI acima de 7% ou descontos superiores a 10% do preço de mercado.",
    glossary_premium_heatmap_title: "Heatmaps Avançados",
    glossary_premium_heatmap_desc: "Visualize graficamente zonas quentes de Assunção e principais cidades do Paraguai no mapa interativo. Alterne camadas de densidade de demanda de aluguel, preços médios por m² e rendimentos médios.",

    // Broker PRO
    glossary_broker_title: "Plano Broker PRO",
    glossary_broker_desc: "Ferramenta profissional avançada projetada exclusivamente para corretores e imobiliárias. Oferece funis de captação de leads direto dos proprietários, acesso direto ao diretório de compradores em tempo real, pins dourados de alta prioridade e ferramentas de prospecção comercial.",
    glossary_broker_leads_title: "Bolsa de Compradores (Leads ao Vivo)",
    glossary_broker_leads_desc: "Permite aos corretores ver em tempo real que tipo de imóveis os usuários do GeoFind estão buscando no mapa. Inclui detalhes de orçamento, zona de interesse e opções de contato direto para oferecer listagens de seu próprio portfólio.",
    glossary_broker_funnel_title: "Funil de Avaliação Marca Branca",
    glossary_broker_funnel_desc: "Link da web personalizável que o Corretor pode compartilhar nas redes sociais. Permite aos proprietários avaliar seu imóvel gratuitamente com a IA do GeoFind. Em troca, os detalhes de contato do proprietário e a avaliação são enviados exclusivamente ao Corretor para captar o imóvel.",
    glossary_broker_pines_title: "Pins de Localização Dourados",
    glossary_broker_pines_desc: "Anúncios publicados por Brokers PRO são destacados com um marcador dourado premium no mapa principal e posicionados no topo da lista do explorador, maximizando a exposição e cliques de potenciais compradores.",
    glossary_broker_radar_title: "Radar Preditivo de Captação",
    glossary_broker_radar_desc: "Painel de análise avançada mostrando o equilíbrio entre a oferta (imóveis à venda/aluguel) e a demanda (buscas ativas) em cada bairro, permitindo identificar zonas de alta demanda para focar os esforços de captação.",

    // Manual de la App
    guide_step1_title: "1. Buscar e Filtrar Oportunidades",
    guide_step1_desc: "No feed principal, você pode pesquisar por bairro ou aplicar filtros inteligentes. O botão de **Alta Rentabilidade** destaca imóveis com ROI >7%, e o de **Baixo Valor** mostra imóveis com desconto em relação à média.",
    guide_step2_title: "2. Análise no Mapa e Heatmaps",
    guide_step2_desc: "Use a visualização de Mapa para localizar imóveis visualmente. Ative a camada de **Zonas de demanda (Heatmap)** para visualizar os bairros com maior atividade, preços de metro quadrado mais altos ou retornos de aluguel mais convenientes.",
    guide_step3_title: "3. Centro de Alertas em Tempo Real",
    guide_step3_desc: "Configure alertas para as suas zonas preferidas. Escolha o que lhe interessa (queda de preço de favoritos, novos imóveis ou alertas de flipping) e receba avisos imediatos no seu painel e e-mail para agir antes de outros compradores.",
    guide_step4_title: "4. Publicar e Sincronização Massiva",
    guide_step4_desc: "Você pode publicar seus imóveis individualmente preenchendo o formulário, ou usar la opção PRO de **Sincronização com Google Sheets**. Basta publicar sua planilha como CSV na web e colá-la para carregar todo o seu catálogo em segundos.",
    guide_step5_title: "5. Broker PRO e Avaliador Inteligente",
    guide_step5_desc: "Como Broker PRO, acesse a lista de compradores ativos buscando imóveis, ou use seu link de avaliação white-label. Compartilhe-o em suas redes; os proprietários avaliarão suas casas gratuitamente com IA e os dados chegarão diretamente a você."
  },"""

    # Spanish Replacement Regex
    pattern_es = r"sheets_error_no_id:[^\n]*,\s*nav_glossary:[^}]+},"
    # Wait, let's just search and replace directly using regex or standard splits.
    # Let's inspect the sections in content.
    
    # Spanish replacement target
    content = re.sub(
        r'sheets_error_no_id:\s*"No se encontraron anuncios válidos con columna \'id\' en la hoja\.",\s*nav_glossary:.*?},\s*en:',
        es_replacement + "\n  en:",
        content,
        flags=re.DOTALL
    )

    # English replacement target
    content = re.sub(
        r'sheets_error_no_id:\s*"No valid listings with an \'id\' column were found in the sheet\.",\s*nav_glossary:.*?},\s*de:',
        en_replacement + "\n  de:",
        content,
        flags=re.DOTALL
    )

    # German replacement target
    content = re.sub(
        r'sheets_error_no_id:\s*"Es wurden keine gültigen Anzeigen mit der Spalte \'id\' im Tabellenblatt gefunden\.",\s*nav_glossary:.*?},\s*pt:',
        de_replacement + "\n  pt:",
        content,
        flags=re.DOTALL
    )

    # Portuguese replacement target
    content = re.sub(
        r'sheets_error_no_id:\s*"Nenhum anúncio válido com a coluna \'id\' foi encontrado na planilha\.",\s*nav_glossary:.*?}\s*}\s*;',
        pt_replacement + "\n};\n\nwindow.translations = translations;",
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated i18n file with detailed technical translations.")

if __name__ == '__main__':
    main()
