utils = {
	logOnce: function (data) {
		if (!window.isShownOnce) {
			window.isShownOnce = true;
			console.log(data);
		}
	}
};