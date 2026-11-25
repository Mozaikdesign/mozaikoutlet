/* global React, I18N */
// Ürün Bilgi Talep Formu → onlinedestek@mozaikdesign.com (via FormSubmit)
const INQ_ENDPOINT = 'https://formsubmit.co/ajax/onlinedestek@mozaikdesign.com';

// Capture traffic source once per visit (first landing URL + referrer)
(function captureSource() {
  try {
    if (sessionStorage.getItem('mozaik.src')) return;
    const q = new URLSearchParams(location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .map(k => q.get(k) ? `${k}=${q.get(k)}` : null).filter(Boolean).join(' · ');
    const ref = document.referrer && !document.referrer.includes(location.host) ? document.referrer : '';
    let label = 'Direct';
    if (q.get('fbclid') || /facebook|instagram|meta/i.test((q.get('utm_source') || '') + ref)) label = (q.get('utm_medium') || '').match(/cpc|paid/i) ? 'Paid Traffic (CPC – meta)' : 'Social (meta)';
    else if (q.get('gclid')) label = 'Paid Traffic (CPC – google)';
    else if (q.get('utm_source')) label = `${q.get('utm_source')}${q.get('utm_medium') ? ' / ' + q.get('utm_medium') : ''}`;
    else if (ref) label = /google|bing|yandex/i.test(ref) ? 'Organic Search' : 'Referral';
    sessionStorage.setItem('mozaik.src', JSON.stringify({ label, utm, ref, landing: location.href }));
  } catch (e) {}
})();

function InquiryForm({ product, onClose, onSent }) {
  const { useState, useEffect } = React;
  const { lang } = I18N.useI18n();
  const tr = lang === 'tr';
  const L = tr ? {
    title: 'Ürün Bilgi Talep Formu', sub: 'Ürün seçenekleri ve fiyatlandırma için iletişime geçebilirsiniz.',
    name: 'Ad, soyad*', email: 'E-posta*', phone: 'Telefon*', company: 'Şirket', product: 'Ürün',
    how: 'Size nasıl dönüş yapalım?*', byEmail: 'E-posta', byPhone: 'Telefon',
    news: 'Yenilikler ve fırsatlardan haberdar olmak istiyorum.',
    kvkk: 'İşlenecek kişisel verilerime ilişkin Aydınlatma Metnini okudum, anladım ve onaylıyorum.',
    send: 'Gönder', sending: 'Gönderiliyor…',
    done: 'Teşekkürler — talebiniz alındı. Ekibimiz en kısa sürede size dönüş yapacak.',
    err: 'Gönderilemedi. Lütfen tekrar deneyin veya onlinedestek@mozaikdesign.com adresine yazın.', close: 'Kapat',
  } : {
    title: 'Product Information Request', sub: 'Get in touch for product options and pricing.',
    name: 'Full name*', email: 'Email*', phone: 'Phone*', company: 'Company', product: 'Product',
    how: 'How should we get back to you?*', byEmail: 'Email', byPhone: 'Phone',
    news: 'I would like to hear about news and offers.',
    kvkk: 'I have read, understood and approve the Clarification Text regarding my personal data.',
    send: 'Send', sending: 'Sending…',
    done: 'Thank you — your request has been received. Our team will get back to you shortly.',
    err: 'Could not send. Please try again or write to onlinedestek@mozaikdesign.com.', close: 'Close',
  };
  const [f, setF] = useState({ name: '', email: '', phone: '', company: '', how: '', news: true, kvkk: false });
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.phone.trim().length >= 7 && f.how && f.kvkk;

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    document.addEventListener('keydown', h, true);
    return () => document.removeEventListener('keydown', h, true);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || status === 'sending') return;
    setStatus('sending');
    let src = {}; try { src = JSON.parse(sessionStorage.getItem('mozaik.src') || '{}'); } catch (x) {}
    let ip = '';
    try { ip = (await (await fetch('https://api.ipify.org?format=json')).json()).ip; } catch (x) {}
    const now = new Date();
    const payload = {
      _subject: 'OUTLET Ürün Bilgi Talebi',
      _template: 'basic',
      _captcha: 'false',
      _replyto: f.email,
      'Gönderen': f.name,
      'E-posta': f.email,
      'Telefon': f.phone,
      'Şirket': f.company || '—',
      'Marka': product.brand,
      'Ürün': product.name,
      'Ürün kodu': String(product.id),
      'Ürün linki': `https://mozaikoutlet.com — ${product.brand} ${product.name}`,
      'Ürün kategorisi': product.category || '—',
      'Ölçüler': product.dims || '—',
      'Outlet fiyatı': '€' + (product.saleEur || 0).toLocaleString('de-DE'),
      'Liste fiyatı': '€' + (product.listEur || 0).toLocaleString('de-DE'),
      'Nasıl dönüş yapılsın?': f.how,
      'Yenilikler ve fırsatlar': f.news ? 'Evet' : 'Hayır',
      'Aydınlatma Metni onayı': 'Evet',
      'Trafik Kaynağı': src.label || 'Direct',
      'UTM': src.utm || '—',
      'Referans': src.ref || '—',
      'Giriş sayfası': src.landing || location.href,
      'Tarih': now.toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }),
      'IP': ip || '—',
      'Tarayıcı': navigator.userAgent,
      'Dil': lang.toUpperCase(),
    };
    try {
      const r = await fetch(INQ_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      console.log('[inquiry]', r.status, j);
      if (r.ok && String(j.success) !== 'false') setStatus('done');
      else if (/activat/i.test(j.message || '')) setStatus('activate');
      else { setErrMsg(j.message || ('HTTP ' + r.status)); setStatus('error'); }
    } catch (x) { console.warn('[inquiry]', x); setErrMsg(String(x.message || x)); setStatus('error'); }
  };

  return (
    <div className="inq" onClick={onClose}>
      <form className="inq__dialog" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <button type="button" className="inq__close" onClick={onClose} aria-label={L.close}>✕</button>
        <div className="inq__intro">
          <h2 className="inq__title">{L.title}</h2>
          <div className="inq__bar"></div>
          <p className="inq__sub">{L.sub}</p>
        </div>
        {status === 'done' ? (
          <div className="inq__done">
            <p>{L.done}</p>
            <button type="button" className="btn btn--primary" onClick={() => { onSent && onSent(); onClose(); }}>{L.close}</button>
          </div>
        ) : (
          <div className="inq__grid">
            <label className="inq__field"><span>{L.name}</span><input value={f.name} onChange={set('name')} autoComplete="name" required/></label>
            <label className="inq__field"><span>{L.email}</span><input type="email" value={f.email} onChange={set('email')} autoComplete="email" required/></label>
            <label className="inq__field"><span>{L.phone}</span><input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" required/></label>
            <label className="inq__field"><span>{L.company}</span><input value={f.company} onChange={set('company')} autoComplete="organization"/></label>
            <label className="inq__field inq__field--full"><span>{L.product}</span><input value={`${product.brand} — ${product.name}`} readOnly/></label>
            <div className="inq__field">
              <span>{L.how}</span>
              <div className="inq__radios">
                <label><input type="radio" name="how" value="E-posta" checked={f.how === 'E-posta'} onChange={set('how')}/>{L.byEmail}</label>
                <label><input type="radio" name="how" value="Telefon" checked={f.how === 'Telefon'} onChange={set('how')}/>{L.byPhone}</label>
              </div>
            </div>
            <div className="inq__checks">
              <label><input type="checkbox" checked={f.news} onChange={set('news')}/><span>{L.news}</span></label>
              <label><input type="checkbox" checked={f.kvkk} onChange={set('kvkk')}/><span>{L.kvkk}</span></label>
            </div>
            <div className="inq__foot">
              {status === 'error' && <p className="inq__err">{L.err}{errMsg && <><br/><small>({errMsg})</small></>}</p>}
              {status === 'activate' && <p className="inq__err">{tr ? 'Form henüz aktif değil: onlinedestek@mozaikdesign.com adresine gelen FormSubmit "Activate Form" e-postasındaki butona bir kez tıklayın, sonra tekrar gönderin.' : 'Form not activated yet: click the button in the FormSubmit "Activate Form" email sent to onlinedestek@mozaikdesign.com, then send again.'}</p>}
              <button type="submit" className="btn btn--primary inq__send" disabled={!valid || status === 'sending'}>{status === 'sending' ? L.sending : L.send}</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

window.INQUIRY = { InquiryForm };
