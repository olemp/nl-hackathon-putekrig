var app = angular.module('trip', ['uiGmapgoogle-maps', 'angularMoment']);
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
		zoom: 12,
		markerEvents: {
			mouseover: function(e) {
				$scope.selectedSong = e.key;
			},
			mouseout: function(e) {
				$scope.selectedSong = -1;
			}
		}
	};
	
     Parse.provider('Trip/').get(document.location.pathname.split("/").slice(-1)[0])
		.success(function(data) {
			$scope.trip = data;
			var firstSong = data.Songs[0];
		
			if(firstSong) {
				// Setting center of map to the location of the first song
				$scope.map.center = firstSong.Fetched_Coords;
			}
		}).
		error(function(response) {
			
		});
		
	$scope.delete = function(obj) {
		 Parse.provider('Trip/').delete($scope.trip.objectId)
		.success(function(data) {
			document.location.href = "/history";
		}).
		error(function(response) {
			
		});
	}
});