'use strict';
var gardener = require('./plant.js');
var entities = require('./player');
var util = require('./utility');

var WorldGrid = function(dimension) {

    this.dimension = dimension;
    this.world = this.worldArray(dimension);
    this.boardMaker(dimension);

    var Player = entities(dimension);
    this.player = new Player(6);
    var Garden = gardener(dimension, this.player).Garden;
    this.garden = new Garden();

    this.step();
    setInterval(function() {
        if (this.player.health-- > 0) this.step();
        return;
    }.bind(this), 1000);

    document.addEventListener('keydown', function(event) {
        this.updateWorldAtCell('off', this.player.x, this.player.y);
        this.player.keyMap(event.keyCode);
        this.updateWorldAtCell('on', this.player.x, this.player.y);
        var playerLoc = util.location(this.dimension, this.player.x, this.player.y);
        if (this.garden.hasPlant(playerLoc)) {
            this.player.score += this.garden.trample(playerLoc);
            this.player.health++;
        }
        document.getElementById('score').textContent = String(this.player.score);
    }.bind(this));

};

WorldGrid.prototype.step = function() {
    this.updateWorldAtCell('on', this.player.x, this.player.y);
    this.garden.season(8);
    this.harvest();
    // this.query();
    document.getElementById('health').textContent = String(this.player.health);
};

WorldGrid.prototype.harvest = function() {
    for (var plot in this.garden.plants) {
        if (this.garden.plants.hasOwnProperty(plot)) {
            var plant = this.garden.plants[plot];
            if (plant.getAge() === 'off') this.garden.root(plant.coordinate);
            this.updateWorldAtCell(plant.getAge(), plant.x, plant.y);
        }
    }
};

WorldGrid.prototype.updateWorldAtCell = function(value, x, y) {
    this.world[util.location(this.dimension, x, y)] = value;
    document.getElementById(util.location(this.dimension, x, y)).className = 'tile ' + String(value);
    return [x, y];
};

WorldGrid.prototype.boardMaker = function(dimension) {
    var boardTableBody = document.createElement('tbody');
    var boardTableHTML = '';

    for (var i = 0; i < dimension; i++) {
        boardTableHTML += '<tr>';
        for (var j = 0; j < dimension; j++) {
            boardTableHTML += '<td id="' + util.location(this.dimension, j, i) + '" class="tile off"></td>';
        }
        boardTableHTML += '</tr>';
    }
    boardTableBody.innerHTML = boardTableHTML;
    var boardTable = document.getElementById('gameboard');
    boardTable.appendChild(boardTableBody);
};

WorldGrid.prototype.worldArray = function(size) {
    var returnObj = {};
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            returnObj[util.location(this.dimension, j, i)] = 0;
        }
    }

    return returnObj;
};

WorldGrid.prototype.query = function() {
    console.log(this.world);
};

var game = new WorldGrid(10);

module.exports = WorldGrid;