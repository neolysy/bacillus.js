/**
 * @overview Demonstrate simpe genetic algoritm.
 * @author Yevhen Lysyakov
 */

/**
 * Represents an Environment.
 * @constructor
 */
function Environment() {
	this.population = [];
	this.places = [];
	this.maxPopulation = 5000;
	this.chance = 100;
	this.canvas = document.getElementById('field');
	this.iterator = null;

	this.init = function() {
		this.canvas.width = config.fieldWidth;
		this.canvas.height = config.fieldHeight;

		this.addCell(new Cell({pos: [150, 150], color: [15, 207, 110]}));
		//this.addCell(new Cell({pos: [75, 75], color: [33, 87, 181]}));
		//this.addCell(new Cell({pos: [85, 65], color: [175, 15, 15]}));

		this.attachEvents();
	};

	/**
	 * Draws cells to the canvas and updates population
	 * @returns {array} Returns updated population array
	 */
	this.render = function() {
		if (config.useCataclysm) {
			this.cataclysm();
		}

		var ctx = this.canvas.getContext('2d');
		var self = this;
		var rgb, canReproduce, tempPopulation;

		tempPopulation = this.removeOldCells(this.population);
		tempPopulation = this.updateLivingPopulation(tempPopulation);

		// draws our cells
		ctx.clearRect ( 0 , 0 , config.fieldWidth, config.fieldHeight );

		tempPopulation.forEach(function(cell, index) {
			rgb = cell.color;
			ctx.fillStyle = "rgb(" + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ")";
			ctx.fillRect(cell.pos[0]*cell.size, cell.pos[1]*cell.size, cell.size, cell.size);
		});

		// just for test
		// tempPopulation.forEach(function(item) {
		// 	tempPopulation.forEach(function(secondItem) {
		// 		if (item.pos[0] == secondItem.pos[0] && item.pos[1] == secondItem.pos[1]) {
		// 			console.log('Blio!');
		// 		}
		// 	});
		// });

		this.population = tempPopulation;
		return this;
	};

	/**
	 * Removes old cells from population and releases free places
	 * @param {array} population - Cells collection
	 * @returns {array} Returns updated population array
	 */
	this.removeOldCells = function(population) {
		var result = [];
		var self = this;

		population.forEach(function(cell) {
			if (cell.timeLeft < 1) {
				self.places[cell.pos[0]][cell.pos[1]] = 0;
			} else {
				result.push(cell);
			}
		});

		return result;
	};

	/**
	 * Updates all living cells in population
	 * @param {array} population - Cells collection
	 * @returns {array} Returns updated population array
	 */
	this.updateLivingPopulation = function(population) {
		var result = [];
		var self = this;

		population.forEach(function(cell) {
			cell.timeLeft--;
			cell.fat += cell.fatPerIteration;
			
			result.push(cell);
			canReproduce = cell.canReproduce(population);

			if (canReproduce) {
				var child = cell.reproduce();
				if (child) {
					if (!self.places[child.pos[0]]) {
						self.places[child.pos[0]] = [];
					}
					self.places[child.pos[0]][child.pos[1]] = 1;

					result.push(child);
				}
			} else if (!canReproduce && cell.canMove) {
				cell.move();
			}
		});

		return result;
	};

	/**
	 * Adds new cell instance to population array
	 * @param {Object} cell - Cell inctance
	 * @returns {Array} Returns updated population array
	 */
	this.addCell = function(cell) {
		if (_.isUndefined(this.places[cell.pos[0]])) {
			this.places[cell.pos[0]] = [];
		}
		this.places[cell.pos[0]][cell.pos[1]] = 1;
		this.population.push(cell);

		return this.population;
	};

	/**
	 * Removes weak cells depending on several conditions
	 * @returns {Object} Returns current environment instance
	 */
	this.cataclysm = function() {
		var randVal = Math.round(Math.random()*200);
		if (randVal !== 27) return;

		console.log('cataclysm');

		this.stop();

		var cond = this.getCataclysmConditions();
		var res = [];

		this.population.forEach(_.bind(function(cell, index) {
			if (cell.lifeTime > cond.lifeTime && cell.timeLeft > cond.timeLeft) {
				_.extend(cell, cell.getMutatedColor());
				res.push(cell);
			} else {
				// @TODO remove condition
				if (this.places[cell.pos[0]]) {
					this.places[cell.pos[0]][cell.pos[1]] = 0;
				}
			}
		}, this));

		this.population = res;
		this.play();

		return this;
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

	/**
	 * Attaches events to canvas
	 * @returns {Object} Returns canvas DOM-element
	 */
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
		this.iterator = setInterval(_.bind(this.render, this), config.timeFrame);
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
