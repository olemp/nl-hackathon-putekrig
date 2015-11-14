var app = angular.module('home', ['angularMoment']);
app.filter('trackDuration', function() {
	return function(ms) {
		var duration = ms;
		var milliseconds = (duration % 1000); duration = Math.floor(duration/1000);
		var seconds = (duration % 60); duration = Math.floor(duration/60);
		var minutes = (duration % 60); duration = Math.floor(duration/60);
		return minutes + ":" + seconds;
	};
})
app.controller('mainCtrl', function($scope, Parse, Location) {

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
				
				Location.getCurrent(function(location) {
					Parse.provider('Trip/').get(sessionStorage.getItem("songwalk-trip-id"))
						.success(function(data) {
							var songs = data.Songs;
							songs.push({
								Artist: trackToAdd.artists[0].name,
								Title: trackToAdd.name,
								TimeAdded: trackToAdd.timeAdded,
								Url: trackToAdd.uri,
								Fetched: location.display,
								Fetched_Coords: location.coords
							});
							Parse.provider('Trip/').edit(data.objectId, { 
								Songs: songs
							})
								.success(function(data) {
									
								});
						}).
						error(function(response) {
							
						});
				});
			}
		});

	}


	$(document).on('userdata-loaded', function (){
		$scope.spotify_userdata = JSON.parse(sessionStorage.getItem("spotify.userdata"));
		$scope.$apply();
	});

	$(document).on('playlist-updated', function() {
		if(!$scope.playlistName) {
			$scope.playlistName = 'Songwalk';
		}
		$scope.playlist = spot.getPlaylist();
		$scope.playlistId = spot.getPlaylistId();
		$scope.$apply();
	});

	$scope.makePlaylist = function() {
		spot.loadPlaylistWithName($scope.playlistName);
		Location.getCurrent(function(location) {	
			Parse.provider('Trip/').create({ 
				From: location.display,
				From_Coords: location.coords,
				Songs: []
			})
				.success(function(data) {
					// Save trip ID
					sessionStorage.setItem("songwalk-trip-id", data.objectId);
					
					// Start spotify job
					w3w.startGeoWatcher(onGetThreeWordsSuccess);
				}).
				error(function(response) {
					
				});
		});		
	};
	
	$scope.stopAdding = function () {
		$scope.stopped = true;
		w3w.stopGeoWatcher();
		Location.getCurrent(function(location) {			
			Parse.provider('Trip/').edit(sessionStorage.getItem("songwalk-trip-id"), { 
				To: location.display,
				To_Coords: location.coords
			})
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