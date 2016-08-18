'use strict';
var util = require('./utility');

module.exports = function(worldSize, player) {

    function Plant(worldSize) {
        this.x = util.randNum(worldSize);
        this.y = util.randNum(worldSize);
        this.coordinate = util.location(worldSize, this.x, this.y);
        this.age = 1;
        // console.log('added plant');
    }

    Plant.prototype.ageOnce = function() {
        this.age = this.age > 4 ? 0 : this.age + 1;
    };

    Plant.prototype.manual = {
        1: {
            class: 'one',
            worth: 1,
            health: 0
        },
        2: {
            class: 'two',
            worth: 2,
            health: 0
        },
        3: {
            class: 'three',
            worth: 4,
            health: 1
        },
        4: {
            class: 'four',
            worth: 1,
            health: 0
        },
        5: {
            class: 'five',
            worth: -5,
            health: -1
        },
        0: {
            class: 'off',
            worth: 0,
            health: 0
        }
    };

    Plant.prototype.getAge = function() {
        return this.manual[this.age].class;
    };

    Plant.prototype.getNutrition = function() {
        return this.manual[this.age].health;
    };

    Plant.prototype.reap = function() {
        return this.manual[this.age].worth;
    };

    //
    //
    //

    function Garden() {
        this.plants = {};
    }

    Garden.prototype.season = function(num) {
        this.addPlants(num);
        this.agePlants();
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

    Garden.prototype.trample = function(coord) {
        //Returns points and garbage collects a stepped-on plant
        var plantWorth = this.plants[coord].reap();
        var playerHealth = this.plants[coord].getNutrition();
        this.root(coord);
        return {value: plantWorth, health: playerHealth};
    };

    Garden.prototype.root = function(coord) {
        delete this.plants[coord];
    };

    return {
        Plant,
        Garden
    };
};
