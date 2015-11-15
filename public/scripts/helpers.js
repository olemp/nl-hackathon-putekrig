var helpers = {
	randomWithRange: function(min, max)
	{
		var range = (max - min) + 1;     
		return parseInt((Math.random() * range) + min);
	},
	randomSpinner: function() {
		var spinnerClasses = ["spinner-loader", "throbber-loader", "refreshing-loader", "heartbeat-loader", "gauge-loader", "three-quarters-loader", "wobblebar-loader", "atebits-loader", "whirly-loader", "flower-loader", "dots-loader", "circles-loader", "plus-loader", "ball-loader", "hexdots-oader", "inner-circles-loader", "pong-loader", "pulse-loader"];
		var index = helpers.randomWithRange(0, spinnerClasses.length-1);
		return spinnerClasses[index] || spinnerClasses[0];
	}
}