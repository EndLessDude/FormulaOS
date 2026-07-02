/* =========================================================
   RaceOS — script.js
   Reusable window manager + icon system + dynamic content.
   Adding a new app only requires:
     1. An icon block in HTML with class "desktop-icon" + data-window
     2. A window block in HTML with class "window" + matching id
     3. A call to initializeWindow("appName") below
   ========================================================= */

/* ---------------------------------------------------------
   GLOBAL STATE
--------------------------------------------------------- */

let biggestIndex = 100;     // tracks the highest z-index in use
let selectedIcon = null;    // currently selected desktop icon (DOM element)
let clockFormat = '24';     // '12' or '24' — chosen on the ignition screen

const topBar = document.getElementById('topbar');

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
   IGNITION SEQUENCE
--------------------------------------------------------- */

const bootLines = [
  'IGNITION SEQUENCE INITIATED',
  'FUEL PUMP PRIMED',
  'ECU HANDSHAKE COMPLETE',
  'TELEMETRY LINK ESTABLISHED',
  'PIT WALL SYSTEMS ONLINE',
  'RACEOS READY'
];

function runBootSequence() {
  const stageStart = document.getElementById('stage-start');
  const stageBoot = document.getElementById('stage-boot');
  const stageFormat = document.getElementById('stage-format');
  const log = document.getElementById('boot-log');
  const progressFill = document.getElementById('boot-progress-fill');
  const tachoFill = document.getElementById('tacho-fill');
  const tachoNeedle = document.getElementById('tacho-needle');

  stageStart.hidden = true;
  stageBoot.hidden = false;

  const totalSteps = bootLines.length;
  const circumference = 276; // matches the tacho arc's stroke-dasharray

  bootLines.forEach((line, i) => {
    setTimeout(() => {
      const lineEl = document.createElement('div');
      lineEl.className = 'boot-log-line ok';
      lineEl.textContent = `> ${line}`;
      log.appendChild(lineEl);

      const progress = ((i + 1) / totalSteps) * 100;
      progressFill.style.width = progress + '%';
      tachoFill.style.strokeDashoffset = circumference - (circumference * progress) / 100;

      // Needle sweeps from -80deg (idle) toward +80deg (redline) as the log fills.
      const angle = -80 + (progress / 100) * 160;
      tachoNeedle.style.transform = `rotate(${angle}deg)`;
    }, i * 380);
  });

  setTimeout(() => {
    stageBoot.hidden = true;
    stageFormat.hidden = false;
  }, totalSteps * 380 + 500);
}

function finishIgnition(format) {
  clockFormat = format;
  updateClock();

  const ignitionScreen = document.getElementById('ignition-screen');
  ignitionScreen.classList.add('hidden');
  setTimeout(() => {
    ignitionScreen.style.display = 'none';
  }, 650);

  // Open the welcome window as the first thing the driver sees.
  openWindow(document.getElementById('welcome'));
}

function initializeIgnition() {
  document.getElementById('ignition-btn').addEventListener('click', runBootSequence);

  document.querySelectorAll('.format-btn').forEach((btn) => {
    btn.addEventListener('click', () => finishIgnition(btn.dataset.format));
  });
}

/* ---------------------------------------------------------
   WINDOW MANAGER
--------------------------------------------------------- */

// Bring a window above every other window, and keep the top bar above all.
function bringToFront(win) {
  biggestIndex += 1;
  win.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

// Open: display the window and bring it to front.
function openWindow(element) {
  element.style.display = 'flex';
  bringToFront(element);
}

// Close: hide the window.
function closeWindow(element) {
  element.style.display = 'none';
}

/* ---- Window tap handling -------------------------------- */

// Bring the clicked window to front and clear any selected icon.
function handleWindowTap(win) {
  bringToFront(win);
  if (selectedIcon) {
    selectedIcon.classList.remove('selected');
    selectedIcon = null;
  }
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
    e.preventDefault();
    handleWindowTap(win);

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    document.addEventListener('mousemove', dragMouseMove);
    document.addEventListener('mouseup', dragMouseUp);
  }

  function dragMouseMove(e) {
    e.preventDefault();
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Keep the window from being dragged behind the top bar.
    const topBarHeight = topBar.offsetHeight;
    if (newTop < topBarHeight) newTop = topBarHeight;

    win.style.left = newLeft + 'px';
    win.style.top = newTop + 'px';
  }

  function dragMouseUp() {
    document.removeEventListener('mousemove', dragMouseMove);
    document.removeEventListener('mouseup', dragMouseUp);
  }
}

