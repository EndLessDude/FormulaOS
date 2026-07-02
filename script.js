// Global State
let biggestIndex = 100;     // tracks the highest z-index in use
let selectedIcon = null;    // currently selected desktop icon (DOM element)

const topBar = document.getElementById('topbar');

// Clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// Window Manager-------------------------------------------------

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

// Window tap handeling---------------------------------------------------

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

// Dragging windows-----------------------------------------------------
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

// The close button-----------------------------------------------------
function enableCloseButton(win){
    const closeBtn = win.querySelector('.closebutton');
    if (!closeBtn) return;
    closeBtn.addEventListener('mousedown', (e) => {
        // Prevents drag handlers from firing
        e.stopProgation();
    });
    closeBtn.addEventListener('click', () => closeWindow(win));
}

// Reusable window--------------------------------------
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

// Icon System----------------------------------------
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

// Garage's dynamic content----------------------------
const garageContent = [
  {
    title: "Ferrari 488 GT3 Evo",
    date: "Acquired 2023",
    class: "GT3 — Endurance",
    specs: { power: "560 HP", weight: "1300 KG", topSpeed: "187 MPH" },
    content: `The cornerstone of the collection. A naturally-aspirated-feeling twin-turbo V8 wrapped
      in a chassis that forgives mistakes at the limit. Run in full Le Mans livery with a fresh
      brake-by-wire setup installed ahead of the next endurance stint.`
  },
  {
    title: "Porsche 911 RSR",
    date: "Acquired 2022",
    class: "GTE — Endurance",
    specs: { power: "510 HP", weight: "1245 KG", topSpeed: "180 MPH" },
    content: `Mid-engined despite the badge on the back. Famous for braking later than physics
      seems to allow. Currently set up with a stiffer rear anti-roll bar for high-speed circuits
      after a loose qualifying run last season.`
  },
  {
    title: "McLaren 720S GT3",
    date: "Acquired 2023",
    class: "GT3 — Sprint",
    specs: { power: "570 HP", weight: "1290 KG", topSpeed: "183 MPH" },
    content: `The sharpest steering in the garage. Built for short, aggressive sprint races where
      one good lap matters more than ten consistent ones. Aero package recently revised for
      better high-speed stability through fast sweepers.`
  },
  {
    title: "Audi R8 LMS",
    date: "Acquired 2021",
    class: "GT3 — All-rounder",
    specs: { power: "565 HP", weight: "1310 KG", topSpeed: "186 MPH" },
    content: `The car that taught patience. Predictable, planted, and easy to trust in changing
      conditions — the default choice for a wet practice session or a driver still learning
      a new circuit.`
  }
];

function buildGarageSidebar() {
  const sidebar = document.getElementById('garage-sidebar');
  sidebar.innerHTML = '';

  garageContent.forEach((car, index) => {
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
}

// Retrieves the content object, renders it, and updates the sidebar selection--------------
function setContent(index) {
    const car = garageContent[index];
    const display = document.getElementById('garage-display');
    display.innerHTML = `
    <div class="display-eyebrow">GARAGE.APP // CAR ${String(index + 1).padStart(2, '0')} OF ${String(garageContent.length).padStart(2, '0')}</div>
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
    <p class="display-content">${car.content}</p>
    `;

     document.querySelectorAll('.garage-entry').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.index) === index);
  });
}
function initializeGarageApp() {
  buildGarageSidebar();
  setContent(0); // show the first car by default
}

// Boot up-------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Windows
  initializeWindow('welcome');
  initializeWindow('garage');

  // Icons
  initializeIcon('welcome');
  initializeIcon('garage');

  // App specific dynamic content
  initializeGarageApp();

  // Top bar always sits above the highest window
  topBar.style.zIndex = biggestIndex + 1;

  // Open the welcome window on boot
  openWindow(document.getElementById('welcome'));
});
