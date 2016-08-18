'use strict';
var gardener = require('./plant.js');
var entities = require('./player');
var util = require('./utility');
var creator = require('./world');

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

Manager.prototype.start = function() {
    this.step();
    this.speed = 1;
    // this.observer();

    setInterval(function() {
        // if (this.player.health-- > 0) this.step();
        // else {
        //     this.quit();
        // }
        this.step();

    }.bind(this), this.speed);
};

Manager.prototype.step = function() {
    this.world.draw('on', this.player.x, this.player.y);
    this.garden.season(1);
    this.harvest();
        var move = this.brain.forward(this.query());
        this.moveBrain(move);
        this.world.score(this.player.score, this.player.health, this.player.reds / this.brain.forward_passes, this.player.reward);
        console.log('My age:', this.brain.age);
};

Manager.prototype.quit = function() {
    for (var plot in this.garden.plants) {
        this.world.draw('off', this.garden.plants[plot].x, this.garden.plants[plot].y);
        this.garden.root(plot);
    }
};

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
        this.player.reward += reward;
        console.log('reward', reward);
};

Manager.prototype.movePlayer = function(keyCode) {
    if (this.player.allowedMoves.includes(keyCode)) {
        this.world.draw('off', this.player.x, this.player.y);
        this.player.keyMap(keyCode);
        this.world.draw('on', this.player.x, this.player.y);
    }
};

Manager.prototype.award = function(scoreObj) {
    this.player.score += scoreObj.value;
    this.player.health += scoreObj.health;
    console.log(scoreObj.worth);
    if (scoreObj.value < 0) this.player.reds++;
    this.world.score(this.player.score, this.player.health, this.player.reds / this.brain.forward_passes, this.player.reward);
    return scoreObj.reward;
};

Manager.prototype.harvest = function() {
    for (var plot in this.garden.plants) {
        if (this.garden.plants.hasOwnProperty(plot)) {
            var plant = this.garden.plants[plot];
            if (plant.getAge() === 'off') this.garden.root(plant.coordinate);
            this.world.draw(plant.getAge(), plant.x, plant.y);
        }
    }
};

Manager.prototype.observer = function() {

    document.addEventListener('keydown', function(event) {
        this.movePlayer(event.keyCode);
        var playerLoc = util.location(this.size, this.player.x, this.player.y);
        if (this.garden.hasPlant(playerLoc)) {
            this.award(this.garden.trample(playerLoc));

        }
    }.bind(this));

};

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

var newGame = new Manager(5);
newGame.start();
