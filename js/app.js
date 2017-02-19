// Enemies our player must avoid
//The parameter type will have the value of fast or slow, meaning that the enemy is going to move fast or not
var enemyTypes = {
    BIG: 'bigBug',
    SMALL: 'smallBug'
};

var Enemy = function(x, y, speed, type) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.sprite = this.type === enemyTypes.BIG ? 'images/enemy-bug.png' : 'images/enemy-bug-small.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    //Enemies go back to the begining afeter reaching the width of the canvas
    //And Y location is random
    if (this.x >= 505) {
        this.x = 0;
        this.y = getRandomYLocation(this.type);
        this.speed = this.type === enemyTypes.BIG ? getRandomFastSpeed() : getRandomSlowSpeed();
    }

    //check for colisions on every update
    collisionCheck(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
};

//Function not used
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
    this.sprite = playerSprite;
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

var Gem = function(x, y, sprite) {

};

//This function is resposible for colision checks
var collisionCheck = function(aThing) {
    //if the collision is with a big enemy
    if ((aThing.type === enemyTypes.BIG) && (player.y + 131 >= aThing.y + 90) && (player.x + 25 <= aThing.x + 88) && (player.y + 73 <= aThing.y + 135) && (player.x + 76 >= aThing.x + 11)) {
        player.reset();
        //if the collision if with a small enemy
    } else if ((aThing.type === enemyTypes.SMALL) && (player.y + 131 >= aThing.y + 45) && (player.x + 25 <= aThing.x + 44) && (player.y + 73 <= aThing.y + 67.5) && (player.x + 76 >= aThing.x + 5.5)) {
        player.reset();
    }

    //if the player reached the water
    if (player.y + 63 <= 0) {
        player.reset();

        increaseDifficulty();
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

// Create more enemies based on level
var increaseDifficulty = function() {
    // remove all previous enemies
    allEnemies = [];
    level++;

    $('#current-level').html(level);

    //increase player speed when the level is multiple of 3
    if (level % 3 === 0) {
        player.speed += 10;
    }

    // create all enemies
    for (var i = 1; i <= level; i++) {
        //if the index is multiple of 3 we create a big enemy or a small one otherwise
        if (i % 3 === 0) {
            var enemy = new Enemy(0, getRandomYLocation(enemyTypes.BIG), getRandomFastSpeed(), enemyTypes.BIG);
        } else {
            var enemy = new Enemy(0, getRandomYLocation(enemyTypes.SMALL), getRandomSlowSpeed(), enemyTypes.SMALL);
        }

        allEnemies.push(enemy);
    }
};


//Util functions bellow

//Get random Y location based of enemy type
var getRandomYLocation = function(enemyType) {
    var location;
    if (enemyType === enemyTypes.BIG) {
        location = (Math.random() * 210) + 40;
    } else {
        location = (Math.random() * 240) + 80;
    }
    return location;
};

var getRandomFastSpeed = function() {
    return (Math.random() * 110) + 60;
};

var getRandomSlowSpeed = function() {
    return (Math.random() * 50) + 20;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player;
var allEnemies;
var enemy;
var level;
var playerSprite = 'images/char-boy.png';

//functions bellow are called on screen buttons

//Reset or init game objects
var resetGame = function() {
    player = new Player(200.5, 383, 50, playerSprite);

    allEnemies = [];
    enemy = new Enemy(0, getRandomYLocation(enemyTypes.SMALL), getRandomSlowSpeed(), enemyTypes.SMALL);
    allEnemies.push(enemy);

    level = 1;
    $('#current-level').html(level);
};
resetGame();


//Change player and also reset game
var changePlayer = function() {
    playerSprite = 'images/' + $('#player-select').val();
    resetGame();
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
