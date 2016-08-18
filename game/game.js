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
    this.garden = new Garden();

    var Brain = require('./neural');
    this.brain = Brain(this.size);

    console.log(this.brain);

};

Manager.prototype.start = function() {
    this.step();
    this.observer();

    setInterval(function() {
        // if (this.player.health-- > 0) this.step();
        // else {
        //     this.quit();
        // }
        this.step();
    }.bind(this), 1000);
};

Manager.prototype.quit = function() {
    for (var plot in this.garden.plants) {
        this.world.draw('off', this.garden.plants[plot].x, this.garden.plants[plot].y);
        this.garden.root(plot);
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

Manager.prototype.movePlayer = function(keyCode) {
    if (this.player.allowedMoves.includes(keyCode)) {
        this.world.draw('off', this.player.x, this.player.y);
        this.player.keyMap(event.keyCode);
        this.world.draw('on', this.player.x, this.player.y);
    }
};

Manager.prototype.award = function(scoreObj) {
    this.player.score += scoreObj.value;
    this.player.health += scoreObj.health;
    this.world.score(this.player.score, this.player.health);
};

Manager.prototype.step = function() {
    this.world.draw('on', this.player.x, this.player.y);
    this.garden.season(4);
    this.harvest();
    console.log('Move?', this.brain.forward(this.query()));
    console.log('Reward:', this.world.world[this.player.loc]);
    // this.brain.backward([Brain.rewardMe(this.world.world[this.player.loc])]);
    this.world.score(this.player.score, this.player.health);
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

Manager.prototype.viewWorld = function() {};

Manager.prototype.query = function() {
    var returnArray = [];
    for (var i = 0; i < this.size; i++) {
        var rowArray = [];
        for (var j = 0; j < this.size; j++) {
            rowArray.push(this.world.world[util.location(this.size, i, j)]);
        }
        returnArray.push(rowArray);
    }
    return returnArray;
};

var newGame = new Manager(10);
newGame.start();