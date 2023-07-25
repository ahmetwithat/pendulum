let soundLib = [
  /*1*/ './assets/sounds/mp3/d-3.mp3',
  /*2*/ './assets/sounds/mp3/f3.mp3',
  /*3*/ './assets/sounds/mp3/f-3.mp3',
  /*4*/ './assets/sounds/mp3/g-3.mp3',
  /*5*/ './assets/sounds/mp3/a-4.mp3',
  /*6*/ './assets/sounds/mp3/c4.mp3',
  /*7*/ './assets/sounds/mp3/d4.mp3',
  /*8*/ './assets/sounds/mp3/d-4.mp3',
  /*9*/ './assets/sounds/mp3/f4.mp3',
  /*10*/ './assets/sounds/mp3/f-4.mp3',
].reverse()

let PLANE_WIDTH = 300;
let NUMBER_OF_DOTS = 9;
let DISTANCE_BETWEEN_NODES = 15;
let BASE_VELOCITY = 0.015;
let VELOCITY_DIFF = 0.0005;
const pendulumDiv = document.getElementById('pendulum');

let dotProperties = {
  r : [],
  v: [],
  prevV: [],
  sound: []
};
initDotProperties();
const plane = document.getElementById('plane');
plane.style.width = toCSSpx(PLANE_WIDTH+10);

let origin = {x : plane.getBoundingClientRect().left+(PLANE_WIDTH/2), y : plane.getBoundingClientRect().top+1
};

let dots = makeDots(NUMBER_OF_DOTS);
placeDotsInitial(dots);

let startTime;
document.getElementById('play').addEventListener('click', () => {
  startTime = new Date();
  animatePendulum();
});


function animatePendulum() {
  let currentTime = new Date();
  let elapsedTime = Math.floor((currentTime - startTime)/10);
  for (let i = 0; i < NUMBER_OF_DOTS; i++) {
    animateDot(i, dots[i], 
      dotProperties.prevV[i], 
      dotProperties.v[i],
      elapsedTime,
      dotProperties.r[i]);
  }

  window.requestAnimationFrame(animatePendulum);
}

console.log(dotProperties)

function animateDot(dotindex, dot, prevV, v, elapsedTime, r) {
  let angle = (Math.PI + (v * elapsedTime)) % (Math.PI * 2);
  if (angle < Math.PI) {
    v = -v;
  }
  if (prevV * v < 0) {
    dotProperties.sound[dotindex].play();
  }
  angle = (Math.PI + (v * elapsedTime)) % (Math.PI * 2);

  dotProperties.prevV[dotindex] = v;
  let dotX = Math.cos(angle) * r + origin.x;
  let dotY = Math.sin(angle) * r + origin.y - 10;

  dot.style.left = toCSSpx(dotX);
  dot.style.top = toCSSpx(dotY);
}



function placeDotsInitial(dots) {
  for (let i = 0; i < dots.length; i++) {
    dots[i].style.left = toCSSpx(origin.x - PLANE_WIDTH / 2 + DISTANCE_BETWEEN_NODES * i);
    dotProperties.r[i] = PLANE_WIDTH / 2 - DISTANCE_BETWEEN_NODES * i;
    dots[i].style.top = toCSSpx(origin.y - 10);
  }
}

function makeDots (number) {
  let dotArray = [];
  for (let i = 0; i < number; i++){
    dotArray[i] = document.createElement('span');
    dotArray[i].setAttribute('class', 'dot');
    dotArray[i].setAttribute('id', 'dot-' + i.toString());
    pendulumDiv.appendChild(dotArray[i]);
  }
  return dotArray;
}

function initDotProperties () {
  for (let i = 0; i < NUMBER_OF_DOTS; i++) {
    dotProperties.v[i] = BASE_VELOCITY + VELOCITY_DIFF * i; 
    dotProperties.prevV[i] = BASE_VELOCITY + VELOCITY_DIFF * i; 
    let naudio = new Audio(soundLib[i]);
    dotProperties.sound[i] = naudio;
  } 
}


function toCSSpx (value) {
  return value.toString() + 'px';
}