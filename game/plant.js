'use strict';
var util = require('./utility');

module.exports = function(worldSize, player) {

    /**
     *
     *
     *
     * The Plant Constructor.
     * 1. Creates a plant which is of the specified age.
     * 2. Each plant is initialized on a random coordinate.
     * 3. Each plant's location is accessible by x AND y properties or a '0'-padded string property, 'this.coordinate'.
     * @param {Number}
     *
     *
     *
     */
    function Plant(age) {
        this.x = util.randNum(worldSize);
        this.y = util.randNum(worldSize);
        this.coordinate = util.location(worldSize, this.x, this.y);
        this.age = age;
        // console.log('added plant');
    }

    /**
     * 1. This object defines the CSS class, game value, and returned health of a plant (these are functions of plant age).
     * 2. This property currently overrides the brain's rewardManual object.
     * @type {Object}
     */
    Plant.prototype.manual = {
        1: {
            worth: 1,
            health: 0,
            reward: 5
        },
        2: {
            worth: 2,
            health: 0,
            reward: 5
        },
        3: {
            worth: 4,
            health: 0,
            reward: 5
        },
        4: {
            worth: 1,
            health: 0,
            reward: 5
        },
        5: {
            worth: -5,
            health: -1,
            reward: -100
        }
    };

    /**
     * 1. Ages the current plant once. If this.plant's current age is five, however, the plant age is set to 0 as an indicator of plant death.
     * @return {undefined}
     */
    Plant.prototype.ageOnce = function() {
        this.age = this.age > 3 ? 0 : this.age + 2;
    };

    /**
     * 1. Helper function which returns this.plant's age.
     * @return {String}
     */
    Plant.prototype.getAge = function() {
        return this.age;
    };

    /**
     * 1. Helper function which returns this.plant's health return.
     * @return {Number}
     */
    Plant.prototype.getNutrition = function() {
        return this.manual[this.age].health;
    };

    /**
     * 1. Helper function which returns this.plant's point value (for game scoring).
     * @return {Number}
     */
    Plant.prototype.reap = function() {
        return this.manual[this.age].worth;
    };

    /**
     * 1. Helper function which returns this.plant's reward (for brain learning).
     * @return {Number}
     */
    Plant.prototype.brainFood = function() {
        return this.manual[this.age].reward;
    };

    /**
     *
     *
     *
     * The Garden Constructor.
     * 2. Accepts a number of steps required for plants to age, 'stepsToAge'.
     * @param {Number}
     *
     *
     *
     */
    function Garden(stepsToAge) {
        this.plants = {};
        this.plantLimit = 2;
        this.stepsToAge = stepsToAge;
        this.tracker = 0; //Used in tandem with this.stepsToAge to manage plant aging frequency.
    }

    /**
     * 1. Manages the frequency of adding and aging plants. This function tunes the ratio of Player moves to plant turns (adding and aging).
     * @param  {Number}
     * @return {undefined}
     */
    Garden.prototype.season = function(numberOfNewPlants) {
        if (this.tracker < this.stepsToAge) {
            this.tracker++;
        } else {
            if (Object.keys(this.plants).length >= this.plantLimit) return;
            this.tracker = 0;
            this.agePlants();
            this.addPlants(numberOfNewPlants);
        }

    };

    /**
     * 1. Adds 'num' number of plants to this.garden at random locations.
     * 2. A plant addition will be SKIPPED if the chosen location is occupied by any object.
     * @param {Number}
     * @return {undefined}
     */
    Garden.prototype.addPlants = function(num) {
        //Adds 'num' number of plants to the garden
        for (var i = 0; i < num; i++) {
            var plantToAdd = new Plant(3); //Spawn an age 3 plant for reduced complexity.

            if (this.plants.hasOwnProperty(plantToAdd.coordinate) || util.location(worldSize, player.x, player.y) === plantToAdd.coordinate) {
                return;
            }
            this.plants[plantToAdd.coordinate] = plantToAdd;
        }
    };

    /**
     * 1. Ages all plants in this.garden
     * @return {undefined}
     */
    Garden.prototype.agePlants = function() {
        for (var plot in this.plants) {
            if (this.plants.hasOwnProperty(plot)) {
                var selectedPlant = this.plants[plot];
                selectedPlant.ageOnce();
            }
        }
    };

    /**
     * 1. Helper function which checks for a plant in this.garden at the specified coordinate.
     * @param  {String}
     * @return {Boolean}
     */
    Garden.prototype.hasPlant = function(coordinate) {
        return this.plants.hasOwnProperty(coordinate);
    };

    /**
     * 1. Caches the plant value, returned health, and plant reward.
     * 2. Deletes the plant from this.garden at the specified coordinate.
     * 3. Returns an object of the cached values for later scoring.
     * @param  {String}
     * @return {Object}
     */
    Garden.prototype.trample = function(coordinate) {
        var plantWorth = this.plants[coordinate].reap();
        var plantReward = this.plants[coordinate].brainFood();
        var playerHealth = this.plants[coordinate].getNutrition();
        this.delete(coordinate);
        return {
            value: plantWorth,
            health: playerHealth,
            reward: plantReward
        };
    };

    /**
     * 1. Deletes the plant from this.garden at the specified coordinate.
     * 2. Accepts a '0'-padded string coordinate (see util.location).
     * @param  {String}
     * @return {undefined}
     */
    Garden.prototype.delete = function(coordinate) {
        delete this.plants[coordinate];
    };

    return {
        Plant,
        Garden
    };
};
