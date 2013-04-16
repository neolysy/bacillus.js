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

		//render first cell
		var parent = new Cell();
		//var parent2 = new Cell({pos: [50, 100]});
		//var parent3 = new Cell({pos: [150, 100]});
		// var parent4 = new Cell({pos: [200, 150]});
		// var parent5 = new Cell({pos: [300, 200]});

		this.iterator = setInterval(renderAll, 100);
	},

	cataclysm: function() {
		var randVal = Math.round(Math.random()*100);
		if (randVal !== 27) return;

		console.log('cataclysm');

		clearInterval(this.iterator);

		var cond = this.getCataclysmConditions();
		var res = [];

		this.cells.forEach($.proxy(function(cell, index) {
			if (cell.lifeTime > cond.lifeTime && cell.timeLeft > cond.timeLeft) {
				$.extend(cell, cell.changeColor());
				res.push(cell);
			} else {
				this.places[cell.pos[0]][cell.pos[1]] = undefined;
			}
		}, this));

		this.cells = res;
		this.iterator = setInterval(renderAll, 100);
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

$(function() {
	env.init();

	$('#field').on('click', function(e) {
		var offset = $(this).offset();
		var x = ev.clientX - offset.left;
    	var y = ev.clientY - offset.top;
	});
});
