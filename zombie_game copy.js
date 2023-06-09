var MedKit = { x: Math.random() * screen.width, y: Math.random() * screen.height, active: true, cooldown: 0, };
var songPause = false;
let themeSong = new Audio("./sounds/z.mp3");
var hunter = { x: 700, y: 400, speed: 7, size: 61, iframe: 0 };
let objectCenter = { x: 0, y: 0 };
var pauseCooldown = 0;
var zombies = [];
var hearts = 3;
var bulletCooldown = 0;
var bullets = [];
var score = 0;


// gör så att när du trycker på musen så skapas skott
function shootGun() {
  if (mouse.left && bulletCooldown === 0) {
    bullets.push({
      x: hunter.x + 30.5,
      y: hunter.y + 30.5,
      size: 7,
      color: "red",
      xMovement: (10 * (mouse.x - hunter.x)) / distance(hunter, mouse),
      yMovement: (10 * (mouse.y - hunter.y)) / distance(hunter, mouse),
    });
    bulletCooldown = 20;
  }

  if (bulletCooldown > 0) {
    bulletCooldown--;
  }
}
// kollar ifall ett object collidar med en bullet
function bulletsCollisionChecker(object, iValue) {
  objectCenter.x = object.x + 35;
  objectCenter.y = object.y + 35;
  if (bullets.length > 0) {
    for (var i = 0; i < bullets.length; i++) {
      if (
        distance(bullets[i].x, bullets[i].y, objectCenter.x, objectCenter.y) <=
        30.5
      ) {
        object.health -= 50;
        score += 3;
        // .splice används för att ta bort ett objekt från list. i är positionen i listan och 1 står för hur många objekt som ska tas bort
        bullets.splice(i, 1);
      }
    }
  }
  // fixar score system
  if (object.health <= 0) {
    object.health = 0;
    score += 7;
    zombies.splice(iValue, 1);
  }
}

hideMouse();
function distanceBetween(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}

function update() {
  clearScreen();
  text(canvas.width / 2 - 70, 50, 25, `score: ${Math.round(score)}`, "orange");
  score += 0.0333;

  if (songPause === false)
    if (keyboard.space && songPause === false && pauseCooldown === 0) {
      themeSong.play();
      themeSong.pause();
      themeSong.currentTime = 0;
      songPause = true;
      pauseCooldown = 20;
    }
  if (pauseCooldown > 0) {
    pauseCooldown--;
  }
  if (keyboard.space && songPause === true && pauseCooldown === 0) {
    themeSong.play();
  }

  picture(hunter.x, hunter.y, "images/hunter-left.png"); 

  if(MedKit.active === true){
    picture(MedKit.x, MedKit.y, "images/medkit red.png", 55, 55);
  }


  if (distanceBetween(MedKit, hunter) < 60 && MedKit.active === true){
    hearts++
    MedKit.active = false
    MedKit.cooldown = 150
  }
  if(MedKit.cooldown > 0){
    MedKit.cooldown--;
  }

  if(MedKit.active === false && MedKit.cooldown === 0){
    MedKit.active = true
  }

  for (var j = 0; j < zombies.length; j++) {
    if (distanceBetween(zombies[j], hunter) < 60 && hunter.iframe == 0) {
      hearts = hearts - 1;
      hunter.iframe = 15;
    }
  }
  // heart image
  for (var i = 0; i < hearts; i++) {
    picture(40 + i * 25, 40, "images/heart.png");
  }

  if (hunter.iframe > 0) {
    hunter.iframe--;
  }

  shootGun();

  for (var i = 0; i < bullets.length; i++) {
    rectangle(
      bullets[i].x,
      bullets[i].y,
      bullets[i].size,
      bullets[i].size,
      bullets[i].color
    );
    bullets[i].x += bullets[i].xMovement;
    bullets[i].y += bullets[i].yMovement;
  }

  // update hunter position
  if (keyboard.d || keyboard.right) {
    hunter.x += hunter.speed;
    /*hunter.direction = "d"; // update direction to right*/
  }
  if (keyboard.a || keyboard.left) {
    hunter.x -= hunter.speed;
    /*hunter.direction = "a"; // update direction to left*/
  }
  if (keyboard.w || keyboard.up) {
    hunter.y -= hunter.speed;
    /* hunter.direction = "w"; // update direction to up*/
  }
  if (keyboard.s || keyboard.down) {
    hunter.y += hunter.speed;
    /*hunter.direction = "s"; // update direction to down*/
  }

  //Spawn up to 5 zombies
  if (zombies.length < 5 && Math.random() < 0.05) {
    var newZombie = {
      x: Math.random() * screen.width,
      y: Math.random() * screen.height,
      speed: Math.random() * 5 + 1, // Random speed between 1 and 5
      health: 100,
    };
    while (distanceBetween(newZombie, hunter) < 200) {
      newZombie = {
        x: Math.random() * screen.width,
        y: Math.random() * screen.height,
        speed: Math.random() * 4 + 1,
        health: 100,
      };
    }
    zombies.push(newZombie);
  }

  //Draw zombies
  for (var i = 0; i < zombies.length; i++) {
    picture(zombies[i].x, zombies[i].y, "images/zombie.png", 50, 50);
    rectangle(
      zombies[i].x,
      zombies[i].y - 15,
      (50 * zombies[i].health) / 100,
      5,
      "red"
    );
    // Move zombie
    var angle = Math.atan2(hunter.y - zombies[i].y, hunter.x - zombies[i].x);
    zombies[i].x += Math.cos(angle) * zombies[i].speed;
    zombies[i].y += Math.sin(angle) * zombies[i].speed;
  }
  // When die 
  if (hearts < 1) {
    hearts === 0;
    themeSong.pause();
    text(500, 300, 50, "Game Over!", "red");
    stopUpdate();
  }

  for (var i = 0; i < zombies.length; i++) {
    bulletsCollisionChecker(zombies[i], i);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
