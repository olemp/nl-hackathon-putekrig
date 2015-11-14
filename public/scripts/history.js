var app = angular.module('history', ['angularMoment']);
app.controller('latestTripsCtrl', function($scope, Parse) {	
    Parse.provider('Trip/').getAll()
	.success(function(data) {
		$scope.trips = data.results;
	}).
	error(function(response) {
		
	});
});
app.controller('statisticsCtrl', function($scope) {
    $scope.statistics = {
		"Total trips": 148,
		"Songs added": 5430,
		"Trips this week": 5,
		"Songs this week": 9,
		"Trips this month": 12,
		"Songs this month": 19,
		"Trips this year": 30,
		"Songs this year": 600
	};
});