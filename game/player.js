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