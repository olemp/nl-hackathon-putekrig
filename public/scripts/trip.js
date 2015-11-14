var app = angular.module('trip', ['uiGmapgoogle-maps']);
app.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true
        });
    }]
)
app.controller('tripCtrl', function($scope, Parse) {
	$scope.map = { 
		center: { latitude: 0, longitude: 0 }, 
		zoom: 12
	};
	
     Parse.provider('Trip/').get(document.location.pathname.split("/").slice(-1)[0])
		.success(function(data) {
			$scope.trip = data;
			var firstSong = data.Songs[0];
			
			if(firstSong) {
				$scope.map.center = firstSong.Fetched_Coords;
			}
		}).
		error(function(response) {
			
		});
});