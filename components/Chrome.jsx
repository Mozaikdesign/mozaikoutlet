/* global React, I18N */
const { useState } = React;
const { useI18n } = I18N;

/* --------------------------------------------------------------------
   Newsletter delivery — Formspree.
   Subscriber details are POSTed here; recipients (basak@, zeynepb@,
   cerena@mozaikdesign.com) are configured in the Formspree dashboard.
   ⬇️ Replace {form_id} with the real form ID from your Formspree form.
-------------------------------------------------------------------- */
const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/xredwlqk';

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-toggle">
      <button
        className={lang === 'en' ? 'is-active' : ''}
        onClick={() => setLang('en')}
      >EN</button>
      <span>·</span>
      <button
        className={lang === 'tr' ? 'is-active' : ''}
        onClick={() => setLang('tr')}
      >TR</button>
    </div>
  );
}

function TopBar({ onSearch, searchQuery, cartCount, onBagClick, onNav }) {
  const { t } = useI18n();
  const handleNav = (key) => (e) => {
    e.preventDefault();
    onNav && onNav(key);
  };
  return (
    <header className="site-header">
      <div className="site-header__announce">{t.announce}</div>
      <div className="site-header__main">
        <div className="site-header__nav site-header__nav--left">
          <a href="#indoor" onClick={handleNav('indoor')}>{t.nav.indoor}</a>
          <a href="#outdoor" onClick={handleNav('outdoor')}>{t.nav.outdoor}</a>
          <a href="#objects" onClick={handleNav('objects')}>{t.nav.objects}</a>
          <a href="#brands" onClick={handleNav('brands')}>{t.nav.brands}</a>
        </div>
        <a href="#top" className="site-header__logo" onClick={handleNav('home')}>
          <img src="assets/mozaik-logo-trimmed.png" alt="Mozaik" className="logo-img"/>
          <span className="logo-tag">Outlet Catalogue</span>
        </a>
        <div className="site-header__nav site-header__nav--right">
          <div className="site-header__search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </div>
          <LangToggle/>
          <a href="#newsletter" className="site-header__subscribe" onClick={(e) => {
            e.preventDefault();
            const form = document.querySelector('.newsletter__form');
            const input = form?.querySelector('input[type="email"]');
            form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => input?.focus(), 600);
          }}>{t.subscribe}</a>
          <a href="#">{t.account}</a>
          <a href="#" className="site-header__cart" onClick={(e) => { e.preventDefault(); onBagClick && onBagClick(); }}>
            {t.bag} <span className="site-header__cart-badge">{cartCount}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ view, setView, section, setSection, counts }) {
  const { t } = useI18n();
  return (
    <section className="hero">
      <div className="hero__meta">
        <span className="hero__eyebrow">{t.hero.eyebrowLeft}</span>
        <span className="hero__dot">·</span>
        <span className="hero__eyebrow">{t.hero.eyebrowRight}</span>
      </div>
      <h1 className="hero__title">
        {t.hero.titlePart1}<br/><em>{t.hero.titleEm}</em>
        {t.hero.titlePart2 ? <><br/>{t.hero.titlePart2}</> : null}
        {t.hero.titleU ? <> <u>{t.hero.titleU}</u></> : null}
      </h1>
      <p className="hero__sub">
        {t.hero.sub}<em>{t.hero.subEm}</em>
      </p>

      <div className="hero__picker">

        <div className="hero__picker-grid">
          <button
            className={'hero__picker-btn ' + (section === 'INDOOR' ? 'is-active' : '')}
            onClick={() => setSection('INDOOR')}
          >
            <span className="hero__picker-title">{t.hero.indoorTitle}</span>
            <span className="hero__picker-sub">{t.hero.indoorSub}</span>
            <span className="hero__picker-count">{counts.indoor} {t.hero.pieces} →</span>
          </button>
          <button
            className={'hero__picker-btn ' + (section === 'OUTDOOR' ? 'is-active' : '')}
            onClick={() => setSection('OUTDOOR')}
          >
            <span className="hero__picker-title">{t.hero.outdoorTitle}</span>
            <span className="hero__picker-sub">{t.hero.outdoorSub}</span>
            <span className="hero__picker-count">{counts.outdoor} {t.hero.pieces} →</span>
          </button>
          <button
            className={'hero__picker-btn hero__picker-btn--all ' + (section === 'All' ? 'is-active' : '')}
            onClick={() => setSection('All')}
          >
            <span className="hero__picker-title">{t.hero.allTitle}</span>
            <span className="hero__picker-sub">{t.hero.allSub}</span>
            <span className="hero__picker-count">{counts.total} {t.hero.pieces} →</span>
          </button>
        </div>
      </div>

      <div className="hero__stats">
        {t.hero.stats.map(([v, l], i) => (
          <div key={i} className="hero__stat"><span>{v}</span><label>{l}</label></div>
        ))}
      </div>
      <div className="hero__controls">
        <span className="hero__controls-label">{t.hero.view}</span>
        <div className="hero__view-toggle">
          {['grid', 'editorial', 'list'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={view === v ? 'is-active' : ''}
            >
              {t.hero.views[v]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStrip({ products }) {
  const brands = [...new Set(products.map(p => p.brand))].slice(0, 18);
  return (
    <section className="brand-strip" id="brands">
      <div className="brand-strip__track">
        {[...brands, ...brands].map((b, i) => (
          <span key={i}>{b}</span>
        ))}
      </div>
    </section>
  );
}

function NewsletterCol() {
  const { t, lang } = useI18n();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const n = t.footer.newsletter;

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !consent || status === 'sending') return;

    // If the endpoint hasn't been configured yet, fail gracefully.
    if (NEWSLETTER_ENDPOINT.includes('{form_id}')) {
      console.warn('Newsletter endpoint not configured — replace {form_id} in NEWSLETTER_ENDPOINT.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    const data = new FormData();
    data.append('Email', email);
    if (phone.trim()) data.append('Phone', phone.trim());
    if (address.trim()) data.append('Address', address.trim());
    data.append('Language', lang.toUpperCase());
    data.append('_subject', 'New outlet newsletter subscriber');

    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('done');
        setEmail(''); setPhone(''); setAddress(''); setConsent(false);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="site-footer__col site-footer__col--newsletter">
      <div className="site-footer__logo">
        <img src="assets/mozaik-logo-trimmed.png" alt="Mozaik" className="logo-img logo-img--footer"/>
      </div>
      <h4>{n.title}</h4>
      <p className="newsletter__body">{n.body}</p>
      {status === 'done' ? (
        <p className="newsletter__success">{n.success}</p>
      ) : (
        <form className="newsletter__form" onSubmit={submit}>
          <input
            type="email"
            placeholder={n.placeholder}
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
            required
          />
          <input
            type="tel"
            placeholder={n.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder={n.addressPlaceholder}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" disabled={!email || !consent || status === 'sending'}>
            {status === 'sending' ? n.sending : n.submit}
          </button>
          {status === 'error' && <p className="newsletter__error">{n.error}</p>}
        </form>
      )}
      <label className="newsletter__consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>{n.consent}</span>
      </label>
    </div>
  );
}

function Footer({ onShopFilter, onInfo }) {
  const { t } = useI18n();
  // shopLinks: Online Stok / Ürünler / Markalar / Tasarımcılar — most behave as catalogue filter shortcuts
  const shopActions = [
    {},                          // Online Stock — show everything
    {},                          // Products — show everything
    { focus: 'brands' },         // Brands — scroll to brand strip
    {},                          // Designers — show everything (placeholder)
  ];
  const handleShop = (i, e) => {
    e.preventDefault();
    const action = shopActions[i] || {};
    if (action.focus === 'brands') {
      document.getElementById('brands')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (onShopFilter) onShopFilter(action);
  };
  const handleInfo = (group, i, e) => {
    e.preventDefault();
    if (onInfo) onInfo(group, i);
  };
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__col site-footer__col--wide">
          <div className="site-footer__logo">
            <img src="assets/mozaik-logo-trimmed.png" alt="Mozaik" className="logo-img logo-img--footer"/>
            <span className="logo-tag">Outlet Catalogue</span>
          </div>
          <p>
            {t.footer.desc}<br/>
            {t.footer.address}<br/>
            {t.footer.appt}
          </p>
        </div>
        <div className="site-footer__col">
          <h4>{t.footer.shop}</h4>
          {t.footer.shopLinks.map((l, i) => <a key={i} href="#" onClick={(e) => handleShop(i, e)}>{l}</a>)}
        </div>
        {t.footer.servicesLinks?.length > 0 && (
          <div className="site-footer__col">
            <h4>{t.footer.services}</h4>
            {t.footer.servicesLinks.map((l, i) => <a key={i} href="#" onClick={(e) => handleInfo('services', i, e)}>{l}</a>)}
          </div>
        )}
        {t.footer.houseLinks?.length > 0 && (
          <div className="site-footer__col">
            <h4>{t.footer.house}</h4>
            {t.footer.houseLinks.map((l, i) => <a key={i} href="#" onClick={(e) => handleInfo('house', i, e)}>{l}</a>)}
          </div>
        )}
        <NewsletterCol/>
      </div>
      <div className="site-footer__rule"/>
      <div className="site-footer__base">
        <span>{t.footer.copyright}</span>
        <span>{t.footer.tagline}</span>
      </div>
    </footer>
  );
}

window.CHROME = { TopBar, Hero, BrandStrip, Footer };
