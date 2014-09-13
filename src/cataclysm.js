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
		var rand = Math.random();
		var randVal = Math.round(rand * config.cataclysmChance);

		this.stop();

		switch (randVal) {
			case 1:
				this.lifeTimeCataclysm();
				break;
			case 2:
				this.positionCataclysm();
				break;
			case 3:
				break;
		}

		this.play();
	},

	/**
	 * Removes weak cells depending on several conditions
	 * 
	 */
	lifeTimeCataclysm: function() {
		console.log('lifeTimeCataclysm');

		var lifeTimeMax = _.max(this.population, function(cell){ return cell.lifeTime; });
		var lifeTimeMin = _.min(this.population, function(cell){ return cell.lifeTime; });
		var lifeTime = (lifeTimeMax.lifeTime + lifeTimeMin.lifeTime)/2;
		var res = [];

		this.population.forEach(_.bind(function(cell, index) {
			if (cell.lifeTime > lifeTime && cell.timeLeft > lifeTime/2) {
				_.extend(cell, cell.getMutatedColor());
				res.push(cell);
			} else {
				this.places[cell.pos[0]][cell.pos[1]] = 0;
			}
		}, this));

		this.population = res;
	},

	/**
	 * Removes weak cells depending on several conditions
	 */
	positionCataclysm: function() {
		console.log('positionCataclysm');
		
		var res = [];
		var distanceToSource;
		var cataclysmRadius = 200;

		// defines max positions
		var maxX = _.max(this.population, function(cell){ return cell.pos[0]; });
		var maxY = _.max(this.population, function(cell){ return cell.pos[1]; });

		var minLifeTimeCell = _.min(this.population, function(cell){ return cell.lifeTime; });
		var minLifeTimePart = minLifeTimeCell.lifeTime/cataclysmRadius;

		// cataclysm sourse point coordinates
		var randX = Math.round( Math.random() * maxX.pos[0] );
		var randY = Math.round( Math.random() * maxY.pos[1] );

		this.population.forEach(_.bind(function(cell, index) {
			distanceToSource = Math.sqrt((cell.pos[0] - randX)*(cell.pos[0] - randX) + (cell.pos[1] - randY)*(cell.pos[1] - randY));

			if (distanceToSource < cataclysmRadius) {
				cell.timeLeft -= minLifeTimePart * (cataclysmRadius - distanceToSource);
				if (cell.timeLeft < 1) {
					this.places[cell.pos[0]][cell.pos[1]] = 0;
				}
			}

			res.push(cell);
		}, this));

		this.population = res;
	},

};