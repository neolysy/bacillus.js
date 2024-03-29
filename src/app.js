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
	this.maxPopulation = config.maxPopulation;
	this.chance = 100;
	this.canvas = document.getElementById('field');
	this.iterator = null;

	this.init = function() {
		// extends current environment with other interfaces
		_.extend(this, Cataclysm);

		this.canvas.width = config.fieldWidth;
		this.canvas.height = config.fieldHeight;

        this.populatePlaces()

		this.addCell(new Cell({pos: [200, 200], color: [15, 207, 110]}));
		this.addCell(new Cell({pos: [400, 400], color: [33, 87, 181]}));
		//this.addCell(new Cell({pos: [85, 65], color: [175, 15, 15]}));

		this.attachEvents();
	};

    this.populatePlaces = function() {
        var i, j;
        for (i = 0; i < config.fieldWidth; i++) {
            if (!this.places[i]) {this.places[i] = [];}
            for (j = 0; j < config.fieldHeight; j++) {
                this.places[i][j] = _.clone(config.place);
            }
        }
    };

	/**
	 * Draws cells to the canvas and updates population
	 * @returns {array} Returns updated population array
	 */
	this.render = function() {
		var ctx = this.canvas.getContext('2d');
		var self = this;
		var rgb, canReproduce, tempPopulation;

		if (config.useCataclysm) this.cataclysm();

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
			if (cell.timeLeft > 0) {
				result.push(cell);
			}
		});

		return result;
	};

    this.updateCells = function() {
        this.places.forEach(function(place) {
            if (place.food == 0 && place.timeFromEmpty < place.timeToProduce) {
                place.timeToProduce++;
            } else {
                place.food += place.growSpeed;
                place.timeFromEmpty = 0;
            }
        });
    }

	/**
	 * Updates all living cells in population
	 * @param {array} population - Cells collection
	 * @returns {array} Returns updated population array
	 */
	this.updateLivingPopulation = function(population) {
		var result = [],
            canReproduce,
            child,
		    self = this,
            place,
            eaten;

        this.updateCells();

		population.forEach(function(cell) {
            place = self.places[cell.pos[0]][cell.pos[1]];
            eaten = place.food > cell.fatPerIteration ? cell.fatPerIteration : place.food
			cell.timeLeft--;

            cell.fat += eaten;

            // updates place
            self.places[cell.pos[0]][cell.pos[1]].food -= eaten;

			result.push(cell);
			canReproduce = cell.canReproduce(population);

			if (canReproduce) {
				child = cell.reproduce();

				if (child) {
					// if (!self.places[child.pos[0]]) {
					// 	self.places[child.pos[0]] = [];
					// }
					// self.places[child.pos[0]][child.pos[1]] = 1;

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
		// if (_.isUndefined(this.places[cell.pos[0]])) {
		// 	this.places[cell.pos[0]] = [];
		// }
		// this.places[cell.pos[0]][cell.pos[1]] = 1;
		this.population.push(cell);

		return this.population;
	};

	/**
	 * Attaches events to canvas
	 * @returns {Object} Returns canvas DOM-element
	 */
	this.attachEvents = function() {
		var x, y;
		var self = this;

		this.canvas.addEventListener('click', _.bind(function(e) {
			//this[this.iterator ? 'stop' : 'play']();
			x = e.pageX - this.canvas.offsetLeft;
  			y = e.pageY - this.canvas.offsetTop;

  			//this.lifeTimeCataclysm([x/2, y/2]);
            this.colorCataclysm([x, y]);
		}, this), false);


		window.onkeyup = function(e) {
			var key = e.keyCode ? e.keyCode : e.which;

			if (key == 80) {
				self[self.iterator ? 'stop' : 'play']();
			}
		};

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
	env.play();
})();
