import os
import re

def update_i18n():
    print("Updating js/i18n.js...")
    with open('js/i18n.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Clean emojis and spaces
    content = content.replace('"✨ Modo Test:', '"Modo Test:')
    content = content.replace('"✨ Test Mode:', '"Test Mode:')
    content = content.replace('"✨ Testmodus:', '"Testmodus:')
    content = content.replace('"✨ Modo de Teste:', '"Modo de Teste:')
    
    content = content.replace('"⚖ RETORNO MODERADO', '"RETORNO MODERADO')
    content = content.replace('"⚖ MODERATE RETURN', '"MODERATE RETURN')
    content = content.replace('"⚖ MÄSSIGE RENDITE', '"MÄSSIGE RENDITE')
    
    content = content.replace('"❤ Guardado"', '"Guardado"')
    content = content.replace('"❤ Saved"', '"Saved"')
    content = content.replace('"❤ Gespeichert"', '"Gespeichert"')
    content = content.replace('"❤ Salvo"', '"Salvo"')
    
    content = content.replace('con ♥ y te', 'y te')
    content = content.replace('con ♥ para', 'para')
    content = content.replace('with ♥ and we', 'and we')
    content = content.replace('with ♥ to', 'to')
    content = content.replace('mit ♥ und wir', 'und wir')
    content = content.replace('mit ♥, um', 'um')
    content = content.replace('com ♥ e avisaremos', 'e avisaremos')
    content = content.replace('com ♥ para', 'para')

    # 2. Add glossary tag translations using regex to locate guide_step5_desc
    # We will find each occurrence of guide_step5_desc in order: es, en, de, pt
    
    es_insert = """,
    glossary_section_tags_title: "Significado de Etiquetas y Distintivos",
    glossary_tag_roi_title: "Etiqueta de Alta Rentabilidad (Verde)",
    glossary_tag_roi_desc: "Esta etiqueta verde en las tarjetas de propiedades destaca que el inmueble tiene un retorno de inversión anual estimado superior al 7.0%. Ideal para inversores que buscan flujo de caja rápido.",
    glossary_tag_discount_title: "Etiqueta de Bajo Precio (Naranja)",
    glossary_tag_discount_desc: "Indica el porcentaje de descuento de la propiedad respecto al promedio por m² en la misma zona. Un valor de -15% significa que la propiedad está listada 15% más barata que la media del barrio.",
    glossary_tag_gf_title: "Insignia GF (Broker PRO)",
    glossary_tag_gf_desc: "Identifica las propiedades publicadas por agentes inmobiliarios suscritos a Broker PRO. Garantiza que la propiedad tiene intermediación profesional, documentación pre-verificada y respuesta rápida.",
    glossary_tag_premium_title: "Insignia Inversor Premium",
    glossary_tag_premium_desc: "Distingue los anuncios publicados por usuarios con membresía Inversor Premium. Estas propiedades suelen contar con análisis de mercado adjuntos y priorización de contacto directo.",
    glossary_tag_type_title: "Etiqueta de Tipo de Inmueble",
    glossary_tag_type_desc: "Etiqueta gris que indica el tipo de construcción o categoría del inmueble (Casa, Departamento, Dúplex, Terreno, Galpón, Oficina, etc.).",
    glossary_tag_op_title: "Etiqueta de Tipo de Operación",
    glossary_tag_op_desc: "Diferencia visualmente entre inmuebles en Venta (color rojo suave) y Alquiler (color azul suave), permitiendo una rápida identificación en el feed o mapa.",
    glossary_tag_verified_title: "Sello de Verificación de Identidad",
    glossary_tag_verified_desc: "Sello azul de verificación que aparece junto al nombre del publicador. Garantiza que GeoFind ha validado la identidad del anunciante como Broker Verificado o Inversor Verificado."
"""

    en_insert = """,
    glossary_section_tags_title: "Meaning of Badges and Tags",
    glossary_tag_roi_title: "High Yield Tag (Green)",
    glossary_tag_roi_desc: "This green tag on property cards highlights that the property has an estimated annual return on investment (ROI) above 7.0%. Ideal for cash-flow buyers.",
    glossary_tag_discount_title: "Underpriced Tag (Orange)",
    glossary_tag_discount_desc: "Indicates the percentage discount of the property compared to the average price per sqm in the neighborhood. A value of -15% means it is listed 15% cheaper.",
    glossary_tag_gf_title: "GF Badge (Broker PRO)",
    glossary_tag_gf_desc: "Identifies properties published by real estate agents subscribed to Broker PRO. Guarantees professional brokerage, pre-verified documents, and quick replies.",
    glossary_tag_premium_title: "Premium Investor Badge",
    glossary_tag_premium_desc: "Distinguishes listings published by users with Premium Investor membership. These properties often feature detailed market reports.",
    glossary_tag_type_title: "Property Type Tag",
    glossary_tag_type_desc: "Gray tag showing the structural category of the property (House, Apartment, Duplex, Land, Warehouse, Office, etc.).",
    glossary_tag_op_title: "Operation Type Tag",
    glossary_tag_op_desc: "Visually differentiates between properties for Sale (soft red) and Rent (soft blue) for quick identification in the feed or map.",
    glossary_tag_verified_title: "Identity Verification Seal",
    glossary_tag_verified_desc: "Blue verification badge next to the publisher's name. Guarantees that GeoFind has validated the legal identity of the advertiser as a Verified Broker or Investor."
"""

    de_insert = """,
    glossary_section_tags_title: "Bedeutung von Badges und Tags",
    glossary_tag_roi_title: "Hohe Rendite-Tag (Grün)",
    glossary_tag_roi_desc: "Dieser grüne Tag auf Immobilienkarten hebt hervor, dass die Immobilie eine geschätzte jährliche Rentabilität (ROI) über 7,0 % aufweist.",
    glossary_tag_discount_title: "Günstiger Preis-Tag (Orange)",
    glossary_tag_discount_desc: "Zeigt den prozentualen Rabatt der Immobilie im Vergleich zum durchschnittlichen Quadratmeterpreis in der Gegend an. Ein Wert von -15 % bedeutet 15 % günstiger.",
    glossary_tag_gf_title: "GF-Abzeichen (Broker PRO)",
    glossary_tag_gf_desc: "Identifiziert Immobilien, die von bei Broker PRO registrierten Immobilienmaklern veröffentlicht wurden, und garantiert eine professionelle Vermittlung.",
    glossary_tag_premium_title: "Premium-Investor-Abzeichen",
    glossary_tag_premium_desc: "Unterscheidet Inserate von Premium-Investoren, die oft detaillierte Marktanalysen enthalten.",
    glossary_tag_type_title: "Immobilienart-Tag",
    glossary_tag_type_desc: "Grauer Tag, der die Kategorie der Immobilie anzeigt (Haus, Wohnung, Duplex, Grundstück, Büro usw.).",
    glossary_tag_op_title: "Betriebsart-Tag",
    glossary_tag_op_desc: "Unterscheidet visuell zwischen Verkauf (zartrot) und Vermietung (zartblau) zur schnellen Identifizierung.",
    glossary_tag_verified_title: "Identitätsprüfsiegel",
    glossary_tag_verified_desc: "Blaues Verifizierungsabzeichen neben dem Namen des Veröffentlichers. Garantiert, dass GeoFind die Identität als verifizierter Makler oder Investor bestätigt hat."
"""

    pt_insert = """,
    glossary_section_tags_title: "Significado de Etiquetas e Distintivos",
    glossary_tag_roi_title: "Etiqueta de Alta Rentabilidade (Verde)",
    glossary_tag_roi_desc: "Esta etiqueta verde nos cartões de propriedades destaca que o imóvel tem um retorno anual estimado (ROI) superior a 7,0%.",
    glossary_tag_discount_title: "Etiqueta de Baixo Preço (Laranja)",
    glossary_tag_discount_desc: "Indica a porcentagem de desconto do imóvel em relação à média por m² no mesmo bairro. Um valor de -15% significa que está 15% mais barato.",
    glossary_tag_gf_title: "Insignia GF (Broker PRO)",
    glossary_tag_gf_desc: "Identifica propriedades publicadas por corretores de imóveis assinantes do Broker PRO, garantindo atendimento profissional.",
    glossary_tag_premium_title: "Insignia Investidor Premium",
    glossary_tag_premium_desc: "Distingue anúncios publicados por usuários com assinatura Investidor Premium, geralmente com relatórios de mercado.",
    glossary_tag_type_title: "Etiqueta de Tipo de Imóvel",
    glossary_tag_type_desc: "Etiqueta cinza que indica o tipo de construção do imóvel (Casa, Apartamento, Duplex, Terreno, Escritório, etc.).",
    glossary_tag_op_title: "Etiqueta de Tipo de Operação",
    glossary_tag_op_desc: "Diferencia visualmente entre imóveis para Venda (vermelho suave) e Aluguel (azul suave).",
    glossary_tag_verified_title: "Selo de Verificação de Identidade",
    glossary_tag_verified_desc: "Selo azul de verificação que garante que o GeoFind validou a identidade do anunciante como Corretor ou Investidor Verificado."
"""

    # We will find all matches of guide_step5_desc in the file.
    # We expect 4 matches in order: es, en, de, pt
    matches = list(re.finditer(r'guide_step5_desc\s*:\s*"[^"]*"', content))
    print(f"Found {len(matches)} guide_step5_desc matches in i18n.js.")
    
    if len(matches) >= 4:
        # Since we're modifying the content and indices will change, let's do it in reverse order!
        # Portuguese (index 3)
        m = matches[3]
        content = content[:m.end()] + pt_insert + content[m.end():]
        # German (index 2)
        m = matches[2]
        content = content[:m.end()] + de_insert + content[m.end():]
        # English (index 1)
        m = matches[1]
        content = content[:m.end()] + en_insert + content[m.end():]
        # Spanish (index 0)
        m = matches[0]
        # Wait, if Spanish was already updated (which it was in the first run), we should avoid duplicating it.
        # Let's check if glossary_tag_roi_title is already present in Spanish.
        # Actually, let's just inspect if it's there.
        if "glossary_tag_roi_title" not in content[:matches[1].start()]:
            content = content[:m.end()] + es_insert + content[m.end():]
            print("Injected Spanish tags translation.")
        else:
            print("Spanish tags translation already present, skipped.")
    else:
        print("Error: Could not find all 4 language sections for guide_step5_desc")

    with open('js/i18n.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("js/i18n.js updated successfully.")


def update_index_html():
    print("Updating index.html...")
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace sun symbol in theme toggle with inline SVG (only if not already replaced)
    sun_target = '<div id="theme-toggle-circle" style="width: 22px; height: 22px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: var(--shadow-sm); transform: translateX(0);">☀</div>'
    sun_replacement = '<div id="theme-toggle-circle" style="width: 22px; height: 22px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: var(--shadow-sm); transform: translateX(0);"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>'
    if sun_target in content:
        content = content.replace(sun_target, sun_replacement)
        print("Updated sun toggle circle.")
        
    # 2. Update line 1820: <button class="btn-fav-modal" id="modal-fav-btn" data-i18n="modal_btn_save">♡ Guardar</button>
    fav_modal_target = '<button class="btn-fav-modal" id="modal-fav-btn" data-i18n="modal_btn_save">♡ Guardar</button>'
    fav_modal_replacement = """<button class="btn-fav-modal" id="modal-fav-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <span data-i18n="modal_btn_save">Guardar</span>
        </button>"""
    if fav_modal_target in content:
        content = content.replace(fav_modal_target, fav_modal_replacement)
        print("Updated fav modal button.")

    # 3. Insert tag explanations in glossary HTML right before line 1695 (closing div)
    # Check if the section was already inserted
    if "glossary_section_tags_title" not in content:
        radar_card_end = """            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_broker_radar_desc">
              Panel de analíticas avanzadas que muestra el balance entre oferta (propiedades en venta/alquiler) y demanda (búsquedas activas) en cada barrio, permitiendo identificar zonas de alta demanda insatisfecha para enfocar la captación de exclusivas.
            </p>
          </div>"""
              
        inserted_html = """
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-top: 1.5rem; display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            <span data-i18n="glossary_section_tags_title">Significado de Etiquetas y Distintivos</span>
          </div>

          <!-- ROI Tag -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #10b981; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <span class="clean-badge badge-premium-green" style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; color: #10b981; background: rgba(16, 185, 129, 0.1);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>ROI %</span>
              <span data-i18n="glossary_tag_roi_title">Etiqueta de Alta Rentabilidad (Verde)</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_roi_desc">
              Esta etiqueta verde en las tarjetas de propiedades destaca que el inmueble tiene un retorno de inversión anual estimado superior al 7.0%. Ideal para inversores que buscan flujo de caja rápido.
            </p>
          </div>

          <!-- Discount Tag -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #f59e0b; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <span class="clean-badge badge-premium-orange" style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; color: #f59e0b; background: rgba(245, 158, 11, 0.1);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 22l10-4 10 4L12 2z"/></svg>-%</span>
              <span data-i18n="glossary_tag_discount_title">Etiqueta de Bajo Precio (Naranja)</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_discount_desc">
              Indica el porcentaje de descuento de la propiedad respecto al promedio por m² en la misma zona. Un valor de -15% significa que la propiedad está listada 15% más barata que la media del barrio.
            </p>
          </div>

          <!-- GF Badge -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #D4AF37; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <span class="clean-badge badge-gf-gold" style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; color: #D4AF37; background: rgba(212, 175, 55, 0.1);"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>GF</span>
              <span data-i18n="glossary_tag_gf_title">Insignia GF (Broker PRO)</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_gf_desc">
              Identifica las propiedades publicadas por agentes inmobiliarios suscritos a Broker PRO. Garantiza que la propiedad tiene intermediación profesional, documentación pre-verificada y respuesta rápida.
            </p>
          </div>

          <!-- Premium Badge -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #8b5cf6; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <span class="clean-badge badge-premium-gold" style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; background: linear-gradient(135deg, #FFE07D, #D4AF37); color: #0f172a; display: inline-block;">Premium</span>
              <span data-i18n="glossary_tag_premium_title">Insignia Inversor Premium</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_premium_desc">
              Distingue los anuncios publicados por usuarios con membresía Inversor Premium. Estas propiedades suelen contar con análisis de mercado adjuntos y priorización de contacto directo.
            </p>
          </div>

          <!-- Type Badge -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #6b7280; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <span class="clean-badge badge-type" style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-block; background: var(--surface2); color: var(--text2);">Departamento</span>
              <span data-i18n="glossary_tag_type_title">Etiqueta de Tipo de Inmueble</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_type_desc">
              Etiqueta gris que indica el tipo de construcción o categoría del inmueble (Casa, Departamento, Dúplex, Terreno, Galpón, Oficina, etc.).
            </p>
          </div>

          <!-- Operation Badge -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #3b82f6; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <span class="clean-badge badge-op bg-red-soft" style="font-size: 0.85rem; padding: 4px 8px; border-radius: 6px; display: inline-block; color: #ff2a5f; background: rgba(255, 42, 95, 0.1);">Venta</span>
              <span data-i18n="glossary_tag_op_title">Etiqueta de Tipo de Operación</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_op_desc">
              Diferencia visualmente entre inmuebles en Venta (color rojo suave) y Alquiler (color azul suave), permitiendo una rápida identificación en el feed o mapa.
            </p>
          </div>

          <!-- Verified Badge -->
          <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-left: 5px solid #3b82f6; border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text); font-size: 1.15rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="none" style="display: inline-block; vertical-align: middle;"><path d="M12 2l2.36 1.48L17 3.03l1.16 2.65L20.88 7l-.6 2.87L22 12l-1.72 2.13.6 2.87-2.72 1.32L17 20.97l-2.64-.45L12 22l-2.36-1.48L7 20.97l-1.16-2.65L3.12 17l.6-2.87L2 12l1.72-2.13-.6-2.87 2.72-1.32L7 3.03l2.64.45L12 2z" fill="#3b82f6" /><path d="M9.5 12l1.83 1.83L15.5 9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span data-i18n="glossary_tag_verified_title">Sello de Verificación de Identidad</span>
            </h3>
            <p style="font-size: 0.92rem; color: var(--text2); line-height: 1.6; margin: 0; font-weight: 500;" data-i18n="glossary_tag_verified_desc">
              Sello azul de verificación que aparece junto al nombre del publicador. Garantiza que GeoFind ha validado la identidad del anunciante como Broker Verificado o Inversor Verificado.
            </p>
          </div>
"""
        if radar_card_end in content:
            content = content.replace(radar_card_end, radar_card_end + inserted_html)
            print("Inserted badges explanation HTML to index.html.")
        else:
            # Fallback if radar_card_end exact string got slightly modified
            print("Warning: radar card end exact match not found for insertion. Trying regex...")
            # Match the card end using regex
            match = re.search(r'data-i18n="glossary_broker_radar_desc".*?</p>\s*</div>', content, re.DOTALL)
            if match:
                end_pos = match.end()
                content = content[:end_pos] + inserted_html + content[end_pos:]
                print("Regex match succeeded for inserting HTML.")
            else:
                print("Warning: regex match also failed.")
    else:
        print("glossary_section_tags_title already in index.html, skipped.")
        
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)


if __name__ == "__main__":
    update_i18n()
    update_index_html()
    print("App files successfully updated with robust regex!")