/* ---- Close button ------------------------------------------ */

function enableCloseButton(win) {
  const closeBtn = win.querySelector('.closebutton');
  if (!closeBtn) return;
  closeBtn.addEventListener('mousedown', (e) => {
    // Prevent the drag/tap handlers on the header from firing.
    e.stopPropagation();
  });
  closeBtn.addEventListener('click', () => closeWindow(win));
}

/* ---- Reusable window initialization ----------------------- */

function initializeWindow(windowName) {
  const win = document.getElementById(windowName);
  const header = document.getElementById(windowName + 'header');
  if (!win || !header) {
    console.warn(`RaceOS: could not initialize window "${windowName}" — missing element(s).`);
    return;
  }

  dragElement(win, header);
  addWindowTapHandling(win);
  enableCloseButton(win);
}

/* ---------------------------------------------------------
   ICON SYSTEM
--------------------------------------------------------- */

function initializeIcon(name) {
  const icon = document.getElementById('icon-' + name);
  if (!icon) {
    console.warn(`RaceOS: could not initialize icon "${name}" — missing element.`);
    return;
  }

  const windowId = icon.dataset.window;
  const win = document.getElementById(windowId);

  icon.addEventListener('click', () => {
    if (icon.classList.contains('selected')) {
      // Already selected -> deselect and open its window.
      icon.classList.remove('selected');
      selectedIcon = null;
      if (win) openWindow(win);
    } else {
      // Not selected -> select it (deselect any other icon first).
      if (selectedIcon) selectedIcon.classList.remove('selected');
      icon.classList.add('selected');
      selectedIcon = icon;
    }
  });
}

/* ---------------------------------------------------------
   APPLICATION: GARAGE — dynamic content architecture
   The garage starts with exactly one car. More can be added
   via the "+ ADD CAR" button (Custom Build or Browse Collection).
--------------------------------------------------------- */

// The garage's own live collection — mutable, starts with one car.
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

// Cars available to browse and add — none of these start in the garage.
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

// Retrieve a content object, render it, and mark it active in the sidebar.
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
  setContent(0); // show the sole default car
}

/* ---------------------------------------------------------
   APPLICATION: ADD CAR — Custom Build & Browse Collection
   Original feature: lets the driver grow the garage either by
   hand-building a car or importing one from a preset collection.
--------------------------------------------------------- */

