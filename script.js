/* =========================================================
   RaceOS — script.js
   Reusable window manager + taskbar + dynamic content.
   Adding a new app only requires:
     1. A taskbar icon block in HTML with class "taskbar-icon" + data-window
     2. A window block in HTML with class "window" + matching id
     3. A call to initializeWindow("appName") below
   ========================================================= */

/* ---------------------------------------------------------
   GLOBAL STATE
--------------------------------------------------------- */

let biggestIndex = 100;      // tracks the highest z-index in use
let activeWindowId = null;   // id of the currently focused window
let clockFormat = '24';      // '12' or '24' — chosen on the ignition screen

const topBar = document.getElementById('topbar');
const TOPBAR_H = 44;
const TASKBAR_H = 68;

const windowMeta = {}; // per-window: { maximized, prevRect }

/* ---------------------------------------------------------
   CLOCK — respects the format chosen on the ignition screen
--------------------------------------------------------- */

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const clockEl = document.getElementById('clock');

  if (clockFormat === '12') {
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    clockEl.textContent = `${h}:${m}:${s} ${suffix}`;
  } else {
    clockEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s}`;
  }
}
updateClock();
setInterval(updateClock, 1000);

/* ---------------------------------------------------------
   RACE COUNTDOWN — next session is FP1 at Silverstone
--------------------------------------------------------- */

// British GP 2026, Free Practice 1 — Friday July 3, 2026, 12:30 BST (UTC+1).
const nextSessionDate = new Date('2026-07-03T12:30:00+01:00');

function updateCountdown() {
  const now = new Date();
  let diff = nextSessionDate - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------------------------------------------------------
   IGNITION — Start OS -> clock format prompt
--------------------------------------------------------- */

function initializeIgnition() {
  const igniteBtn = document.getElementById('ignition-btn');
  const stageStart = document.getElementById('stage-start');
  const stageFormat = document.getElementById('stage-format');

  igniteBtn.addEventListener('click', () => {
    igniteBtn.classList.add('firing');
    setTimeout(() => {
      stageStart.hidden = true;
      stageFormat.hidden = false;
    }, 350);
  });

  document.querySelectorAll('.format-btn').forEach((btn) => {
    btn.addEventListener('click', () => finishIgnition(btn.dataset.format));
  });
}

function finishIgnition(format) {
  clockFormat = format;
  updateClock();

  const ignitionScreen = document.getElementById('ignition-screen');
  ignitionScreen.classList.add('hidden');
  setTimeout(() => { ignitionScreen.style.display = 'none'; }, 650);

  // Open the guide window as the first thing the driver sees.
  openWindow(document.getElementById('welcome'));
}

/* ---------------------------------------------------------
   WINDOW MANAGER
--------------------------------------------------------- */

function bringToFront(win) {
  biggestIndex += 1;
  win.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  activeWindowId = win.id;
  updateTaskbar();
}

function openWindow(win) {
  win.style.display = 'flex';
  win.dataset.state = 'open';
  bringToFront(win);
}

function minimizeWindow(win) {
  win.style.display = 'none';
  win.dataset.state = 'minimized';
  if (activeWindowId === win.id) activeWindowId = null;
  updateTaskbar();
}

function closeWindowFull(win) {
  win.style.display = 'none';
  win.dataset.state = 'closed';
  if (activeWindowId === win.id) activeWindowId = null;
  updateTaskbar();
}

function toggleMaximizeWindow(win) {
  const meta = windowMeta[win.id] || (windowMeta[win.id] = { maximized: false, prevRect: null });

  if (!meta.maximized) {
    meta.prevRect = {
      top: win.style.top, left: win.style.left,
      width: win.style.width, height: win.style.height
    };
    win.style.top = TOPBAR_H + 'px';
    win.style.left = '0px';
    win.style.width = '100%';
    win.style.height = `calc(100% - ${TOPBAR_H}px - ${TASKBAR_H}px)`;
    meta.maximized = true;
  } else {
    if (meta.prevRect) {
      win.style.top = meta.prevRect.top;
      win.style.left = meta.prevRect.left;
      win.style.width = meta.prevRect.width;
      win.style.height = meta.prevRect.height;
    }
    meta.maximized = false;
  }

  win.dataset.state = 'open';
  win.style.display = 'flex';
  bringToFront(win);
}

/* ---- Window tap handling -------------------------------- */

function handleWindowTap(win) {
  bringToFront(win);
}

function addWindowTapHandling(win) {
  win.addEventListener('mousedown', () => handleWindowTap(win));
}

/* ---- Dragging --------------------------------------------
   Dragging is initiated only from the window header.
--------------------------------------------------------- */

function dragElement(win, header) {
  let offsetX = 0, offsetY = 0;

  header.addEventListener('mousedown', dragMouseDown);

  function dragMouseDown(e) {
    if (e.target.closest('.winctrl')) return; // don't drag when clicking a control button
    e.preventDefault();
    handleWindowTap(win);

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    document.addEventListener('mousemove', dragMouseMove);
    document.addEventListener('mouseup', dragMouseUp);
  }

  function dragMouseMove(e) {
    e.preventDefault();

    // Dragging exits the maximized state so the window becomes freely movable again.
    const meta = windowMeta[win.id];
    if (meta && meta.maximized) {
      meta.maximized = false;
      win.style.width = meta.prevRect ? meta.prevRect.width : win.style.width;
      win.style.height = meta.prevRect ? meta.prevRect.height : win.style.height;
    }

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    const maxTop = window.innerHeight - TASKBAR_H - 40;
    if (newTop < TOPBAR_H) newTop = TOPBAR_H;
    if (newTop > maxTop) newTop = maxTop;

    win.style.left = newLeft + 'px';
    win.style.top = newTop + 'px';
  }

  function dragMouseUp() {
    document.removeEventListener('mousemove', dragMouseMove);
    document.removeEventListener('mouseup', dragMouseUp);
  }
}

/* ---- Window controls: minimize / maximize / close ---------- */

function enableWindowControls(win) {
  const minBtn = win.querySelector('.btn-minimize');
  const maxBtn = win.querySelector('.btn-maximize');
  const closeBtn = win.querySelector('.btn-close');

  [minBtn, maxBtn, closeBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('mousedown', (e) => e.stopPropagation());
  });

  if (minBtn) minBtn.addEventListener('click', () => minimizeWindow(win));
  if (maxBtn) maxBtn.addEventListener('click', () => toggleMaximizeWindow(win));
  if (closeBtn) closeBtn.addEventListener('click', () => closeWindowFull(win));
}

/* ---- Reusable window initialization ----------------------- */

function initializeWindow(windowName) {
  const win = document.getElementById(windowName);
  const header = document.getElementById(windowName + 'header');
  if (!win || !header) {
    console.warn(`RaceOS: could not initialize window "${windowName}" — missing element(s).`);
    return;
  }

  win.dataset.state = 'closed';
  windowMeta[win.id] = { maximized: false, prevRect: null };

  dragElement(win, header);
  addWindowTapHandling(win);
  enableWindowControls(win);
}

/* ---------------------------------------------------------
   TASKBAR
--------------------------------------------------------- */

function updateTaskbar() {
  document.querySelectorAll('.taskbar-icon').forEach((icon) => {
    const win = document.getElementById(icon.dataset.window);
    if (!win) return;
    const isOpen = win.dataset.state === 'open' || win.dataset.state === 'minimized';
    const isActive = activeWindowId === win.id && win.dataset.state === 'open';
    icon.classList.toggle('open', isOpen);
    icon.classList.toggle('active', isActive);
  });
}

function initializeTaskbarIcon(name) {
  const icon = document.getElementById('icon-' + name);
  if (!icon) {
    console.warn(`RaceOS: could not initialize taskbar icon "${name}" — missing element.`);
    return;
  }

  const win = document.getElementById(icon.dataset.window);
  if (!win) return;

  icon.addEventListener('click', () => {
    const state = win.dataset.state;
    if (state !== 'open') {
      openWindow(win);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win);
    } else {
      bringToFront(win);
    }
    updateTaskbar();
  });
}

/* ---------------------------------------------------------
   APPLICATION: WELCOME / APP GUIDE
   Explains each application in the OS.
--------------------------------------------------------- */

const appGuide = [
  {
    id: 'garage',
    name: 'Garage',
    eyebrow: 'APP 01 — COLLECTION MANAGEMENT',
    tagline: 'Build, browse, and manage your car collection.',
    body: `The Garage is where your collection lives. It starts with a single car, and grows
      however you like — hand-build a custom entry with your own specs and notes, or browse a
      preset collection of ten GT3 and GTE machines and add them with one click. Every car gets
      its own spec card with power, weight, and top speed, plus room for your own notes on setup
      and character.`,
    windowId: 'garage'
  },
  {
    id: 'lightsout',
    name: 'Lights Out',
    eyebrow: 'APP 02 — REACTION TRAINER',
    tagline: 'Test your reflexes against a real F1 start sequence.',
    body: `Five lights illuminate one by one, just like the start gantry at a real Grand Prix.
      Jump the start and you'll be flagged before the lights even go out. Wait for all five to go
      dark, then react as fast as you can — your time is measured in milliseconds and graded from
      "Back to Karting" to "F1 Reflexes." Your personal best is saved between sessions.`,
    windowId: 'lightsout'
  }
];

function buildGuideSidebar() {
  const sidebar = document.getElementById('guide-sidebar');
  sidebar.innerHTML = '';

  appGuide.forEach((app, index) => {
    const entry = document.createElement('div');
    entry.className = 'garage-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
      <span class="entry-number">APP ${String(index + 1).padStart(2, '0')}</span>
      <div class="entry-name">${app.name}</div>
      <div class="entry-class">${app.tagline}</div>
    `;
    entry.addEventListener('click', () => setGuideContent(index));
    sidebar.appendChild(entry);
  });
}

