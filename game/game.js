'use strict';
var Plant = require('./plant.js');
var Player = require('./player');

var WorldGrid = function(dimension) {

    this.dimension = dimension;
    this.player = new Player(dimension, 5);
    this.world = this.worldArray(dimension);
    this.boardMaker(dimension);
    this.plants = {};
    this.step();

    setInterval(function() {
        if (this.player.health-- > 0) {
            this.step();
        } else return;
    }.bind(this), 1000);

    document.addEventListener('keydown', function(event) {
        this.updateWorldAtCell('off', this.player.x, this.player.y);
        this.player.keyMap(event.keyCode);
        this.updateWorldAtCell('on', this.player.x, this.player.y);
        var playerLoc = this.cellLoc(this.player.x, this.player.y);
        if (this.plants.hasOwnProperty(playerLoc)) {
            this.player.score += this.plants[playerLoc].reap();
            this.player.health++;
            delete this.plants[playerLoc];
        }
        document.getElementById('score').textContent = String(this.player.score);
        this.moveState = true;
    }.bind(this));

};

WorldGrid.prototype.step = function() {
    this.updateWorldAtCell('on', this.player.x, this.player.y);
    this.addPlants(8);
    this.agePlants();
    // this.query();
    document.getElementById('health').textContent = String(this.player.health);
};

WorldGrid.prototype.updateWorldAtCell = function(value, x, y) {
    this.world[this.cellLoc(x, y)] = value;
    document.getElementById(this.cellLoc(x, y)).className = 'tile ' + String(value);
    return [x, y];
};

WorldGrid.prototype.boardMaker = function(dimension) {
    var boardTableBody = document.createElement('tbody');
    var boardTableHTML = '';

    for (var i = 0; i < dimension; i++) {
        boardTableHTML += '<tr>';
        for (var j = 0; j < dimension; j++) {
            boardTableHTML += '<td id="' + this.cellLoc(j, i) + '" class="tile off"></td>';
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
            returnObj[this.cellLoc(j, i)] = 0;
        }
    }

    return returnObj;
};

WorldGrid.prototype.cellLoc = function(x, y) {
    function stringify(num) {
        num = num.toString().split('');
        while (num.length < this.dimension.toString().length) {
            num.unshift('0');
        }
        return num.join('');
    }

    return stringify.bind(this)(x) + stringify.bind(this)(y);

};

WorldGrid.prototype.addPlants = function(num) {
    for (var i = 0; i < num; i++) {
        var plantToAdd = new Plant(this.dimension),
            plantCoordinates = this.cellLoc(plantToAdd.x, plantToAdd.y);

        if (this.plants.hasOwnProperty(this.cellLoc(plantToAdd.x, plantToAdd.y)) || this.cellLoc(this.player.x, this.player.y) === plantCoordinates) {
            return;
        }
        this.plants[plantCoordinates] = plantToAdd;
        this.updateWorldAtCell(plantToAdd.age, plantToAdd.x, plantToAdd.y);
    }
};

WorldGrid.prototype.agePlants = function() {
    for (var plant in this.plants) {
        var selectedPlant = this.plants[plant];
        selectedPlant.ageOnce();
        if (selectedPlant.getAge() === 'off') {
            delete this.plants[plant];
        }
        this.updateWorldAtCell(selectedPlant.getAge(),
            selectedPlant.x, selectedPlant.y);
    }
};

WorldGrid.prototype.query = function() {
    console.log(this.world);
}

var game = new WorldGrid(10);

module.exports = WorldGrid;