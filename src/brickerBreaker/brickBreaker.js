const ELEMENT_SELECTOR = {
  USER_LIVES: 'user-life-count',
  USER_SCORE: 'user-score',
  CANVAS_ID: 'brickBreaker',
};
//
const canvas = document.querySelector (`#${ELEMENT_SELECTOR.CANVAS_ID}`);
const ctx = canvas.getContext ('2d');

// brick vars
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 10;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

// draw the ball
const ballRadius = 10;
let dx = 1;
let dy = -5;
let x = canvas.width / 2;
let y = canvas.height - 30;

// paddle vars
const paddleHeight = 10;
const paddleOffSet = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const user = {
  lives: 5,
  score: 0,
  paddleHits: 0,
};
let gameInterval = null;
let keyPressed = null;

const KEYNUM = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const BRICK_TYPE = {
  NORMAL: {type: 0, points: 10},
  INDESTRUCTIBLE: 1,
};

const updateLifeCounter = () => {
  document.querySelector (`#${ELEMENT_SELECTOR.USER_LIVES}`).innerHTML =
    user.lives;
};

const updateScoreCounter = () => {
  document.querySelector (`#${ELEMENT_SELECTOR.USER_SCORE}`).innerHTML =
    user.score;
};

const addDynamicElements = () => {
  updateLifeCounter ();
  updateScoreCounter ();
};

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

const gridSetup = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {x: 0, y: 0, status: 1, type: BRICK_TYPE.NORMAL.type};
    }
  }
};

const drawBricks = context => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        createSquare (context, {
          xCord: brickX,
          yCord: brickY,
          width: brickWidth,
          height: brickHeight,
          colour: '#0095DD',
        });
      }
    }
  }
};

const brickCollisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          if (b.type === BRICK_TYPE.NORMAL.type) {
            b.status = 0;
            user.score += BRICK_TYPE.NORMAL.points;
          }
        }
      }
    }
  }
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

const setupGame = context => {
  let colour = '#0095DD';

  const draw = () => {
    if (keyPressed === KEYNUM.LEFT && paddleX > paddleOffSet) {
      paddleX += -7;
    } else if (
      keyPressed === KEYNUM.RIGHT &&
      paddleX < canvas.width - (paddleWidth + paddleOffSet)
    ) {
      paddleX += 7;
    }

    // if hit left then reverse or if hit right reverse
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
      colour = randColour ();
    }

    // if hit top wall reverse
    if (y + dy < ballRadius) {
      dy = -dy;
      colour = randColour ();
      // if hit bottom lose life
    } else if (
      y + dy >
      canvas.height - (ballRadius + paddleHeight + paddleOffSet)
    ) {
      if (x > paddleX && x < paddleX + (paddleWidth + 40)) {
        console.log (`BALL coords: X: ${x}, Y: ${y}, DX: ${dx}, DY: ${dy}`);
        console.log (`PADDLE X: ${paddleX} width: ${paddleWidth}`);
        const ballOnPaddleLocation = x - paddleX;
        const paddleLeft = paddleWidth / 3;
        const paddleCentre = paddleLeft * 2;
        // When ball hits left side of paddle
        if (ballOnPaddleLocation < paddleLeft) {
          dy = -dy;
          dx = -Math.abs (-dx);
          // When ball hits centre of paddle
        } else if (
          ballOnPaddleLocation > paddleLeft &&
          ballOnPaddleLocation < paddleCentre
        ) {
          dy = -dy;
          dx = 1;
          // when ball hits right side of paddle
        } else if (
          ballOnPaddleLocation > paddleCentre &&
          ballOnPaddleLocation <= paddleWidth
        ) {
          dy = -dy;
          dx = +Math.abs (+dx);
        }
      } else {
        y = canvas.height / 3;
        x = canvas.width / 2;
        --user.lives;
        if (user.lives <= 0) {
          clearInterval (gameInterval);
        }
      }
    }

    context.clearRect (0, 0, canvas.width, canvas.height);
    drawBricks (context);
    createBall (context, {x, y, ballRadius, colour});
    createSquare (context, {
      xCord: paddleX,
      yCord: canvas.height - (paddleHeight + 20),
      width: paddleWidth,
      height: paddleHeight,
      colour: '#0095DD',
    });
    brickCollisionDetection ();
    x += dx;
    y += dy;
    addDynamicElements ();
  };

  //animate the ball
  gameInterval = setInterval (draw, 10);
};

const createEventListeners = () => {
  const keyDownHandler = e => {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
      keyPressed = KEYNUM.RIGHT;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
      keyPressed = KEYNUM.LEFT;
    }
  };
  const keyUpHandler = e => {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
      keyPressed = null;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
      keyPressed = null;
    }
  };
  document.addEventListener ('keydown', keyDownHandler, false);
  document.addEventListener ('keyup', keyUpHandler, false);
};

createEventListeners ();
gridSetup ();
setupGame (ctx);
