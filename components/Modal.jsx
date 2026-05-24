/* global React, DATA, I18N */
const { useState, useEffect } = React;
const { Img, eurFmt } = DATA;
const { useI18n } = I18N;

function QuickView({ product, onClose, onSave, saved, onAdd }) {
  const { t } = useI18n();
  const m = t.modal;
  const [imgIdx, setImgIdx] = useState(0);

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

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__dialog" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>{m.close}</button>

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

        <div className="modal__body">
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
          </div>

          <div className="modal__actions">
            <a
              className="btn btn--primary"
              href={
                'mailto:simge@mozaikdesign.com' +
                '?subject=' + encodeURIComponent(`Reserve: ${product.brand} ${product.name}`) +
                '&body=' + encodeURIComponent(
                  `Hello Mozaikdesign team,\n\nI'd like to reserve the piece below:\n\n` +
                  `• ${product.brand} — ${product.name}\n` +
                  `• Category: ${product.category}\n` +
                  `• Dimensions: ${product.dims || '—'}\n` +
                  `• Outlet price: €${product.saleEur?.toLocaleString('de-DE')}\n\n` +
                  `Please confirm availability and condition.\n\nThank you.`
                )
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
  );
}

window.MODAL = { QuickView };
