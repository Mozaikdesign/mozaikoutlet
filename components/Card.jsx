/* global React, DATA */
const { useState } = React;
const { Img, eurFmt } = DATA;

// ------- Grid card — clean, neutral, showroom-catalogue style -------
function GridCard({ product, onOpen, onSave, saved, cardStyle }) {
  const [hover, setHover] = useState(false);
  const lifes = Array.isArray(product.lifes) ? product.lifes : (product.life ? [product.life] : []);
  const firstLife = lifes[0];
  const showLife = hover && firstLife;

  return (
    <article
      className={'card card--' + cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(product)}
    >
      <div className="card__image">
        <Img src={showLife ? firstLife : product.dekupe} alt={product.name}/>
        {product.discountPct >= 15 && (
          <span className="card__discount">−{product.discountPct}%</span>
        )}
        {product.qty !== 1 && (
          <span className={'card__qty card__qty--' + (product.qty === 2 ? 'two' : 'many')}>
            {product.qty === 2 ? '2 left' : product.qty + ' available'}
          </span>
        )}
        {firstLife && product.dekupe && (
          <div className="card__photo-flip" aria-hidden="true">
            <Img src={showLife ? product.dekupe : firstLife} alt=""/>
            {lifes.length > 1 && (
              <span className="card__photo-count">+{lifes.length}</span>
            )}
          </div>
        )}
        <button
          className={'card__save ' + (saved ? 'is-saved' : '')}
          onClick={(e) => { e.stopPropagation(); onSave(product); }}
          aria-label="Save"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="card__body">
        <div className="card__brand">{product.brand}</div>
        <div className="card__name">{product.name}</div>
        <div className="card__prices">
          <span className="card__price">{eurFmt(product.saleEur)}</span>
          {product.listEur > product.saleEur && (
            <span className="card__list">{eurFmt(product.listEur)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

// ------- Editorial card — larger, magazine-style, with copywriting -------
function EditorialCard({ product, onOpen, onSave, saved, index }) {
  // vary size based on index for rhythm
  const sizes = ['span-1', 'span-1', 'span-2', 'span-1', 'span-1', 'span-1'];
  const size = sizes[index % sizes.length];

  return (
    <article
      className={'ed-card ed-card--' + size}
      onClick={() => onOpen(product)}
    >
      <div className="ed-card__image">
        <Img src={product.dekupe} alt={product.name}/>
        {(() => {
          const lifes = Array.isArray(product.lifes) ? product.lifes : (product.life ? [product.life] : []);
          return lifes[0] ? (
            <div className="ed-card__life">
              <Img src={lifes[0]} alt={product.name + ' in situ'}/>
            </div>
          ) : null;
        })()}
      </div>
      <div className="ed-card__body">
        <div className="ed-card__line">
          <span className="ed-card__brand">— {product.brand}</span>
          <span className="ed-card__qty">{product.qty === 1 ? 'one only' : product.qty + ' available'}</span>
        </div>
        <h3 className="ed-card__name">{product.name}</h3>
        <div className="ed-card__meta">{product.category}</div>
        <div className="ed-card__prices">
          <span className="ed-card__list">{eurFmt(product.listEur)}</span>
          <span className="ed-card__arrow">→</span>
          <span className="ed-card__sale">{eurFmt(product.saleEur)}</span>
          <span className="ed-card__pct">−{product.discountPct}%</span>
        </div>
      </div>
    </article>
  );
}

// ------- List row — dense, table-like -------
function ListRow({ product, onOpen, onSave, saved }) {
  return (
    <tr className="list-row" onClick={() => onOpen(product)}>
      <td className="list-row__img">
        <Img src={product.dekupe} alt={product.name}/>
      </td>
      <td className="list-row__brand">{product.brand}</td>
      <td className="list-row__name">
        <div>{product.name}</div>
        <div className="list-row__cat">{product.category}</div>
      </td>
      <td className="list-row__qty">{product.qty}</td>
      <td className="list-row__list">{eurFmt(product.listEur)}</td>
      <td className="list-row__sale">
        {eurFmt(product.saleEur)}
        <span className="list-row__pct">−{product.discountPct}%</span>
      </td>
      <td className="list-row__cta">
        <button onClick={(e) => { e.stopPropagation(); onOpen(product); }}>view →</button>
      </td>
    </tr>
  );
}

window.CARDS = { GridCard, EditorialCard, ListRow };
