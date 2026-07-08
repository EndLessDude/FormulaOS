let biggestIndex = 100;
let activeWindowId = null;
let clockFormat = '24';

const topBar = document.getElementById('topbar');
const TOPBAR_H = 36;
const TASKBAR_H = 78;

const windowMeta = {};

// Clock
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

const F1_2026_SCHEDULE = [
  { round: 1, track: 'Albert Park', country: 'Australia', tz: '+11:00', gpName: 'AUSTRALIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-03-07T12:30:00+11:00' },
      { name: 'FREE PRACTICE 2', date: '2026-03-07T16:00:00+11:00' },
      { name: 'FREE PRACTICE 3', date: '2026-03-08T12:30:00+11:00' },
      { name: 'QUALIFYING', date: '2026-03-08T16:00:00+11:00' },
      { name: 'GRAND PRIX', date: '2026-03-09T15:00:00+11:00' }
  ]},
  { round: 2, track: 'Shanghai', country: 'China', tz: '+08:00', gpName: 'CHINESE GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-03-14T12:30:00+08:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-03-14T16:30:00+08:00' },
      { name: 'SPRINT RACE', date: '2026-03-15T12:00:00+08:00' },
      { name: 'GP QUALIFYING', date: '2026-03-15T16:00:00+08:00' },
      { name: 'GRAND PRIX', date: '2026-03-16T15:00:00+08:00' }
  ]},
  { round: 3, track: 'Suzuka', country: 'Japan', tz: '+09:00', gpName: 'JAPANESE GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-03-28T12:30:00+09:00' },
      { name: 'FREE PRACTICE 2', date: '2026-03-28T16:00:00+09:00' },
      { name: 'FREE PRACTICE 3', date: '2026-03-29T12:30:00+09:00' },
      { name: 'QUALIFYING', date: '2026-03-29T16:00:00+09:00' },
      { name: 'GRAND PRIX', date: '2026-03-30T15:00:00+09:00' }
  ]},
  { round: 4, track: 'Miami', country: 'USA', tz: '-04:00', gpName: 'MIAMI GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-05-02T12:30:00-04:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-05-02T16:30:00-04:00' },
      { name: 'SPRINT RACE', date: '2026-05-03T12:00:00-04:00' },
      { name: 'GP QUALIFYING', date: '2026-05-03T16:00:00-04:00' },
      { name: 'GRAND PRIX', date: '2026-05-04T15:00:00-04:00' }
  ]},
  { round: 5, track: 'Montreal', country: 'Canada', tz: '-04:00', gpName: 'CANADIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-05-23T12:30:00-04:00' },
      { name: 'FREE PRACTICE 2', date: '2026-05-23T16:00:00-04:00' },
      { name: 'FREE PRACTICE 3', date: '2026-05-24T12:30:00-04:00' },
      { name: 'QUALIFYING', date: '2026-05-24T16:00:00-04:00' },
      { name: 'GRAND PRIX', date: '2026-05-25T15:00:00-04:00' }
  ]},
  { round: 6, track: 'Monaco', country: 'Monaco', tz: '+02:00', gpName: 'MONACO GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-06-05T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-06-05T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-06-06T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-06-06T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-06-07T15:00:00+02:00' }
  ]},
  { round: 7, track: 'Barcelona', country: 'Spain', tz: '+02:00', gpName: 'SPANISH GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-06-12T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-06-12T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-06-13T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-06-13T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-06-14T15:00:00+02:00' }
  ]},
  { round: 8, track: 'Spielberg', country: 'Austria', tz: '+02:00', gpName: 'AUSTRIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-06-26T12:30:00+02:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-06-26T16:30:00+02:00' },
      { name: 'SPRINT RACE', date: '2026-06-27T12:00:00+02:00' },
      { name: 'GP QUALIFYING', date: '2026-06-27T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-06-28T15:00:00+02:00' }
  ]},
  { round: 9, track: 'Silverstone', country: 'Great Britain', tz: '+01:00', gpName: 'BRITISH GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-07-03T12:30:00+01:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-07-03T16:30:00+01:00' },
      { name: 'SPRINT RACE', date: '2026-07-04T12:00:00+01:00' },
      { name: 'GP QUALIFYING', date: '2026-07-04T16:00:00+01:00' },
      { name: 'GRAND PRIX', date: '2026-07-05T15:00:00+01:00' }
  ]},
  { round: 10, track: 'Spa', country: 'Belgium', tz: '+02:00', gpName: 'BELGIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-07-17T12:30:00+02:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-07-17T16:30:00+02:00' },
      { name: 'SPRINT RACE', date: '2026-07-18T12:00:00+02:00' },
      { name: 'GP QUALIFYING', date: '2026-07-18T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-07-19T15:00:00+02:00' }
  ]},
  { round: 11, track: 'Budapest', country: 'Hungary', tz: '+02:00', gpName: 'HUNGARIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-07-24T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-07-24T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-07-25T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-07-25T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-07-26T15:00:00+02:00' }
  ]},
  { round: 12, track: 'Zandvoort', country: 'Netherlands', tz: '+02:00', gpName: 'DUTCH GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-08-21T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-08-21T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-08-22T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-08-22T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-08-23T15:00:00+02:00' }
  ]},
  { round: 13, track: 'Monza', country: 'Italy', tz: '+02:00', gpName: 'ITALIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-09-04T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-09-04T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-09-05T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-09-05T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-09-06T15:00:00+02:00' }
  ]},
  { round: 14, track: 'Madrid', country: 'Spain', tz: '+02:00', gpName: 'MADRID GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-09-11T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-09-11T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-09-12T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-09-12T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-09-13T15:00:00+02:00' }
  ]},
  { round: 15, track: 'Baku', country: 'Azerbaijan', tz: '+04:00', gpName: 'AZERBAIJAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-09-24T12:30:00+04:00' },
      { name: 'FREE PRACTICE 2', date: '2026-09-24T16:00:00+04:00' },
      { name: 'FREE PRACTICE 3', date: '2026-09-25T12:30:00+04:00' },
      { name: 'QUALIFYING', date: '2026-09-25T16:00:00+04:00' },
      { name: 'GRAND PRIX', date: '2026-09-26T15:00:00+04:00' }
  ]},
  { round: 16, track: 'Singapore', country: 'Singapore', tz: '+08:00', gpName: 'SINGAPORE GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-10-09T12:30:00+08:00' },
      { name: 'FREE PRACTICE 2', date: '2026-10-09T16:00:00+08:00' },
      { name: 'FREE PRACTICE 3', date: '2026-10-10T12:30:00+08:00' },
      { name: 'QUALIFYING', date: '2026-10-10T16:00:00+08:00' },
      { name: 'GRAND PRIX', date: '2026-10-11T15:00:00+08:00' }
  ]},
  { round: 17, track: 'Austin', country: 'USA', tz: '-05:00', gpName: 'UNITED STATES GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-10-23T12:30:00-05:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-10-23T16:30:00-05:00' },
      { name: 'SPRINT RACE', date: '2026-10-24T12:00:00-05:00' },
      { name: 'GP QUALIFYING', date: '2026-10-24T16:00:00-05:00' },
      { name: 'GRAND PRIX', date: '2026-10-25T15:00:00-05:00' }
  ]},
  { round: 18, track: 'Mexico City', country: 'Mexico', tz: '-06:00', gpName: 'MEXICO CITY GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-10-30T12:30:00-06:00' },
      { name: 'FREE PRACTICE 2', date: '2026-10-30T16:00:00-06:00' },
      { name: 'FREE PRACTICE 3', date: '2026-10-31T12:30:00-06:00' },
      { name: 'QUALIFYING', date: '2026-10-31T16:00:00-06:00' },
      { name: 'GRAND PRIX', date: '2026-11-01T15:00:00-06:00' }
  ]},
  { round: 19, track: 'Interlagos', country: 'Brazil', tz: '-03:00', gpName: 'SAO PAULO GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-11-06T12:30:00-03:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-11-06T16:30:00-03:00' },
      { name: 'SPRINT RACE', date: '2026-11-07T12:00:00-03:00' },
      { name: 'GP QUALIFYING', date: '2026-11-07T16:00:00-03:00' },
      { name: 'GRAND PRIX', date: '2026-11-08T15:00:00-03:00' }
  ]},
  { round: 20, track: 'Las Vegas', country: 'USA', tz: '-08:00', gpName: 'LAS VEGAS GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-11-19T12:30:00-08:00' },
      { name: 'FREE PRACTICE 2', date: '2026-11-19T16:00:00-08:00' },
      { name: 'FREE PRACTICE 3', date: '2026-11-20T12:30:00-08:00' },
      { name: 'QUALIFYING', date: '2026-11-20T16:00:00-08:00' },
      { name: 'GRAND PRIX', date: '2026-11-21T15:00:00-08:00' }
  ]},
  { round: 21, track: 'Lusail', country: 'Qatar', tz: '+03:00', gpName: 'QATAR GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-11-27T12:30:00+03:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-11-27T16:30:00+03:00' },
      { name: 'SPRINT RACE', date: '2026-11-28T12:00:00+03:00' },
      { name: 'GP QUALIFYING', date: '2026-11-28T16:00:00+03:00' },
      { name: 'GRAND PRIX', date: '2026-11-29T15:00:00+03:00' }
  ]},
  { round: 22, track: 'Abu Dhabi', country: 'UAE', tz: '+04:00', gpName: 'ABU DHABI GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-12-04T12:30:00+04:00' },
      { name: 'FREE PRACTICE 2', date: '2026-12-04T16:00:00+04:00' },
      { name: 'FREE PRACTICE 3', date: '2026-12-05T12:30:00+04:00' },
      { name: 'QUALIFYING', date: '2026-12-05T16:00:00+04:00' },
      { name: 'GRAND PRIX', date: '2026-12-06T15:00:00+04:00' }
  ]}
];

