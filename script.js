const player = document.getElementById('playerCar');
const aiCars = [
  document.getElementById('aiCar1'),
  document.getElementById('aiCar2'),
];

const lapCounter = document.getElementById('lapCounter');

let playerPos = { x: 1000, y: 1000, angle: 0 };
const keys = {};

const trackCenter = 1000;
const trackRadius = 900;

const aiPaths = [
  [
    { x: 1000, y: 1000 },
    { x: 1300, y: 1000 },
    { x: 1300, y: 1300 },
    { x: 1000, y: 1300 },
    { x: 700, y: 1300 },
    { x: 700, y: 1000 },
    { x: 700, y: 700 },
    { x: 1000, y: 700 },
  ],
  [
    { x: 1100, y: 1100 },
    { x: 1350, y: 1100 },
    { x: 1350, y: 1350 },
    { x: 1100, y: 1350 },
    { x: 850, y: 1350 },
    { x: 850, y: 1100 },
    { x: 850, y: 850 },
    { x: 1100, y: 850 },
  ],
];

// AI car data
const aiData = [
  { pos: { x: 1000, y: 1000 }, path: aiPaths[0], index: 0, speed: 1.5 },
  { pos: { x: 1100, y: 1100 }, path: aiPaths[1], index: 0, speed: 1.2 },
];

let lap = 0;
let passedStart = false;

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

function moveCar(pos, angle, speed, turnSpeed) {
  angle += (keys['a'] ? -turnSpeed : 0) + (keys['d'] ? turnSpeed : 0);

  // Calculate new position
  let rad = (angle * Math.PI) / 180;
  if (keys['w']) {
    pos.x += Math.sin(rad) * speed;
    pos.y -= Math.cos(rad) * speed;
  }
  if (keys['s']) {
    pos.x -= Math.sin(rad) * speed * 0.6;
    pos.y += Math.cos(rad) * speed * 0.6;
  }
  return { pos, angle };
}

function update() {
  // Move player
  let result = moveCar(playerPos, playerPos.angle, 4, 3);
  playerPos = result.pos;
  playerPos.angle = result.angle;

  // Update player style
  player.style.transform = `translate3d(${playerPos.x - 60}px, ${playerPos.y - 30}px, 0) rotateZ(${playerPos.angle}deg)`;

  // Move AI cars along paths
  aiData.forEach((car, i) => {
    let target = car.path[car.index];
    let dx = target.x - car.pos.x;
    let dy = target.y - car.pos.y;
    let dist = Math.hypot(dx, dy);
    if (dist < 5) {
      car.index = (car.index + 1) % car.path.length;
      target = car.path[car.index];
    }
    let angle = Math.atan2(dy, dx);
    car.pos.x += Math.cos(angle) * car.speed;
    car.pos.y += Math.sin(angle) * car.speed;
    aiCars[i].style.transform = `translate3d(${car.pos.x - 60}px, ${car.pos.y - 30}px, 0) rotateZ(${angle * 180 / Math.PI}deg)`;
  });

  // Camera follow track
  const track = document.getElementById('track');
  track.style.transform = `translate3d(calc(50% - ${playerPos.x}px), calc(50% - ${playerPos.y}px), 0)`;

  // Lap counting based on crossing start line
  if (
    playerPos.x > 980 && playerPos.x < 1020 &&
    playerPos.y > 950 && playerPos.y < 1050
  ) {
    if (!passedStart) {
      lap++;
      lapCounter.textContent = `Lap: ${lap}`;
      passedStart = true;
    }
  } else {
    passedStart = false;
  }

  requestAnimationFrame(update);
}

update();


