const canvas = document.querySelector ('#brickBracker');
const ctx = canvas.getContext ('2d');

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

const createBall = (context, {x, y}) => {
  context.beginPath ();
  context.arc (x, y, 10, 0, Math.PI * 2);
  context.fillStyle = '#0095DD';
  context.fill ();
  context.closePath ();
};

const buildBall = context => {
  // draw the ball
  let dx = 2;
  let dy = -2;
  let x = canvas.width / 2;
  let y = canvas.height - 30;

  const draw = () => {
    context.clearRect (0, 0, canvas.width, canvas.height);
    createBall (context, {x, y});
    x += dx;
    y += dy;
  };

  //animate the ball
  setInterval (draw, 10);
};

buildBall (ctx);
