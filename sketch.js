var PLAY = 1;
var END = 0;
var gameState = PLAY;


var trex,trex_running;
var ground,groundImage;
var invisibleGround;
var cloudImage;
var obstacle1Image;
var obstacle2Image;
var obstacle3Image;
var obstacle4Image;
var obstacle5Image;
var obstacle6Image;
var trex_collided;
var gameOver,gameOverImage;
var restart,restartImage;

var obstaclesGroup;
var cloudsGroup;

var score;

var jumpSound;
var checkPointSound;
var dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1Image = loadImage("obstacle1.png");
  obstacle2Image =  loadImage("obstacle2.png");
  obstacle3Image = loadImage("obstacle3.png");
  obstacle4Image = loadImage("obstacle4.png");
  obstacle5Image = loadImage("obstacle5.png");
  obstacle6Image = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  trex = createSprite(50,height-40,20,10);
  trex.addAnimation("running",trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided",trex_collided);
  
  ground = createSprite(width/2,height-40,600,10);
  ground.addImage(groundImage);
  
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  score = 0;
  
  trex.setCollider("rectangle",0,0,40,40);
  
  gameOver = createSprite(width/2,height/3,100,10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.7;
  
  restart = createSprite(width/2,height/2,10,20);
  restart.addImage(restartImage);
  restart.scale = 0.7;
  

}

function draw(){
  background("skyBlue");
  if(gameState===PLAY){
    if((touches.length>0||keyDown("space"))&&trex.y>=height-100){
    trex.velocityY = -10;
      jumpSound.play();
      touches = [];
  }
      spawnClouds();
  spawnObstacles();
    
    gameOver.visible = false;
    restart.visible = false;
    
  score = score+Math.round(getFrameRate()/60);
    
    
    ground.velocityX = -(5+3*score/100);
      
  if(ground.x<0){
    ground.x = ground.width/2;
  }
  }
  else if(gameState === END){
    trex.velocityY = 0;
    ground.velocityX = 0;
    
    gameOver.visible = true;
    restart.visible = true;
    
  }

  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    trex.changeAnimation("collided",trex_collided);
  }
  
  textSize(20)
  text("score:"+score,50,30);
  trex.velocityY = trex.velocityY+0.8;
 trex.collide(invisibleGround);
if(score%100 === 0){
checkPointSound.play();
}
  if(mousePressedOver(restart)){
    reset();
  }
  drawSprites();
  
  
  
}

function spawnClouds(){
  if(frameCount % 60 === 0){
    var cloud = createSprite(width-10,height/2,10,20);
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -5;
    cloud.lifetime = 400;
    cloud.y = Math.round(random(height/4,height-20));
    cloudsGroup.add(cloud)
  }
}

function spawnObstacles(){
  if(frameCount % 120 === 0){
    var obstacle = createSprite(width,height-55,10,20);
    obstacle.velocityX = -(6+3*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1Image);
        break;
        
        case 2: obstacle.addImage(obstacle2Image);
        break;
        
        case 3: obstacle.addImage(obstacle3Image);
        break;
        
        case 4: obstacle.addImage(obstacle4Image);
        break;
        
        case 5: obstacle.addImage(obstacle5Image);
        break;
        
        case 6: obstacle.addImage(obstacle6Image);
        break;
        
        default: break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  score = 0;
}