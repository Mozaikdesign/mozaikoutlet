/* global React, I18N */
const { useState } = React;
const { useI18n } = I18N;

/* --------------------------------------------------------------------
   Newsletter delivery — Mailchimp.
   Subscribers are added to your Mailchimp audience (mailing list).
   Get this URL from: Mailchimp → Audience → Sign-up forms →
   Embedded forms → copy the <form action="..."> value.
   It ends in /subscribe/post?u=XXXX&id=YYYY
   ⬇️ Paste your real action URL here.
   To also capture phone/address, add a Phone field and a plain-text
   "Address" field to your audience (merge tags PHONE and ADDRESS).
-------------------------------------------------------------------- */
const MAILCHIMP_ACTION = 'https://YOUR_DC.list-manage.com/subscribe/post?u=YOUR_U&id=YOUR_ID';

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

function Hero({ view, setView, section, setSection, counts, cubeImages, pickerImages }) {
  const { t } = useI18n();
  const Cube = window.CUBE && window.CUBE.Cube;
  return (
    <section className="hero">
      <div className="hero__meta">
        <span className="hero__eyebrow">{t.hero.eyebrowLeft}</span>
        <span className="hero__dot">·</span>
        <span className="hero__eyebrow">{t.hero.eyebrowRight}</span>
      </div>
      <div className="hero__lead">
        <h1 className="hero__title">
          {t.hero.titlePart1}<br/><em>{t.hero.titleEm}</em>
          {t.hero.titlePart2 ? <><br/>{t.hero.titlePart2}</> : null}
          {t.hero.titleU ? <> <u>{t.hero.titleU}</u></> : null}
        </h1>
        {Cube && cubeImages && cubeImages.length > 0 && <Cube images={cubeImages}/>}
        <p className="hero__sub">
          {t.hero.sub}<em>{t.hero.subEm}</em>
        </p>
      </div>

      <div className="hero__stats">
        {t.hero.stats.map(([v, l], i) => (
          <div key={i} className="hero__stat"><span>{v}</span><label>{l}</label></div>
        ))}
      </div>

      <div className="hero__picker">

        <div className="hero__picker-grid">
          <button
            className={'pick-card ' + (section === 'INDOOR' ? 'is-active' : '')}
            onClick={() => setSection('INDOOR')}
          >
            <span className="pick-card__media">
              <img className="pick-card__img pick-card__img--base" src={(pickerImages && pickerImages.indoor || [])[0]} alt="" loading="lazy"/>
              {(pickerImages && pickerImages.indoor || [])[1] && <img className="pick-card__img pick-card__img--hover" src={pickerImages.indoor[1]} alt="" loading="lazy"/>}
            </span>
            <span className="pick-card__label">{t.hero.indoorTitle}</span>
            <span className="pick-card__badge">{counts.indoor} {t.hero.pieces}</span>
            <span className="pick-card__foot">
              <span className="pick-card__sub">{t.hero.indoorSub}</span>
              <span className="pick-card__cta">{t.hero.enter} →</span>
            </span>
          </button>
          <button
            className={'pick-card ' + (section === 'OUTDOOR' ? 'is-active' : '')}
            onClick={() => setSection('OUTDOOR')}
          >
            <span className="pick-card__media">
              <img className="pick-card__img pick-card__img--base" src={(pickerImages && pickerImages.outdoor || [])[0]} alt="" loading="lazy"/>
              {(pickerImages && pickerImages.outdoor || [])[1] && <img className="pick-card__img pick-card__img--hover" src={pickerImages.outdoor[1]} alt="" loading="lazy"/>}
            </span>
            <span className="pick-card__label">{t.hero.outdoorTitle}</span>
            <span className="pick-card__badge">{counts.outdoor} {t.hero.pieces}</span>
            <span className="pick-card__foot">
              <span className="pick-card__sub">{t.hero.outdoorSub}</span>
              <span className="pick-card__cta">{t.hero.enter} →</span>
            </span>
          </button>
          <button
            className={'pick-card pick-card--all ' + (section === 'All' ? 'is-active' : '')}
            onClick={() => setSection('All')}
          >
            <span className="pick-card__media">
              <img className="pick-card__img pick-card__img--base" src={(pickerImages && pickerImages.all || [])[0]} alt="" loading="lazy"/>
              {(pickerImages && pickerImages.all || [])[1] && <img className="pick-card__img pick-card__img--hover" src={pickerImages.all[1]} alt="" loading="lazy"/>}
            </span>
            <span className="pick-card__label">{t.hero.allTitle}</span>
            <span className="pick-card__badge">{counts.total} {t.hero.pieces}</span>
            <span className="pick-card__foot">
              <span className="pick-card__sub">{t.hero.allSub}</span>
              <span className="pick-card__cta">{t.hero.enter} →</span>
            </span>
          </button>
        </div>
      </div>

      <div className="hero__controls">
        <span className="hero__controls-label">{t.hero.view}</span>
        <div className="hero__view-toggle">
          {['grid', 'list'].map(v => (
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

  const submit = (e) => {
    e.preventDefault();
    if (!email || !consent || status === 'sending') return;

    // If the Mailchimp URL hasn't been configured yet, fail gracefully.
    if (MAILCHIMP_ACTION.includes('YOUR_U')) {
      console.warn('Mailchimp not configured — paste your action URL into MAILCHIMP_ACTION.');
      setStatus('error');
      return;
    }

    setStatus('sending');

    // Mailchimp doesn't allow cross-origin fetch, so we use JSONP:
    // hit the /post-json endpoint with a callback that receives the result.
    const cb = 'mcCallback_' + Date.now();
    const params = new URLSearchParams();
    params.set('EMAIL', email);
    if (phone.trim()) params.set('PHONE', phone.trim());
    if (address.trim()) params.set('ADDRESS', address.trim());
    params.set('LANG', lang.toUpperCase()); // only stored if a LANG field exists
    params.set('c', cb);

    const url = MAILCHIMP_ACTION.replace('/post?', '/post-json?') + '&' + params.toString();
    const script = document.createElement('script');

    const cleanup = () => {
      try { delete window[cb]; } catch (err) { window[cb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    window[cb] = (res) => {
      cleanup();
      const msg = (res && res.msg) || '';
      if ((res && res.result === 'success') || /already subscribed/i.test(msg)) {
        setStatus('done');
        setEmail(''); setPhone(''); setAddress(''); setConsent(false);
      } else {
        setStatus('error');
      }
    };

    script.src = url;
    script.onerror = () => { cleanup(); setStatus('error'); };
    document.body.appendChild(script);
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

function ViewModeToggle() {
  const { t } = useI18n();
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('mozaik.viewmode') === 'desktop' ? 'desktop' : 'mobile'; }
    catch (e) { return 'mobile'; }
  });
  const apply = (m) => {
    setMode(m);
    try { localStorage.setItem('mozaik.viewmode', m); } catch (e) {}
    const vp = document.getElementById('viewport');
    if (vp) vp.setAttribute('content', m === 'desktop' ? 'width=1280' : 'width=device-width, initial-scale=1');
  };
  return (
    <div className="viewmode">
      <span className="viewmode__label">{t.footer.viewSite}</span>
      <div className="viewmode__toggle">
        <button className={mode === 'mobile' ? 'is-active' : ''} onClick={() => apply('mobile')}>{t.footer.mobile}</button>
        <button className={mode === 'desktop' ? 'is-active' : ''} onClick={() => apply('desktop')}>{t.footer.desktop}</button>
      </div>
    </div>
  );
}

function Footer({ onShopFilter, onInfo, onBrands }) {
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
    // "Brands" / "Markalar" → open the brand list, in either language.
    if (t.footer.shopLinks[i] === t.nav.brands) {
      if (onBrands) onBrands();
      return;
    }
    const action = shopActions[i] || {};
    if (action.focus === 'brands') {
      if (onBrands) onBrands();
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
          <div className="site-footer__social">
            <span className="site-footer__social-label">{t.footer.follow}</span>
            <div className="site-footer__social-icons">
              <a href="https://www.instagram.com/mozaikdesign/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/>
                  <circle cx="12" cy="12" r="4.2"/>
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/mozaikdesigncom/?locale=tr_TR" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v1.9H8v3h2.6V21H14v-9.5h2.5l.4-3H14z"/>
                </svg>
              </a>
              <a href="https://wa.me/905395761800" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.8 4.9-1.3A9.9 9.9 0 1 0 12 2zm0 1.8a8.1 8.1 0 0 1 6.9 12.4l.0.1a8.1 8.1 0 0 1-10.9 2.9l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 0 1 12 3.8zm-2.8 4c-.1 0-.4 0-.6.3-.2.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.6 4 3.5 1.9.8 2.3.6 2.8.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.7-.3-1.4-.6-2.1-1.6-.2-.3.2-.3.5-.9.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.3-.4-.5-.4h-.4z"/>
                </svg>
              </a>
            </div>
          </div>
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
        <ViewModeToggle/>
        <span>{t.footer.tagline}</span>
      </div>
    </footer>
  );
}

window.CHROME = { TopBar, Hero, BrandStrip, Footer };
