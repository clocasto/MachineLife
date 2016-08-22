var deepqlearn = require("./brain/deepqlearn");

module.exports = function(dim) {

    /**
     *
     *
     *
     * The Brain Construction.
     * 1. Arguments[0]: Number of inputs (# of tiles)
     * 2. Arguments[1]: Number of outputs (# of move options)
     * 3. Arguments[2]: Options object.
     * 4. The rewardManual class method
     * @type {deepqlearn}
     *
     *
     *
     */

    //Houses the options for defining the deep learning Brain.
    var options = {
        epsilon_min: 0.08,
        epsilon_test_time: 0.08, //Set to 0 to be totally deterministic
        experience_size: 500000,
        gamma: 0.8,
        learning_steps_burnin: 5000,
        learning_steps_total: 2000000,
        start_learn_threshhold: 1000,
        temporal_window: 2,
        tdtrainer_options: {
            learning_rate: 0.01,
            option: 'adagrad'
        }
        // experience_size: 5000
    };

    var Brain = new deepqlearn.Brain(Math.pow(dim, 2), 4, options); // dim^2 inputs, 4 outputs (0,1)

    /**
     * [Class method which defines rewards given to brain instances. THIS IS NOT CURRENTLY USED.]
     * @type {Object}
     */
    // Brain.rewardManual = {
    //     one: .02,
    //     two: .04,
    //     three: .1,
    //     four: .02,
    //     five: -1,
    //     off: -0.005,
    //     on: 0
    // };

    /**
     * 1. Class method which returns the reward corresponding to a tile state (string)
     * @param  {String}
     * @return {Number}
     */
    Brain.rewardMe = function(string) {
        return Brain.rewardManual[string];
    };

    //Module return.
    return Brain;

};
