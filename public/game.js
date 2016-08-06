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
    this.plants = []; //THIS NEEDS TO BE AN OBJECT SO I KNOW WHICH PLANT TO REMOVE
    this.step();

    setInterval(function() {this.addPlant()}.bind(this), 500);

    document.addEventListener('keydown', function(event) {
        this.updateWorldAtCell('off', this.player.x, this.player.y);
        // debugger;
        this.player.keyMap(event.keyCode);
        this.updateWorldAtCell('on', this.player.x, this.player.y);
        // debugger;
    }.bind(this));

};

WorldGrid.prototype.step = function() {
    this.updateWorldAtCell('on', this.player.x, this.player.y);
};

WorldGrid.prototype.updateWorldAtCell = function(value, x, y) {
    this.world[this.stringify(x) + this.stringify(y)] = value;
    document.getElementById(this.stringify(x) + this.stringify(y)).className = 'tile ' + String(value);
    return [x, y];
};

WorldGrid.prototype.boardMaker = function(dimension) {
    var boardTableBody = document.createElement('tbody');
    var boardTableHTML = '';

    for (var i = 0; i < dimension; i++) {
        boardTableHTML += '<tr>';
        for (var j = 0; j < dimension; j++) {
            boardTableHTML += '<td id="' + this.stringify(j) + this.stringify(i) + '" class="tile ' + this.world[this.stringify(j) + this.stringify(i)] + '"></td>';
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
            returnObj[this.stringify(i) + this.stringify(j)] = 0;
        }
    }

    return returnObj;
};

WorldGrid.prototype.stringify = function(num) {
    num = num.toString().split('');
    while (num.length < this.dimension.toString().length) {
        num.unshift('0');
    }
    return num.join('');
};

WorldGrid.prototype.addPlant = function() {
    var plantToAdd = new Plant(this.dimension);
    if (this.plants.some(function(plant) {
        return this.stringify(plant.x) + this.stringify(plant.y) === this.stringify(plantToAdd.x) + this.stringify(plantToAdd.y)
    }.bind(this))) {
        return;
    }
    this.plants.push(plantToAdd);
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