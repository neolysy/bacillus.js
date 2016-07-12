utils = {
	logOnce: function (data) {
		if (!window.isShownOnce) {
			window.isShownOnce = true;
			console.log(data);
		}
	},
	arraysEqual: function(first, second) {
		var firstArrayLength = first.length;
		if (firstArrayLength != second.length) return false;

		for (var i = 0; i < firstArrayLength; i++) {
			if (first[i] != second[i]) return false;
		}

		return true;
	},
    getDistance: function(p1, p2) {
        return Math.sqrt((p1[0] - p2[0])*(p1[0] - p2[0]) + (p1[1] - p2[1])*(p1[1] - p2[1]));
    }
};
