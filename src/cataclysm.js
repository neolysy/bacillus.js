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
		this.lifeTimeCataclysm();
	},

	/**
	 * Removes weak cells depending on several conditions
	 * @returns {Object} Returns current environment instance
	 */
	lifeTimeCataclysm: function() {
		var randVal = Math.round(Math.random() * config.cataclysmChance);
		if (randVal !== 27) return;

		console.log('cataclysm');

		this.stop();

		var cond = this.getLifeTimeConditions();
		var res = [];

		this.population.forEach(_.bind(function(cell, index) {
			if (cell.lifeTime > cond.lifeTime && cell.timeLeft > cond.timeLeft) {
				_.extend(cell, cell.getMutatedColor());
				res.push(cell);
			} else {
				// @TODO remove condition
				//if (this.places[cell.pos[0]]) {
					this.places[cell.pos[0]][cell.pos[1]] = 0;
				//}
			}
		}, this));

		this.population = res;
		this.play();

		return this;
	},

	/**
	 * Defines lifeTime conditions for cataclysm
	 * @returns {Object} Returns conditions
	 */
	getLifeTimeConditions: function() {
		var lifeTimeMax = _.max(this.population, function(cell){ return cell.lifeTime; });
		var lifeTimeMin = _.min(this.population, function(cell){ return cell.lifeTime; });
		var lifeTime = (lifeTimeMax.lifeTime + lifeTimeMin.lifeTime)/2;

		return {
			lifeTime: lifeTime,
			timeLeft: lifeTime/2
		};
	}
};