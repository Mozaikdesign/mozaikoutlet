/* global React */
const { useState, useEffect, useRef } = React;

function TryInRoom({ product, onClose }) {
  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const furnitureRef = useRef(null);
  const gestureRef  = useRef({ dragging: false, lastX: 0, lastY: 0, pinching: false, lastDist: 0 });

  const [processedSrc, setProcessedSrc] = useState(null);
  const [processing,   setProcessing]   = useState(true);
  const [cameraReady,  setCameraReady]  = useState(false);
  const [cameraError,  setCameraError]  = useState(null);
  const [photoTaken,   setPhotoTaken]   = useState(null);
  const [showHint,     setShowHint]     = useState(true);
  const [pos,   setPos]   = useState({ x: 0, y: 60 });
  const [scale, setScale] = useState(0.85);

  /* ── fade hint after 3 s ── */
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  /* ── start camera ── */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
    }).then(stream => {
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
    }).catch(err => {
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Please go to your browser settings, allow camera access for this site, then try again.'
          : 'Camera is not available. Please try on a mobile device with a camera.'
      );
    });
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, []);

  /* ── load image + strip white background ── */
  useEffect(() => {
    if (!product?.dekupe) return;
    setProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        removeWhiteBg(imageData, 30);
        ctx.putImageData(imageData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
      } catch {
        setProcessedSrc(product.dekupe); /* fallback if canvas is tainted */
      }
      setProcessing(false);
    };
    img.onerror = () => { setProcessedSrc(product.dekupe); setProcessing(false); };
    img.src = product.dekupe;
  }, [product]);

  /* ── flood-fill background removal from all edges ── */
  function removeWhiteBg(imageData, tolerance) {
    const { data, width, height } = imageData;
    const visited = new Uint8Array(width * height);
    const stack   = [];
    const thresh  = 255 - tolerance;

    /* seed every edge pixel */
    for (let x = 0; x < width; x++) {
      [[x, 0], [x, height - 1]].forEach(([cx, cy]) => {
        const i = cy * width + cx;
        if (!visited[i]) { visited[i] = 1; stack.push(i); }
      });
    }
    for (let y = 1; y < height - 1; y++) {
      [[0, y], [width - 1, y]].forEach(([cx, cy]) => {
        const i = cy * width + cx;
        if (!visited[i]) { visited[i] = 1; stack.push(i); }
      });
    }

    while (stack.length > 0) {
      const i  = stack.pop();
      const px = i * 4;
      if (data[px] >= thresh && data[px + 1] >= thresh && data[px + 2] >= thresh) {
        data[px + 3] = 0; /* make transparent */
        const x = i % width;
        const y = Math.floor(i / width);
        if (x > 0          && !visited[i - 1])      { visited[i - 1]      = 1; stack.push(i - 1); }
        if (x < width - 1  && !visited[i + 1])      { visited[i + 1]      = 1; stack.push(i + 1); }
        if (y > 0          && !visited[i - width])   { visited[i - width]  = 1; stack.push(i - width); }
        if (y < height - 1 && !visited[i + width])  { visited[i + width]  = 1; stack.push(i + width); }
      }
    }
  }

  /* ── touch gesture helpers ── */
  function dist(t1, t2) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  }

  function onTouchStart(e) {
    e.preventDefault();
    const g = gestureRef.current;
    if (e.touches.length === 1) {
      g.dragging = true; g.pinching = false;
      g.lastX = e.touches[0].clientX;
      g.lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      g.dragging = false; g.pinching = true;
      g.lastDist = dist(e.touches[0], e.touches[1]);
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    const g = gestureRef.current;
    if (g.dragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - g.lastX;
      const dy = e.touches[0].clientY - g.lastY;
      g.lastX = e.touches[0].clientX;
      g.lastY = e.touches[0].clientY;
      setPos(p => ({ x: p.x + dx, y: p.y + dy }));
    } else if (g.pinching && e.touches.length === 2) {
      const newDist = dist(e.touches[0], e.touches[1]);
      const ratio   = newDist / g.lastDist;
      g.lastDist    = newDist;
      setScale(s => Math.max(0.15, Math.min(5, s * ratio)));
    }
  }

  function onTouchEnd(e) {
    const g = gestureRef.current;
    if (e.touches.length === 0) { g.dragging = false; g.pinching = false; }
    else if (e.touches.length === 1) {
      g.pinching = false; g.dragging = true;
      g.lastX = e.touches[0].clientX;
      g.lastY = e.touches[0].clientY;
    }
  }

  /* ── composite camera + furniture → JPEG ── */
  function takePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || window.innerWidth;
    canvas.height = video.videoHeight || window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (processedSrc && furnitureRef.current) {
      const el   = furnitureRef.current;
      const rect = el.getBoundingClientRect();
      const sx   = canvas.width  / window.innerWidth;
      const sy   = canvas.height / window.innerHeight;
      ctx.drawImage(el, rect.left * sx, rect.top * sy, rect.width * sx, rect.height * sy);
    }
    setPhotoTaken(canvas.toDataURL('image/jpeg', 0.92));
  }

  function savePhoto() {
    if (!photoTaken) return;
    const a = document.createElement('a');
    a.href = photoTaken;
    a.download = (product.brand + '-' + product.name).replace(/\s+/g, '-') + '.jpg';
    a.click();
  }

  /* ─────────────────────────────── render ─────────────────────────────── */
  return (
    <div className="tr-room">

      {/* Live camera feed */}
      <video ref={videoRef} className="tr-room__video" autoPlay playsInline muted/>

      {/* Camera / permission error */}
      {cameraError && (
        <div className="tr-room__error">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <p>{cameraError}</p>
          <button className="tr-room__err-btn" onClick={onClose}>← Go back</button>
        </div>
      )}

      {/* Spinner while camera or image loads */}
      {(processing || (!cameraReady && !cameraError)) && (
        <div className="tr-room__loading">
          <div className="tr-room__spinner"></div>
          <p>{processing ? 'Removing background…' : 'Starting camera…'}</p>
        </div>
      )}

      {/* Furniture drag / pinch area */}
      {processedSrc && !processing && (
        <div
          className="tr-room__stage"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            ref={furnitureRef}
            src={processedSrc}
            className="tr-room__furniture"
            alt={product.name}
            draggable="false"
            style={{ transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${scale})` }}
          />
        </div>
      )}

      {/* Top bar */}
      <div className="tr-room__topbar">
        <button className="tr-room__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className="tr-room__info">
          <span className="tr-room__brand">{product.brand}</span>
          <span className="tr-room__pname">{product.name}</span>
        </div>
      </div>

      {/* Gesture hint */}
      <div className={'tr-room__hint' + (showHint ? '' : ' tr-room__hint--gone')}>
        Drag to move · Pinch to resize
      </div>

      {/* Shutter button */}
      <div className="tr-room__bottom">
        <button
          className="tr-room__shutter"
          onClick={takePhoto}
          disabled={!cameraReady || processing}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Take Photo
        </button>
      </div>

      {/* Photo preview */}
      {photoTaken && (
        <div className="tr-room__preview">
          <img src={photoTaken} alt="Your room" className="tr-room__preview-img"/>
          <div className="tr-room__preview-actions">
            <button className="tr-room__preview-btn tr-room__preview-btn--save" onClick={savePhoto}>
              Save to Camera Roll
            </button>
            <button className="tr-room__preview-btn tr-room__preview-btn--retake" onClick={() => setPhotoTaken(null)}>
              Retake
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

window.TRYINROOM = { TryInRoom };
