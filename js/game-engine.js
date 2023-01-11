//=================================================================================
/*
 * Script: Flappy Bird Game
 */
//================================================================================

/* CONSTANTS AND ELEMENTS REFERENCES */
const gravity = 0.3;
const pointsPerPipe = 10;
const pipeGap = 35;

const backgroundProps = document.querySelector('.bg-img').getBoundingClientRect();

const counterValue = document.querySelector('.counter-value');

const counterLabel = document.querySelector('.counter-label');

const stateInfo = document.querySelector('.state-info');

const stateInfoTitle = document.querySelector('.state-info-title');

const bird = document.querySelector('.bird');

let birdProps = bird.getBoundingClientRect();


/* GAME STATE VARIABLES */
let gameSpeed = 6;

var isGameRunning = false;

const initializeGame = () => {
  bird.style.top = '45vh';
  document.querySelectorAll('.pipe').forEach((e) => { e.remove(); });
  isGameRunning = true;
  stateInfo.innerHTML = '';
  stateInfoTitle.innerHTML = ''
  counterLabel.innerHTML = 'Pontuação : ';
  counterValue.innerHTML = '00';
  runGame();
}

// Listening to key press
document.addEventListener('keydown', (e) => {
  // if Enter pressed and the game stopped.. start the game
  if (!isGameRunning && e.key == 'Enter') {
    initializeGame()
  }
});

const runGame = () => {

  const move = () => {
    // If the game is not running. leave the function
    if (!isGameRunning) return;

    // Getting reference to all the pipe elements
    const pipes = document.querySelectorAll('.pipe');

    pipes.forEach((element) => {

      let pipeProps = element.getBoundingClientRect();
      birdProps = bird.getBoundingClientRect();

      // Delete the pipes if they have moved out of the screen hence saving memory
      if (pipeProps.right <= 0) {

        element.remove();

      } else {
        // Collision detection with bird and pipes
        if (
          birdProps.left < pipeProps.left + pipeProps.width
          && birdProps.left + birdProps.width > pipeProps.left
          && birdProps.top < pipeProps.top + pipeProps.height
          && birdProps.top + birdProps.height > pipeProps.top
        ) {
          // Change game state and end the game if collision occurs
          isGameRunning = false;
          stateInfo.innerHTML = 'Pressiona Enter para voltar a jogar';
          return;

        } else {
          // Increase the score if player  has the successfully dodged the pip
          if (
            pipeProps.right < birdProps.left
            && pipeProps.right + gameSpeed >= birdProps.left
            && element.increaseScore == pointsPerPipe
          ) {
            counterValue.innerHTML = +counterValue.innerHTML + pointsPerPipe;
          }

          element.style.left = pipeProps.left - gameSpeed + 'px';
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);


  let birdPositionY = 0;

  const enforceGravity = () => {
    if (!isGameRunning) return;

    birdPositionY = birdPositionY + gravity;

    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird.src = '../assets/bird-up.png'
        birdPositionY = -5.6;
        setTimeout(() => {
          bird.src = '../assets/bird-down.png'
        }, 15);
      }
    });

    birdProps = bird.getBoundingClientRect();

    // Collision detection with bird and window top and bottom
    if (birdProps.top <= 0 || birdProps.bottom >= backgroundProps.bottom) {
      isGameRunning = false;
      stateInfo.innerHTML = 'Pressiona Enter para voltar a jogar';
      return;
    }
    bird.style.top = birdProps.top + birdPositionY + 'px';
    birdProps = bird.getBoundingClientRect();

    requestAnimationFrame(enforceGravity);
  }
  requestAnimationFrame(enforceGravity);


  let pipeSeparation = 0;

  const createPipe = () => {
    if (!isGameRunning) return;

    // Create another set of pipes
    // if distance between two pipe has exceeded a predefined value
    if (pipeSeparation > 115) {
      pipeSeparation = 0
      const pipePositionY = Math.floor(Math.random() * 43) + 8;

      // Create bottom Pipe
      const pipe = document.createElement('img');
      pipe.className = 'pipe';
      pipe.src = '../assets/pipe-bottom.png';
      pipe.style.top = `${pipePositionY + pipeGap}vh`;

      document.body.appendChild(pipe);

      // Create top Pipe
      const pipeInverted = document.createElement('img');
      pipeInverted.className = 'pipe';
      pipeInverted.src = '../assets/pipe-top.png';
      pipeInverted.style.top = `${pipePositionY - 70}vh`;
      document.body.appendChild(pipeInverted);

      pipe.increaseScore = pointsPerPipe;
    }

    pipeSeparation++;

    requestAnimationFrame(createPipe);
  }
  requestAnimationFrame(createPipe);
}
