var WorldGrid = function(dimension) {

    var world = worldArray(dimension);

    function worldArray(size) {
        var returnObj = {};
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                returnObj[String(i) + String(j)] = 0;
            }
        }

        return returnObj;
    }

    function boardMaker(gridObject) {
        var boardTableBody = document.createElement('tbody');
        var boardTableHTML = '';

        for (var i = 0; i < dimension; i++) {
            boardTableHTML += '<tr>';
            for (var j = 0; j < dimension; j++) {
                boardTableHTML += '<td id="' + String(i) + String(j) + '" class="tile ' + world[String(i) + String(j)] + '"></td>';
            }
            boardTableHTML += '</tr>';
        }
        boardTableBody.innerHTML = boardTableHTML;
        var boardTable = document.getElementById('gameboard');
        boardTable.appendChild(boardTableBody);
    }

    function updateWorldAtCell(value, x, y) {

        function updateGameBoardAtCell() {
            document.getElementById(String(x) + String(y)).className = 'tile ' + String(value);
        }

        world[String(x) + String(y)] = value;
        updateGameBoardAtCell();
    }

    boardMaker();

    updateWorldAtCell('on',5,5);

};

var game = new WorldGrid(20);