/**
 * Represents an Environment.
 * @constructor
 */
function Environment() {
	this.population = [];
	this.places = [];
	this.maxLeft = 1000;
	this.maxTop = 1000;
	this.maxPopulation = 5000;
	this.chance = 500;
	this.canvas = null;
	this.iterator = null;

	this.init = function() {
		this.canvas = document.getElementById('field');
		this.canvas.width = this.maxLeft;
		this.canvas.height = this.maxTop;

		this.addCell(new Cell({pos: [50, 100], color: [15, 207, 110]}));
		this.addCell(new Cell({pos: [75, 75], color: [33, 87, 181]}));
		this.addCell(new Cell({pos: [85, 65], color: [175, 15, 15]}));

		this.attachEvents();
	};

	this.render = function() {
		if (config.useCataclysm) {
			this.cataclysm();
		}

		var ctx = this.canvas.getContext('2d');
		var cellsArr = [];
		var self = this;
		var rgb, canReproduce;

		ctx.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );

		this.population.forEach(function(cell, index) {
			rgb = cell.color;
			ctx.fillStyle = "rgb(" + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ")";
			ctx.fillRect(cell.pos[0]*cell.size, cell.pos[1]*cell.size, cell.size, cell.size);

			cell.timeLeft--;
			cell.fat += cell.fatPerIteration;
			
			if (cell.timeLeft !== 0) {
				cellsArr.push(cell);
				canReproduce = cell.canReproduce();

				if (canReproduce) {
					var child = cell.reproduce();
					if (child) cellsArr.push(child);
				} else if (!canReproduce && cell.canMove) {
					cell.move();
				}
			} else {
				delete self.places[cell.pos[0]][cell.pos[1]];
			}
		});

		this.population = cellsArr;
	};

	/**
	 * Adds new cell instance to population array
	 * @param {object} cell - Cell inctance
	 * @returns {array} Returns updated population array
	 */
	this.addCell = function(cell) {
		if (_.isUndefined(this.places[cell.pos[0]])) {
			this.places[cell.pos[0]] = [];
		}
		this.places[cell.pos[0]][cell.pos[1]] = true;
		this.population.push(cell);

		return this.population;
	};

	this.cataclysm = function() {
		var randVal = Math.round(Math.random()*200);
		if (randVal !== 27) return;

		console.log('cataclysm');

		this.stop();

		var cond = this.getCataclysmConditions();
		var res = [];

		this.population.forEach(_.bind(function(cell, index) {
			if (cell.lifeTime > cond.lifeTime && cell.timeLeft > cond.timeLeft) {
				_.extend(cell, cell.changeColor());
				res.push(cell);
			} else {
				this.places[cell.pos[0]][cell.pos[1]] = undefined;
			}
		}, this));

		this.population = res;
		this.play();
	};

	this.getCataclysmConditions = function() {
		var lifeTimeMax = _.max(this.population, function(cell){ return cell.lifeTime; });
		var lifeTimeMin = _.min(this.population, function(cell){ return cell.lifeTime; });
		var lifeTime = (lifeTimeMax.lifeTime + lifeTimeMin.lifeTime)/2;

		return {
			lifeTime: lifeTime,
			timeLeft: lifeTime/2
		};
	};

	this.attachEvents = function() {
		this.canvas.addEventListener('click', _.bind(function() {
			this[this.iterator ? 'stop' : 'play']();
		}, this), false);

		return this.canvas;
	};

	/**
	 * Starts population actions
	 * @returns {Object} Returns current environment instance
	 */
	this.play = function() {
		this.iterator = setInterval(_.bind(this.render, this), 100);
		return this;
	};

	/**
	 * Stops all actions in environment
	 * @returns {Object} Returns current environment instance
	 */
	this.stop = function() {
		clearInterval(this.iterator);
		this.iterator = null;

		return this;
	};
}

(function() {
	env = new Environment();
	env.init();
})();
