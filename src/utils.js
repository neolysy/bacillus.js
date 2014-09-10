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
	}
};