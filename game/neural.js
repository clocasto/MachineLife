var deepqlearn = require("./brain/deepqlearn");

module.exports = function(dim) {

    var options = {
        temporal_window: 2
        // experience_size: 5000
    };

    var Brain = new deepqlearn.Brain(Math.pow(dim, 2), 4, options); // dim^2 inputs, 4 outputs (0,1)
    Brain.learning = true;
    Brain.rewardManual = {
        one: .02,
        two: .04,
        three: .1,
        four: .02,
        five: -1,
        off: -0.005,
        on: 0
    };
    Brain.rewardMe = function(string) {
        return Brain.rewardManual[string];
    };

    return Brain;

};

