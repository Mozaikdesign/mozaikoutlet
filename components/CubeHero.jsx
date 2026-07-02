/* global React */
const { useMemo } = React;

// Faces of the cube, in the order we lay images onto them.
const CUBE_FACES = ['front', 'back', 'right', 'left', 'top', 'bottom'];
const TILES_PER_FACE = 9; // 3 × 3 mosaic per face

// Showroom gallery — replaces the cube in the hero.
const SHOWROOM_IMGS = [
  'uploads/hero-1.png',
  'uploads/hero-2.png',
  'uploads/hero-3.png',
];

function ShowroomGallery() {
  const [current, setCurrent] = React.useState(0);
  const [loaded, setLoaded] = React.useState([0]); // track which indices have been preloaded
  const total = SHOWROOM_IMGS.length;

  const next = () => setCurrent(c => (c + 1) % total);

  // Auto-advance every 4s
  React.useEffect(() => {
    const t = setInterval(next, 2000);
    return () => clearInterval(t);
  }, []);

  // Preload next image when current changes
  React.useEffect(() => {
    const nextIdx = (current + 1) % total;
    if (!loaded.includes(nextIdx)) {
      setLoaded(prev => [...prev, nextIdx]);
    }
  }, [current]);

  // Touch swipe support
  const touchStartX = React.useRef(0);
  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) setCurrent(c => dx < 0 ? (c + 1) % total : (c - 1 + total) % total);
  };

  return (
    <div
      className="showroom-gallery cube-stage"
      onClick={next}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ cursor: 'pointer' }}
      aria-hidden="true"
    >
      {SHOWROOM_IMGS.map((src, i) => (
        loaded.includes(i) ? (
          <img key={i} src={src} alt="" className={'showroom-gallery__img' + (i === current ? ' is-active' : '')}/>
        ) : null
      ))}
      <div className="showroom-gallery__dots">
        {SHOWROOM_IMGS.map((_, i) => (
          <div key={i} className={'showroom-gallery__dot' + (i === current ? ' is-active' : '')}/>
        ))}
      </div>
    </div>
  );
}

// A slowly rotating 3D cube whose six faces are photo mosaics.
// `images` is a flat array of image URLs (lifestyle/product shots).
function Cube({ images }) {
  const faces = useMemo(() => {
    const pool = (images && images.length) ? images : [];
    const need = TILES_PER_FACE * CUBE_FACES.length;
    const filled = [];
    for (let i = 0; i < need; i++) {
      filled.push(pool.length ? pool[i % pool.length] : null);
    }
    const grouped = [];
    for (let f = 0; f < CUBE_FACES.length; f++) {
      grouped.push(filled.slice(f * TILES_PER_FACE, f * TILES_PER_FACE + TILES_PER_FACE));
    }
    return grouped;
  }, [images]);

  return (
    <div className="cube-stage" aria-hidden="true">
      <div className="cube">
        {CUBE_FACES.map((face, fi) => (
          <div className={'cube__face cube__face--' + face} key={face}>
            <div className="cube__tiles">
              {faces[fi].map((src, i) => (
                <span
                  className="cube__tile"
                  key={i}
                  style={src ? { backgroundImage: 'url("' + src + '")' } : null}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.CUBE = { Cube, ShowroomGallery };
