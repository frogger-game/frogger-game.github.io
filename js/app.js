'use strict';
// The image/sprite for our game are easily loaded in engine.js

//Object resposible to keep types of enemies
var enemyTypes = {
    BIG: 'bigBug',
    SMALL: 'smallBug'
};

//Types of direction an enemy can go
var directions = {
    LEFT: 'left',
    RIGHT: 'right'
};

/**
 * This is a generec class for the game objects
 *
 * @class GameObj
 * @constructor
 */
var GameObj = function(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
};

/**
 * This is the Enemy class, all the enemies are instances of this class
 *
 * @class MyClass
 * @constructor
 */
var Enemy = function(x, y, speed, sprite, type, direction) {
    GameObj.call(this, x, y, speed, sprite);
    this.type = type;
    this.direction = direction;
};
Enemy.prototype = Object.create(GameObj.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * This metthod is called on every update by the game engine
 * to update the enemy's location
 *
 * @method update
 * @param {String} dt a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.direction === directions.LEFT) {
        this.x -= this.speed * dt;
    } else {
        this.x += this.speed * dt;
    }

    //Enemies go back to the begining afeter reaching the width of the canvas but the speed and the Y location is random
    if (this.x >= 505) {
        this.y = getRandomYLocation(this.type);
        this.speed = getRandomSpeed();
        this.x = 0;
    } else if (this.x < -100) {
        this.y = getRandomYLocation(this.type);
        this.speed = getRandomSpeed();
        this.x = 505;
    }

    //check for colisions on every update
    this.collisionCheck();
};

/**
 * This metthod is called on every update by the game engine
 * to redraw the enemy
 *
 * @method render
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * This metthod is called on every update by the update method abouve
 * to check if the player collided with an enemy
 *
 * @method collisionCheck
 */
Enemy.prototype.collisionCheck = function() {
    //if the collision is with a big enemy
    if ((this.type === enemyTypes.BIG) && (player.y + 131 >= this.y + 90) && (player.x + 25 <= this.x + 88) && (player.y + 73 <= this.y + 135) && (player.x + 76 >= this.x + 11)) {
        player.reset();
        //if the collision if with a small enemy
    } else if ((this.type === enemyTypes.SMALL) && (player.y + 131 >= this.y + 45) && (player.x + 25 <= this.x + 44) && (player.y + 73 <= this.y + 67.5) && (player.x + 76 >= this.x + 5.5)) {
        player.reset();
    }
};

/**
 * This is the player class
 *
 * @class MyClass
 * @constructor
 */
var Player = function(x, y, speed, sprite) {
    GameObj.call(this, x, y, speed, sprite);
};
Player.prototype = Object.create(GameObj.prototype);
Player.prototype.constructor = Player;

//Function not used
Player.prototype.update = function() {

};

/**
 * This metthod is called on every update by the game engine
 * to redraw the player
 *
 * @method render
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * This metthod is called whenever we want the player to go back to the start
 * to redraw the player
 *
 * @method render
 */
Player.prototype.reset = function() {
    this.x = 205.5
    this.y = 383
    this.speed = 50;
    this.sprite = playerSprite;
};

/**
 * This metthod is called when a key is pressed and checks if the key pressed is one that moves the playerr
 *
 * @method render
 */
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

    // prevent player from going out of bounds
    if (this.y > 383) {
        this.y = 383;
    }

    if (this.x > 402.5) {
        this.x = 402.5;
    }

    if (this.x < 2.5) {
        this.x = 2.5;
    }

    //if the player reached the water
    if (this.y + 30 <= 0) {
        this.reset();
        increaseDifficulty();
    }
};

//Not used now, but can ben used latter to create gems
var Gem = function(x, y, sprite) {

};

// Create more enemies to increase difficulty when the player wins
var increaseDifficulty = function() {
    level++;
    $('#current-level').html(level);

    //increase player speed when the level is multiple of 3
    if (level % 3 === 0) {
        player.speed += 10;
    }

    var direction = getRandomDirection();
    var start = direction === directions.LEFT ? 505 : -100;
    //if the level is multiple of 5 we create a big enemy or a small one otherwise
    if (level % 5 === 0) {
        var bigSprite = direction === directions.LEFT ? 'images/enemy-bug-inverse.png' : 'images/enemy-bug.png';
        var enemy = new Enemy(start, getRandomYLocation(enemyTypes.BIG), getRandomSpeed(), bigSprite, enemyTypes.BIG, direction);
    } else {
        var smallSprite = direction === directions.LEFT ? 'images/enemy-bug-small-inverse.png' : 'images/enemy-bug-small.png';
        var enemy = new Enemy(start, getRandomYLocation(enemyTypes.SMALL), getRandomSpeed(), smallSprite, enemyTypes.SMALL, direction);
    }

    //add the enemy
    allEnemies.push(enemy);

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

var getRandomSpeed = function() {
    return (Math.random() * 50) + 20;
};

//Returns left or right to use as a direction for the enemy
var getRandomDirection = function() {
    var random = Math.floor((Math.random() * 2) + 1);
    if (random === 1) {
        return directions.LEFT;
    } else {
        return directions.RIGHT;
    }

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
    enemy = new Enemy(-100, getRandomYLocation(enemyTypes.SMALL), getRandomSpeed(), 'images/enemy-bug-small.png', enemyTypes.SMALL, directions.RIGHT);
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