function initializeAddCarApp() {
  const addCarBtn = document.getElementById('btn-add-car');
  const addCarWindow = document.getElementById('addcar');

  addCarBtn.addEventListener('click', () => {
    renderBrowseGrid();
    openWindow(addCarWindow);
  });

  // Tab switching
  document.querySelectorAll('.addcar-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.addcar-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.addcar-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Custom build submission
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

    // Reset the form for next time.
    document.getElementById('input-name').value = '';
    document.getElementById('input-power').value = '';
    document.getElementById('input-weight').value = '';
    document.getElementById('input-topspeed').value = '';
    document.getElementById('input-notes').value = '';

    closeWindow(addCarWindow);
    bringToFront(document.getElementById('garage'));
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
   APPLICATION: DEVLOG — build history of the project itself
--------------------------------------------------------- */

const devlogEntries = [
  {
    title: "Pit Wall Boots Up",
    date: "Build 0.1",
    class: "Foundation",
    specs: { power: "Window Mgr", weight: "Drag + Focus", topSpeed: "Icon System" },
    content: `First working build. Established the reusable window manager: draggable headers,
      click-to-front z-index stacking, and open/close handling shared by every app. Desktop icons
      got their select-then-open behavior, with only one icon selectable at a time. Welcome and
      Garage shipped as the first two applications, both built on the same reusable classes so
      future apps wouldn't need custom scaffolding.`
  },
  {
    title: "Garage Goes Live",
    date: "Build 0.2",
    class: "Content architecture",
    specs: { power: "Dynamic Data", weight: "Sidebar Gen", topSpeed: "Spec Cards" },
    content: `Replaced hardcoded HTML entries with a proper content array and a setContent(index)
      renderer, so the Garage sidebar and detail view are both generated from data. Added the spec
      card layout (power / weight / top speed) as the visual language for anything car-related,
      which every later feature reused instead of inventing something new.`
  },
  {
    title: "Ignition & Telemetry",
    date: "Build 0.3",
    class: "Original features",
    specs: { power: "Boot Sequence", weight: "Live Countdown", topSpeed: "Add Car" },
    content: `The biggest update yet. Added an ignition screen with an engine-start boot animation
      gating entry to the OS, plus a 12-hour/24-hour clock format prompt that the top bar clock now
      respects. Replaced the wallpaper with a stylized Silverstone circuit layout and a live
      countdown to the next real session, Free Practice 1. Expanded the Garage with an Add Car
      window offering Custom Build and Browse Collection paths, and dropped the default garage back
      down to a single car so growing the collection actually means something. This Devlog app is
      also new, and now tracks its own build history.`
  }
];

function buildDevlogSidebar() {
  const sidebar = document.getElementById('devlog-sidebar');
  sidebar.innerHTML = '';

  devlogEntries.forEach((entry, index) => {
    const el = document.createElement('div');
    el.className = 'garage-entry';
    el.dataset.index = index;
    el.innerHTML = `
      <span class="entry-number">${entry.date.toUpperCase()}</span>
      <div class="entry-name">${entry.title}</div>
      <div class="entry-class">${entry.class}</div>
    `;
    el.addEventListener('click', () => setDevlogContent(index));
    sidebar.appendChild(el);
  });
}

function setDevlogContent(index) {
  const entry = devlogEntries[index];
  const display = document.getElementById('devlog-display');

  display.innerHTML = `
    <div class="display-eyebrow">DEVLOG.LOG // ENTRY ${String(index + 1).padStart(2, '0')} OF ${String(devlogEntries.length).padStart(2, '0')}</div>
    <h2 class="display-title">${entry.title}</h2>
    <div class="display-meta">${entry.date} · ${entry.class}</div>
    <div class="display-specs">
      <div class="spec-box">
        <span class="spec-label">HEADLINE</span>
        <span class="spec-value" style="font-size:13px;">${entry.specs.power}</span>
      </div>
      <div class="spec-box">
        <span class="spec-label">HEADLINE</span>
        <span class="spec-value" style="font-size:13px;">${entry.specs.weight}</span>
      </div>
      <div class="spec-box">
        <span class="spec-label">HEADLINE</span>
        <span class="spec-value" style="font-size:13px;">${entry.specs.topSpeed}</span>
      </div>
    </div>
    <p class="display-body">${entry.content}</p>
  `;

  document.querySelectorAll('#devlog-sidebar .garage-entry').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.index) === index);
  });
}

function initializeDevlogApp() {
  buildDevlogSidebar();
  setDevlogContent(0);
}

/* ---------------------------------------------------------
   BOOT
--------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Ignition screen (gates entry to the desktop)
  initializeIgnition();

  // Windows
  initializeWindow('welcome');
  initializeWindow('garage');
  initializeWindow('addcar');
  initializeWindow('devlog');

  // Icons
  initializeIcon('welcome');
  initializeIcon('garage');
  initializeIcon('devlog');

  // App-specific dynamic content
  initializeGarageApp();
  initializeAddCarApp();
  initializeDevlogApp();

  // Top bar always sits above the highest window.
  topBar.style.zIndex = biggestIndex + 1;
});