function setGuideContent(index) {
  const app = appGuide[index];
  const display = document.getElementById('guide-display');

  display.innerHTML = `
    <div class="display-eyebrow">${app.eyebrow}</div>
    <h2 class="display-title">${app.name}</h2>
    <div class="display-meta">${app.tagline}</div>
    <p class="display-body">${app.body}</p>
    <button class="btn-launch" id="guide-launch-btn">LAUNCH ${app.name.toUpperCase()} →</button>
  `;

  document.getElementById('guide-launch-btn').addEventListener('click', () => {
    openWindow(document.getElementById(app.windowId));
  });

  document.querySelectorAll('#guide-sidebar .garage-entry').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.index) === index);
  });
}

function initializeGuideApp() {
  buildGuideSidebar();
  setGuideContent(0);
}

/* ---------------------------------------------------------
   APPLICATION: GARAGE — dynamic content architecture
   The garage starts with exactly one car. More can be added
   via the "+ ADD CAR" button (Custom Build or Browse Collection).
--------------------------------------------------------- */

const garageCars = [
  {
    title: "Ferrari 488 GT3 Evo",
    date: "Acquired 2023",
    class: "GT3 — Endurance",
    specs: { power: "560 HP", weight: "1300 KG", topSpeed: "187 MPH" },
    content: `The cornerstone of the collection. A naturally-aspirated-feeling twin-turbo V8 wrapped
      in a chassis that forgives mistakes at the limit. Run in full Le Mans livery with a fresh
      brake-by-wire setup installed ahead of the next endurance stint.`
  }
];

