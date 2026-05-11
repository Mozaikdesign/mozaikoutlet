/* global React */
// Catalogue data is fetched async at startup; components that use it read from window.CATALOGUE.

// Category ordering for UI
const CATEGORY_ORDER = [
  'Sofas', 'Armchairs', 'Chairs', 'Beds & Daybeds',
  'Tables & Consoles', 'Coffee & Side Tables',
  'Storage & Bookcases', 'Poufs & Ottomans', 'Objects & Vases',
  'Outdoor Seating', 'Outdoor Chairs', 'Outdoor Tables',
  'Outdoor Accents', 'Outdoor Architecture', 'Outdoor',
  'Indoor',
];

// Helpers
const eurFmt = (n) => '€' + (n || 0).toLocaleString('en-US');
const pctFmt = (n) => '−' + n + '%';

// Placeholder SVG used when a photo fails to load
const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <rect width='200' height='200' fill='#efece6'/>
      <text x='100' y='108' text-anchor='middle' font-family='serif' font-size='14' fill='#7a6f55' font-style='italic'>No image</text>
    </svg>`
  );

function Img({ src, alt, style, className }) {
  const [err, setErr] = React.useState(false);
  return (
    <img
      src={err || !src ? PLACEHOLDER_SVG : src}
      alt={alt || ''}
      loading="lazy"
      onError={() => setErr(true)}
      style={style}
      className={className}
    />
  );
}

window.DATA = { CATEGORY_ORDER, eurFmt, pctFmt, Img, PLACEHOLDER_SVG };
