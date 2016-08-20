var util = require('./utility');

module.exports = function(size) {

    /**
     *
     *
     *
     * The World Constructor.
     * 1. Has a 'world' property (object) which tracks the state of every tile.
     * 2. A new game board (DOM element) is rendered upon instantiation.
     *
     *
     */
    function World() {
        this.world = this.createWorld(size);
        this.size = size;
        //Creates the HTML Board
        this.boardMaker(size);
        this.manual = {
            0: 'off',
            1: 'one',
            2: 'two',
            3: 'three',
            4: 'four',
            5: 'five',
            6: 'off',
            7: 'on'

        };
    }

    /**
     * 1. Updates the tile on the DOM board (coordinate [x,y]) to have a class of 'value'.
     * @param  {String}
     * @param  {Number}
     * @param  {Number}
     * @return {undefined}
     */
    World.prototype.update = function(value, x, y) {
        var coordinate = util.location(size, x, y);
        this.world[coordinate] = value;
        document.getElementById(coordinate).className = 'tile ' + String(this.manual[value]);
    };

    /**
     * 1. Creates this.world, the object which tracks game state.
     * 2. The keys are '0'-padded string representations of coordinates (see util.location).
     * @type {Object}
     * @return {Object}
     */
    World.prototype.createWorld = function() {
        var returnObj = {};
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                returnObj[util.location(size, j, i)] = 0;
            }
        }
        return returnObj;
    };

    /**
     * 1. Creates the board/grid on the DOM.
     * @return {undefined}
     */
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


    /**
     * 1. Updates the game's scoreboard on the DOM to the provided values.
     * @param  {Number} [score: The current game score.]
     * @param  {Number} [health: The current player health.]
     * @param  {Number} [reds: Ratio of red plants to total steps.]
     * @param  {Number} [reward: Sum total reward given to the brain.]
     * @return {Number}
     */
    World.prototype.score = function(score, health, reds, reward) {
        document.getElementById('score').textContent = String(score);
        document.getElementById('health').textContent = String(health);
        document.getElementById('reds').textContent = String(reds);
        document.getElementById('reward').textContent = String(reward);
    };

    //Module return.
    return World;
};