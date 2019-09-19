// import {selectElement} from '../utils/domSelectors';

const ELEMENT_SELECTORS = {
  CANVAS_ID: '#snake',
};

const DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
};

const selectElement = elementSelector =>
  document.querySelector (elementSelector);

const canvas = selectElement (ELEMENT_SELECTORS.CANVAS_ID);
const ctx = canvas.getContext ('2d');
let gameInterval = null;

const snakeSegementOffset = 11;
let snakeBody = [];
let snakeLength = 3;
let snakeDx = 1;
let snakeDy = 0;
let snakeDirection = DIRECTION.RIGHT;
let snakeX = canvas.width / 2;
let snakeY = canvas.height / 2;

const createSquare = (
  context,
  {xCord = 20, yCord = 40, width = 10, height = 10, colour = '#FF0000'} = {}
) => {
  context.beginPath ();
  context.rect (xCord, yCord, width, height);
  context.fillStyle = colour;
  context.fill ();
  context.closePath ();
};

const draw = () => {
  ctx.clearRect (0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snakeLength; i++) {
    // const direction = snakeDirection === DIRECTION.RIGHT
    createSquare (ctx, {
      xCord: snakeX - snakeSegementOffset * i,
      yCord: snakeY,
    });
  }

  snakeX += snakeDx;
  snakeY += snakeDy;
};

gameInterval = setInterval (draw, 10);
