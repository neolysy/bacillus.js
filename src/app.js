env = {
	cells: [],
	places: [],
	maxLeft: 1000,
	maxTop: 1000,
	maxPopulation: 5000,
	chance: 1000,

	init: function() {
		var canvas = document.getElementById('field');
		canvas.width = env.maxLeft;
		canvas.height = env.maxTop;

		// creates first cell
		var parent = new Cell();
		// var parent2 = new Cell({pos: [50, 100], color: [15, 207, 110]});
		// var parent3 = new Cell({pos: [150, 100]});
		// var parent4 = new Cell({pos: [200, 150]});
		// var parent5 = new Cell({pos: [300, 200]});

		this.iterator = setInterval(this.render, 100);
	},

	render: function() {
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
			
			if (cell.timeLeft !== 0) {
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
	},

	cataclysm: function() {
		var randVal = Math.round(Math.random()*200);
		if (randVal !== 27) return;

		console.log('cataclysm');

		clearInterval(this.iterator);

		var cond = this.getCataclysmConditions();
		var res = [];

		this.cells.forEach(_.bind(function(cell, index) {
			if (cell.lifeTime > cond.lifeTime && cell.timeLeft > cond.timeLeft) {
				_.extend(cell, cell.changeColor());
				res.push(cell);
			} else {
				this.places[cell.pos[0]][cell.pos[1]] = undefined;
			}
		}, this));

		this.cells = res;
		this.iterator = setInterval(this.render, 100);
	},

	getCataclysmConditions: function() {
		var lifeTimeMax = _.max(this.cells, function(cell){ return cell.lifeTime; }),
			lifeTimeMin = _.min(this.cells, function(cell){ return cell.lifeTime; }),
			lifeTime = (lifeTimeMax.lifeTime + lifeTimeMin.lifeTime)/2;

		return {
			lifeTime: lifeTime,
			timeLeft: lifeTime/2
		};
	}
};

(function() {
	env.init();
})();
