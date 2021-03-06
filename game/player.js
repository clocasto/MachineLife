'use strict';
var util = require('./utility');

module.exports = function(dim) {

    /**
     *
     *
     *
     * The Player Constructor.
     * @param {Number}
     *
     *
     *
     */
    var Player = function(startingHP) {
        this.worldSize = dim;
        this.health = startingHP;
        this.reds = 0;
        this.score = 0;
        this.reward = 0;
        this.x = Math.floor(dim / 2);
        this.y = Math.floor(dim / 2);
        this.allowedMoves = [37, 38, 39, 40]; //Arrow key keyCodes - relic from human keyboard controls.
        this.loc = util.location(10, this.x, this.y);

    };

    /**
     * 1. Adjusts this.player 'x' and 'y' properties based on keyCode argument.
     * @param  {Number}
     * @return {Number}
     */
    Player.prototype.keyMap = function(code) {
        var keyMappings = {
            37: function() {
                // console.log('left');
                return (this.x > 0) ? this.x-- : null;
            },
            38: function() {
                // console.log('up');
                return (this.y > 0) ? this.y-- : null;
            },
            39: function() {
                // console.log('right');
                return (this.x < this.worldSize - 1) ? this.x++ : null;
            },
            40: function() {
                // console.log('down');
                return (this.y < this.worldSize - 1) ? this.y++ : null;
            }
        };

        //Check if the code corresponds to a valid move
        if (keyMappings[code.toString()]) {
            keyMappings[code.toString()].bind(this)();
        }
    };

    //Module return.
    return Player;
};
