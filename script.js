let biggestIndex = 100;
let activeWindowId = null;
let clockFormat = '24';

const topBar = document.getElementById('topbar');
const TOPBAR_H = 36;
const TASKBAR_H = 44;

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

// 2026 F1 Season Schedule, for the countdown timer

const F1_2026_SCHEDULE = [
  // Round 1: Australia (Melbourne) UTC+11 (AEDT)
  { round: 1, track: 'Albert Park', country: 'Australia', tz: '+11:00', gpName: 'AUSTRALIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-03-07T12:30:00+11:00' },
      { name: 'FREE PRACTICE 2', date: '2026-03-07T16:00:00+11:00' },
      { name: 'FREE PRACTICE 3', date: '2026-03-08T12:30:00+11:00' },
      { name: 'QUALIFYING', date: '2026-03-08T16:00:00+11:00' },
      { name: 'GRAND PRIX', date: '2026-03-09T15:00:00+11:00' }
  ]},
  // Round 2: China (Shanghai) Sprint UTC+8
  { round: 2, track: 'Shanghai', country: 'China', tz: '+08:00', gpName: 'CHINESE GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-03-14T12:30:00+08:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-03-14T16:30:00+08:00' },
      { name: 'SPRINT RACE', date: '2026-03-15T12:00:00+08:00' },
      { name: 'GP QUALIFYING', date: '2026-03-15T16:00:00+08:00' },
      { name: 'GRAND PRIX', date: '2026-03-16T15:00:00+08:00' }
  ]},
  // Round 3: Japan (Suzuka) UTC+9
  { round: 3, track: 'Suzuka', country: 'Japan', tz: '+09:00', gpName: 'JAPANESE GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-03-28T12:30:00+09:00' },
      { name: 'FREE PRACTICE 2', date: '2026-03-28T16:00:00+09:00' },
      { name: 'FREE PRACTICE 3', date: '2026-03-29T12:30:00+09:00' },
      { name: 'QUALIFYING', date: '2026-03-29T16:00:00+09:00' },
      { name: 'GRAND PRIX', date: '2026-03-30T15:00:00+09:00' }
  ]},
  // Round 4: Miami SPRINT UTC-4 (EDT)
  { round: 4, track: 'Miami', country: 'USA', tz: '-04:00', gpName: 'MIAMI GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-05-02T12:30:00-04:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-05-02T16:30:00-04:00' },
      { name: 'SPRINT RACE', date: '2026-05-03T12:00:00-04:00' },
      { name: 'GP QUALIFYING', date: '2026-05-03T16:00:00-04:00' },
      { name: 'GRAND PRIX', date: '2026-05-04T15:00:00-04:00' }
  ]},
  // Round 5: Canada (Montreal) UTC-4 (EDT)
  { round: 5, track: 'Montreal', country: 'Canada', tz: '-04:00', gpName: 'CANADIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-05-23T12:30:00-04:00' },
      { name: 'FREE PRACTICE 2', date: '2026-05-23T16:00:00-04:00' },
      { name: 'FREE PRACTICE 3', date: '2026-05-24T12:30:00-04:00' },
      { name: 'QUALIFYING', date: '2026-05-24T16:00:00-04:00' },
      { name: 'GRAND PRIX', date: '2026-05-25T15:00:00-04:00' }
  ]},
  // Round 6: Monaco UTC+2 (CEST)
  { round: 6, track: 'Monaco', country: 'Monaco', tz: '+02:00', gpName: 'MONACO GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-06-05T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-06-05T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-06-06T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-06-06T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-06-07T15:00:00+02:00' }
  ]},
  // Round 7: Spain (Barcelona) UTC+2 (CEST)
  { round: 7, track: 'Barcelona', country: 'Spain', tz: '+02:00', gpName: 'SPANISH GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-06-12T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-06-12T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-06-13T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-06-13T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-06-14T15:00:00+02:00' }
  ]},
  // Round 8: Austria (Spielberg) Sprint UTC+2 (CEST)
  { round: 8, track: 'Spielberg', country: 'Austria', tz: '+02:00', gpName: 'AUSTRIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-06-26T12:30:00+02:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-06-26T16:30:00+02:00' },
      { name: 'SPRINT RACE', date: '2026-06-27T12:00:00+02:00' },
      { name: 'GP QUALIFYING', date: '2026-06-27T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-06-28T15:00:00+02:00' }
  ]},
  // Round 9: Great Britain (Silverstone) Sprint  UTC+1 (BST)
  { round: 9, track: 'Silverstone', country: 'Great Britain', tz: '+01:00', gpName: 'BRITISH GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-07-03T12:30:00+01:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-07-03T16:30:00+01:00' },
      { name: 'SPRINT RACE', date: '2026-07-04T12:00:00+01:00' },
      { name: 'GP QUALIFYING', date: '2026-07-04T16:00:00+01:00' },
      { name: 'GRAND PRIX', date: '2026-07-05T15:00:00+01:00' }
  ]},
  //Round 10: Belgium (Spa) Sprint UTC+2 (CEST) 
  { round: 10, track: 'Spa', country: 'Belgium', tz: '+02:00', gpName: 'BELGIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-07-17T12:30:00+02:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-07-17T16:30:00+02:00' },
      { name: 'SPRINT RACE', date: '2026-07-18T12:00:00+02:00' },
      { name: 'GP QUALIFYING', date: '2026-07-18T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-07-19T15:00:00+02:00' }
  ]},
  // Round 11: Hungary (Budapest) UTC+2 (CEST)
  { round: 11, track: 'Budapest', country: 'Hungary', tz: '+02:00', gpName: 'HUNGARIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-07-24T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-07-24T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-07-25T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-07-25T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-07-26T15:00:00+02:00' }
  ]},
  // Round 12: Netherlands (Zandvoort) UTC+2 (CEST)
  { round: 12, track: 'Zandvoort', country: 'Netherlands', tz: '+02:00', gpName: 'DUTCH GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-08-21T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-08-21T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-08-22T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-08-22T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-08-23T15:00:00+02:00' }
  ]},
  // Round 13: Italy (Monza)UTC+2 (CEST)
  { round: 13, track: 'Monza', country: 'Italy', tz: '+02:00', gpName: 'ITALIAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-09-04T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-09-04T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-09-05T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-09-05T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-09-06T15:00:00+02:00' }
  ]},
  // Round 14: Spain (Madrid street) UTC+2 (CEST)
  { round: 14, track: 'Madrid', country: 'Spain', tz: '+02:00', gpName: 'MADRID GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-09-11T12:30:00+02:00' },
      { name: 'FREE PRACTICE 2', date: '2026-09-11T16:00:00+02:00' },
      { name: 'FREE PRACTICE 3', date: '2026-09-12T12:30:00+02:00' },
      { name: 'QUALIFYING', date: '2026-09-12T16:00:00+02:00' },
      { name: 'GRAND PRIX', date: '2026-09-13T15:00:00+02:00' }
  ]},
  // Round 15: Azerbaijan (Baku) UTC+4
  { round: 15, track: 'Baku', country: 'Azerbaijan', tz: '+04:00', gpName: 'AZERBAIJAN GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-09-24T12:30:00+04:00' },
      { name: 'FREE PRACTICE 2', date: '2026-09-24T16:00:00+04:00' },
      { name: 'FREE PRACTICE 3', date: '2026-09-25T12:30:00+04:00' },
      { name: 'QUALIFYING', date: '2026-09-25T16:00:00+04:00' },
      { name: 'GRAND PRIX', date: '2026-09-26T15:00:00+04:00' }
  ]},
  // Round 16: Singapore UTC+8 (night race)
  { round: 16, track: 'Singapore', country: 'Singapore', tz: '+08:00', gpName: 'SINGAPORE GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-10-09T12:30:00+08:00' },
      { name: 'FREE PRACTICE 2', date: '2026-10-09T16:00:00+08:00' },
      { name: 'FREE PRACTICE 3', date: '2026-10-10T12:30:00+08:00' },
      { name: 'QUALIFYING', date: '2026-10-10T16:00:00+08:00' },
      { name: 'GRAND PRIX', date: '2026-10-11T15:00:00+08:00' }
  ]},
  // Round 17: USA (COTA Austin) Sprint UTC-5 (CDT)
  { round: 17, track: 'Austin', country: 'USA', tz: '-05:00', gpName: 'UNITED STATES GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-10-23T12:30:00-05:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-10-23T16:30:00-05:00' },
      { name: 'SPRINT RACE', date: '2026-10-24T12:00:00-05:00' },
      { name: 'GP QUALIFYING', date: '2026-10-24T16:00:00-05:00' },
      { name: 'GRAND PRIX', date: '2026-10-25T15:00:00-05:00' }
  ]},
  // Round 18: Mexico (Mexico City) UTC-6 (CST)
  { round: 18, track: 'Mexico City', country: 'Mexico', tz: '-06:00', gpName: 'MEXICO CITY GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-10-30T12:30:00-06:00' },
      { name: 'FREE PRACTICE 2', date: '2026-10-30T16:00:00-06:00' },
      { name: 'FREE PRACTICE 3', date: '2026-10-31T12:30:00-06:00' },
      { name: 'QUALIFYING', date: '2026-10-31T16:00:00-06:00' },
      { name: 'GRAND PRIX', date: '2026-11-01T15:00:00-06:00' }
  ]},
  // Round 19: Brazil (Sao Paulo) Sprint UTC-3 (BRT)
  { round: 19, track: 'Interlagos', country: 'Brazil', tz: '-03:00', gpName: 'SAO PAULO GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-11-06T12:30:00-03:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-11-06T16:30:00-03:00' },
      { name: 'SPRINT RACE', date: '2026-11-07T12:00:00-03:00' },
      { name: 'GP QUALIFYING', date: '2026-11-07T16:00:00-03:00' },
      { name: 'GRAND PRIX', date: '2026-11-08T15:00:00-03:00' }
  ]},
  // Round 20: Las Vegas UTC-8 (PST, night race)
  { round: 20, track: 'Las Vegas', country: 'USA', tz: '-08:00', gpName: 'LAS VEGAS GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-11-19T12:30:00-08:00' },
      { name: 'FREE PRACTICE 2', date: '2026-11-19T16:00:00-08:00' },
      { name: 'FREE PRACTICE 3', date: '2026-11-20T12:30:00-08:00' },
      { name: 'QUALIFYING', date: '2026-11-20T16:00:00-08:00' },
      { name: 'GRAND PRIX', date: '2026-11-21T15:00:00-08:00' }
  ]},
  // Round 21: Qatar (Lusail) Sprint UTC+3
  { round: 21, track: 'Lusail', country: 'Qatar', tz: '+03:00', gpName: 'QATAR GP',
    sessions: [
      { name: 'FREE PRACTICE 1', date: '2026-11-27T12:30:00+03:00' },
      { name: 'SPRINT QUALIFYING', date: '2026-11-27T16:30:00+03:00' },
      { name: 'SPRINT RACE', date: '2026-11-28T12:00:00+03:00' },
      { name: 'GP QUALIFYING', date: '2026-11-28T16:00:00+03:00' },
      { name: 'GRAND PRIX', date: '2026-11-29T15:00:00+03:00' }
  ]},
  // Round 22: Abu Dhabi UTC+4
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

// Track Wallpaper:

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

function applyTrackWallpaper(trackName) {
  const svg = document.getElementById('track-svg');
  if (!svg) return;
  const svgData = TRACK_SVGS[trackName] || TRACK_SVGS['Silverstone'];
  svg.innerHTML = svgData;
}

function initializeTrackWallpaper() {
  if (currentNextSession) {
    applyTrackWallpaper(currentNextSession.round.track);
  }
}

// Start OS screen

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

// Window management

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

// Window handling

function handleWindowTap(win) {
  bringToFront(win);
}

function addWindowTapHandling(win) {
  win.addEventListener('mousedown', () => handleWindowTap(win));
}

// Dragging windows:

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

// Window controls:

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

// Taskbar


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

// Welcome App: Explains each application in the OS to the user.


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


/* Application: Garage — A place where you can add cars with their specs and details. 
(Since this is a small probject I hard coded it instead of using a database.) */


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


//  Application: Add a car: Custom Build or Browse Collection


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


// Application: LIGHTS OUT — F1-style reaction time tester


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

// Boot up:

document.addEventListener('DOMContentLoaded', () => {
  initializeIgnition();

  // Track wallpaper — set to the circuit of the next session
  initializeTrackWallpaper();

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