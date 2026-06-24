/* global React */
const { useMemo } = React;

// Faces of the cube, in the order we lay images onto them.
const CUBE_FACES = ['front', 'back', 'right', 'left', 'top', 'bottom'];
const TILES_PER_FACE = 9; // 3 × 3 mosaic per face

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

window.CUBE = { Cube };
