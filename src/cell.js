/**
 * Represents a cell.
 * @constructor
 * @param {object} options - options for new cell extension.
 */
function Cell(options) {
	this.size = 2;
	this.lifeTime = 30;
	this.timeLeft = this.lifeTime;
	this.fatPerIteration = 10;
	this.fatPerMove = 1;
	this.canMove = false;
	this.moveStep = 2;
	this.reproductionAfter = {
		age: 3,
		fat: 30
	};
	this.fatPerReproduce = this.reproductionAfter.fat;
	this.color = [33, 87, 181];

	this.pos = [Math.round(env.maxLeft/(2*this.size)),Math.round(env.maxTop/(2*this.size))];
	this.fat = 0;

	_.extend(this, options || {});
}

Cell.prototype.move = function() {
	if (this.fat > 0) {
		this.fat -= this.fatPerMove;
		var freePlace = this.getNearestFreePlace();
		if (freePlace) {
			if (env.places[this.pos[0]] && env.places[this.pos[0]][this.pos[1]]) {
				delete env.places[this.pos[0]][this.pos[1]];
			}
			if (_.isUndefined(env.places[freePlace[0]])) {
				env.places[freePlace[0]] = [];
			}
			env.places[freePlace[0]][freePlace[1]] = true;

			this.pos = freePlace;
		}
	}

	return this;
};

Cell.prototype.ass = function() {return 'ass';};


Cell.prototype.reproduce = function() {
	var nearestPlace, options;

	this.fat -= this.fatPerReproduce;
	nearestPlace = this.getNearestFreePlace();

	if (!nearestPlace) return false;

	options = this.getChildOptions({pos: nearestPlace});

	return new Cell(options);
};

Cell.prototype.canReproduce = function() {
	var options = this.reproductionAfter;
	return this.fat >= options.fat && 
			env.population.length < env.maxPopulation && 
			(this.lifeTime - this.timeLeft >= options.age);
};

Cell.prototype.getNearestFreePlace = function() {
	var left = this.pos[0],
		top = this.pos[1],
		res = [];

	for (var i = left + 1; i >= left - 1; i -= 1) {
		if (i < env.maxLeft && i >= 0) {
			for (var j = top + 1; j >= top - 1; j -= 1) {
				if (j < env.maxTop && j >= 0 && (_.isUndefined(env.places[i]) || _.isUndefined(env.places[i][j]))) {
					res.push([i, j]);
				}
			}
		}
	}
	if (res.length > 0) {
		var index = Math.round(Math.random()*res.length);
		return res[index];
	}
	//console.log('NOT FOUND');
	return false;
};

Cell.prototype.getChildOptions = function(defaults) {
	var randVal = Math.round(Math.random()*env.chance);
	var options = defaults || {};
	var reproductionAge;

	options.reproductionAfter = this.reproductionAfter;

	reproductionAge = this.reproductionAfter.age + (Math.round(Math.random()*10) > 5 ? -1 : 1);
	options.reproductionAfter.age = reproductionAge > 0 && reproductionAge < options.lifeTime ? reproductionAge : 1;
	options.reproductionAfter.fat = options.reproductionAfter.age*10;

	return _.extend(
		options,
		randVal > env.chance/2 ? this.getMutatedLifeTime() : {},
		randVal == Math.round(env.chance/3) ? this.getMutatedColor() : {color: this.color},
		randVal > env.chance/10 && randVal < 2*env.chance/10 ? this.getMutatedMobility() : {}
	);
};


//mutations

/**
 * Changes cells lifeTime
 * @returns {Object} Returns object with new lifeTime and lifeLeft of cell
 */
Cell.prototype.getMutatedLifeTime = function() {
	var lifeRandom = Math.round(Math.random()*10);
	var lifeTime = this.lifeTime + (lifeRandom > 5 ? (5 - lifeRandom) : lifeRandom);

	return {
		lifeTime: lifeTime,
		timeLeft: lifeTime
	};
};

/**
 * Changes cells color
 * @returns {Object} Returns new color of cell
 */
Cell.prototype.getMutatedColor = function() {
	var colorNum = Math.round(Math.random()*3);
	var color = [];

	for (var i = 0; i < 3; i++) {
		if (i == colorNum) {
			color[i] = this.color[colorNum] + 5 < 255 ? this.color[colorNum] + 5 : 0;
		} else {
			color[i] = this.color[i];
		}
	}

	return {
		color: color
	};
};

/**
 * Changes cells mobility, cells can't move by default
 * @returns {Object} Returns set of new params including canMove
 */
Cell.prototype.getMutatedMobility = function() {
	return {
		canMove: true,
		lifeTime: this.lifeTime + 100,
		timeLeft: this.lifeTime + 10,
		fatPerIteration: 15
	};
};