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
		zoom: 11,
		events: {
			zoom_changed: function(e) {
				
			}	
		},
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
						
			// Calculcates duration
			var duration = moment.duration(moment(data.endedAt.iso).diff(moment(data.createdAt)));
			console.log(duration);
			$scope.trip.duration = "Approx " + ((parseInt(duration.asHours()) > 0 ) ? duration.asHours().toFixed(0) + " hour(s), " : "");
			
			var firstSong = data.Songs[0];
		
			if(firstSong) {
				// Setting center of map to the location of the first song
				$scope.map.center = firstSong.Fetched_Coords;
			}
		}).
		error(function(response) {
			
		});
		
	$scope.centerMapOnSong = function(song, zoom) {
		$scope.map.center = song.Fetched_Coords;
		$scope.map.zoom = zoom;
	}
		
	$scope.trackLink = function(song) {
		var songId = song.Url.replace("spotify:track:", "");
		return "https://open.spotify.com/track/" + songId;
	}
		
	$scope.delete = function(obj) {
		 Parse.provider('Trip/').delete($scope.trip.objectId)
		.success(function(data) {
			document.location.href = "/history";
		}).
		error(function(response) {
			
		});
	}
});