function findNextSession() {
  const now = new Date();
  for (const round of F1_2026_SCHEDULE) {
    for (const session of round.sessions) {
      const sessionDate = new Date(session.date);
      if (sessionDate > now) {
        return { round, session, date: sessionDate };
      }
    }
  }
  return null;
}

let currentNextSession = findNextSession();

function updateCountdown() {
  if (!currentNextSession) return;

  const now = new Date();
  let diff = currentNextSession.date - now;
  if (diff < 0) {
    currentNextSession = findNextSession();
    if (!currentNextSession) return;
    diff = currentNextSession.date - now;
    if (diff < 0) diff = 0;
    applyTrackWallpaper(currentNextSession.round.track);
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  document.getElementById('cd-session').textContent = currentNextSession.session.name;
  document.getElementById('cd-track').textContent = currentNextSession.round.track.toUpperCase();
}
updateCountdown();
setInterval(updateCountdown, 1000);

const TRACK_SVGS = {
  'Albert Park': `<path class="track-ribbon" d="M400,280 C300,270 200,280 150,340 C120,380 140,450 200,500 L300,500 C260,470 240,430 270,400 L280,310 L400,310 C430,280 440,250 400,280 Z"/>
    <path class="track-centerline" d="M400,280 C300,270 200,280 150,340 C120,380 140,450 200,500 L300,500 C260,470 240,430 270,400 L280,310 L400,310 C430,280 440,250 400,280 Z"/>
    <text x="140" y="370" class="track-label">T1</text><text x="280" y="480" class="track-label">T3</text><text x="400" y="320" class="track-label">T11</text>`,

  'Shanghai': `<path class="track-ribbon" d="M500,250 C550,240 600,260 620,310 L620,440 C640,480 620,520 560,500 L440,460 C400,230 340,120 250,100 C150,80 130,180 180,240 C220,290 280,280 340,240 C380,210 420,160 440,140 L460,160 C460,200 450,280 460,360 L480,420 C500,440 530,420 540,380 L540,330 C540,280 530,250 500,250 Z"/>
    <path class="track-centerline" d="M500,250 C550,240 600,260 620,310 L620,440 C640,480 620,520 560,500 L440,460 C400,230 340,120 250,100 C150,80 130,180 180,240 C220,290 280,280 340,240 C380,210 420,160 440,140 L460,160 C460,200 450,280 460,360 L480,420 C500,440 530,420 540,380 L540,330 C540,280 530,250 500,250 Z"/>
    <text x="160" y="130" class="track-label">T1</text><text x="440" y="130" class="track-label">T7</text>`,

  'Suzuka': `<path class="track-ribbon" d="M520,200 L520,60 C540,30 600,20 640,60 L620,100 C550,110 510,150 460,190 L380,250 C340,210 260,210 220,280 C170,370 200,440 280,500 C360,560 500,580 640,520 L660,460 C700,490 780,480 820,430 L800,390 C720,420 600,480 480,460 C380,440 280,380 260,300 C240,220 300,200 400,240 L460,280 L520,200 Z"/>
    <path class="track-centerline" d="M520,200 L520,60 C540,30 600,20 640,60 L620,100 C550,110 510,150 460,190 L380,250 C340,210 260,210 220,280 C170,370 200,440 280,500 C360,560 500,580 640,520 L660,460 C700,490 780,480 820,430 L800,390 C720,420 600,480 480,460 C380,440 280,380 260,300 C240,220 300,200 400,240 L460,280 L520,200 Z"/>
    <text x="600" y="80" class="track-label">130R</text><text x="200" y="350" class="track-label">S-CURVES</text>`,

  'Miami': `<path class="track-ribbon" d="M500,120 L480,160 C440,200 400,240 440,300 L280,300 C240,330 260,380 320,420 C380,460 480,440 560,390 C620,350 640,300 560,260 L480,220 C420,180 440,150 460,120 L500,120 Z"/>
    <path class="track-centerline" d="M500,120 L480,160 C440,200 400,240 440,300 L280,300 C240,330 260,380 320,420 C380,460 480,440 560,390 C620,350 640,300 560,260 L480,220 C420,180 440,150 460,120 L500,120 Z"/>
    <text x="240" y="350" class="track-label">T1</text><text x="580" y="380" class="track-label">T11</text>`,

  'Montreal': `<path class="track-ribbon" d="M500,200 C480,160 440,140 400,170 L400,220 C380,240 360,220 340,260 L180,360 C140,400 160,460 220,500 L400,540 C460,530 500,480 480,440 L460,300 C490,220 540,200 560,240 L540,280 C510,270 500,250 500,200 Z"/>
    <path class="track-centerline" d="M500,200 C480,160 440,140 400,170 L400,220 C380,240 360,220 340,260 L180,360 C140,400 160,460 220,500 L400,540 C460,530 500,480 480,440 L460,300 C490,220 540,200 560,240 L540,280 C510,270 500,250 500,200 Z"/>
    <text x="160" y="420" class="track-label">WALL OF CHAMPIONS</text>`,

  'Monaco': `<path class="track-ribbon" d="M620,440 L620,360 L580,360 C560,380 560,420 500,420 L480,460 C420,520 360,520 300,480 C240,440 220,360 280,300 L340,240 C380,200 440,200 480,240 L520,280 L540,360 C520,380 500,380 460,360 L480,320 L580,280 L600,260 L620,280 Z"/>
    <path class="track-centerline" d="M620,440 L620,360 L580,360 C560,380 560,420 500,420 L480,460 C420,520 360,520 300,480 C240,440 220,360 280,300 L340,240 C380,200 440,200 480,240 L520,280 L540,360 C520,380 500,380 460,360 L480,320 L580,280 L600,260 L620,280 Z"/>
    <text x="240" y="370" class="track-label">CASINO</text><text x="460" y="150" class="track-label">TUNNEL</text>`,

  'Barcelona': `<path class="track-ribbon" d="M600,300 L600,140 C580,100 500,80 440,120 L360,180 C320,220 320,280 380,320 C440,360 520,340 560,280 C600,240 560,180 500,180 C440,180 440,220 440,280 C440,340 480,400 560,420 C640,440 700,380 700,320 L800,320 L800,280 L700,280 L600,300 Z"/>
    <path class="track-centerline" d="M600,300 L600,140 C580,100 500,80 440,120 L360,180 C320,220 320,280 380,320 C440,360 520,340 560,280 C600,240 560,180 500,180 C440,180 440,220 440,280 C440,340 480,400 560,420 C640,440 700,380 700,320 L800,320 L800,280 L700,280 L600,300 Z"/>
    <text x="620" y="130" class="track-label">T1</text><text x="370" y="270" class="track-label">T7</text>`,

  'Spielberg': `<path class="track-ribbon" d="M480,100 C380,80 280,140 340,240 C380,310 280,380 300,440 C320,500 420,520 500,480 L520,380 C500,320 560,280 620,220 C680,160 700,100 620,100 C560,100 520,140 500,180 L480,140 C480,120 480,100 480,100 Z"/>
    <path class="track-centerline" d="M480,100 C380,80 280,140 340,240 C380,310 280,380 300,440 C320,500 420,520 500,480 L520,380 C500,320 560,280 620,220 C680,160 700,100 620,100 C560,100 520,140 500,180 L480,140 C480,120 480,100 480,100 Z"/>
    <text x="280" y="200" class="track-label">T1</text><text x="640" y="200" class="track-label">T7</text>`,

  'Spa': `<path class="track-ribbon" d="M520,80 L520,180 C550,200 600,190 640,160 L640,80 L720,140 C780,180 820,260 780,340 C740,420 660,460 580,430 C500,400 440,340 420,260 C400,180 440,120 520,80 Z"/>
    <path class="track-centerline" d="M520,80 L520,180 C550,200 600,190 640,160 L640,80 L720,140 C780,180 820,260 780,340 C740,420 660,460 580,430 C500,400 440,340 420,260 C400,180 440,120 520,80 Z"/>
    <text x="660" y="200" class="track-label">EAU ROUGE</text><text x="280" y="350" class="track-label">LES COMBES</text>`,

  'Budapest': `<path class="track-ribbon" d="M500,100 C420,80 340,100 280,180 C220,260 260,340 340,380 L440,400 C500,420 520,380 520,340 C520,300 480,280 440,300 C400,320 360,360 340,320 C320,280 360,220 400,200 C440,180 480,160 480,120 L500,100 Z"/>
    <path class="track-centerline" d="M500,100 C420,80 340,100 280,180 C220,260 260,340 340,380 L440,400 C500,420 520,380 520,340 C520,300 480,280 440,300 C400,320 360,360 340,320 C320,280 360,220 400,200 C440,180 480,160 480,120 L500,100 Z"/>
    <text x="260" y="220" class="track-label">T1</text><text x="500" y="360" class="track-label">T4</text>`,

  'Zandvoort': `<path class="track-ribbon" d="M440,120 L560,120 C640,120 700,180 700,280 L700,400 L640,480 C580,540 460,500 440,440 C420,380 460,320 500,300 C540,280 540,240 520,200 C500,160 460,140 440,120 Z"/>
    <path class="track-centerline" d="M440,120 L560,120 C640,120 700,180 700,280 L700,400 L640,480 C580,540 460,500 440,440 C420,380 460,320 500,300 C540,280 540,240 520,200 C500,160 460,140 440,120 Z"/>
    <text x="600" y="160" class="track-label">T1</text><text x="480" y="400" class="track-label">T13</text>`,

  'Monza': `<path class="track-ribbon" d="M580,140 L640,140 C700,140 760,180 800,260 L800,380 L740,460 C680,500 620,460 600,400 L580,340 L580,260 C640,200 580,140 580,140 Z"/>
    <path class="track-centerline" d="M580,140 L640,140 C700,140 760,180 800,260 L800,380 L740,460 C680,500 620,460 600,400 L580,340 L580,260 C640,200 580,140 580,140 Z"/>
    <text x="790" y="300" class="track-label">PARABOLICA</text><text x="560" y="180" class="track-label">CHICANE</text>`,

  'Madrid': `<path class="track-ribbon" d="M450,500 C300,480 180,400 200,300 C220,200 320,120 420,100 C520,80 600,160 640,260 C680,360 600,440 500,460 L460,400 C520,380 580,320 560,260 C540,200 480,160 440,180 C400,200 340,260 300,340 C280,380 360,440 420,460 L450,500 Z"/>
    <path class="track-centerline" d="M450,500 C300,480 180,400 200,300 C220,200 320,120 420,100 C520,80 600,160 640,260 C680,360 600,440 500,460 L460,400 C520,380 580,320 560,260 C540,200 480,160 440,180 C400,200 340,260 300,340 C280,380 360,440 420,460 L450,500 Z"/>
    <text x="600" y="230" class="track-label">T1</text><text x="180" y="360" class="track-label">T7</text>`,

  'Baku': `<path class="track-ribbon" d="M560,500 L700,500 L700,200 C760,150 840,150 880,200 L880,360 C830,440 720,460 640,420 L580,380 L560,420 C560,460 560,500 560,500 Z"/>
    <path class="track-centerline" d="M560,500 L700,500 L700,200 C760,150 840,150 880,200 L880,360 C830,440 720,460 640,420 L580,380 L560,420 C560,460 560,500 560,500 Z"/>
    <text x="880" y="280" class="track-label">CASTLE</text><text x="700" y="480" class="track-label">START</text>`,

  'Singapore': `<path class="track-ribbon" d="M500,120 L500,240 C440,300 380,280 340,200 C300,120 340,60 440,60 C540,60 640,80 700,160 L700,320 C640,400 540,420 440,380 C340,340 280,260 240,180 C200,100 240,60 340,60 L400,60 Z"/>
    <path class="track-centerline" d="M500,120 L500,240 C440,300 380,280 340,200 C300,120 340,60 440,60 C540,60 640,80 700,160 L700,320 C640,400 540,420 440,380 C340,340 280,260 240,180 C200,100 240,60 340,60 L400,60 Z"/>
    <text x="240" y="120" class="track-label">T1</text><text x="620" y="360" class="track-label">T13</text>`,

  'Austin': `<path class="track-ribbon" d="M480,80 L680,80 L800,140 C850,170 880,220 840,280 C800,340 720,380 640,380 L480,360 C360,340 280,260 280,160 C280,80 360,60 480,80 Z"/>
    <path class="track-centerline" d="M480,80 L680,80 L800,140 C850,170 880,220 840,280 C800,340 720,380 640,380 L480,360 C360,340 280,260 280,160 C280,80 360,60 480,80 Z"/>
    <text x="840" y="230" class="track-label">T1</text><text x="280" y="220" class="track-label">T12</text>`,

  'Mexico City': `<path class="track-ribbon" d="M600,100 L720,100 C780,100 820,150 820,220 L820,340 C820,400 780,440 700,420 L620,380 L560,300 C520,260 520,220 560,200 C600,180 600,140 600,100 Z"/>
    <path class="track-centerline" d="M600,100 L720,100 C780,100 820,150 820,220 L820,340 C820,400 780,440 700,420 L620,380 L560,300 C520,260 520,220 560,200 C600,180 600,140 600,100 Z"/>
    <text x="820" y="300" class="track-label">FORO SOL</text><text x="540" y="250" class="track-label">T1</text>`,

  'Interlagos': `<path class="track-ribbon" d="M640,120 C560,100 480,100 400,160 L300,260 C240,330 260,420 340,460 L460,500 C560,530 660,480 700,420 L680,380 L580,320 C540,280 540,200 580,160 L640,120 Z"/>
    <path class="track-centerline" d="M640,120 C560,100 480,100 400,160 L300,260 C240,330 260,420 340,460 L460,500 C560,530 660,480 700,420 L680,380 L580,320 C540,280 540,200 580,160 L640,120 Z"/>
    <text x="300" y="320" class="track-label">SENNA S</text><text x="560" y="400" class="track-label">T4</text>`,

  'Las Vegas': `<path class="track-ribbon" d="M700,500 L700,140 L840,100 C880,80 920,100 940,150 L940,400 C940,450 880,480 840,470 L740,440 C700,420 680,380 700,360 L740,340 L740,200 L700,240 L680,200 C680,300 700,440 700,500 Z"/>
    <path class="track-centerline" d="M700,500 L700,140 L840,100 C880,80 920,100 940,150 L940,400 C940,450 880,480 840,470 L740,440 C700,420 680,380 700,360 L740,340 L740,200 L700,240 L680,200 C680,300 700,440 700,500 Z"/>
    <text x="920" y="280" class="track-label">STRIP</text><text x="700" y="180" class="track-label">T1</text>`,

  'Lusail': `<path class="track-ribbon" d="M520,100 C640,80 760,120 820,200 C880,280 840,400 760,460 C680,520 560,500 480,440 C400,380 340,280 340,180 C340,120 400,100 520,100 Z"/>
    <path class="track-centerline" d="M520,100 C640,80 760,120 820,200 C880,280 840,400 760,460 C680,520 560,500 480,440 C400,380 340,280 340,180 C340,120 400,100 520,100 Z"/>
    <text x="820" y="240" class="track-label">T1</text><text x="340" y="340" class="track-label">T10</text>`,

  'Abu Dhabi': `<path class="track-ribbon" d="M500,80 L780,80 C840,80 880,140 880,220 C880,300 840,360 780,380 L600,440 C540,480 480,520 440,540 C400,560 360,540 340,500 C320,460 320,400 340,340 C360,280 300,220 220,180 C140,140 80,140 60,160 L40,140 C80,60 200,80 300,160 C350,200 380,260 380,320 L500,240 L500,80 Z"/>
    <path class="track-centerline" d="M500,80 L780,80 C840,80 880,140 880,220 C880,300 840,360 780,380 L600,440 C540,480 480,520 440,540 C400,560 360,540 340,500 C320,460 320,400 340,340 C360,280 300,220 220,180 C140,140 80,140 60,160 L40,140 C80,60 200,80 300,160 C350,200 380,260 380,320 L500,240 L500,80 Z"/>
    <text x="800" y="280" class="track-label">S1</text><text x="380" y="420" class="track-label">S3</text>`,

  'Silverstone': `<path class="track-ribbon" d="M120,420 C60,380 60,300 130,270 C190,244 210,190 180,140 C150,90 200,40 270,55 C330,68 350,120 400,120 C460,120 470,60 540,50 C610,40 660,90 630,140 C605,182 640,210 700,215 C775,222 830,180 860,230 C892,283 850,330 780,335 C715,340 690,300 640,320 C585,342 590,400 530,410 C470,420 460,370 400,375 C335,381 330,440 260,445 C190,450 175,455 120,420 Z"/>
    <path class="track-centerline" d="M120,420 C60,380 60,300 130,270 C190,244 210,190 180,140 C150,90 200,40 270,55 C330,68 350,120 400,120 C460,120 470,60 540,50 C610,40 660,90 630,140 C605,182 640,210 700,215 C775,222 830,180 860,230 C892,283 850,330 780,335 C715,340 690,300 640,320 C585,342 590,400 530,410 C470,420 460,370 400,375 C335,381 330,440 260,445 C190,450 175,455 120,420 Z"/>
    <text x="145" y="405" class="track-label">CLUB</text><text x="120" y="230" class="track-label">MAGGOTTS-BECKETTS</text><text x="330" y="45" class="track-label">COPSE</text><text x="600" y="115" class="track-label">HANGAR STRAIGHT</text><text x="820" y="255" class="track-label">STOWE</text>`
};

function applyTrackWallpaper(trackName) { /* deprecated — kept as a no-op */ }
function initializeTrackWallpaper() { /* deprecated — wallpaper is now static */ }

function initializeIgnition() {
  const igniteBtn = document.getElementById('ignition-btn');
  const ignitionScreen = document.getElementById('ignition-screen');
  const formatScreen = document.getElementById('format-screen');

  igniteBtn.addEventListener('click', () => {
    igniteBtn.classList.add('firing');
    setTimeout(() => {
      ignitionScreen.classList.add('hidden');
      setTimeout(() => { ignitionScreen.style.display = 'none'; }, 450);
      formatScreen.removeAttribute('hidden');
      formatScreen.style.display = 'flex';
      formatScreen.style.opacity = '0';
      void formatScreen.offsetWidth;
      formatScreen.style.opacity = '1';
      formatScreen.querySelector('.ignition-stage').style.animation = 'none';
      void formatScreen.offsetWidth;
      formatScreen.querySelector('.ignition-stage').style.animation = 'stage-enter 0.35s ease';
    }, 200);
  });

  document.querySelectorAll('.format-btn').forEach((btn) => {
    btn.addEventListener('click', () => finishIgnition(btn.dataset.format));
  });
}

function finishIgnition(format) {
  clockFormat = format;
  updateClock();

  const formatScreen = document.getElementById('format-screen');
  formatScreen.classList.add('hidden');
  setTimeout(() => { formatScreen.style.display = 'none'; }, 450);

  openWindow(document.getElementById('welcome'));
}

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

function handleWindowTap(win) {
  bringToFront(win);
}

function addWindowTapHandling(win) {
  win.addEventListener('mousedown', () => handleWindowTap(win));
}

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

function updateTaskbar() {
  document.querySelectorAll('.dock-item').forEach((icon) => {
    const win = document.getElementById(icon.dataset.window);
    if (!win) return;
    const isOpen = win.dataset.state === 'open' || win.dataset.state === 'minimized';
    icon.classList.toggle('open', isOpen);
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

const CHAMPIONS = [
  { name: 'Michael Schumacher',   titles: 7, years: [1994, 1995, 2000, 2001, 2002, 2003, 2004] },
  { name: 'Lewis Hamilton',       titles: 7, years: [2008, 2014, 2015, 2017, 2018, 2019, 2020] },
  { name: 'Juan Manuel Fangio',   titles: 5, years: [1951, 1954, 1955, 1956, 1957] },
  { name: 'Alain Prost',          titles: 4, years: [1985, 1986, 1989, 1993] },
  { name: 'Sebastian Vettel',     titles: 4, years: [2010, 2011, 2012, 2013] },
  { name: 'Max Verstappen',       titles: 4, years: [2021, 2022, 2023, 2024] },
  { name: 'Jack Brabham',         titles: 3, years: [1959, 1960, 1966] },
  { name: 'Jackie Stewart',       titles: 3, years: [1969, 1971, 1973] },
  { name: 'Niki Lauda',           titles: 3, years: [1975, 1977, 1984] },
  { name: 'Nelson Piquet',        titles: 3, years: [1981, 1983, 1987] },
  { name: 'Ayrton Senna',         titles: 3, years: [1988, 1990, 1991] },
  { name: 'Alberto Ascari',       titles: 2, years: [1952, 1953] },
  { name: 'Graham Hill',          titles: 2, years: [1962, 1968] },
  { name: 'Jim Clark',            titles: 2, years: [1963, 1965] },
  { name: 'Emerson Fittipaldi',   titles: 2, years: [1972, 1974] },
  { name: 'Mika Häkkinen',        titles: 2, years: [1998, 1999] },
  { name: 'Fernando Alonso',      titles: 2, years: [2005, 2006] },
  { name: 'Giuseppe Farina',      titles: 1, years: [1950] },
  { name: 'Mike Hawthorn',        titles: 1, years: [1958] },
  { name: 'Phil Hill',            titles: 1, years: [1961] },
  { name: 'John Surtees',         titles: 1, years: [1964] },
  { name: 'Denny Hulme',          titles: 1, years: [1967] },
  { name: 'Jochen Rindt',         titles: 1, years: [1970] },
  { name: 'James Hunt',           titles: 1, years: [1976] },
  { name: 'Mario Andretti',       titles: 1, years: [1978] },
  { name: 'Jody Scheckter',       titles: 1, years: [1979] },
  { name: 'Alan Jones',           titles: 1, years: [1980] },
  { name: 'Keke Rosberg',         titles: 1, years: [1982] },
  { name: 'Nigel Mansell',        titles: 1, years: [1992] },
  { name: 'Damon Hill',           titles: 1, years: [1996] },
  { name: 'Jacques Villeneuve',   titles: 1, years: [1997] },
  { name: 'Kimi Räikkönen',       titles: 1, years: [2007] },
  { name: 'Jenson Button',        titles: 1, years: [2009] },
  { name: 'Nico Rosberg',         titles: 1, years: [2016] },
  { name: 'Lando Norris',         titles: 1, years: [2025] }
];

function buildChampionsTable() {
  const display = document.getElementById('champions-display');
  if (!display) return;

  const sorted = [...CHAMPIONS].sort((a, b) => {
    if (b.titles !== a.titles) return b.titles - a.titles;
    const aFirst = a.years[0] ?? Infinity;
    const bFirst = b.years[0] ?? Infinity;
    if (aFirst !== bFirst) return aFirst - bFirst;
    return a.name.localeCompare(b.name);
  });

  const rowsHtml = sorted.map((c, i) => {
    const yearsStr = c.years.length ? c.years.join(', ') : '\u2014';
    const titlesChip = c.titles >= 3 ? 'champ-row--multi' : 'champ-row--single';
    return `
      <tr class="${titlesChip}">
        <td class="champ-rank">${String(i + 1).padStart(2, '0')}</td>
        <td class="champ-name">${c.name}</td>
        <td class="champ-titles">${c.titles}</td>
        <td class="champ-years">${yearsStr}</td>
      </tr>`;
  }).join('');

  display.innerHTML = `
    <table class="champ-table">
      <thead>
        <tr>
          <th class="champ-rank-head">RANK</th>
          <th class="champ-name-head">DRIVER</th>
          <th class="champ-titles-head">TITLES</th>
          <th class="champ-years-head">YEARS</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  `;
}

function initializeChampionsApp() {
  buildChampionsTable();
}


const QUIZ_QUESTIONS = [
  {
    text: 'Who was the first F1 World Champion?',
    answer: 'Giuseppe Farina',
    choices: ['Giuseppe Farina', 'Juan Manuel Fangio', 'Jim Clark', 'Graham Hill']
  },
  {
    text: 'Who has the most wins in F1?',
    answer: 'Lewis Hamilton',
    choices: ['Lewis Hamilton', 'Fernando Alonso', 'Michael Schumacher', 'Max Verstappen']
  },
  {
    text: 'Who has the most wins at Monaco?',
    answer: 'Ayrton Senna',
    choices: ['Ayrton Senna', 'Lewis Hamilton', 'Alain Prost', 'Michael Schumacher']
  },
  {
    text: 'Which F1 team won the Constructors\u2019 Championship in 2009?',
    answer: 'Brawn GP',
    choices: ['Brawn GP', 'Ferrari', 'Mercedes', 'Red Bull']
  },
  {
    text: 'Who won the Drivers\u2019 Championship in 1976?',
    answer: 'James Hunt',
    choices: ['James Hunt', 'Niki Lauda', 'Sebastian Vettel', 'Damon Hill']
  }
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function quizRenderQuestion() {
  const q = QUIZ_QUESTIONS[quizIndex];
  const display = document.getElementById('quiz-display');
  if (!display) return;

  const total = QUIZ_QUESTIONS.length;
  const progressPct = ((quizIndex) / total) * 100;

  const choicesHtml = q.choices.map((c) => `
    <button class="quiz-choice" data-choice="${c.replace(/"/g, '"')}">
      <span class="quiz-choice-letter"></span>
      <span class="quiz-choice-text">${c}</span>
    </button>
  `).join('');

  display.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-meta">
        <span class="quiz-progress-label">QUESTION ${quizIndex + 1} OF ${total}</span>
        <span class="quiz-progress-score">SCORE ${quizScore}</span>
      </div>
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
      </div>
    </div>
    <div class="quiz-card">
      <h2 class="quiz-question">${q.text}</h2>
      <div class="quiz-choices">${choicesHtml}</div>
      <div class="quiz-feedback" id="quiz-feedback"></div>
      <div class="quiz-actions">
        <button class="quiz-next-btn" id="quiz-next-btn" hidden>NEXT QUESTION \u2192</button>
      </div>
    </div>
  `;

  display.querySelectorAll('.quiz-choice').forEach((btn) => {
    btn.addEventListener('click', () => quizHandleAnswer(btn));
  });

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.addEventListener('click', quizNext);

  quizAnswered = false;
}

function quizHandleAnswer(btn) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q = QUIZ_QUESTIONS[quizIndex];
  const chosen = btn.dataset.choice;
  const isCorrect = chosen === q.answer;

  document.querySelectorAll('#quiz-display .quiz-choice').forEach((c) => {
    c.disabled = true;
    const isAns = c.dataset.choice === q.answer;
    c.classList.add(isAns ? 'quiz-choice--correct' : 'quiz-choice--dim');
  });

  if (!isCorrect) btn.classList.add('quiz-choice--wrong');

  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.add(isCorrect ? 'feedback--good' : 'feedback--bad');
  feedback.textContent = isCorrect
    ? 'Nice. \u2714'
    : 'Not quite \u2014 correct answer: ' + q.answer;

  if (isCorrect) quizScore++;
  document.getElementById('quiz-next-btn').hidden = false;
}

function quizNext() {
  quizIndex++;
  if (quizIndex >= QUIZ_QUESTIONS.length) {
    quizRenderResult();
  } else {
    quizRenderQuestion();
  }
}

function quizRenderResult() {
  const total = QUIZ_QUESTIONS.length;
  const pct = Math.round((quizScore / total) * 100);
  const display = document.getElementById('quiz-display');

  let rating = 'Back to karting';
  if (pct === 100) rating = 'OG Fan';
  else if (pct >= 80) rating = 'Normal Fan';
  else if (pct >= 60) rating = 'New Fan';
  else if (pct >= 40) rating = 'Rookie';

  display.innerHTML = `
    <div class="quiz-card quiz-card--result">
      <span class="result-eyebrow">QUIZ COMPLETE</span>
      <h2 class="result-title">${quizScore} / ${total}</h2>
      <p class="result-rating">${rating}</p>
      <p class="result-percent">${pct}% correct</p>
      <button class="btn-primary quiz-restart" id="quiz-restart">PLAY AGAIN</button>
    </div>
  `;

  document.getElementById('quiz-restart').addEventListener('click', () => {
    quizIndex = 0;
    quizScore = 0;
    quizRenderQuestion();
  });
}

function initializeQuizApp() {
  QUIZ_QUESTIONS.forEach((q) => {
    const correct = q.answer;
    q.choices = shuffleArray(q.choices);
    q.answer = correct;
  });
  quizIndex = 0;
  quizScore = 0;
  quizRenderQuestion();
}


let loState = 'idle';
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
  startBtn.textContent = 'Running...';

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
  if (ms < 180) return { label: 'Pro', cls: 'grade-elite' };
  if (ms < 230) return { label: 'Pro-Amature', cls: 'grade-pro' };
  if (ms < 300) return { label: 'Amature', cls: 'grade-good' };
  if (ms < 450) return { label: 'Rookie', cls: 'grade-avg' };
  return { label: 'Old Man', cls: 'grade-slow' };
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

const CARS_2026 = [
  { name: 'Alpine',       src: 'Cars/Alpine.webp' },
  { name: 'Aston Martin', src: 'Cars/Aston%20Martin.jpg' },
  { name: 'Audi',         src: 'Cars/Audi.jpg' },
  { name: 'Cadillac',     src: 'Cars/Cadillac.webp' },
  { name: 'Ferrari',      src: 'Cars/Ferrari.jpg' },
  { name: 'Haas',         src: 'Cars/Haas.webp' },
  { name: 'McLaren',      src: 'Cars/McLaren.jpg' },
  { name: 'Mercedes',     src: 'Cars/Mercedes.webp' },
  { name: 'Racing Bulls', src: 'Cars/Racing%20Bulls.jpg' },
  { name: 'RedBull',      src: 'Cars/RedBull.jpeg' },
  { name: 'Williams',     src: 'Cars/Williams.webp' }
];

function buildCarsGrid() {
  const grid = document.getElementById('cars-grid');
  if (!grid) return;
  grid.innerHTML = CARS_2026.map((c) => `
    <figure class="cars-cell">
      <img src="${c.src}" alt="${c.name}" class="cars-img">
      <figcaption class="cars-name">${c.name}</figcaption>
    </figure>`).join('');
}

function initializeCarsApp() {
  buildCarsGrid();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeIgnition();
  initializeTrackWallpaper();

  initializeWindow('welcome');
  initializeWindow('lightsout');
  initializeWindow('champions');
  initializeWindow('quiz');
  initializeWindow('calendar');
  initializeWindow('cars');

  initializeTaskbarIcon('welcome');
  initializeTaskbarIcon('lightsout');
  initializeTaskbarIcon('champions');
  initializeTaskbarIcon('quiz');
  initializeTaskbarIcon('calendar');
  initializeTaskbarIcon('cars');

  initializeLightsOutApp();
  initializeChampionsApp();
  initializeQuizApp();
  initializeCarsApp();

  topBar.style.zIndex = biggestIndex + 1;
  updateTaskbar();
});