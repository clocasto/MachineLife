'use strict';
var gardener = require('./plant.js');
var entities = require('./player');
var util = require('./utility');
var creator = require('./world');

/**
 *
 *
 *
 * The Game ('Manager') Constructor.
 * 1. Sets the game size to 'dimension'.
 * 2. Attaches a World object to this.world.
 * 3. Attaches a Player Object to this.player.
 * 4. Attaches a Garden Object to this.garden.
 * 5. Attaches a Brain Object to this.brain.
 * @param {Number}
 * @return {Manager} [Game constructor which holds and oversees all modules. Takes a grid width as an argument.]
 *
 *
 *
 */
var Manager = function(dimension) {

    this.size = dimension;

    var World = creator(dimension);
    this.world = new World();

    var Player = entities(dimension);
    this.player = new Player(5);

    var Garden = gardener(dimension, this.player).Garden;
    this.garden = new Garden(4);

    var Brain = require('./neural');
    this.brain = Brain(this.size);

};

/**
 * 1. Advances the game by one step (time unit).
 * 2. Draws the player pixel.
 * 3. Calls this.garden's season method which attempts to spawn a specified number of plants and age them.
 * 4. Deletes any dead plants from this.garden and re-draws blank tiles using this.world.draw.
 * @return {undefined}
 * @method  {function}
 */
Manager.prototype.step = function() {
    // this.world.draw('on', this.player.x, this.player.y);
    this.garden.season(1);
    this.harvest();

    //Handling brain movement and scoring below.
    var move = this.brain.forward(this.query());
    this.moveBrain(move);
    this.world.score(this.player.score, this.player.health, this.player.reds / this.brain.forward_passes, this.player.reward);
    this.brain.visSelf(document.getElementById('brainboard')); //Displays brain statistics.
};

/**
 * 1. Accepts a direction from this.brain (Number [0,x) ) and attempts to move this.player.
 * @param  {Number}
 * @return {undefined}
 */
Manager.prototype.moveBrain = function(direction) {
    this.movePlayer(37 + direction);
    var playerLoc = util.location(this.size, this.player.x, this.player.y);
    if (this.garden.hasPlant(playerLoc)) {
        var reward = this.award(this.garden.trample(playerLoc));
        this.brain.backward(reward);
    } else {
        var reward = -0.02;
        this.brain.backward(reward);
    }
    // console.log(reward);
    this.player.reward += reward;
};

/**
 * 1. Accepts a keycode (relic from when Manager.prototype.movePlayer was in use) and checks if it's an allowed move.
 * 2. If the move is allowed it will redraw this.player pixel at the new location using this.world.draw.
 * @param  {Number}
 * @return {undefined}
 */
Manager.prototype.movePlayer = function(keyCode) {
    if (this.player.allowedMoves.includes(keyCode)) {
        // this.world.draw('off', this.player.x, this.player.y);
        this.player.keyMap(keyCode);
        // this.world.draw('on', this.player.x, this.player.y);
    }
};

/**
 * 1. Returns a single-order array of all tiles states in the grid. The data is stored in this.world.world (an object with '0'-padded coordinate keys).
 * @return {Array}
 */
Manager.prototype.query = function() {
    var returnArray = [];
    for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
            returnArray.push(this.world.world[util.location(this.size, i, j)]);
        }
    }
    // console.log(returnArray);
    return returnArray;
};

/**
 * 1. Adjusts this.player's health and score properties based on scoreObj properties.
 * 2. Increments a counter of red plants if the scoreObj denotes a negatively valued plant
 * 3. Updates the DOM using this.world.score to display new game statistics.
 * @param  {Object}
 * @return {Number}
 */
Manager.prototype.award = function(scoreObj) {
    this.player.score += scoreObj.value;
    this.player.health += scoreObj.health;
    if (scoreObj.value < 0) this.player.reds++;
    this.world.score(this.player.score, this.player.health, this.player.reds / this.brain.forward_passes, this.player.reward);
    return scoreObj.reward;
};

/**
 * 1. Looks at all plants in this.garden and removes them if they died (aged out).
 * @return {undefined}
 */
Manager.prototype.harvest = function() {
    for (var plot in this.garden.plants) {
        if (this.garden.plants.hasOwnProperty(plot)) {
            var plant = this.garden.plants[plot];
            if (plant.getAge() === 'off') this.garden.delete(plant.coordinate);
            // this.world.draw(plant.getAge(), plant.x, plant.y);
        }
    }
};

/**
 * 1. Adds an event listener to the document.
 * 2. Enables a user to play using the arrow keys.
 * 3. The listener will handle scoring if a human player lands on a plant using this.award.
 * @return {undefined}
 */
Manager.prototype.observer = function() {

    document.addEventListener('keydown', function(event) {
        this.movePlayer(event.keyCode);
        var playerLoc = util.location(this.size, this.player.x, this.player.y);
        if (this.garden.hasPlant(playerLoc)) {
            this.award(this.garden.trample(playerLoc));
        }
    }.bind(this));
};

/**
 * 1. Starts the game. Initially calls step() to immediately render the player and first wave of plants.
 * 2. Sets the step frequency in this.speed (ms).
 * 3. Applies an interval to the window which advances the game by one step. The interval may also be utilized to apply a health-decrement game mechanic.
 * @return {undefined}
 */
Manager.prototype.start = function() {
    // this.step();
    this.speed = 1;
    // this.observer();

    // setInterval(function() {
    //     // if (this.player.health-- > 0) this.step();
    //     // else {
    //     //     this.quit();
    //     // }
    //     this.step();

    // }.bind(this), this.speed);
    // 
    while (this.brain.age < 10000) {
        this.step();
    }
};

/**
 * Quits the current game by:
 * 1. Deletes all plants from this.garden.
 * 2. Re-draws all plant tiles to be blank.
 * @return {undefined}
 */
Manager.prototype.quit = function() {
    for (var plot in this.garden.plants) {
        // this.world.draw('off', this.garden.plants[plot].x, this.garden.plants[plot].y);
        this.garden.root(plot);
    }
};

/**
 * Starts a new game.
 * @type {Manager}
 */
var newGame = new Manager(5);
newGame.start();