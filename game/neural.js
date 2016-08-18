var deepqlearn = require("../node_modules/convnetjs/build/deepqlearn");

module.exports = function(dim) {

    var Brain = new deepqlearn.Brain(Math.pow(dim, 2), 4); // dim^2 inputs, 4 outputs (0,1)
    Brain.learning = true;
    Brain.rewardManual = {
        one: .2,
        two: .4,
        three: 1,
        four: .2,
        five: -1,
        off: 0,
        on: 0
    };
    Brain.rewardMe = function(string) {
        return Brain.rewardManual[string];
    };

    return Brain;

};

