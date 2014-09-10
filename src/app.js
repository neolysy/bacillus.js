/** @namespace */
env = {
	population: [],
	places: [],
	maxLeft: 1000,
	maxTop: 1000,
	maxPopulation: 15000,
	chance: 1000,
	canvas: null,
	iterator: null,

	init: function() {
		this.canvas = document.getElementById('field');
		this.canvas.width = env.maxLeft;
		this.canvas.height = env.maxTop;

		// creates first cell
		
		var parent = new Cell({pos: [50, 100], color: [15, 207, 110]});
		var parent2 = new Cell({pos: [75, 75], color: [33, 87, 181]});
		var parent3 = new Cell({pos: [85, 65], color: [175, 15, 15]});

		this.addCell(parent);
		this.addCell(parent2);
		this.addCell(parent3);

		this.attachEvents();
	},

	render: function() {
		if (config.useCataclysm) {
			env.cataclysm();
		}

		var canvas = document.getElementById('field');
		var ctx = canvas.getContext('2d');
		var cellsArr = [];
		var rgb, canReproduce;

		ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

		env.population.forEach(function(cell, index) {
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
				delete env.places[cell.pos[0]][cell.pos[1]];
			}
		});

		env.population = cellsArr;
	},

	/**
	 * Adds new cell instance to population array
	 * @param {object} cell - Cell inctance
	 * @returns {array} Returns updated population array
	 */
	addCell: function(cell) {
		if (_.isUndefined(this.places[cell.pos[0]])) {
			this.places[cell.pos[0]] = [];
		}
		this.places[cell.pos[0]][cell.pos[1]] = true;
		this.population.push(cell);

		return this.population;
	},

	cataclysm: function() {
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
	},

	getCataclysmConditions: function() {
		var lifeTimeMax = _.max(this.population, function(cell){ return cell.lifeTime; }),
			lifeTimeMin = _.min(this.population, function(cell){ return cell.lifeTime; }),
			lifeTime = (lifeTimeMax.lifeTime + lifeTimeMin.lifeTime)/2;

		return {
			lifeTime: lifeTime,
			timeLeft: lifeTime/2
		};
	},

	attachEvents: function() {
		this.canvas.addEventListener('click', _.bind(function() {
			this[this.iterator ? 'stop' : 'play']();
		}, this), false);

		return this.canvas;
	},

	/**
	 * Starts population actions
	 * @returns {Object} Returns current environment instance
	 */
	play: function() {
		this.iterator = setInterval(this.render, 100);
		return this;
	},

	/**
	 * Stops all actions in environment
	 * @returns {Object} Returns current environment instance
	 */
	stop: function() {
		clearInterval(this.iterator);
		this.iterator = null;

		return this;
	}
};

(function() {
	env.init();
})();
