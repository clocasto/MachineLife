'use strict';

function Plant(worldSize) {
    this.x = this.randNum(worldSize);
    this.y = this.randNum(worldSize);
    this.age = 0;
    this.ages = {
    	1: {class: 'one', worth: 1},
    	2: {class: 'two', worth: 2},
    	3: {class: 'three', worth: 4},
    	4: {class: 'four', worth: 1},
    	5: {class: 'five', worth: -5},
    	0: {class: 'off'}
    }
    console.log('added plant');
}

Plant.prototype.randNum = function(max) {
    return Math.floor(Math.random() * max);
};

Plant.prototype.ageOnce = function() {
	this.age = this.age > 4 ? 0 : this.age + 1;
}

Plant.prototype.getAge = function() {
	return this.ages[this.age].class;
}

Plant.prototype.reap = function() {
	return this.ages[this.age].worth;
}

module.exports = Plant;