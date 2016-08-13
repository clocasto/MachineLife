(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./plant.js":2,"./player":3}],2:[function(require,module,exports){
'use strict';

function Plant(worldSize) {
    this.x = this.randNum(worldSize);
    this.y = this.randNum(worldSize);
    this.age = 0;
    this.ages = {
    	1: {class: 'one', worth: 1},
    	2: {class: 'two', worth: 2},
    	3: {class: 'three', worth: 4},
    	4: {class: 'four', worth: 1},
    	5: {class: 'five', worth: -5},
    	0: {class: 'off'}
    }
    console.log('added plant');
}

Plant.prototype.randNum = function(max) {
    return Math.floor(Math.random() * max);
};

Plant.prototype.ageOnce = function() {
	this.age = this.age > 4 ? 0 : this.age + 1;
}

Plant.prototype.getAge = function() {
	return this.ages[this.age].class;
}

Plant.prototype.reap = function() {
	return this.ages[this.age].worth;
}

module.exports = Plant;
},{}],3:[function(require,module,exports){
'use strict';

var Player = function(worldSize, startingHP) {
    this.worldSize = worldSize;
    this.health = startingHP;
    this.score = 0;
    this.x = 0;
    this.y = 0;

};

Player.prototype.keyMap = function(code) {
    var keyMappings = {
        37: function() {
            console.log('left');
            return (this.x > 0) ? this.x-- : null;
        },
        38: function() {
            console.log('up');
            return (this.y > 0) ? this.y-- : null;
        },
        39: function() {
            console.log('right');
            return (this.x < this.worldSize - 1) ? this.x++ : null;
        },
        40: function() {
            console.log('down');
            return (this.y < this.worldSize - 1) ? this.y++ : null;
        }
    };

    if (keyMappings[code.toString()]) {
        keyMappings[code.toString()].bind(this)();
    }
};

module.exports = Player;
},{}]},{},[1]);
