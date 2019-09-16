const canvas = document.querySelector ('#brickBracker');
const ctx = canvas.getContext ('2d');

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor (Math.random () * (max - min + 1) + min);
};

const createSquare = (
  context,
  {xCord = 20, yCord = 40, width = 50, height = 50, colour = '#FF0000'} = {}
) => {
  context.beginPath ();
  context.rect (xCord, yCord, width, height);
  context.fillStyle = colour;
  context.fill ();
  context.closePath ();
};

const createBall = (context, {x, y, ballRadius, colour = '#0095DD'}) => {
  context.beginPath ();
  context.arc (x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = colour;
  context.fill ();
  context.closePath ();
};

const randColour = () => {
  const num = randomIntFromInterval (1, 6);
  switch (num) {
    case 1:
      return '#0095DD';
    case 2:
      return '#0000ff';
    case 3:
      return '#ff3300';
    case 4:
      return '#6600ff';
    case 5:
      return '#33cc00';
    default:
      return '#000';
  }
};

const buildBall = context => {
  // draw the ball
  const ballRadius = 10;
  let dx = 1;
  let dy = -5;
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let colour = '#0095DD';

  const draw = () => {
    // if hit top wall reverse or if hits bottom reverse
    if (y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
      dy = -dy;
      colour = randColour ();
    }
    // if hit left then reverse or if hit right reverse
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
      colour = randColour ();
    }
    context.clearRect (0, 0, canvas.width, canvas.height);
    createBall (context, {x, y, ballRadius, colour});
    x += dx;
    y += dy;
  };

  //animate the ball
  setInterval (draw, 10);
};

buildBall (ctx);
