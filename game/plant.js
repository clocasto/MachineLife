'use strict';
var util = require('./utility');

module.exports = function(worldSize, player) {
    //constructor for each plant object.
    function Plant(worldSize) {
        this.x = util.randNum(worldSize);
        this.y = util.randNum(worldSize);
        this.coordinate = util.location(worldSize, this.x, this.y);
        this.age = 1;
        // console.log('added plant');
    }
    //maximum age of 4
    Plant.prototype.ageOnce = function() {
        this.age = this.age > 4 ? 0 : this.age + 1;
    };
    //worth is for score, reward is for deepqlearn.  need to decouple these.
    Plant.prototype.manual = {
        1: {
            class: 'one',
            worth: 1,
            health: 0,
            reward: 0.2
        },
        2: {
            class: 'two',
            worth: 2,
            health: 0,
            reward: 0.4
        },
        3: {
            class: 'three',
            worth: 4,
            health: 1,
            reward: 1
        },
        4: {
            class: 'four',
            worth: 1,
            health: 0,
            reward: 0.2
        },
        5: {
            class: 'five',
            worth: -5,
            health: -1,
            reward: -1
        },
        0: {
            class: 'off',
            worth: 0,
            health: 0,
            reward: 0
        }
    };

    Plant.prototype.getAge = function() {
        return this.manual[this.age].class;
    };

    Plant.prototype.getNutrition = function() {
        return this.manual[this.age].health;
    };
    // returns its player score.
    Plant.prototype.reap = function() {
        return this.manual[this.age].worth;
    };
    //returns deepqlearn reward or penalty.
    Plant.prototype.brainFood = function() {
        return this.manual[this.age].reward;
    };

    //
    //
    //

    /**
     * stepsToAge: how many steps it takes for a plant to age
     */

    function Garden(stepsToAge) {
        this.plants = {};
        this.stepsToAge = stepsToAge;
        this.tracker = 0;
    }

    Garden.prototype.season = function(num) {

        if (this.tracker < this.stepsToAge) {
            this.tracker++;
        } else {
            this.tracker = 0;
            this.addPlants(num);
            this.agePlants();
        }

    };

    Garden.prototype.addPlants = function(num) {
        //Adds 'num' number of plants to the garden
        for (var i = 0; i < num; i++) {
            var plantToAdd = new Plant(worldSize);

            if (this.plants.hasOwnProperty(plantToAdd.coordinate) || util.location(worldSize, player.x, player.y) === plantToAdd.coordinate) {
                return;
            }
            this.plants[plantToAdd.coordinate] = plantToAdd;
        }
    };

    Garden.prototype.agePlants = function() {
        //Ages all of the plants in the garden
        for (var plot in this.plants) {
            if (this.plants.hasOwnProperty(plot)) {
                var selectedPlant = this.plants[plot];
                selectedPlant.ageOnce();
            }
        }
    };

    Garden.prototype.hasPlant = function(coord) {
        return this.plants.hasOwnProperty(coord);
    };


    //Returns value, health, and reward, garbage collects a stepped-on plant
    Garden.prototype.trample = function(coord) {
        var plantWorth = this.plants[coord].reap();
        var plantReward = this.plants[coord].brainFood();
        var playerHealth = this.plants[coord].getNutrition();
        this.delete(coord);
        return {
            value: plantWorth,
            health: playerHealth,
            reward: plantReward
        };
    };

    Garden.prototype.delete = function(coord) {
        delete this.plants[coord];
    };

    return {
        Plant,
        Garden
    };
};
