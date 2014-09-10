var renderAll = function() {
	env.cataclysm();


	var canvas = document.getElementById('field');
	var ctx = canvas.getContext('2d');
	var rgb, 
		cellsArr = [];

	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

	env.cells.forEach(function(cell, index) {
		rgb = cell.color;
		ctx.fillStyle = "rgb(" + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ")";
		ctx.fillRect(cell.pos[0]*cell.size, cell.pos[1]*cell.size, cell.size, cell.size);

		cell.timeLeft--;
		cell.fat += cell.fatPerIteration;
		
		if (cell.timeLeft != 0) {
			cellsArr.push(cell);
		} else {
			env.places[cell.pos[0]][cell.pos[1]] = undefined;
		}

		if (cell.canReproduce()) {
			var child = cell.reproduce();
			if (child) cellsArr.push(child);
		} else if (cell.canMove) {
			cell.move();
		}
	});

	env.cells = cellsArr;
}

function Cell(options) {
	this.size = 2;
	this.lifeTime = 50;
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

	$.extend(this, options || {});

	if (_.isUndefined(env.places[this.pos[0]])) {
		env.places[this.pos[0]] = [];
	}
	env.places[this.pos[0]][this.pos[1]] = true;
	env.cells.push(this);
}

Cell.prototype.move = function() {
	if (this.fat > 0) {
		this.fat -= this.fatPerMove;
		var freePlace = this.getNearestFreePlace();
		if (freePlace) {
			env.places[this.pos[0]][this.pos[1]] = undefined;
			if (_.isUndefined(env.places[freePlace[0]])) {
				env.places[freePlace[0]] = [];
			}
			env.places[freePlace[0]][freePlace[1]] = true;

			this.pos = freePlace;
		}
	}
}

Cell.prototype.reproduce = function() {
	this.fat -= this.fatPerReproduce;

	var nearestPlace = this.getNearestFreePlace();
	if (!nearestPlace) return false;

	var options = this.getChildOptions({pos: nearestPlace});
	return new Cell(options);
}

Cell.prototype.canReproduce = function() {
	var options = this.reproductionAfter;
	return this.fat >= options.fat 
			&& env.cells.length < env.maxPopulation
			&& (this.lifeTime - this.timeLeft >= options.age);
}

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
}

Cell.prototype.getChildOptions = function(defaults) {
	var randVal = Math.round(Math.random()*env.chance),
		options = defaults || {};

	options.reproductionAfter = this.reproductionAfter;

	var reproductionAge = this.reproductionAfter.age + (Math.round(Math.random()*10) > 5 ? -1 : 1);
	options.reproductionAfter.age = reproductionAge > 0 && reproductionAge < options.lifeTime ? reproductionAge : 1;
	options.reproductionAfter.fat = options.reproductionAfter.age*10;

	return $.extend(
		options,
		randVal > env.chance/2 ? this.changeLifeTime() : {},
		randVal == Math.round(env.chance/3) ? this.changeColor() : {},
		randVal > env.chance/10 && randVal < 2*env.chance/10 ? this.changeMovable() : {}
	);
}

//mutations

Cell.prototype.changeSize = function() {
	return {size: this.size + 1};
}

Cell.prototype.changeLifeTime = function() {
	var lifeRandom = Math.round(Math.random()*10);
	var lifeTime = this.lifeTime + (lifeRandom > 5 ? (5 - lifeRandom) : lifeRandom);
	return {
		lifeTime: lifeTime,
		timeLeft: lifeTime
	};
}

Cell.prototype.changeColor = function() {
	var colorNum = Math.round(Math.random()*3);
	var color = this.color;
	color[colorNum] = this.color[colorNum] + 5 < 255 ? this.color[colorNum] + 5 : 0;
	return {
		color: color
	};
};

Cell.prototype.changeMovable = function() {
	return {
		canMove: true,
		lifeTime: this.lifeTime + 100,
		timeLeft: this.lifeTime + 100,
		fatPerIteration: 15,
		reproductionAfter: {
			age: this.reproductionAfter.age - 2,
			fat: this.reproductionAfter.fat - 10
		}
	};
}