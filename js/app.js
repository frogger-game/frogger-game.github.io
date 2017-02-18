// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    //Enemies go back to the begining afeter reaching the width of the canvas
    if (this.x >= 505) {
        this.x = 0;
    }

    collisionCheck(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {

};

//Draw the player on the screen, required method for the game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    this.x = 205.5
    this.y = 383
    this.speed = 50;
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.x -= this.speed;
            break;
        case 'up':
            this.y -= this.speed;
            break;
        case 'right':
            this.x += this.speed;
            break;
        case 'down':
            this.y += this.speed;
            break;
    }
};

var collisionCheck = function(aThing) {
    if ((player.x + 131 >= aThing.y + 90) && (player.x + 25 <= aThing.x + 88) && (player.y + 73 <= aThing.y + 135) && (player.x + 76 >= aThing.x + 11)) {
        console.log('Enemy collision');
        player.x = 202.5;
        player.y = 383;
    }

    if (player.y + 63 <= 0) {
        player.reset();
        console.log('you wom');

        level++;
        increaseDifficulty(level);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);
    }

    // prevent player from going out of bounds
    if (player.y > 383) {
        player.y = 383;
    }
    if (player.x > 402.5) {
        player.x = 402.5;
    }
    if (player.x < 2.5) {
        player.x = 2.5;
    }

};

// Create more enemiew based on level
var increaseDifficulty = function(level) {
    // remove all previous enemies
    allEnemies.length = 0;

    // create all enemies
    for (var i = 0; i <= level; i++) {
        var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(205.5, 383, 50);
var allEnemies = [];
var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
var level = 1;
allEnemies.push(enemy);

//functions bellow are called on screen buttons
var resetGame = function() {

};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