const browseCollectionCars = [
  {
    title: "Porsche 911 RSR",
    date: "Available now",
    class: "GTE — Endurance",
    specs: { power: "510 HP", weight: "1245 KG", topSpeed: "180 MPH" },
    content: `Mid-engined despite the badge on the back. Famous for braking later than physics
      seems to allow. A proven endurance weapon with a chassis that stays honest as the fuel load drops.`
  },
  {
    title: "McLaren 720S GT3",
    date: "Available now",
    class: "GT3 — Sprint",
    specs: { power: "570 HP", weight: "1290 KG", topSpeed: "183 MPH" },
    content: `The sharpest steering in the class. Built for short, aggressive sprint races where
      one good lap matters more than ten consistent ones.`
  },
  {
    title: "Audi R8 LMS",
    date: "Available now",
    class: "GT3 — All-rounder",
    specs: { power: "565 HP", weight: "1310 KG", topSpeed: "186 MPH" },
    content: `Predictable, planted, and easy to trust in changing conditions — the default choice
      for a wet practice session or a driver still learning a new circuit.`
  },
  {
    title: "BMW M4 GT3",
    date: "Available now",
    class: "GT3 — All-rounder",
    specs: { power: "590 HP", weight: "1300 KG", topSpeed: "184 MPH" },
    content: `A front-engined GT3 that punches above its layout. Strong traction out of slow corners
      makes it a favorite on tight, technical club circuits.`
  },
  {
    title: "Mercedes-AMG GT3",
    date: "Available now",
    class: "GT3 — Endurance",
    specs: { power: "550 HP", weight: "1285 KG", topSpeed: "182 MPH" },
    content: `A big, torquey V8 wrapped around a chassis built for 24-hour races. Comfortable rather
      than thrilling — exactly what you want at 4am in the rain.`
  },
  {
    title: "Aston Martin Vantage GT3",
    date: "Available now",
    class: "GT3 — Sprint",
    specs: { power: "580 HP", weight: "1280 KG", topSpeed: "185 MPH" },
    content: `British bulldog styling with a bite to match. Aggressive on turn-in, and rewards a driver
      willing to trail-brake deep into the apex.`
  },
  {
    title: "Lamborghini Huracán GT3 Evo2",
    date: "Available now",
    class: "GT3 — Sprint",
    specs: { power: "620 HP", weight: "1245 KG", topSpeed: "190 MPH" },
    content: `The highest-revving V10 left in GT3. Loud, dramatic, and genuinely fast in the right hands —
      less forgiving than most of the paddock.`
  },
  {
    title: "Chevrolet Corvette Z06 GT3.R",
    date: "Available now",
    class: "GT3 — Endurance",
    specs: { power: "545 HP", weight: "1300 KG", topSpeed: "181 MPH" },
    content: `A naturally-aspirated flat-plane V8 with a soundtrack unlike anything else in the field.
      Built tough for the long stints of an endurance campaign.`
  },
  {
    title: "Ford Mustang GT3",
    date: "Available now",
    class: "GT3 — Sprint",
    specs: { power: "560 HP", weight: "1295 KG", topSpeed: "183 MPH" },
    content: `The newest name on this list, and already a giant-killer at Le Mans. Aggressive aero
      package built specifically for high-speed stability.`
  },
  {
    title: "Lexus RC F GT3",
    date: "Available now",
    class: "GT3 — All-rounder",
    specs: { power: "540 HP", weight: "1300 KG", topSpeed: "180 MPH" },
    content: `Quietly reliable and rarely the fastest car on paper, but a chassis that never seems to
      put a wheel wrong when it matters most.`
  }
];

