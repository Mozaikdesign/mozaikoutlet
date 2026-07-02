/* global React, DATA, I18N, TRYINROOM */
const { useState, useEffect } = React;
const { Img, eurFmt } = DATA;
const { useI18n } = I18N;

function QuickView({ product, onClose, onSave, saved, onAdd }) {
  const { t, lang } = useI18n();
  const m = t.modal;
  const [imgIdx, setImgIdx] = useState(0);
  const [showTryRoom, setShowTryRoom] = useState(false);
  const { TryInRoom } = TRYINROOM;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  const lifes = Array.isArray(product.lifes) ? product.lifes : (product.life ? [product.life] : []);
  const images = [product.dekupe, ...lifes].filter(Boolean);
  const currentImg = images[imgIdx] || product.dekupe;

  const savings = product.listEur - product.saleEur;

  return (<>
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog" onClick={e => e.stopPropagation()}>
        <div className="modal__gallery">
          <div className="modal__main-img">
            <Img src={currentImg} alt={product.name}/>
          </div>
          {images.length > 1 && (
            <div className="modal__thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={imgIdx === i ? 'is-active' : ''}
                >
                  <Img src={src} alt=""/>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="modal__close modal__close--below-img" onClick={onClose}>{m.close}</button>

        <div className="modal__body">
          {isTouchDevice && (
            <button
              className="btn btn--try-room btn--try-room-top"
              onClick={() => setShowTryRoom(true)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              {m.tryRoom}
            </button>
          )}

          <div className="modal__eyebrow">
            <span>{product.brand}</span>
            <span className="modal__eyebrow-dot">·</span>
            <span>{product.category}</span>
          </div>

          <h2 className="modal__title">{product.name}</h2>

          <div className="modal__scarcity">
            <span className="modal__scarcity-dot"/>
            {product.qty === 1 ? m.oneOnly : m.manyAvail(product.qty)}
          </div>

          <div className="modal__pricing">
            <div className="modal__pricing-row">
              <span>{m.listPrice}</span>
              <span className="modal__list-price">{eurFmt(product.listEur)}</span>
            </div>
            <div className="modal__pricing-row">
              <span>{m.outletPrice}</span>
              <span className="modal__sale-price">{eurFmt(product.saleEur)}</span>
            </div>
            <div className="modal__pricing-rule"/>
            <div className="modal__pricing-row modal__pricing-row--save">
              <span>{m.youSave}</span>
              <span>{eurFmt(savings)} <em>(−{product.discountPct}%)</em></span>
            </div>
          </div>

          <div className="modal__tab-body">
            <div className="modal__dim-row">
              <span>{m.asCatalogued}</span>
              <strong>{product.dims || '—'}</strong>
            </div>
            <p className="modal__muted">{m.dimsTolerance}</p>
            {product.note && (
              <p className="modal__note">{typeof product.note === 'string' ? product.note : (product.note[lang] || product.note.en)}</p>
            )}
          </div>

          <div className="modal__actions">
            <a
              className="btn btn--primary"
              href={
                'mailto:simge@mozaikdesign.com' +
                '?subject=' + encodeURIComponent(t.reserveMail.subject(product)) +
                '&body=' + encodeURIComponent(t.reserveMail.bodyModal(product))
              }
              onClick={() => onAdd(product)}
            >
              {m.reserve} — {eurFmt(product.saleEur)}
            </a>
            <button
              className={'btn btn--ghost ' + (saved ? 'is-saved' : '')}
              onClick={() => onSave(product)}
            >
              {saved ? m.saved : m.save}
            </button>

          </div>

        </div>
      </div>
    </div>
    {showTryRoom && <TryInRoom product={product} onClose={() => setShowTryRoom(false)}/>}
  </>);
}

window.MODAL = { QuickView };
