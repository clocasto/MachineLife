var deepqlearn = require("../node_modules/convnetjs/build/deepqlearn");

module.exports = function(dim) {

    var Brain = new deepqlearn.Brain(Math.pow(dim, 2), 4); // dim^2 inputs, 4 outputs (0,1)
    Brain.epsilon_test_time = 0.0; // don't make any more random choices
    Brain.learning = false;
    Brain.rewardManual = {
        one: 1,
        two: 2,
        three: 4,
        four: 1,
        five: -5,
        off: 0,
        on: 0
    };
    Brain.rewardMe = function(string) {
        return Brain.rewardManual[string];
    };

    return Brain;

};

