
var util = require('./utility');

module.exports = function(size) {


function World() {
	this.world = this.createWorld(size);
	this.size = size;
	//Creates the HTML Board
	this.boardMaker(size);

}

World.prototype.draw = function(value, x, y) {
    this.world[util.location(size, x, y)] = value;
    document.getElementById(util.location(size, x, y)).className = 'tile ' + String(value);
};

World.prototype.createWorld = function() {
    var returnObj = {};
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            returnObj[util.location(size, j, i)] = 0;
        }
    }
    return returnObj;
};

World.prototype.boardMaker = function() {
    var boardTableBody = document.createElement('tbody');
    var boardTableHTML = '';

    for (var i = 0; i < size; i++) {
        boardTableHTML += '<tr>';
        for (var j = 0; j < size; j++) {
            boardTableHTML += '<td id="' + util.location(size, j, i) + '" class="tile off"></td>';
        }
        boardTableHTML += '</tr>';
    }
    boardTableBody.innerHTML = boardTableHTML;
    var boardTable = document.getElementById('gameboard');
    boardTable.appendChild(boardTableBody);
};

World.prototype.score = function(score, health) {
	document.getElementById('score').textContent = String(score);
	document.getElementById('health').textContent = String(health);
};

	return World;
};

