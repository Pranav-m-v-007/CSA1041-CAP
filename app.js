/**
 * ╔══════════════════════════════════════════╗
 * ║        BMI CALCULATOR — app.js           ║
 * ║   100% Vanilla JS · Zero dependencies   ║
 * ╚══════════════════════════════════════════╝
 *
 * Drop this single file anywhere and open in a browser.
 * It builds the full HTML, CSS, Canvas FX & logic itself.
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1.  INJECT  <meta> + FONTS + BASE STYLES
  ───────────────────────────────────────── */
  document.documentElement.lang = "en";
  document.title = "BMI Calculator";

  const metaViewport = document.createElement("meta");
  metaViewport.name = "viewport";
  metaViewport.content = "width=device-width, initial-scale=1.0";
  document.head.appendChild(metaViewport);

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,300&display=swap";
  document.head.appendChild(fontLink);

  const styleEl = document.createElement("style");
  styleEl.textContent = `
    :root {
      --bg: #060a12;
      --panel: #0c1220;
      --border: rgba(255,255,255,0.07);
      --accent: #00f5c4;
      --accent2: #7b61ff;
      --accent3: #ff6b6b;
      --accent4: #ffd166;
      --text: #e8eaf0;
      --muted: #48526e;
      --glow-green: 0 0 40px rgba(0,245,196,0.18);
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { scroll-behavior:smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      overflow-x: hidden;
      position: relative;
    }

    /* ── canvas bg ── */
    #bmi-canvas {
      position: fixed; inset:0; z-index:0; pointer-events:none;
    }

    /* ── grid dots ── */
    .grid-bg {
      position:fixed; inset:0; z-index:0; pointer-events:none;
      background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
      background-size: 38px 38px;
      mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%);
    }

    /* ── card ── */
    .bmi-card {
      position:relative; z-index:2;
      width:100%; max-width:460px;
      background: linear-gradient(148deg, rgba(12,18,32,0.94) 0%, rgba(6,10,18,0.97) 100%);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 2.4rem 2.2rem 2rem;
      box-shadow: 0 32px 90px rgba(0,0,0,0.65), var(--glow-green);
      backdrop-filter: blur(24px);
      animation: cardIn .9s cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes cardIn {
      from { opacity:0; transform:translateY(44px) scale(.95); }
      to   { opacity:1; transform:none; }
    }

    /* ── header ── */
    .bmi-header { text-align:center; margin-bottom:2rem; }
    .logo-ring {
      width:64px; height:64px; margin:0 auto 1rem;
      border-radius:50%;
      border:2px solid var(--accent);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 22px rgba(0,245,196,.32), inset 0 0 22px rgba(0,245,196,.07);
      animation: pulseRing 3s ease-in-out infinite;
    }
    @keyframes pulseRing {
      0%,100% { box-shadow:0 0 22px rgba(0,245,196,.32),inset 0 0 22px rgba(0,245,196,.07); }
      50%      { box-shadow:0 0 40px rgba(0,245,196,.6), inset 0 0 30px rgba(0,245,196,.14); }
    }
    .logo-ring svg { width:30px; height:30px; }

    .bmi-header h1 {
      font-family:'Bebas Neue',sans-serif;
      font-size:2.5rem; letter-spacing:.09em;
      background:linear-gradient(130deg,#fff 30%,var(--accent));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
    }
    .bmi-header p { color:var(--muted); font-size:.8rem; margin-top:.25rem; letter-spacing:.05em; }

    /* ── unit toggle ── */
    .unit-toggle {
      display:flex;
      background:rgba(255,255,255,0.04);
      border:1px solid var(--border);
      border-radius:12px;
      padding:4px;
      margin-bottom:1.8rem;
      position:relative;
    }
    .unit-toggle button {
      flex:1; padding:.52rem; border:none; background:none;
      color:var(--muted); font-family:'DM Sans',sans-serif;
      font-size:.85rem; font-weight:600; cursor:pointer;
      border-radius:9px; position:relative; z-index:1;
      transition:color .3s;
    }
    .unit-toggle button.active { color:#060a12; }
    .unit-slider {
      position:absolute; top:4px; bottom:4px; left:4px;
      width:calc(50% - 4px);
      background:linear-gradient(135deg,var(--accent),var(--accent2));
      border-radius:9px;
      transition:transform .38s cubic-bezier(.34,1.56,.64,1);
      z-index:0;
    }
    .unit-slider.imp { transform:translateX(100%); }

    /* ── inputs ── */
    .bmi-inputs { display:flex; flex-direction:column; gap:1.3rem; }
    .bmi-field { display:flex; flex-direction:column; gap:.45rem; }
    .bmi-field-label {
      font-size:.74rem; font-weight:700; letter-spacing:.12em;
      text-transform:uppercase; color:var(--muted);
      display:flex; align-items:center; gap:.45rem;
    }
    .bmi-field-label em { color:var(--accent); font-style:normal; }

    /* slider */
    .slider-wrap { position:relative; padding:.4rem 0 1.5rem; }
    input[type=range] {
      -webkit-appearance:none; width:100%; height:5px;
      background:rgba(255,255,255,0.09); border-radius:99px;
      outline:none; cursor:pointer;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance:none; width:22px; height:22px;
      border-radius:50%;
      background:linear-gradient(135deg,var(--accent),var(--accent2));
      box-shadow:0 0 14px rgba(0,245,196,.55);
      transition:transform .18s, box-shadow .18s;
      cursor:grab;
    }
    input[type=range]:active::-webkit-slider-thumb {
      transform:scale(1.3); cursor:grabbing;
      box-shadow:0 0 26px rgba(0,245,196,.85);
    }
    .track-fill {
      position:absolute; top:calc(.4rem + 1px); left:0;
      height:5px; border-radius:99px;
      background:linear-gradient(90deg,var(--accent),var(--accent2));
      pointer-events:none;
    }
    .slider-bubble {
      position:absolute; bottom:0;
      transform:translateX(-50%);
      font-size:.73rem; color:var(--accent); font-weight:700;
      letter-spacing:.05em; white-space:nowrap;
      background:rgba(0,245,196,.1); border:1px solid rgba(0,245,196,.25);
      padding:.15rem .5rem; border-radius:6px;
      transition:left .04s;
    }

    /* imperial sub-row */
    .imp-row { display:flex; gap:.8rem; }
    .imp-row .bmi-field { flex:1; }

    /* ── calc button ── */
    .calc-btn {
      margin-top:.8rem; width:100%; padding:1rem;
      border:none; border-radius:14px; cursor:pointer;
      font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:.14em;
      background:linear-gradient(135deg,var(--accent),var(--accent2));
      color:#060a12;
      box-shadow:0 8px 28px rgba(0,245,196,.3);
      position:relative; overflow:hidden;
      transition:transform .2s, box-shadow .2s;
    }
    .calc-btn::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(135deg,rgba(255,255,255,.22),transparent);
      opacity:0; transition:opacity .3s;
    }
    .calc-btn:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(0,245,196,.48); }
    .calc-btn:hover::after { opacity:1; }
    .calc-btn:active { transform:scale(.97); }
    .ripple {
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,.32);
      transform:scale(0); animation:rippleAnim .6s linear;
      pointer-events:none;
    }
    @keyframes rippleAnim { to { transform:scale(4); opacity:0; } }

    /* ── result panel ── */
    .result-panel {
      margin-top:1.6rem; border-radius:20px;
      border:1px solid var(--border);
      background:rgba(255,255,255,0.025);
      overflow:hidden;
      max-height:0; opacity:0;
      transition: max-height .75s cubic-bezier(.22,1,.36,1),
                  opacity .5s ease, transform .5s ease;
      transform:translateY(18px);
    }
    .result-panel.show { max-height:500px; opacity:1; transform:none; }
    .result-inner { padding:1.6rem; }

    /* arc gauge */
    .arc-wrap {
      display:flex; flex-direction:column; align-items:center;
      gap:.4rem; margin-bottom:1.4rem;
    }
    .arc-svg { overflow:visible; }
    .arc-bg { fill:none; stroke:rgba(255,255,255,0.07); stroke-width:9; stroke-linecap:round; }
    .arc-fg {
      fill:none; stroke-width:9; stroke-linecap:round;
      stroke-dasharray:220; stroke-dashoffset:220;
      transition:stroke-dashoffset 1.3s cubic-bezier(.34,1.56,.64,1), stroke .6s;
      filter:drop-shadow(0 0 7px currentColor);
    }
    .arc-center-group {}
    .bmi-num {
      font-family:'Bebas Neue',sans-serif; font-size:3.4rem; line-height:1;
      letter-spacing:.04em; transition:fill .6s;
    }
    .bmi-cat-text {
      font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:700;
      letter-spacing:.14em; text-transform:uppercase; transition:fill .6s;
    }

    /* category bar */
    .cat-bar {
      display:grid; grid-template-columns:repeat(4,1fr);
      gap:5px; margin-bottom:1.2rem;
    }
    .cat-seg {
      padding:.55rem .3rem; border-radius:9px;
      text-align:center; font-size:.66rem; font-weight:700;
      letter-spacing:.05em; text-transform:uppercase;
      opacity:.3; transition:opacity .5s, transform .45s;
    }
    .cat-seg.active { opacity:1; transform:scale(1.05); }
    .seg-under { background:rgba(255,209,102,.13); color:var(--accent4); border:1px solid rgba(255,209,102,.25); }
    .seg-normal { background:rgba(0,245,196,.1);   color:var(--accent);  border:1px solid rgba(0,245,196,.25); }
    .seg-over   { background:rgba(255,107,107,.11); color:var(--accent3); border:1px solid rgba(255,107,107,.25); }
    .seg-obese  { background:rgba(255,50,50,.14);   color:#ff4444;        border:1px solid rgba(255,50,50,.28); }

    /* stats row */
    .stats-row { display:flex; gap:.8rem; }
    .stat-box {
      flex:1; padding:.8rem .5rem; border-radius:12px;
      background:rgba(255,255,255,0.04); border:1px solid var(--border);
      text-align:center;
      animation:statIn .5s ease both;
    }
    .stat-box:nth-child(2) { animation-delay:.1s; }
    .stat-box:nth-child(3) { animation-delay:.2s; }
    @keyframes statIn {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:none; }
    }
    .stat-val {
      font-family:'Bebas Neue',sans-serif; font-size:1.35rem;
      color:var(--accent2);
    }
    .stat-lbl { font-size:.62rem; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; margin-top:.1rem; }

    /* tip */
    .result-tip {
      margin-top:1rem; padding:.9rem 1rem; border-radius:10px;
      background:rgba(123,97,255,0.08); border-left:3px solid var(--accent2);
      font-size:.79rem; line-height:1.6; color:rgba(232,234,240,.75);
    }

    /* reset btn */
    .reset-btn {
      margin-top:1rem; width:100%; padding:.65rem;
      border:1px solid var(--border); border-radius:10px;
      background:transparent; color:var(--muted);
      font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:600;
      letter-spacing:.06em; cursor:pointer;
      transition:color .25s, border-color .25s;
    }
    .reset-btn:hover { color:var(--text); border-color:rgba(255,255,255,.2); }

    /* floating decorative labels */
    .float-label {
      position:fixed; pointer-events:none; z-index:1;
      font-family:'Bebas Neue',sans-serif; font-size:5.5rem;
      color:rgba(255,255,255,.014); letter-spacing:.1em;
      user-select:none;
    }

    @media(max-width:480px){
      .bmi-card { padding:1.8rem 1.3rem 1.6rem; border-radius:20px; }
      .bmi-header h1 { font-size:2rem; }
      .bmi-num { font-size:2.6rem; }
    }
  `;
  document.head.appendChild(styleEl);

  /* ─────────────────────────────────────────
     2.  BUILD  DOM
  ───────────────────────────────────────── */

  // canvas
  const canvas = el("canvas", { id: "bmi-canvas" });
  document.body.appendChild(canvas);

  // grid
  document.body.appendChild(el("div", { className: "grid-bg" }));

  // floating decorative numbers
  [
    { text: "18.5", style: "top:9%;left:4%" },
    { text: "25",   style: "top:68%;right:3%" },
    { text: "30",   style: "top:42%;left:1.5%" },
  ].forEach(({ text, style }) => {
    const d = el("div", { className: "float-label" });
    d.textContent = text;
    d.setAttribute("style", style);
    document.body.appendChild(d);
  });

  // card
  const card = el("div", { className: "bmi-card" });
  document.body.appendChild(card);

  // ── header
  card.appendChild(buildHeader());

  // ── unit toggle
  const { toggleWrap, unitSlider, btnMetric, btnImp } = buildUnitToggle();
  card.appendChild(toggleWrap);

  // ── inputs
  const {
    inputsWrap,
    heightSlider, heightFill, heightBubble,
    heightFtSlider, heightFtFill, heightFtBubble,
    heightInSlider, heightInFill, heightInBubble,
    weightSlider, weightFill, weightBubble,
    metricRow, imperialRow,
  } = buildInputs();
  card.appendChild(inputsWrap);

  // ── calc button
  const calcBtn = el("button", { className: "calc-btn" });
  calcBtn.textContent = "CALCULATE BMI";
  card.appendChild(calcBtn);

  // ── result panel
  const {
    resultPanel,
    arcFg, bmiNumText, bmiCatText,
    segUnder, segNormal, segOver, segObese,
    statBmiVal, statWeightRangeVal, statCatVal,
    tipEl,
  } = buildResultPanel();
  card.appendChild(resultPanel);

  // reset btn
  const resetBtn = el("button", { className: "reset-btn" });
  resetBtn.textContent = "↺  Reset";
  card.appendChild(resetBtn);

  /* ─────────────────────────────────────────
     3.  STATE
  ───────────────────────────────────────── */
  let useMetric = true;
  const state = {
    heightCm: 170,
    heightFt: 5,
    heightIn: 7,
    weightKg: 70,
    weightLb: 154,
  };

  /* ─────────────────────────────────────────
     4.  UNIT TOGGLE LOGIC
  ───────────────────────────────────────── */
  btnMetric.addEventListener("click", () => {
    if (useMetric) return;
    useMetric = true;
    unitSlider.classList.remove("imp");
    btnMetric.classList.add("active");
    btnImp.classList.remove("active");
    metricRow.style.display = "flex";
    imperialRow.style.display = "none";
    // sync
    state.heightCm = Math.round(ftInToCm(state.heightFt, state.heightIn));
    state.weightKg = Math.round(state.weightLb / 2.2046);
    syncSlider(heightSlider, heightFill, heightBubble, state.heightCm, "cm");
    syncSlider(weightSlider, weightFill, weightBubble, state.weightKg, "kg");
  });

  btnImp.addEventListener("click", () => {
    if (!useMetric) return;
    useMetric = false;
    unitSlider.classList.add("imp");
    btnImp.classList.add("active");
    btnMetric.classList.remove("active");
    metricRow.style.display = "none";
    imperialRow.style.display = "flex";
    // sync
    const { ft, inches } = cmToFtIn(state.heightCm);
    state.heightFt = ft; state.heightIn = inches;
    state.weightLb = Math.round(state.weightKg * 2.2046);
    syncSlider(heightFtSlider, heightFtFill, heightFtBubble, state.heightFt, "ft");
    syncSlider(heightInSlider, heightInFill, heightInBubble, state.heightIn, "in");
    syncSlider(weightSlider, weightFill, weightBubble, state.weightLb, "lbs");
  });

  /* ─────────────────────────────────────────
     5.  SLIDER EVENTS
  ───────────────────────────────────────── */
  heightSlider.addEventListener("input", () => {
    state.heightCm = +heightSlider.value;
    syncSlider(heightSlider, heightFill, heightBubble, state.heightCm, "cm");
  });
  heightFtSlider.addEventListener("input", () => {
    state.heightFt = +heightFtSlider.value;
    syncSlider(heightFtSlider, heightFtFill, heightFtBubble, state.heightFt, "ft");
  });
  heightInSlider.addEventListener("input", () => {
    state.heightIn = +heightInSlider.value;
    syncSlider(heightInSlider, heightInFill, heightInBubble, state.heightIn, "in");
  });
  weightSlider.addEventListener("input", () => {
    if (useMetric) {
      state.weightKg = +weightSlider.value;
      syncSlider(weightSlider, weightFill, weightBubble, state.weightKg, "kg");
    } else {
      state.weightLb = +weightSlider.value;
      syncSlider(weightSlider, weightFill, weightBubble, state.weightLb, "lbs");
    }
  });

  /* initial fill */
  syncSlider(heightSlider, heightFill, heightBubble, state.heightCm, "cm");
  syncSlider(weightSlider, weightFill, weightBubble, state.weightKg, "kg");
  syncSlider(heightFtSlider, heightFtFill, heightFtBubble, state.heightFt, "ft");
  syncSlider(heightInSlider, heightInFill, heightInBubble, state.heightIn, "in");

  /* ─────────────────────────────────────────
     6.  CALCULATE
  ───────────────────────────────────────── */
  calcBtn.addEventListener("click", (e) => {
    createRipple(e, calcBtn);
    calculate();
  });

  resetBtn.addEventListener("click", () => {
    resultPanel.classList.remove("show");
  });

  function calculate() {
    let heightM, weightKg;
    if (useMetric) {
      heightM = state.heightCm / 100;
      weightKg = state.weightKg;
    } else {
      const totalIn = state.heightFt * 12 + state.heightIn;
      heightM = totalIn * 0.0254;
      weightKg = state.weightLb / 2.2046;
    }
    if (heightM <= 0 || weightKg <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    const bmiFixed = bmi.toFixed(1);
    const { label, color, seg } = classify(bmi);

    // healthy weight range
    const minKg = 18.5 * heightM * heightM;
    const maxKg = 24.9 * heightM * heightM;
    let weightRange;
    if (useMetric) {
      weightRange = `${minKg.toFixed(1)}–${maxKg.toFixed(1)} kg`;
    } else {
      weightRange = `${(minKg * 2.2046).toFixed(0)}–${(maxKg * 2.2046).toFixed(0)} lbs`;
    }

    // update arc (BMI 10→40 mapped to 0→220)
    const clamped = Math.min(Math.max(bmi, 10), 40);
    const offset = 220 - ((clamped - 10) / 30) * 220;
    arcFg.style.strokeDashoffset = offset;
    arcFg.style.stroke = color;

    bmiNumText.textContent = bmiFixed;
    bmiNumText.style.fill = color;
    bmiCatText.textContent = label;
    bmiCatText.style.fill = color;

    // segments
    [segUnder, segNormal, segOver, segObese].forEach((s) => s.classList.remove("active"));
    seg.classList.add("active");

    statBmiVal.textContent = bmiFixed;
    statWeightRangeVal.textContent = weightRange;
    statCatVal.textContent = label;
    statCatVal.style.color = color;

    tipEl.textContent = getTip(label, bmi);

    // show panel
    resultPanel.classList.add("show");

    // animate count-up for the big number
    animateNumber(bmiNumText, 0, bmi, 1300, (v) => v.toFixed(1), color);

    // burst particles
    fireBurst(color);
  }

  /* ─────────────────────────────────────────
     7.  PARTICLE CANVAS
  ───────────────────────────────────────── */
  const ctx = canvas.getContext("2d");
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // ambient floating particles
  for (let i = 0; i < 55; i++) {
    particles.push(makeParticle(true));
  }

  function makeParticle(random) {
    const colors = ["#00f5c4", "#7b61ff", "#ff6b6b", "#ffd166", "#ffffff"];
    return {
      x: random ? Math.random() * W : W / 2 + (Math.random() - .5) * 60,
      y: random ? Math.random() * H : H * .65 + (Math.random() - .5) * 60,
      r: Math.random() * 1.8 + .4,
      vx: (Math.random() - .5) * .45,
      vy: -Math.random() * .55 - .15,
      alpha: Math.random() * .45 + .05,
      color: colors[Math.floor(Math.random() * colors.length)],
      burst: false,
      life: 1,
      decay: 0,
    };
  }

  const burst = [];

  function fireBurst(color) {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60 + Math.random() * .2;
      const speed = Math.random() * 5 + 1.5;
      burst.push({
        x: W / 2, y: H * .58,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        r: Math.random() * 3 + 1,
        color: Math.random() > .5 ? color : "#ffffff",
        alpha: 1,
        decay: Math.random() * .02 + .015,
        burst: true,
        life: 1,
        gravity: .08,
      });
    }
  }

  function loopCanvas() {
    ctx.clearRect(0, 0, W, H);

    // ambient
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });

    // burst
    for (let i = burst.length - 1; i >= 0; i--) {
      const b = burst[i];
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      b.x += b.vx; b.y += b.vy;
      b.vy += b.gravity || 0;
      b.alpha -= b.decay;
      if (b.alpha <= 0) burst.splice(i, 1);
    }

    requestAnimationFrame(loopCanvas);
  }
  loopCanvas();

  /* ─────────────────────────────────────────
     8.  HELPER FUNCTIONS
  ───────────────────────────────────────── */
  function el(tag, props = {}) {
    const e = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => (e[k] = v));
    return e;
  }

  function syncSlider(slider, fill, bubble, value, unit) {
    const min = +slider.min, max = +slider.max;
    const pct = ((value - min) / (max - min)) * 100;
    fill.style.width = pct + "%";
    bubble.style.left = pct + "%";
    bubble.textContent = value + " " + unit;
    slider.value = value;
  }

  function createRipple(e, btn) {
    const r = el("span", { className: "ripple" });
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
  }

  function animateNumber(el, from, to, duration, format, color) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.textContent = format(from + (to - from) * ease);
      el.style.fill = color;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function classify(bmi) {
    if (bmi < 18.5) return { label: "Underweight", color: "#ffd166", seg: segUnder };
    if (bmi < 25)   return { label: "Normal",      color: "#00f5c4", seg: segNormal };
    if (bmi < 30)   return { label: "Overweight",  color: "#ff6b6b", seg: segOver };
    return             { label: "Obese",        color: "#ff4444", seg: segObese };
  }

  function getTip(label) {
    const tips = {
      Underweight: "Your BMI is below the healthy range. Consider consulting a nutritionist to create a balanced meal plan and healthy weight-gain strategy.",
      Normal: "Great job! Your BMI falls within the healthy range. Keep maintaining your balanced diet and regular physical activity.",
      Overweight: "Your BMI is slightly above normal. A combination of moderate exercise and mindful eating habits can help bring it back to the healthy range.",
      Obese: "Your BMI indicates a higher health risk. It's advisable to consult a healthcare professional for a personalized plan involving diet and lifestyle changes.",
    };
    return tips[label] || "";
  }

  function ftInToCm(ft, inches) {
    return (ft * 12 + inches) * 2.54;
  }
  function cmToFtIn(cm) {
    const totalIn = cm / 2.54;
    return { ft: Math.floor(totalIn / 12), inches: Math.round(totalIn % 12) };
  }

  /* ─────────────────────────────────────────
     9.  DOM BUILDERS
  ───────────────────────────────────────── */
  function buildHeader() {
    const wrap = el("div", { className: "bmi-header" });

    const ring = el("div", { className: "logo-ring" });
    ring.innerHTML = `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="10" stroke="#00f5c4" stroke-width="1.8"/>
      <path d="M9 19 L14 9 L19 19" stroke="#00f5c4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="10.5" y1="16" x2="17.5" y2="16" stroke="#00f5c4" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;
    wrap.appendChild(ring);

    const h1 = el("h1");
    h1.textContent = "BMI Calculator";
    wrap.appendChild(h1);

    const sub = el("p");
    sub.textContent = "Body Mass Index · Precision Analytics";
    wrap.appendChild(sub);

    return wrap;
  }

  function buildUnitToggle() {
    const toggleWrap = el("div", { className: "unit-toggle" });
    const unitSlider = el("div", { className: "unit-slider" });
    const btnMetric = el("button");
    btnMetric.textContent = "Metric (cm / kg)";
    btnMetric.className = "active";
    const btnImp = el("button");
    btnImp.textContent = "Imperial (ft / lbs)";
    toggleWrap.appendChild(unitSlider);
    toggleWrap.appendChild(btnMetric);
    toggleWrap.appendChild(btnImp);
    return { toggleWrap, unitSlider, btnMetric, btnImp };
  }

  function buildSliderField(labelText, unit, min, max, defaultVal) {
    const field = el("div", { className: "bmi-field" });
    const lbl = el("label", { className: "bmi-field-label" });
    lbl.innerHTML = `${labelText} <em>${unit}</em>`;
    field.appendChild(lbl);

    const wrap = el("div", { className: "slider-wrap" });
    const fill = el("div", { className: "track-fill" });
    const bubble = el("div", { className: "slider-bubble" });
    const slider = el("input");
    slider.type = "range";
    slider.min = min; slider.max = max; slider.value = defaultVal;

    wrap.appendChild(fill);
    wrap.appendChild(slider);
    wrap.appendChild(bubble);
    field.appendChild(wrap);
    return { field, slider, fill, bubble };
  }

  function buildInputs() {
    const inputsWrap = el("div", { className: "bmi-inputs" });

    // metric height
    const { field: hField, slider: heightSlider, fill: heightFill, bubble: heightBubble } =
      buildSliderField("Height", "cm", 100, 220, 170);

    // imperial height row
    const imperialRow = el("div", { className: "imp-row" });
    imperialRow.style.display = "none";
    const { field: ftField, slider: heightFtSlider, fill: heightFtFill, bubble: heightFtBubble } =
      buildSliderField("Feet", "ft", 3, 7, 5);
    const { field: inField, slider: heightInSlider, fill: heightInFill, bubble: heightInBubble } =
      buildSliderField("Inches", "in", 0, 11, 7);
    imperialRow.appendChild(ftField);
    imperialRow.appendChild(inField);

    const metricRow = el("div");
    metricRow.style.display = "flex";
    metricRow.style.flexDirection = "column";
    metricRow.appendChild(hField);

    // weight
    const { field: wField, slider: weightSlider, fill: weightFill, bubble: weightBubble } =
      buildSliderField("Weight", "kg", 30, 200, 70);

    inputsWrap.appendChild(metricRow);
    inputsWrap.appendChild(imperialRow);
    inputsWrap.appendChild(wField);

    return {
      inputsWrap,
      heightSlider, heightFill, heightBubble,
      heightFtSlider, heightFtFill, heightFtBubble,
      heightInSlider, heightInFill, heightInBubble,
      weightSlider, weightFill, weightBubble,
      metricRow, imperialRow,
    };
  }

  function buildResultPanel() {
    const resultPanel = el("div", { className: "result-panel" });
    const inner = el("div", { className: "result-inner" });

    // ── arc SVG
    const arcWrap = el("div", { className: "arc-wrap" });
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "arc-svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "120");
    svg.setAttribute("viewBox", "0 0 200 120");

    const arcBg = document.createElementNS(ns, "path");
    arcBg.setAttribute("class", "arc-bg");
    arcBg.setAttribute("d", describeArc(100, 105, 80, -200, 20));

    const arcFg = document.createElementNS(ns, "path");
    arcFg.setAttribute("class", "arc-fg");
    arcFg.setAttribute("d", describeArc(100, 105, 80, -200, 20));
    arcFg.style.stroke = "#00f5c4";

    // tick marks
    for (let bv of [18.5, 25, 30]) {
      const angle = -200 + ((bv - 10) / 30) * 220;
      const rad = (angle * Math.PI) / 180;
      const x1 = 100 + 80 * Math.cos(rad);
      const y1 = 105 + 80 * Math.sin(rad);
      const x2 = 100 + 70 * Math.cos(rad);
      const y2 = 105 + 70 * Math.sin(rad);
      const tick = document.createElementNS(ns, "line");
      tick.setAttribute("x1", x1); tick.setAttribute("y1", y1);
      tick.setAttribute("x2", x2); tick.setAttribute("y2", y2);
      tick.setAttribute("stroke", "rgba(255,255,255,0.25)"); tick.setAttribute("stroke-width", "2");
      svg.appendChild(tick);
    }

    const bmiNumText = document.createElementNS(ns, "text");
    bmiNumText.setAttribute("class", "bmi-num");
    bmiNumText.setAttribute("x", "100");
    bmiNumText.setAttribute("y", "98");
    bmiNumText.setAttribute("text-anchor", "middle");
    bmiNumText.setAttribute("dominant-baseline", "middle");
    bmiNumText.style.fill = "#00f5c4";
    bmiNumText.textContent = "–";

    const bmiCatText = document.createElementNS(ns, "text");
    bmiCatText.setAttribute("class", "bmi-cat-text");
    bmiCatText.setAttribute("x", "100");
    bmiCatText.setAttribute("y", "115");
    bmiCatText.setAttribute("text-anchor", "middle");
    bmiCatText.style.fill = "#48526e";
    bmiCatText.textContent = "CALCULATE";

    svg.appendChild(arcBg);
    svg.appendChild(arcFg);
    svg.appendChild(bmiNumText);
    svg.appendChild(bmiCatText);
    arcWrap.appendChild(svg);
    inner.appendChild(arcWrap);

    // ── category bar
    const catBar = el("div", { className: "cat-bar" });
    const segUnder  = el("div", { className: "cat-seg seg-under" });  segUnder.textContent  = "Under";
    const segNormal = el("div", { className: "cat-seg seg-normal" }); segNormal.textContent = "Normal";
    const segOver   = el("div", { className: "cat-seg seg-over" });   segOver.textContent   = "Over";
    const segObese  = el("div", { className: "cat-seg seg-obese" });  segObese.textContent  = "Obese";
    [segUnder, segNormal, segOver, segObese].forEach((s) => catBar.appendChild(s));
    inner.appendChild(catBar);

    // ── stats row
    const statsRow = el("div", { className: "stats-row" });

    const box1 = el("div", { className: "stat-box" });
    const statBmiVal = el("div", { className: "stat-val" }); statBmiVal.textContent = "–";
    const statBmiLbl = el("div", { className: "stat-lbl" }); statBmiLbl.textContent = "BMI Score";
    box1.appendChild(statBmiVal); box1.appendChild(statBmiLbl);

    const box2 = el("div", { className: "stat-box" });
    const statWeightRangeVal = el("div", { className: "stat-val" }); statWeightRangeVal.textContent = "–";
    const statWeightRangeLbl = el("div", { className: "stat-lbl" }); statWeightRangeLbl.textContent = "Healthy Range";
    statWeightRangeVal.style.fontSize = ".85rem";
    box2.appendChild(statWeightRangeVal); box2.appendChild(statWeightRangeLbl);

    const box3 = el("div", { className: "stat-box" });
    const statCatVal = el("div", { className: "stat-val" }); statCatVal.textContent = "–";
    statCatVal.style.fontSize = ".9rem";
    const statCatLbl = el("div", { className: "stat-lbl" }); statCatLbl.textContent = "Category";
    box3.appendChild(statCatVal); box3.appendChild(statCatLbl);

    statsRow.appendChild(box1); statsRow.appendChild(box2); statsRow.appendChild(box3);
    inner.appendChild(statsRow);

    // ── tip
    const tipEl = el("div", { className: "result-tip" });
    inner.appendChild(tipEl);

    resultPanel.appendChild(inner);

    return {
      resultPanel, arcFg, bmiNumText, bmiCatText,
      segUnder, segNormal, segOver, segObese,
      statBmiVal, statWeightRangeVal, statCatVal,
      tipEl,
    };
  }

  /* ─────────────────────────────────────────
     10. ARC PATH HELPER
  ───────────────────────────────────────── */
  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const s = polarToCartesian(cx, cy, r, endAngle);
    const e = polarToCartesian(cx, cy, r, startAngle);
    const large = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
  }
})();
