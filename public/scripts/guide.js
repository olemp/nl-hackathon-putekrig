var app = angular.module('guide', []);
app.controller('guideCtrl', function($scope) {	
	var pollingInterval = parseInt(sessionStorage.getItem("songwalk-polling-interval"));
	var pollingIntervalMinutes = (pollingInterval/1000);
	$scope.guides = [
		{
			"glyphicon": "play-circle",
			"body": "Start playing"
		},
		{
			"glyphicon": "road",
			"body": "Start moving"
		},
		{
			"glyphicon": "time",
			"body": "Songwalk pulls another song every " + pollingIntervalMinutes + " minutes based on your location"
		},
		{
			"glyphicon": "stop",
			"body": "Stop playing"
		},
		{
			"glyphicon": "floppy-save",
			"body": "Your trip is stored together with your songs on the History page"
		}
	];  
});