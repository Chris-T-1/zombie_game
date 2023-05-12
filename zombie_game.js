var hunter = {x:700, y:400, speed: 5};
var zombies = [];
var gun = {x: hunter.x, y: hunter.y,};
var maxZombies = 5;
var attackCooldown = 500;  //1 sekund
var healthBar = 100;
let hunterIMG = './.png/hunter-left.png';



function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
//dom här 2 är för roteringen av "gun"
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

/* Add a "Gun" object to the code
var gun = {x: hunter.x + 20, y: hunter.y - 40,};*/ 

hideMouse();


function togglePause() {
    if (!isPaused) {
        // Pause the game logic here
        isPaused = true;
    } else {
        // Resume the game logic here
        isPaused = false;
    }
}

/* domhär är för roteringen av "gun" */
function setTransform(degrees, x, y) {
var radians = degrees * Math.PI / 180;
ctx.setTransform(Math.cos(radians), Math.sin(radians), -Math.sin(radians), Math.cos(radians), x, y);
} 

function spawnZombie() {
    // Create new zombie with random position and speed
    var newZombie = {x: Math.floor(Math.random() * 1200), y: Math.floor(Math.random() * 800), speed: Math.floor(Math.random() * 4) + 1, canAttack: true};
    // Check if zombie is too close to the hunter
    if (distance(hunter, newZombie) > 100) {
        zombies.push(newZombie);
    } else {
        spawnZombie(); // Try again if too close
    }
}
var isPaused = false;

function update() {
    if (keyboard.p) {
        delay(7000).then(() => console.log('ran after 1 second1 passed'));
        togglePause();
        text(450, 300, 40, "Press P to start!", "Black");
    };
    //if (!isPaused) {
    //    if (keyboard.p) {
    //    togglePause();
    //    text(450, 300, 40, "Press P to start!", "Black");
    //};
        clearScreen();
        fill("grey");

        circle(hunter.x, hunter.y, 30, "brown");
        /* rectangle(hunter.x+13, hunter.y-50, 20, 40, "black") */

        if (keyboard.d) hunter.x += 5;
        if (keyboard.a) hunter.x -= 5;
        if (keyboard.w) hunter.y -= 5;
        if (keyboard.s) hunter.y += 5;

        // Spawn new zombies if maximum number not reached
        if (zombies.length < maxZombies) {
            spawnZombie();
        }

        for (var i = 0; i < zombies.length; i++) {
            var zombie = zombies[i];
            circle(zombie.x, zombie.y, 20, "green");
            if (zombie.x < hunter.x) {
                zombie.x += zombie.speed;
            } else {
                zombie.x -= zombie.speed;
            }
            if (zombie.y < hunter.y) {
                zombie.y += zombie.speed;
            } else {
                zombie.y -= zombie.speed;
            }
            // apply damage ability to all zombies
            for (var j = 0; j < zombies.length; j++) {
                var zombie2 = zombies[j];
                if (distance(hunter, zombie) < 45 && zombie.canAttack || distance(hunter, zombie2) < 45 && zombie.canAttack ) {
                    healthBar -= 5;
                }
            }

            // check if hunter is dead
            if (parseInt(healthBar) <= 0) {
                text(500, 300, 50, "Game Over!", "red");
                button(getElementById("start-button"));
                showMouse();
                stopUpdate();
            }
                
            // set cooldown period for zombie's next attack
            zombie.canAttack = false;
            setTimeout(function() {
            zombie.canAttack = true;
            }, attackCooldown);
        }
        
        //domhär är för roteringen av "gun"
        // Add the "Gun" object to the scene graph
        var angle = Math.atan2(mouse.y - hunter.y, mouse.x - hunter.x);
        var angleInDegrees = angle * (180/Math.PI);
        gun.x = hunter.x + Math.cos(angle) * 50;
        gun.y = hunter.y + Math.sin(angle) * 50;
        setTransform(angleInDegrees, gun.x, gun.y);
        rectangle(gun.x, gun.y, 10, 40, "black");
            

        // draw health bar
        /*var healthBar = document.getElementById("health-bar");
        healthBar.style.top = (hunter.y-10 - healthBar.offsetHeight) + "px";
        healthBar.style.left = (hunter.x - healthBar.offsetWidth/2) + "px"; */
        rectangle(hunter.x-15, hunter.y-40, 60 * healthBar/100, 5, "green")
    }
    update()