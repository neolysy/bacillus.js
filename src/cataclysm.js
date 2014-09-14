/**
 * @overview Extension for Environment class
 * @author Yevhen Lysyakov
 */

 /**
 * Set of cataclysm methods
 * @mixin
 */
Cataclysm = {

	cataclysm: function() {
		var randVal = Math.round(Math.random() * config.cataclysmChance);

		this.stop();

		switch (randVal) {
			case 1:
				this.lifeTimeCataclysm(this.getSourcePoint());
				break;
			case 2:
				this.colorCataclysm(this.getSourcePoint());
				break;
			default:
				break;
		}

		this.play();
	},

	/**
	 * Removes weak cells depending on lifeTime
	 * @param {array} source - cataclysm source coordinates
	 */
	lifeTimeCataclysm: function(source) {
		console.log('lifeTimeCataclysm');
		
		var self = this;
		var res = [];
		var distanceToSource;
		var cataclysmRadius = Math.random() * config.cataclysmLifeTimeRadius;

		var lifeTimeMax = _.max(this.population, function(cell){ return cell.lifeTime; });
		var lifeTimeMin = _.min(this.population, function(cell){ return cell.lifeTime; });
		var lifeTimePart = (lifeTimeMax.lifeTime + lifeTimeMin.lifeTime) / (2 * cataclysmRadius);

		this.population.forEach(function(cell, index) {
			distanceToSource = Math.sqrt((cell.pos[0] - source[0])*(cell.pos[0] - source[0]) + (cell.pos[1] - source[1])*(cell.pos[1] - source[1]));

			if (distanceToSource < cataclysmRadius) {
				cell.timeLeft -= lifeTimePart * (cataclysmRadius - distanceToSource);
				if (cell.timeLeft < 1) {
					self.places[cell.pos[0]][cell.pos[1]] = 0;
				} else {
					//_.extend(cell, cell.getMutatedColor());
					res.push(cell);		
				}
			} else {
				res.push(cell);
			}
		});

		this.population = res;
	},

	/**
	 * Changes cells color near source point
	 * @param {array} source - cataclysm source coordinates
	 */
	colorCataclysm: function(source) {
		console.log('colorCataclysm');
		
		var res = [];
		var newCell;
		var distanceToSource;
		var cataclysmRadius = Math.random() * 10;
		var i, color;

		var minLifeTimeCell = _.min(this.population, function(cell){ return cell.lifeTime; });
		var minLifeTimePart = minLifeTimeCell.lifeTime/cataclysmRadius;

		this.population.forEach(function(cell, index) {
			distanceToSource = Math.sqrt((cell.pos[0] - source[0])*(cell.pos[0] - source[0]) + (cell.pos[1] - source[1])*(cell.pos[1] - source[1]));

			if (distanceToSource < cataclysmRadius) {
				i = Math.round(Math.random() * 2);
				color = Math.round((cell.color[i] + distanceToSource)%255);
				cell.color[i] = color;
			}
			res.push(cell);
		});

		this.population = res;
	},

	/**
	 * Creates source point
	 * @returns {Array} Returns point coordinates
	 */
	getSourcePoint: function() {
		// defines max positions
		var maxX = _.max(this.population, function(cell){ return cell.pos[0]; });
		var maxY = _.max(this.population, function(cell){ return cell.pos[1]; });

		// cataclysm sourse point coordinates
		return [Math.round( Math.random() * maxX.pos[0] ), Math.round( Math.random() * maxY.pos[1] )];
	}

};