function buildGarageSidebar() {
  const sidebar = document.getElementById('garage-sidebar');
  sidebar.innerHTML = '';

  garageCars.forEach((car, index) => {
    const entry = document.createElement('div');
    entry.className = 'garage-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
      <span class="entry-number">CAR ${String(index + 1).padStart(2, '0')}</span>
      <div class="entry-name">${car.title}</div>
      <div class="entry-class">${car.class}</div>
    `;
    entry.addEventListener('click', () => setContent(index));
    sidebar.appendChild(entry);
  });

  document.getElementById('garage-count').textContent = garageCars.length;
}

function setContent(index) {
  const car = garageCars[index];
  const display = document.getElementById('garage-display');
  if (!car) return;

  display.innerHTML = `
    <div class="display-eyebrow">GARAGE.APP // CAR ${String(index + 1).padStart(2, '0')} OF ${String(garageCars.length).padStart(2, '0')}</div>
    <h2 class="display-title">${car.title}</h2>
    <div class="display-meta">${car.date} · ${car.class}</div>
    <div class="display-specs">
      <div class="spec-box">
        <span class="spec-label">POWER</span>
        <span class="spec-value">${car.specs.power}</span>
      </div>
      <div class="spec-box">
        <span class="spec-label">WEIGHT</span>
        <span class="spec-value">${car.specs.weight}</span>
      </div>
      <div class="spec-box">
        <span class="spec-label">TOP SPEED</span>
        <span class="spec-value">${car.specs.topSpeed}</span>
      </div>
    </div>
    <p class="display-body">${car.content}</p>
  `;

  document.querySelectorAll('#garage-sidebar .garage-entry').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.index) === index);
  });
}

function initializeGarageApp() {
  buildGarageSidebar();
  setContent(0);
}

/* ---------------------------------------------------------
   APPLICATION: ADD CAR — Custom Build & Browse Collection
--------------------------------------------------------- */

function initializeAddCarApp() {
  const addCarBtn = document.getElementById('btn-add-car');
  const addCarWindow = document.getElementById('addcar');

  addCarBtn.addEventListener('click', () => {
    renderBrowseGrid();
    openWindow(addCarWindow);
  });

  document.querySelectorAll('.addcar-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.addcar-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.addcar-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('submit-custom-car').addEventListener('click', () => {
    const name = document.getElementById('input-name').value.trim();
    const carClass = document.getElementById('input-class').value;
    const power = document.getElementById('input-power').value.trim();
    const weight = document.getElementById('input-weight').value.trim();
    const topSpeed = document.getElementById('input-topspeed').value.trim();
    const notes = document.getElementById('input-notes').value.trim();

    if (!name) {
      document.getElementById('input-name').focus();
      return;
    }

    const newCar = {
      title: name,
      date: 'Custom build',
      class: carClass,
      specs: {
        power: power ? `${power} HP` : '— HP',
        weight: weight ? `${weight} KG` : '— KG',
        topSpeed: topSpeed ? `${topSpeed} MPH` : '— MPH'
      },
      content: notes || 'No setup notes recorded yet for this build.'
    };

    garageCars.push(newCar);
    buildGarageSidebar();
    setContent(garageCars.length - 1);

    document.getElementById('input-name').value = '';
    document.getElementById('input-power').value = '';
    document.getElementById('input-weight').value = '';
    document.getElementById('input-topspeed').value = '';
    document.getElementById('input-notes').value = '';

    closeWindowFull(addCarWindow);
    openWindow(document.getElementById('garage'));
  });
}

function renderBrowseGrid() {
  const grid = document.getElementById('browse-grid');
  grid.innerHTML = '';

  if (browseCollectionCars.length === 0) {
    grid.innerHTML = '<div class="browse-empty">Every car in the collection is already in your garage.</div>';
    return;
  }

  browseCollectionCars.forEach((car, index) => {
    const card = document.createElement('div');
    card.className = 'browse-card';
    card.innerHTML = `
      <span class="browse-card-class">${car.class}</span>
      <span class="browse-card-name">${car.title}</span>
      <span class="browse-card-specs">${car.specs.power} · ${car.specs.weight} · ${car.specs.topSpeed}</span>
      <button class="browse-card-add">+ ADD TO GARAGE</button>
    `;
    card.querySelector('.browse-card-add').addEventListener('click', () => {
      const [added] = browseCollectionCars.splice(index, 1);
      garageCars.push(added);
      buildGarageSidebar();
      setContent(garageCars.length - 1);
      renderBrowseGrid();
    });
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   APPLICATION: LIGHTS OUT — F1-style reaction time trainer
   Five lights illuminate one at a time. A random hold follows
   the fifth light, then all five extinguish together — that's
   the "go" signal. Click before they go out and it's a false
   start; click after, and your reaction time is measured.
--------------------------------------------------------- */

let loState = 'idle';       // idle | armed | waiting | go | result | falseStart
let loTimers = [];
let loGoTimestamp = 0;
let loBest = null;
let loHistory = [];

const LO_BEST_KEY = 'raceos-lightsout-best';

function loClearTimers() {
  loTimers.forEach((id) => clearTimeout(id));
  loTimers = [];
}

function loSetStatus(text) {
  document.getElementById('lo-status').textContent = text;
}

function loClearLights() {
  document.querySelectorAll('.lo-light').forEach((l) => l.classList.remove('lit'));
}

function loStartSequence() {
  loClearTimers();
  loClearLights();
  loState = 'armed';

  loSetStatus('GET READY...');
  document.getElementById('lo-result-value').textContent = '--';
  document.getElementById('lo-grade').textContent = '';
  document.getElementById('lo-grade').className = 'lo-grade';

  const startBtn = document.getElementById('lo-start-btn');
  startBtn.disabled = true;
  startBtn.textContent = 'SEQUENCE RUNNING...';

  const lights = document.querySelectorAll('.lo-light');

  for (let i = 0; i < 5; i++) {
    const t = setTimeout(() => {
      lights[i].classList.add('lit');

      if (i === 4) {
        loState = 'waiting';
        loSetStatus('HOLD...');

        const holdDelay = 1000 + Math.random() * 2000; // 1s–3s, unpredictable like a real start
        const t2 = setTimeout(() => {
          loClearLights();
          loState = 'go';
          loGoTimestamp = performance.now();
          loSetStatus('LIGHTS OUT — GO!');
          document.getElementById('lo-rig').classList.add('go-flash');
          setTimeout(() => document.getElementById('lo-rig').classList.remove('go-flash'), 500);
        }, holdDelay);
        loTimers.push(t2);
      }
    }, i * 1000);
    loTimers.push(t);
  }
}

function loGradeFor(ms) {
  if (ms < 180) return { label: 'F1 REFLEXES', cls: 'grade-elite' };
  if (ms < 230) return { label: 'PRO PACE', cls: 'grade-pro' };
  if (ms < 300) return { label: 'RACE READY', cls: 'grade-good' };
  if (ms < 450) return { label: 'ROOKIE', cls: 'grade-avg' };
  return { label: 'BACK TO KARTING', cls: 'grade-slow' };
}

function loShowResult(ms) {
  const rounded = Math.round(ms);
  document.getElementById('lo-result-value').textContent = rounded;

  const g = loGradeFor(rounded);
  const gradeEl = document.getElementById('lo-grade');
  gradeEl.textContent = g.label;
  gradeEl.className = 'lo-grade ' + g.cls;

  loSetStatus('REACTION RECORDED');

  loHistory.unshift({ ms: rounded, grade: g.label });
  loHistory = loHistory.slice(0, 8);
  loRenderHistory();

  if (loBest === null || rounded < loBest) {
    loBest = rounded;
    try { localStorage.setItem(LO_BEST_KEY, String(loBest)); } catch (e) { /* storage unavailable */ }
  }
  document.getElementById('lo-best').textContent = loBest + ' ms';
}

function loRenderHistory() {
  const el = document.getElementById('lo-history');
  el.innerHTML = '';

  if (loHistory.length === 0) {
    el.innerHTML = '<div class="lo-history-empty">No attempts yet.</div>';
    return;
  }

  loHistory.forEach((h) => {
    const row = document.createElement('div');
    row.className = 'lo-history-row';
    row.innerHTML = `<span>${h.ms} ms</span><span class="lo-history-grade">${h.grade}</span>`;
    el.appendChild(row);
  });
}

function loHandleRigClick() {
  const startBtn = document.getElementById('lo-start-btn');

  if (loState === 'armed' || loState === 'waiting') {
    // Clicked before the lights went out — false start.
    loClearTimers();
    loClearLights();
    loState = 'falseStart';
    loSetStatus('FALSE START — JUMP DETECTED');
    document.getElementById('lo-result-value').textContent = 'DQ';
    const gradeEl = document.getElementById('lo-grade');
    gradeEl.textContent = 'Wait for lights out next time.';
    gradeEl.className = 'lo-grade grade-slow';
    startBtn.disabled = false;
    startBtn.textContent = 'TRY AGAIN';
  } else if (loState === 'go') {
    const reaction = performance.now() - loGoTimestamp;
    loState = 'result';
    loShowResult(reaction);
    startBtn.disabled = false;
    startBtn.textContent = 'RUN AGAIN';
  } else if (loState === 'idle' || loState === 'result' || loState === 'falseStart') {
    loSetStatus('PRESS START SEQUENCE FIRST');
  }
}

function initializeLightsOutApp() {
  document.getElementById('lo-start-btn').addEventListener('click', loStartSequence);
  document.getElementById('lo-rig').addEventListener('click', loHandleRigClick);

  try {
    const saved = localStorage.getItem(LO_BEST_KEY);
    if (saved) {
      loBest = Number(saved);
      document.getElementById('lo-best').textContent = loBest + ' ms';
    }
  } catch (e) { /* storage unavailable */ }

  loRenderHistory();
}

/* ---------------------------------------------------------
   BOOT
--------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initializeIgnition();

  // Windows
  initializeWindow('welcome');
  initializeWindow('garage');
  initializeWindow('addcar');
  initializeWindow('lightsout');

  // Taskbar icons
  initializeTaskbarIcon('welcome');
  initializeTaskbarIcon('garage');
  initializeTaskbarIcon('lightsout');

  // App-specific dynamic content
  initializeGuideApp();
  initializeGarageApp();
  initializeAddCarApp();
  initializeLightsOutApp();

  topBar.style.zIndex = biggestIndex + 1;
  updateTaskbar();
});