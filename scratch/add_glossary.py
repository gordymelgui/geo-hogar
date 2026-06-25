import json
import os

with open('js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the translations object
es_start = content.find('es: {') + 4
en_start = content.find('en: {') + 4
pt_start = content.find('pt: {') + 4
de_start = content.find('de: {') + 4

glossary_es = """
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
    glossary_premium_title: "Membresía Inversor Premium",
    glossary_premium_desc: "Plan de suscripción diseñado para compradores e inversores inmobiliarios. Desbloquea el acceso ilimitado al Radar de Oportunidades (anuncios web externos filtrados por ROI y descuento), el Validador de Precios detallado con desglose de mercado, alertas de flipping y el Mapa de Calor de demanda.",
    glossary_premium_radar_title: "Radar PRO sin límites",
    glossary_premium_radar_desc: "Accede al catálogo de propiedades analizadas y extraídas de múltiples portales externos en Paraguay. Filtra sin restricciones las oportunidades con ROI superior al 7% o descuentos superiores al 10% del precio de mercado.",
    glossary_premium_heatmap_title: "Mapas de Calor Avanzados",
    glossary_premium_heatmap_desc: "Visualiza de forma gráfica en el mapa interactivo las zonas calientes de Asunción y principales urbes de Paraguay. Alterna capas de densidad de demanda de alquileres, precios por metro cuadrado y rendimientos promedio de rentabilidad.",
    glossary_broker_title: "Plan Broker PRO",
    glossary_broker_desc: "Herramienta profesional avanzada diseñada exclusivamente para agentes inmobiliarios y brokers. Ofrece embudos de captación de propiedades directas de dueños, acceso directo a la bolsa de compradores en tiempo real, pines dorados de alta prioridad y herramientas de prospección comercial.",
"""

glossary_en = """
    glossary_roi_title: "ROI (Return on Investment)",
    glossary_roi_desc: "Measures the estimated annual gross rental yield relative to the property's purchase price. Formula: (Monthly Rent × 12) / Purchase Price. An ROI over 7.0% per year is considered high and optimal for real estate investments in Paraguay.",
    glossary_low_value_title: "Below Market Value (Opportunity)",
    glossary_low_value_desc: "Indicates that the property's price per square meter (USD/m²) is substantially below the historical estimated average for that same area and property category. Represents an immediate discount purchase with short-term appreciation potential.",
    glossary_radar_title: "Opportunities Radar",
    glossary_radar_desc: "GeoFind's smart algorithm that scans, processes, and filters listings from multiple portals in real time. It classifies properties, automatically highlighting those that are undervalued or have high ROI rates before anyone else in the market.",
    glossary_cap_rate_title: "Cap Rate (Capitalization Rate)",
    glossary_cap_rate_desc: "Indicates the annual net yield of a rented property. Unlike gross ROI, Cap Rate deducts all operating costs (maintenance, expenses, taxes, and vacancy) from the annual gross income. Formula: Net Operating Income (NOI) / Property Value.",
    glossary_flipping_title: "Real Estate Flipping",
    glossary_flipping_desc: "Investment strategy that consists of acquiring properties at a high discount (commonly below appraisal value) or that require aesthetic reforms, to then resell them at their true market value in the shortest possible time, capturing a quick net profit.",
    glossary_val_title: "Smart Validator",
    glossary_val_desc: "Predictive automatic appraisal algorithm based on AI. It analyzes the dimensions, rooms, and location of any property to calculate its percentage deviation from the area average, estimate the average sale time in days, and issue an investment verdict.",
    glossary_m2_title: "Value per Square Meter (USD/m²)",
    glossary_m2_desc: "Standard comparison metric in real estate. It allows objectively evaluating the price-size ratio of different properties by eliminating total area bias, allowing homogeneous comparison of different offers in the same area.",
    glossary_pulse_title: "Market Sample and Pulse",
    glossary_pulse_desc: "Statistical indicators of real estate market behavior. Fed by aggregating hundreds of live listings in Paraguay to establish the true average price for each neighborhood, demand rates, and monthly percentage variations.",
    glossary_premium_title: "Premium Investor Membership",
    glossary_premium_desc: "Subscription plan designed for buyers and real estate investors. Unlocks unlimited access to the Opportunities Radar (external web listings filtered by ROI and discount), detailed Price Validator with market breakdown, flipping alerts, and Demand Heatmap.",
    glossary_premium_radar_title: "Unlimited PRO Radar",
    glossary_premium_radar_desc: "Access the catalog of analyzed properties extracted from multiple external portals in Paraguay. Filter opportunities with ROI greater than 7% or discounts over 10% of market price without restrictions.",
    glossary_premium_heatmap_title: "Advanced Heatmaps",
    glossary_premium_heatmap_desc: "Graphically visualize the hot zones of Asunción and main cities of Paraguay on the interactive map. Alternate layers of rental demand density, prices per square meter, and average profitability yields.",
    glossary_broker_title: "Broker PRO Plan",
    glossary_broker_desc: "Advanced professional tool designed exclusively for real estate agents and brokers. Offers capture funnels for direct-by-owner properties, direct access to the real-time buyers pool, high-priority golden pins, and commercial prospecting tools.",
"""

glossary_pt = """
    glossary_roi_title: "ROI (Retorno sobre Investimento)",
    glossary_roi_desc: "Mede o rendimento bruto anual estimado de aluguel em relação ao preço de compra do imóvel. Fórmula: (Aluguel Mensal × 12) / Preço de Compra. Um ROI superior a 7,0% ao ano é considerado alto e ideal para investimentos imobiliários no Paraguai.",
    glossary_low_value_title: "Abaixo do Valor de Mercado (Oportunidade)",
    glossary_low_value_desc: "Indica que o preço por metro quadrado (USD/m²) do imóvel está substancialmente abaixo da média histórica estimada para essa mesma área e categoria de imóvel. Representa uma compra com desconto imediato e potencial de valorização a curto prazo.",
    glossary_radar_title: "Radar de Oportunidades",
    glossary_radar_desc: "Algoritmo inteligente do GeoFind que rastreia, processa e filtra anúncios de vários portais em tempo real. Classifica imóveis destacando automaticamente aqueles desvalorizados ou com altas taxas de ROI antes de qualquer outro no mercado.",
    glossary_cap_rate_title: "Cap Rate (Taxa de Capitalização)",
    glossary_cap_rate_desc: "Indica o rendimento líquido anual de um imóvel alugado. Ao contrário do ROI bruto, o Cap Rate deduz todos os custos operacionais (manutenção, despesas, impostos e vacância) da renda bruta anual. Fórmula: Receita Operacional Líquida (NOI) / Valor do Imóvel.",
    glossary_flipping_title: "Flipping Imobiliário",
    glossary_flipping_desc: "Estratégia de investimento que consiste em adquirir imóveis com alto desconto (comumente abaixo da avaliação) ou que requeiram reformas estéticas, para revendê-los pelo verdadeiro valor de mercado no menor tempo possível, capturando lucro líquido rápido.",
    glossary_val_title: "Validador Inteligente",
    glossary_val_desc: "Algoritmo preditivo de avaliação automática baseado em IA. Analisa dimensões, ambientes e localização de qualquer imóvel para calcular seu desvio percentual em relação à média da área, estimar o tempo médio de venda em dias e emitir um veredicto de investimento.",
    glossary_m2_title: "Valor do Metro Quadrado (USD/m²)",
    glossary_m2_desc: "Métrica de comparação padrão no setor imobiliário. Permite avaliar objetivamente a relação preço-tamanho de diferentes imóveis, eliminando o viés de área total, permitindo comparação homogênea de ofertas na mesma área.",
    glossary_pulse_title: "Amostra e Pulso de Mercado",
    glossary_pulse_desc: "Indicadores estatísticos do comportamento do mercado imobiliário. Alimentados pela agregação de centenas de anúncios ativos no Paraguai para estabelecer o preço médio real de cada bairro, taxas de demanda e variações percentuais mensais.",
    glossary_premium_title: "Membro Investidor Premium",
    glossary_premium_desc: "Plano de assinatura projetado para compradores e investidores imobiliários. Desbloqueia acesso ilimitado ao Radar de Oportunidades (anúncios externos filtrados por ROI e desconto), Validador de Preços detalhado, alertas de flipping e Mapa de Calor de demanda.",
    glossary_premium_radar_title: "Radar PRO Ilimitado",
    glossary_premium_radar_desc: "Acesse o catálogo de imóveis analisados e extraídos de portais externos no Paraguai. Filtre oportunidades com ROI superior a 7% ou descontos acima de 10% do preço de mercado sem restrições.",
    glossary_premium_heatmap_title: "Mapas de Calor Avançados",
    glossary_premium_heatmap_desc: "Visualize graficamente as zonas quentes de Assunção e principais cidades do Paraguai no mapa interativo. Alterne camadas de densidade de demanda de aluguel, preços por metro quadrado e rendimentos médios de rentabilidade.",
    glossary_broker_title: "Plano Broker PRO",
    glossary_broker_desc: "Ferramenta profissional avançada projetada exclusivamente para agentes imobiliários e corretores. Oferece funis de captação de propriedades diretas com o proprietário, acesso direto à bolsa de compradores em tempo real, pins dourados de alta prioridade e ferramentas de prospecção comercial.",
"""

glossary_de = """
    glossary_roi_title: "ROI (Return on Investment)",
    glossary_roi_desc: "Misst die geschätzte jährliche Bruttomietrendite im Verhältnis zum Kaufpreis der Immobilie. Formel: (Monatsmiete × 12) / Kaufpreis. Ein ROI von über 7,0 % pro Jahr gilt als hoch und optimal für Immobilieninvestitionen in Paraguay.",
    glossary_low_value_title: "Unter Marktwert (Gelegenheit)",
    glossary_low_value_desc: "Zeigt an, dass der Preis pro Quadratmeter (USD/m²) der Immobilie deutlich unter dem historischen Durchschnittsschätzwert für dieselbe Gegend und Immobilienkategorie liegt. Stellt einen Kauf mit sofortigem Rabatt und kurzfristigem Wertsteigerungspotenzial dar.",
    glossary_radar_title: "Chancen-Radar",
    glossary_radar_desc: "GeoFinds intelligenter Algorithmus, der Angebote aus mehreren Portalen in Echtzeit scannt, verarbeitet und filtert. Er klassifiziert Immobilien und hebt automatisch solche hervor, die unterbewertet sind oder hohe ROI-Raten aufweisen, bevor es jemand anderes auf dem Markt tut.",
    glossary_cap_rate_title: "Cap Rate (Kapitalisierungsrate)",
    glossary_cap_rate_desc: "Gibt die jährliche Nettorendite einer vermieteten Immobilie an. Im Gegensatz zum Brutto-ROI zieht die Cap Rate alle Betriebskosten (Instandhaltung, Ausgaben, Steuern und Leerstand) von den jährlichen Bruttoeinnahmen ab. Formel: Nettobetriebsergebnis (NOI) / Immobilienwert.",
    glossary_flipping_title: "Immobilien-Flipping",
    glossary_flipping_desc: "Anlagestrategie, die darin besteht, Immobilien mit einem hohen Rabatt (normalerweise unter dem Schätzwert) oder solche, die ästhetische Renovierungen erfordern, zu erwerben, um sie dann in kürzester Zeit zu ihrem wahren Marktwert weiterzuverkaufen und einen schnellen Nettogewinn zu erzielen.",
    glossary_val_title: "Intelligenter Validator",
    glossary_val_desc: "Prädiktiver automatischer Bewertungsalgorithmus basierend auf KI. Er analysiert die Abmessungen, Zimmer und Lage einer beliebigen Immobilie, um deren prozentuale Abweichung vom Gebietsdurchschnitt zu berechnen, die durchschnittliche Verkaufszeit in Tagen zu schätzen und ein Anlageurteil abzugeben.",
    glossary_m2_title: "Wert pro Quadratmeter (USD/m²)",
    glossary_m2_desc: "Standard-Vergleichsmetrik in Immobilien. Ermöglicht die objektive Bewertung des Preis-Größen-Verhältnisses verschiedener Immobilien, indem die Verzerrung der Gesamtfläche eliminiert wird, wodurch ein homogener Vergleich verschiedener Angebote in derselben Gegend ermöglicht wird.",
    glossary_pulse_title: "Marktstichprobe und Puls",
    glossary_pulse_desc: "Statistische Indikatoren für das Verhalten des Immobilienmarktes. Gespeist durch die Aggregation von Hunderten von Live-Angeboten in Paraguay, um den tatsächlichen Durchschnittspreis für jedes Viertel, die Nachfrageraten und die monatlichen prozentualen Schwankungen zu ermitteln.",
    glossary_premium_title: "Premium Investor Mitgliedschaft",
    glossary_premium_desc: "Abonnementplan für Käufer und Immobilieninvestoren. Schaltet uneingeschränkten Zugriff auf das Chancen-Radar (externe Web-Angebote nach ROI und Rabatt gefiltert), detaillierten Preis-Validator mit Marktaufschlüsselung, Flipping-Benachrichtigungen und Nachfrage-Heatmap frei.",
    glossary_premium_radar_title: "Unbegrenztes PRO-Radar",
    glossary_premium_radar_desc: "Greifen Sie auf den Katalog analysierter Immobilien zu, die aus mehreren externen Portalen in Paraguay extrahiert wurden. Filtern Sie Chancen mit einem ROI von mehr als 7 % oder Rabatten von über 10 % des Marktpreises ohne Einschränkungen.",
    glossary_premium_heatmap_title: "Erweiterte Heatmaps",
    glossary_premium_heatmap_desc: "Visualisieren Sie grafisch die Hot Zones von Asunción und den wichtigsten Städten Paraguays auf der interaktiven Karte. Wechseln Sie zwischen Ebenen für Mietnachfragedichte, Quadratmeterpreise und durchschnittliche Rentabilitätsrenditen.",
    glossary_broker_title: "Broker PRO-Plan",
    glossary_broker_desc: "Erweitertes professionelles Tool, das exklusiv für Immobilienmakler und Broker entwickelt wurde. Bietet Erfassungstrichter für direkte Eigentümerimmobilien, direkten Zugang zum Käuferpool in Echtzeit, hochpriorisierte goldene Pins und Tools zur kommerziellen Akquise.",
"""

# We'll replace the first key in each object with the glossary string + the first key
c1 = content[:es_start] + '\\n' + glossary_es + content[es_start:]
c1_en_start = c1.find('en: {') + 4
c2 = c1[:c1_en_start] + '\\n' + glossary_en + c1[c1_en_start:]
c2_pt_start = c2.find('pt: {') + 4
c3 = c2[:c2_pt_start] + '\\n' + glossary_pt + c2[c2_pt_start:]
c3_de_start = c3.find('de: {') + 4
c4 = c3[:c3_de_start] + '\\n' + glossary_de + c3[c3_de_start:]

with open('js/i18n.js', 'w', encoding='utf-8') as f:
    f.write(c4)
print("Glossary added to i18n.js")
