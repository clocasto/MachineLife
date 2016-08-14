(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./plant.js":2,"./player":3,"./utility":4}],2:[function(require,module,exports){
'use strict';
var util = require('./utility');

module.exports = function(worldSize, player) {

    function Plant(worldSize) {
        this.x = util.randNum(worldSize);
        this.y = util.randNum(worldSize);
        this.coordinate = util.location(worldSize, this.x, this.y);
        this.age = 1;
        console.log('added plant');
    }

    Plant.prototype.ageOnce = function() {
        this.age = this.age > 4 ? 0 : this.age + 1;
    };

    Plant.prototype.manual = {
        1: {
            class: 'one',
            worth: 1
        },
        2: {
            class: 'two',
            worth: 2
        },
        3: {
            class: 'three',
            worth: 4
        },
        4: {
            class: 'four',
            worth: 1
        },
        5: {
            class: 'five',
            worth: -5
        },
        0: {
            class: 'off',
            worth: 0
        }
    };

    Plant.prototype.getAge = function() {
        return this.manual[this.age].class;
    };

    Plant.prototype.reap = function() {
        return this.manual[this.age].worth;
    };

    //
    //
    //

    function Garden() {
        this.plants = {};
    }

    Garden.prototype.season = function(num) {
        this.addPlants(num);
        this.agePlants();
    };

    Garden.prototype.addPlants = function(num) {
        //Adds 'num' number of plants to the garden
        for (var i = 0; i < num; i++) {
            var plantToAdd = new Plant(worldSize);

            if (this.plants.hasOwnProperty(plantToAdd.coordinate) || util.location(worldSize, player.x, player.y) === plantToAdd.coordinate) {
                return;
            }
            this.plants[plantToAdd.coordinate] = plantToAdd;
        }
    };

    Garden.prototype.agePlants = function() {
        //Ages all of the plants in the garden
        for (var plot in this.plants) {
            if (this.plants.hasOwnProperty(plot)) {
                var selectedPlant = this.plants[plot];
                selectedPlant.ageOnce();
            }
        }
    };

    Garden.prototype.hasPlant = function(coord) {
        return this.plants.hasOwnProperty(coord);
    };

    Garden.prototype.trample = function(coord) {
        //Returns points and garbage collects a stepped-on plant
        var plantWorth = this.plants[coord].reap();
        this.root(coord);
        return plantWorth;
    };

    Garden.prototype.root = function(coord) {
        delete this.plants[coord];
    };

    return {
        Plant: Plant,
        Garden: Garden
    };
};
},{"./utility":4}],3:[function(require,module,exports){
'use strict';

module.exports = function(dim) {

    var Player = function(startingHP) {
        this.worldSize = dim;
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

    return Player;
};

},{}],4:[function(require,module,exports){
module.exports = {
    location: function(dim, x, y) {
        function stringify(num) {
            num = num.toString().split('');
            while (num.length < dim.toString().length) {
                num.unshift('0');
            }
            return num.join('');
        }
        return stringify(x) + stringify(y);
    },
    randNum: function(max) {
        return Math.floor(Math.random() * max);
    }
};

},{}]},{},[1]);
