let carType = 'lambo';
let car, carX = 500, carY = 500, angle = 0, keys = {};
let aiCars = [];
let lap = 0, passedLine = false;
let difficulty = 'easy';

const aiPaths = [
  [ {x: 600, y: 600}, {x: 600, y: 300}, {x: 900, y: 300}, {x: 900, y: 600} ],
  [ {x: 400, y: 400}, {x: 400, y: 700}, {x: 700, y: 700}, {x: 700, y: 400} ]
];

const difficultySettings = {
  easy: { speed: 1.2 },
  medium: { speed: 2.2 },
  hard: { speed: 3.5 }
};

function selectCar(type) {
  carType = type;
}

function startGame(diff) {
  difficulty = diff;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  car = document.getElementById('playerCar');
  car.classList.add(carType);

  aiCars = [
    { el: document.getElementById('aiCar1'), path: aiPaths[0], index: 0, x: 600, y: 600 },
    { el: document.getElementById('aiCar2'), path: aiPaths[1], index: 0, x: 400, y: 400 }
  ];

  document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  update();
}

function update() {
  requestAnimationFrame(update);

  if (keys['a']) angle -= 3;
  if (keys['d']) angle += 3;

  const rad = angle * Math.PI / 180;
  const speed = keys['w'] ? 5 : keys['s'] ? -3 : 0;

  carX += Math.sin(rad) * speed;
  carY -= Math.cos(rad) * speed;

  car.style.left = carX + "px";
  car.style.top = carY + "px";
  car.style.transform = `rotateZ(${angle}deg)`;

  const aiConfig = difficultySettings[difficulty];
  aiCars.forEach(ai => {
    const target = ai.path[ai.index];
    const dx = target.x - ai.x;
    const dy = target.y - ai.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 10) ai.index = (ai.index + 1) % ai.path.length;
    else {
      const angleRad = Math.atan2(dy, dx);
      ai.x += Math.cos(angleRad) * aiConfig.speed;
      ai.y += Math.sin(angleRad) * aiConfig.speed;
      ai.el.style.left = ai.x + "px";
      ai.el.style.top = ai.y + "px";
      ai.el.style.transform = `rotateZ(${angleRad * 180 / Math.PI}deg)`;
    }
  });

  // Track camera
  const track = document.getElementById('track');
  track.style.left = 500 - carX + "px";
  track.style.top = 500 - carY + "px";

  // Lap counter
  if (carY < 510 && carY > 490 && carX > 500 && carX < 700) {
    if (!passedLine) {
      lap++;
      passedLine = true;
      document.getElementById('lapCounter').innerText = "Lap: " + lap;
    }
  } else {
    passedLine = false;
  }
}
