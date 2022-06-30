var PLAY = 1;
var END = 0;
var gameState = PLAY;

var road, roadImage;
var flappyBird, flyingBird, collidedBird;
var invisibleGround;

var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score;

var gameOverImg, gameOver, restart, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload() {
  flyingBird = loadImage("flyingBird.gif");
  collidedBird = loadImage("collidingBird.png");
  
  roadImage = loadImage("road.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  // jumpSound = loadSound("jump.mp3");
  // checkPointSound = loadSound("checkPoint.mp3");
  // dieSound = loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  road = createSprite(width/2,height/2,width,height);
  road.addImage(roadImage);

  gameOver = createSprite(width/2,height/2-150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.9;

  restart = createSprite(width/2,height/2-30);
  restart.addImage(restartImg);
  restart.scale = 0.8;

  invisibleGround = createSprite(width/2,height,width,160);
  invisibleGround.visible = false;

  flappyBird = createSprite(300,550,30,40);
  flappyBird.addAnimation("flying", flyingBird);
  flappyBird.addImage("collided", collidedBird);
  flappyBird.scale = 0.285;

  obstaclesGroup = new Group();

  flappyBird.setCollider("circle",0,0,20);
  flappyBird.debug = false;

  score = 0;
}

function draw() {
  background(180);
 
  text("Score: "+ score, width-150,height/2-200);

  if(gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;

    road.velocityX = -(3 + score/100);

    score = score + Math.round(frameCount/200);

    if(score % 100 == 0) {
      // checkPointSound.play();
    }

    if(road.x < 480) {
      road.x = road.width/2;
    }

    if(keyDown("space")) {
      flappyBird.velocityY = -16;
      // jumpSound.play();
    }

    flappyBird.velocityY = flappyBird.velocityY + 0.8;

    spawnObstacles();

    if(obstaclesGroup.isTouching(flappyBird)) {
      gameState = END;
      // dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    road.velocityX = 0;
    flappyBird.velocityY = 0;

    flappyBird.changeImage("collided",collidedBird);
    flappyBird.scale = 0.03;

    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
  }

  if(mousePressedOver(restart)) {
    reset();
  }

  //flappyBird.collide(invisibleGround);

  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width+10,height-95,10,30);
    obstacle.velocityX = -(5 + score/100);

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }

    obstacle.scale = 0.2;
    obstacle.lifetime = 350;

    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  flappyBird.changeImage("flying", flyingBird);
  flappyBird.scale = 0.285;
}
