export function renderFavoritesView() {
  return `
<section class="view" id="view-favorites">
        <div class="section-header">
          <h2 data-i18n="my_favorites">Mis Favoritos</h2>
        </div>
        <div class="properties-grid" id="favorites-grid">
          <div class="empty-state">
            <svg viewBox="0 0 24 24">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p data-i18n="empty_favs_desc">Guardá propiedades para verlas aquí</p>
          </div>
        </div>
      </section>
`;
}
