var app = angular.module('history', ['angularMoment']);
app.controller('historyCtrl', function($scope, Parse) {	
	try {
		var username = JSON.parse(sessionStorage.getItem("spotify.userdata")).id;
	} catch(e) {
		
	}
	
    Parse.provider('Trip/').getAll()
	.success(function(data) {
		$scope.trips = jQuery.grep(data.results, function(val) {
			return (val.username == username && val.endedAt)	
		});
		
		if($scope.trips.length > 0) {
				var totalSongs = 0;
				$scope.trips.forEach(function(trip) {
					totalSongs += trip.Songs.length;
				});
			
				$scope.statistics = {
					"Total trips": $scope.trips.length,
					"Total songs added": totalSongs,
					"Trips this week": $scope.trips.length,
					"Songs this week": totalSongs,
					"Trips this month": $scope.trips.length,
					"Songs this month": totalSongs,
					"Trips this year": $scope.trips.length,
					"Songs this year": totalSongs
				};
		}
	}).
	error(function(response) {
		
	});
	

});