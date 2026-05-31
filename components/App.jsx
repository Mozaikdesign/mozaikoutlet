/* global React, ReactDOM, DATA, CHROME, FILTERS, CARDS, MODAL, I18N */
const { useState, useEffect, useMemo } = React;
const { TopBar, Hero, BrandStrip, Footer } = CHROME;
const { Filters } = FILTERS;
const { GridCard, EditorialCard, ListRow } = CARDS;
const { QuickView } = MODAL;
const { I18nProvider, useI18n } = I18N;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardStyle": "framed",
  "accent": "cognac",
  "typography": "modern",
  "density": "roomy",
  "showLifeOnHover": true
}/*EDITMODE-END*/;

function App() {
  const { t, lang } = useI18n();
  const [catalogue, setCatalogue] = useState([]);
  const [filters, setFilters] = useState({
    section: 'All',
    category: null,
    brand: null,
    minDiscount: 0,
    discountBand: 'any',
    sort: 'featured',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState(() => localStorage.getItem('dekupe.view') || 'grid');
  const [openProduct, setOpenProduct] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dekupe.saved') || '[]')); }
    catch { return new Set(); }
  });
  const [cartIds, setCartIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dekupe.cart') || '[]')); }
    catch { return new Set(); }
  });
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweakOpen, setTweakOpen] = useState(false);
  const [infoPanel, setInfoPanel] = useState(null); // { group: 'services'|'house', idx }
  const [savedTrayOpen, setSavedTrayOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toast, setToast] = useState(null); // { msg, action?: { label, onClick } }
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  // Load catalogue
  useEffect(() => {
    if (typeof window.__resolveCatalogue__ === 'function') {
      // Standalone bundled mode — inlined JSON + blob URLs
      setCatalogue(window.__resolveCatalogue__());
      return;
    }
    fetch('data/catalogue.json')
      .then(r => r.json())
      .then(setCatalogue);
  }, []);

  // Persist state
  useEffect(() => { localStorage.setItem('dekupe.view', view); }, [view]);
  useEffect(() => { localStorage.setItem('dekupe.saved', JSON.stringify([...savedIds])); }, [savedIds]);
  useEffect(() => { localStorage.setItem('dekupe.cart', JSON.stringify([...cartIds])); }, [cartIds]);

  // Apply theme tweaks to document
  useEffect(() => {
    document.body.dataset.accent = tweaks.accent;
    document.body.dataset.density = tweaks.density;
    document.body.dataset.typography = tweaks.typography;
  }, [tweaks]);

  // Tweaks host protocol
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweakOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweakOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  // Filtered + sorted products
  const visible = useMemo(() => {
    let list = catalogue;
    if (filters.section !== 'All') list = list.filter(p => p.section === filters.section);
    if (filters.category) list = list.filter(p => p.category === filters.category);
    if (filters.categories && filters.categories.length) list = list.filter(p => filters.categories.includes(p.category));
    if (filters.brand) list = list.filter(p => p.brand === filters.brand);
    if (filters.discountBand && filters.discountBand !== 'any') {
      const bandTests = {
        '15-29': p => p.discountPct >= 15 && p.discountPct < 30,
        '30-44': p => p.discountPct >= 30 && p.discountPct < 45,
        '45-59': p => p.discountPct >= 45 && p.discountPct < 60,
        '60-plus': p => p.discountPct >= 60,
      };
      const t = bandTests[filters.discountBand];
      if (t) list = list.filter(t);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    list = [...list];
    switch (filters.sort) {
      case 'discount': list.sort((a, b) => b.discountPct - a.discountPct); break;
      case 'price-low': list.sort((a, b) => a.saleEur - b.saleEur); break;
      case 'price-high': list.sort((a, b) => b.saleEur - a.saleEur); break;
      case 'brand': list.sort((a, b) => a.brand.localeCompare(b.brand)); break;
      default: break;
    }
    return list;
  }, [catalogue, filters, searchQuery]);

  // Reset to page 1 whenever filters/search/sort change
  useEffect(() => { setPage(1); }, [filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [visible, page]
  );

  const goToPage = (n) => {
    const next = Math.min(Math.max(1, n), totalPages);
    setPage(next);
    setTimeout(() => {
      document.querySelector('.catalogue-main__grid-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const showToast = (msg, action) => {
    setToast({ msg, action });
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 4000);
  };

  const toggleSave = (product) => {
    setSavedIds(prev => {
      const n = new Set(prev);
      const wasSaved = n.has(product.id);
      wasSaved ? n.delete(product.id) : n.add(product.id);
      if (wasSaved) {
        showToast(`Removed "${product.name}" from your list`);
      } else {
        showToast(`Added "${product.name}" to your list`, {
          label: 'View list',
          onClick: () => { setToast(null); setSavedTrayOpen(true); }
        });
      }
      return n;
    });
  };

  const addToCart = (product) => {
    setCartIds(prev => new Set([...prev, product.id]));
    setOpenProduct(null);
    showToast(`Reservation email opened for ${product.brand} ${product.name}. If nothing happened, write to simge@mozaikdesign.com.`);
  };

  const resetFilters = () => {
    setFilters({ section: 'All', category: null, brand: null, minDiscount: 0, discountBand: 'any', sort: 'featured' });
    setSearchQuery('');
  };

  // Scroll grid back into view when the visible count changes (filter/search/sort applied).
  const prevCountRef = React.useRef(visible.length);
  useEffect(() => {
    if (prevCountRef.current !== visible.length && catalogue.length > 0) {
      const grid = document.querySelector('.catalogue-main__grid-wrap');
      if (grid) {
        const rect = grid.getBoundingClientRect();
        // Only re-align if user is already past the top of the grid
        if (rect.top < 0) {
          const top = window.scrollY + rect.top - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
    prevCountRef.current = visible.length;
  }, [visible.length, catalogue.length]);

  if (catalogue.length === 0) {
    return (
      <div className="loading">
        <span>{t.loading}</span>
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        cartCount={savedIds.size}
        onBagClick={() => setSavedTrayOpen(true)}
        onNav={(key) => {
          const scrollToCatalogue = () => setTimeout(() => {
            document.querySelector('.catalogue-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
          if (key === 'indoor') {
            setFilters({ ...filters, section: 'INDOOR', category: null, categories: null });
            scrollToCatalogue();
          } else if (key === 'outdoor') {
            setFilters({ ...filters, section: 'OUTDOOR', category: null, categories: null });
            scrollToCatalogue();
          } else if (key === 'objects') {
            setFilters({ ...filters, section: 'All', category: 'Objects & Vases', categories: null });
            scrollToCatalogue();
          } else if (key === 'brands') {
            document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (key === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <Hero
        view={view}
        setView={setView}
        section={filters.section}
        setSection={(s) => {
          setFilters({ ...filters, section: s, category: null });
          // scroll to catalogue after pick
          setTimeout(() => {
            document.querySelector('.catalogue-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }}
        counts={{
          indoor: catalogue.filter(p => p.section === 'INDOOR').length,
          outdoor: catalogue.filter(p => p.section === 'OUTDOOR').length,
          total: catalogue.length,
        }}
      />

      <main className="catalogue-main">
        <div className="catalogue-main__layout">
          <button
            className="filters__mobile-toggle"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="17" x2="14" y2="17"/>
            </svg>
            {lang === 'tr' ? 'Filtrele & Sırala' : 'Filter & Sort'}
          </button>

          <div className={'catalogue-main__filters' + (mobileFiltersOpen ? ' is-open' : '')}>
            <div className="filters__backdrop" onClick={() => setMobileFiltersOpen(false)}/>
            <div className="filters__drawer">
              <div className="filters__drawer-head">
                <span>{lang === 'tr' ? 'Filtrele & Sırala' : 'Filter & Sort'}</span>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close">×</button>
              </div>
              <Filters products={catalogue} filters={filters} setFilters={setFilters} resetFilters={resetFilters}/>
              <button className="filters__drawer-apply" onClick={() => setMobileFiltersOpen(false)}>
                {lang === 'tr' ? `${visible.length} ürünü göster` : `Show ${visible.length} pieces`}
              </button>
            </div>
          </div>

          <section className="catalogue-main__grid-wrap">
            <div className="catalogue-main__breadcrumb">
              <span>{filters.section === 'All' ? t.breadcrumb.whole : (filters.section === 'INDOOR' ? t.hero.indoorTitle : t.hero.outdoorTitle)}</span>
              {filters.category && <span> · {filters.category}</span>}
              {filters.brand && <span> · {filters.brand}</span>}
              <strong>{visible.length} {t.breadcrumb.pieces}</strong>
            </div>

            {view === 'grid' && (
              <div className={'grid grid--' + tweaks.density}>
                {pageItems.map(p => (
                  <GridCard
                    key={p.id}
                    product={p}
                    onOpen={setOpenProduct}
                    onSave={toggleSave}
                    saved={savedIds.has(p.id)}
                    cardStyle={tweaks.cardStyle}
                  />
                ))}
              </div>
            )}

            {view === 'editorial' && (
              <div className="ed-grid">
                {pageItems.map((p, i) => (
                  <EditorialCard
                    key={p.id}
                    product={p}
                    index={i}
                    onOpen={setOpenProduct}
                    onSave={toggleSave}
                    saved={savedIds.has(p.id)}
                  />
                ))}
              </div>
            )}

            {view === 'list' && (
              <table className="list-view">
                <thead>
                  <tr>
                    <th></th>
                    <th>{t.list.house}</th>
                    <th>{t.list.piece}</th>
                    <th>{t.list.qty}</th>
                    <th>{t.list.list}</th>
                    <th>{t.list.outlet}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(p => (
                    <ListRow
                      key={p.id}
                      product={p}
                      onOpen={setOpenProduct}
                      onSave={toggleSave}
                      saved={savedIds.has(p.id)}
                    />
                  ))}
                </tbody>
              </table>
            )}

            {visible.length > 0 && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onGoTo={goToPage}
                total={visible.length}
                pageSize={PAGE_SIZE}
              />
            )}

            {visible.length === 0 && (
              <div className="empty">
                <h3>{t.empty.title}</h3>
                <p>{t.empty.body}</p>
                <button
                  className="btn btn--ghost"
                  onClick={resetFilters}
                >
                  {t.empty.clear}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <BrandStrip products={catalogue}/>

      <Footer onShopFilter={(action) => {
        setFilters({
          section: action.section || 'All',
          category: null,
          categories: action.categories || null,
          brand: null,
          discountBand: 'any',
          sort: filters.sort,
        });
        setTimeout(() => {
          document.querySelector('.catalogue-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }} onInfo={(group, idx) => setInfoPanel({ group, idx })}/>

      {infoPanel && (() => {
        const panels = t.footer.infoPanels?.[infoPanel.group] || [];
        const data = panels[infoPanel.idx];
        if (!data) return null;
        return (
          <div className="info-panel" onClick={() => setInfoPanel(null)}>
            <div className="info-panel__dialog" onClick={(e) => e.stopPropagation()}>
              <button className="info-panel__close" onClick={() => setInfoPanel(null)}>×</button>
              <div className="info-panel__eyebrow">{infoPanel.group === 'services' ? t.footer.services : t.footer.house}</div>
              <h2 className="info-panel__title">{data.title}</h2>
              <p className="info-panel__body">{data.body}</p>
            </div>
          </div>
        );
      })()}

      {openProduct && (
        <QuickView
          product={openProduct}
          onClose={() => setOpenProduct(null)}
          onSave={toggleSave}
          saved={savedIds.has(openProduct.id)}
          onAdd={addToCart}
        />
      )}

      {savedTrayOpen && (
        <div className="info-panel" onClick={() => setSavedTrayOpen(false)}>
          <div className="info-panel__dialog info-panel__dialog--wide" onClick={(e) => e.stopPropagation()}>
            <button className="info-panel__close" onClick={() => setSavedTrayOpen(false)}>×</button>
            <div className="info-panel__eyebrow">{t.savedTray.eyebrow}</div>
            <div className="saved-tray__header">
              <h2 className="info-panel__title">{t.savedTray.title} ({savedIds.size})</h2>
              {savedIds.size > 0 && (
                <button
                  className="saved-tray__clear"
                  onClick={() => {
                    if (window.confirm(t.savedTray.clearConfirm)) {
                      setSavedIds(new Set());
                    }
                  }}
                >{t.savedTray.clearAll}</button>
              )}
            </div>
            {savedIds.size === 0 ? (
              <p className="info-panel__body">{t.savedTray.empty}</p>
            ) : (
              <ul className="saved-tray__list">
                {catalogue.filter(p => savedIds.has(p.id)).map(p => (
                  <li key={p.id} className="saved-tray__item">
                    <img src={p.dekupe} alt="" className="saved-tray__img" onClick={() => { setSavedTrayOpen(false); setOpenProduct(p); }}/>
                    <div className="saved-tray__meta" onClick={() => { setSavedTrayOpen(false); setOpenProduct(p); }}>
                      <div className="saved-tray__brand">{p.brand}</div>
                      <div className="saved-tray__name">{p.name}</div>
                      <div className="saved-tray__price">€{p.saleEur?.toLocaleString('de-DE')}</div>
                    </div>
                    <div className="saved-tray__actions">
                      <a
                        className="btn btn--primary btn--sm"
                        href={
                          'mailto:simge@mozaikdesign.com' +
                          '?subject=' + encodeURIComponent(`Reserve: ${p.brand} ${p.name}`) +
                          '&body=' + encodeURIComponent(
                            `Hello Mozaikdesign team,\n\nI'd like to reserve:\n\n` +
                            `• ${p.brand} — ${p.name}\n` +
                            `• Dimensions: ${p.dims || '—'}\n` +
                            `• Outlet price: €${p.saleEur?.toLocaleString('de-DE')}\n\nThank you.`
                          )
                        }
                      >{t.savedTray.reserve}</a>
                      <button className="btn btn--ghost btn--sm" onClick={() => toggleSave(p)}>{t.savedTray.remove}</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tweakOpen && (
        <TweakPanel tweaks={tweaks} update={updateTweak} onClose={() => setTweakOpen(false)}/>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <span className="toast__msg">{toast.msg}</span>
          {toast.action && (
            <button className="toast__action" onClick={toast.action.onClick}>
              {toast.action.label}
            </button>
          )}
          <button className="toast__close" aria-label="Dismiss" onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onGoTo, total, pageSize }) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build a compact page list: 1 … (p-1) p (p+1) … N
  const pages = [];
  const push = (v) => { if (!pages.includes(v)) pages.push(v); };
  push(1);
  for (let i = page - 1; i <= page + 1; i++) {
    if (i > 1 && i < totalPages) push(i);
  }
  if (totalPages > 1) push(totalPages);

  return (
    <nav className="pagination" aria-label="Catalogue pages">
      <div className="pagination__count">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong>
      </div>
      <div className="pagination__controls">
        <button
          className="pagination__btn pagination__btn--arrow"
          onClick={() => onGoTo(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >← Prev</button>
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const gap = prev && p - prev > 1;
          return (
            <React.Fragment key={p}>
              {gap && <span className="pagination__dots">…</span>}
              <button
                className={'pagination__btn' + (p === page ? ' is-active' : '')}
                onClick={() => onGoTo(p)}
                aria-current={p === page ? 'page' : undefined}
              >{p}</button>
            </React.Fragment>
          );
        })}
        <button
          className="pagination__btn pagination__btn--arrow"
          onClick={() => onGoTo(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >Next →</button>
      </div>
    </nav>
  );
}

function TweakPanel({ tweaks, update, onClose }) {
  return (
    <div className="tweaks">
      <div className="tweaks__header">
        <strong>Tweaks</strong>
        <button onClick={onClose}>×</button>
      </div>
      <div className="tweaks__body">
        <TweakGroup label="Accent">
          {['aubergine', 'cognac', 'ink', 'sage'].map(a => (
            <button
              key={a}
              onClick={() => update('accent', a)}
              className={'tweaks__swatch tweaks__swatch--' + a + (tweaks.accent === a ? ' is-active' : '')}
              title={a}
            >
              <span/>
              <em>{a}</em>
            </button>
          ))}
        </TweakGroup>
        <TweakGroup label="Card style">
          {['quiet', 'framed', 'tagged'].map(s => (
            <button
              key={s}
              onClick={() => update('cardStyle', s)}
              className={'tweaks__opt ' + (tweaks.cardStyle === s ? 'is-active' : '')}
            >
              {s}
            </button>
          ))}
        </TweakGroup>
        <TweakGroup label="Typography">
          {['editorial', 'modern', 'quiet'].map(t => (
            <button
              key={t}
              onClick={() => update('typography', t)}
              className={'tweaks__opt ' + (tweaks.typography === t ? 'is-active' : '')}
            >
              {t}
            </button>
          ))}
        </TweakGroup>
        <TweakGroup label="Density">
          {['roomy', 'compact'].map(d => (
            <button
              key={d}
              onClick={() => update('density', d)}
              className={'tweaks__opt ' + (tweaks.density === d ? 'is-active' : '')}
            >
              {d}
            </button>
          ))}
        </TweakGroup>
      </div>
    </div>
  );
}

function TweakGroup({ label, children }) {
  return (
    <div className="tweaks__group">
      <label>{label}</label>
      <div className="tweaks__row">{children}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <I18nProvider><App/></I18nProvider>
);
