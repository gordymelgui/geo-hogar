export function renderMessagesView() {
  return `
<section class="view" id="view-messages">
        <div class="messages-layout">
          <div class="conversations-list">
            <div class="conv-header">
              <h3 data-i18n="messages_title">Mensajes</h3>
            </div>
            <div id="conv-list"></div>
          </div>
          <div class="chat-area" id="chat-area">
            <div class="chat-placeholder"
              style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--text2);padding:2rem;">
              <div
                style="background:var(--surface2);width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;box-shadow:var(--shadow-sm);">
                <svg viewBox="0 0 24 24"
                  style="width:48px;height:48px;stroke:var(--accent);stroke-width:1.5;fill:none;">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8" />
                  <path d="M8 13h5" />
                </svg>
              </div>
              <h3
                style="color:var(--text);font-family:'Plus Jakarta Sans', sans-serif;font-weight:800;font-size:1.4rem;margin-bottom:0.5rem;"
                data-i18n="select_chat">Seleccioná una conversación</h3>
              <p style="font-size:1rem;max-width:300px;line-height:1.5;">Tus mensajes, ofertas y contactos con dueños y
                brokers aparecerán aquí.</p>
            </div>
          </div>
        </div>
      </section>
`;
}
