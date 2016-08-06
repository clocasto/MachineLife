'use strict'

function randNum(max) {
    return Math.floor(Math.random() * max);
}

//
//
//
//
//

var WorldGrid = function(dimension) {

    this.dimension = dimension;
    this.player = new Player(dimension, 20);
    this.world = this.worldArray(dimension);
    this.boardMaker(dimension);
    this.plants = {};
    this.step();

    setInterval(function() {
        this.addPlant();
    }.bind(this), 1000);

    document.addEventListener('keydown', function(event) {
        this.updateWorldAtCell('off', this.player.x, this.player.y);
        // debugger;
        this.player.keyMap(event.keyCode);
        this.updateWorldAtCell('on', this.player.x, this.player.y);
        var playerLoc = this.cellLoc(this.player.x, this.player.y);
        if (this.plants.hasOwnProperty(playerLoc))
            this.player.score += this.plants[playerLoc].worth;
        delete this.plants[playerLoc];
        document.getElementById('score').textContent = String(this.player.score);
    }.bind(this));

};

WorldGrid.prototype.step = function() {
    this.updateWorldAtCell('on', this.player.x, this.player.y);
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
            boardTableHTML += '<td id="' + this.cellLoc(j, i) + '" class="tile ' + this.world[this.cellLoc(j, i)] + '"></td>';
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

WorldGrid.prototype.addPlant = function() {
    var plantToAdd = new Plant(this.dimension),
        plantCoordinates = this.cellLoc(plantToAdd.x, plantToAdd.y)
    if (this.plants.hasOwnProperty(this.cellLoc(plantToAdd.x, plantToAdd.y))) {
        return;
    }
    this.plants[plantCoordinates] = plantToAdd;
    this.updateWorldAtCell('plant', plantToAdd.x, plantToAdd.y);
};

//
//
//
//
//

var Player = function(worldSize, startingHP) {
    this.worldSize = worldSize;
    this.health = startingHP;
    this.score = 0;
    this.x = randNum(this.worldSize);
    this.y = randNum(this.worldSize);

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

//
//
//
//
//

function Plant(worldSize) {
    this.worth = randNum(5);
    this.x = randNum(worldSize);
    this.y = randNum(worldSize);
    console.log('added plant');
}

var game = new WorldGrid(20);