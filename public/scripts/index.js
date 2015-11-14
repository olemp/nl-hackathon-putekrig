var app = angular.module('home', []);
app.controller('mainCtrl', function($scope, Parse) {

	var lastTrackAdded;

	/**
	 * This function is run when the what3words request returns
	 * @param three
	 */
	function onGetThreeWordsSuccess(three) {
		console.log(three);
		spot.search(three.words[0] + ' OR ' + three.words[1], function(response) {
			var trackToAdd = response.tracks.items[0];

			// Don't repeatedly add the same track if the user is stationary
			if(!lastTrackAdded || lastTrackAdded.uri !== trackToAdd.uri) {
				spot.addTrackToPlaylist(trackToAdd);
				lastTrackAdded = trackToAdd;
			}
		});

	}


	$(document).on('userdata-loaded', function (){
		$scope.spotify_userdata = JSON.parse(sessionStorage.getItem("spotify.userdata"));
		console.log($scope.spotify_userdata);
		$scope.$apply();
	});

	$(document).on('playlist-updated', function() {
		if(!$scope.playlistName) {
			$scope.playlistName = 'Songwalk';
		}
		$scope.playlist = spot.getPlaylist();
		$scope.playlistId = spot.getPlaylistId();
		console.log($scope.playlistId);
		$scope.$apply();
	});

	$scope.makePlaylist = function() {
		spot.loadPlaylistWithName($scope.playlistName);
		navigator.geolocation.getCurrentPosition(function(geo) {
			Parse.provider('Trip/').create({ From: '{"latitude": "' + geo.coords.latitude + '" "longitude": "' + geo.coords.longitude + '"}' })
				.success(function(data) {
					sessionStorage.setItem("songwalk-trip-id", data.objectId);
				}).
				error(function(response) {
					
				});
		});
		w3w.startGeoWatcher(onGetThreeWordsSuccess);
	};
	
	$scope.stopAdding = function () {
		$scope.stopped = true;
		w3w.stopGeoWatcher();
		navigator.geolocation.getCurrentPosition(function(geo) {
			Parse.provider('Trip/').edit(sessionStorage.getItem("songwalk-trip-id"), { To: '{"latitude": "' + geo.coords.latitude + '" "longitude": "' + geo.coords.longitude + '"}' })
				.success(function(data) {
					sessionStorage.removeItem("songwalk-trip-id");
				}).
				error(function(response) {
					
				});
		});
	};

	$scope.restart = function () {
		$scope.playlist = undefined;
		$scope.stopped = false;
	};

});