/* global React, DATA, I18N */
const { useMemo } = React;
const { useI18n } = I18N;

function Filters({ products, filters, setFilters, resetFilters }) {
  const { section, category, brand, sort } = filters;
  const { t, lang } = useI18n();
  const activeCount =
    (section !== 'All' ? 1 : 0) +
    (category ? 1 : 0) +
    (brand ? 1 : 0) +
    ((filters.discountBand && filters.discountBand !== 'any') ? 1 : 0) +
    (sort && sort !== 'featured' ? 1 : 0);

  // Sections
  const sections = useMemo(() => ['All', ...new Set(products.map(p => p.section))], [products]);

  // Categories (scoped to section)
  const categories = useMemo(() => {
    const scoped = section === 'All' ? products : products.filter(p => p.section === section);
    const counts = {};
    scoped.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return DATA.CATEGORY_ORDER
      .filter(c => counts[c])
      .map(c => ({ name: c, count: counts[c] }));
  }, [products, section]);

  // Brands (scoped)
  const brands = useMemo(() => {
    const scoped = section === 'All' ? products : products.filter(p => p.section === section);
    const counts = {};
    scoped.forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0], 'en', { sensitivity: 'base' }));
  }, [products, section]);

  // Discount bands — only bands with products in current section
  const discountBands = useMemo(() => {
    const scoped = section === 'All' ? products : products.filter(p => p.section === section);
    const bands = [
      { key: 'any', test: () => true },
      { key: '15-29', test: p => p.discountPct >= 15 && p.discountPct < 30 },
      { key: '30-44', test: p => p.discountPct >= 30 && p.discountPct < 45 },
      { key: '45-59', test: p => p.discountPct >= 45 && p.discountPct < 60 },
      { key: '60-plus', test: p => p.discountPct >= 60 },
    ];
    return bands.map(b => ({ ...b, count: scoped.filter(b.test).length }))
      .filter(b => b.key === 'any' || b.count > 0);
  }, [products, section]);

  return (
    <aside className="filters">
      <div className="filters__top">
        <h3 className="filters__title">{lang === 'tr' ? 'Filtreler' : 'Filters'}</h3>
        <button
          className="filters__reset"
          onClick={resetFilters}
          disabled={activeCount === 0}
        >
          {lang === 'tr' ? 'Sıfırla' : 'Reset'}
          {activeCount > 0 && <span className="filters__reset-badge">{activeCount}</span>}
        </button>
      </div>

      <div className="filters__group">
        <h4 className="filters__label">{t.filters.collection}</h4>
        <div className="filters__chips">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setFilters({ ...filters, section: s, category: null })}
              className={'chip ' + (section === s ? 'is-active' : '')}
            >
              {s === 'All' ? t.breadcrumb.whole.toLowerCase() : (s === 'INDOOR' ? t.hero.indoorTitle.toLowerCase() : t.hero.outdoorTitle.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <h4 className="filters__label">{t.filters.category}</h4>
        <div className="filters__list">
          <button
            onClick={() => setFilters({ ...filters, category: null })}
            className={'filters__item ' + (!category ? 'is-active' : '')}
          >
            <span>{t.filters.allCategories}</span>
            <span className="filters__count">
              {categories.reduce((a, c) => a + c.count, 0)}
            </span>
          </button>
          {categories.map(c => (
            <button
              key={c.name}
              onClick={() => setFilters({ ...filters, category: c.name })}
              className={'filters__item ' + (category === c.name ? 'is-active' : '')}
            >
              <span>{c.name}</span>
              <span className="filters__count">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <h4 className="filters__label">{t.filters.discountBand}</h4>
        <div className="filters__list">
          {discountBands.map(b => (
            <button
              key={b.key}
              onClick={() => setFilters({ ...filters, discountBand: b.key })}
              className={'filters__item ' + ((filters.discountBand || 'any') === b.key ? 'is-active' : '')}
            >
              <span>{t.filters.bands[b.key]}</span>
              <span className="filters__count">{b.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <h4 className="filters__label">{t.filters.house}</h4>
        <div className="filters__brands">
          <button
            onClick={() => setFilters({ ...filters, brand: null })}
            className={'filters__brand ' + (!brand ? 'is-active' : '')}
          >
            {t.filters.allHouses}
          </button>
          {brands.map(([b, n]) => (
            <button
              key={b}
              onClick={() => setFilters({ ...filters, brand: brand === b ? null : b })}
              className={'filters__brand ' + (brand === b ? 'is-active' : '')}
            >
              {b} <em>{n}</em>
            </button>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <h4 className="filters__label">{t.filters.sort}</h4>
        <div className="filters__list">
          {['featured', 'discount', 'price-low', 'price-high', 'brand'].map(v => (
            <button
              key={v}
              onClick={() => setFilters({ ...filters, sort: v })}
              className={'filters__item ' + (sort === v ? 'is-active' : '')}
            >
              <span>{t.filters.sorts[v]}</span>
              {sort === v && <span className="filters__dot">●</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

window.FILTERS = { Filters };
