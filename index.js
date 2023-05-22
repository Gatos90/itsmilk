// The following line gets the canvas element from the document
const canvas = document.querySelector("canvas");

// The following line gets a 2D rendering context for the canvas
const c = canvas.getContext("2d");

// Set the width and height of the canvas
canvas.width = 64 * 16;
canvas.height = 64 * 9;

let parsedCollisions;
let collisionBlocks;
let background;
let doors;



// Create a new instance of the Player class
const player = new Player({
    imageSrc: "./img/king/idle.png",
    frameRate: 11,
    animations: {
      idleRight: {
        frameRate: 11,
        frameBuffer: 2,
        loop: true,
        imageSrc: "./img/king/idle.png",
      },
      idleLeft: {
        frameRate: 11,
        frameBuffer: 2,
        loop: true,
        imageSrc: "./img/king/idleLeft.png",
      },
      runRight: {
        frameRate: 8,
        frameBuffer: 4,
        loop: true,
        imageSrc: "./img/king/runRight.png",
      },
      runLeft: {
        frameRate: 8,
        frameBuffer: 4,
        loop: true,
        imageSrc: "./img/king/runLeft.png",
      },
      enterDoor: {
        frameRate: 8,
        frameBuffer: 4,
        loop: false,
        imageSrc: "./img/king/enterDoor.png",
        onComplete: () => {
          console.log("completed animation");
          gsap.to(overlay, {
            opacity: 1,
            onComplete: () => {
              level++;
  
              if (level === 4) level = 1;
              levels[level].init();
              player.switchSprite("idleRight");
              player.preventInput = false;
              gsap.to(overlay, {
                opacity: 0,
              });
            },
          });
        },
      },
    },
  });


let level = 3
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      if (player.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel1.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 767,
            y: 270,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      player.position.x = 96
      player.position.y = 140

      if (player.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel2.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 772.0,
            y: 336,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      player.position.x = 750
      player.position.y = 230
      if (player.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel3.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 176.0,
            y: 335,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
}



// Declare variables `msPrev`, `fps`, `msPerFrame` and `frames`
let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;
let frames = 0;

const overlay = {
  opacity: 0,
};

// Define the `animate()` function to animate the game scene
function animate() {
  // Call the `animate()` function recursively using requestAnimationFrame()
  window.requestAnimationFrame(animate);

  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  // If time passed between the current frame and the previous frame is less than the desired frame rate, return
  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  msPrev = msNow - excessTime;

  // Clear the canvas with white color in each frame

  background.draw();


  doors.forEach((collisionBlock) => {
    collisionBlock.draw();
  });

  // Draw and update the player object in each frame of the animation
  player.draw();
  player.update();

  // Check which keys are pressed and call the corresponding functions
  if (keys.w.isPressed) jump();
  if (keys.a.isPressed && keys.d.isPressed) {
    stopMovement();
  } else if (keys.a.isPressed) moveLeft();
  else if (keys.d.isPressed) moveRight();

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
  frames++;
}

// Log the number of frames per second in the console every second using the `setInterval()` method
setInterval(() => {
  console.log(frames);
}, 1000);

levels[level].init()
// Call the `animate()` function to start the animation loop
animate();
