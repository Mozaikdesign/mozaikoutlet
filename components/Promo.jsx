/* global React, I18N */
// Short-term extra discount campaign.
// Bands: current outlet discount → new total discount off list price.
// Phase 1 countdown ends ANNOUNCED_END; then banner shows "extended" and counts to FINAL_END.
// After FINAL_END everything reverts automatically to catalogue prices.
const PROMO_CFG = {
  ENABLED: true, // set to false to switch the whole campaign off instantly
  ANNOUNCED_END: new Date('2026-11-04T23:59:59+03:00'),
  FINAL_END: new Date('2026-11-11T23:59:59+03:00'),
  bands: [
    { min: 60, pct: 70 },
    { min: 45, pct: 65 },
    { min: 30, pct: 55 },
    { min: 15, pct: 40 },
  ],
  fallbackExtra: 10, // items under 15% get +10 points
};

const promoActive = (now = new Date()) => PROMO_CFG.ENABLED && now < PROMO_CFG.FINAL_END;
const promoExtended = (now = new Date()) => now >= PROMO_CFG.ANNOUNCED_END;

function promoPct(p) {
  const b = PROMO_CFG.bands.find(b => p.discountPct >= b.min);
  return b ? b.pct : (p.discountPct || 0) + PROMO_CFG.fallbackExtra;
}

function applyPromo(list) {
  if (!promoActive() || !Array.isArray(list)) return list;
  return list.map(p => {
    if (!p.listEur || !p.saleEur) return p;
    const pct = promoPct(p);
    const newSale = Math.round((p.listEur * (1 - pct / 100)) / 10) * 10;
    if (newSale >= p.saleEur) return p;
    const extra10 = true;
    return { ...p, prevSaleEur: p.saleEur, prevDiscountPct: p.discountPct, saleEur: newSale, discountPct: pct, promo: true, extra10 };
  });
}

function useCountdown(target) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
}

function PromoBanner() {
  const { lang } = I18N.useI18n();
  const extended = promoExtended();
  const c = useCountdown(extended ? PROMO_CFG.FINAL_END : PROMO_CFG.ANNOUNCED_END);
  const pad = n => String(n).padStart(2, '0');
  const tr = lang === 'tr';
  const u = tr ? ['g', 's', 'dk', 'sn'] : ['d', 'h', 'm', 's'];
  return (
    <div className="promo-banner" role="status">
      <span className="promo-banner__tag">{extended ? (tr ? 'Süre uzatıldı' : 'Extended') : (tr ? 'Özel indirim' : 'Special offer')}</span>
      <span className="promo-banner__msg">{tr ? <>Tüm outlet’te <strong>%70’e varan</strong> ekstra indirim</> : <>Extra savings — <strong>up to 70% off</strong> the whole outlet</>}</span>
      <span className="promo-banner__clock" aria-label="countdown">
        <em>{tr ? 'Bitimine' : 'Ends in'}</em>
        <b>{c.d}{u[0]}</b><b>{pad(c.h)}{u[1]}</b><b>{pad(c.m)}{u[2]}</b><b>{pad(c.s)}{u[3]}</b>
      </span>
    </div>
  );
}

function Extra10({ className }) {
  const { lang } = I18N.useI18n();
  return <span className={'promo-extra ' + (className || '')}>{lang === 'tr' ? '%10 ek indirim ile' : 'with extra 10% off'}</span>;
}

const goCatalogue = () => setTimeout(() => { const el = document.querySelector('.catalogue-main'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }, 50);

function PromoHero() {
  const { lang } = I18N.useI18n();
  const l = lang === 'tr' ? 'tr' : 'en';
  return (
    <button type="button" className="promo-hero" onClick={goCatalogue} aria-label={l === 'tr' ? 'Hemen keşfet' : 'Discover now'}>
      <picture>
        <source media="(max-width: 720px)" srcSet={'assets/promo/ek10-mobile-' + l + '.webp'}/>
        <img src={'assets/promo/ek10-desktop-' + l + '.webp'} alt={l === 'tr' ? 'Tasarımlar tükenmeden! Mevcut indirimlere ek %10 indirim.' : 'Before the designs are gone! An extra 10% off existing discounts.'}/>
      </picture>
    </button>
  );
}

function PromoPopup() {
  const { lang } = I18N.useI18n();
  const l = lang === 'tr' ? 'tr' : 'en';
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (sessionStorage.getItem('mozaik.promoPopup')) return;
    const id = setTimeout(() => { setOpen(true); sessionStorage.setItem('mozaik.promoPopup', '1'); }, 1500);
    return () => clearTimeout(id);
  }, []);
  if (!open) return null;
  const close = () => setOpen(false);
  return (
    <div className="promo-popup" onClick={close}>
      <div className="promo-popup__dialog" onClick={e => e.stopPropagation()}>
        <button className="promo-popup__close" onClick={close} aria-label="Close">×</button>
        <button type="button" className="promo-popup__img" onClick={() => { close(); goCatalogue(); }}>
          <img src={'assets/promo/ek10-popup-' + l + '.webp'} alt={l === 'tr' ? 'Mevcut indirimlere ek %10 indirim' : 'An extra 10% off existing discounts'}/>
        </button>
      </div>
    </div>
  );
}

window.PROMO = { PROMO_CFG, promoActive, applyPromo, PromoBanner, Extra10, PromoHero, PromoPopup };
