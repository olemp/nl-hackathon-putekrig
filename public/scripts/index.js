var app = angular.module('home', ['angularMoment']);
app.filter('trackDuration', function() {
	return function(ms) {
		var duration = Math.floor(ms/1000);
		var seconds = (duration % 60); duration = Math.floor(duration/60);
		var minutes = (duration % 60); duration = Math.floor(duration/60);
		return minutes + ":" + ((seconds.toString()).length == 1 ? "0" + seconds : seconds);
	};
})
app.controller('mainCtrl', function($scope, Parse, Location, Debug) {

	var lastTrackAdded;

	/**
	 * This function is run when the what3words request returns
	 * @param three
	 */
	function onGetThreeWordsSuccess(three) {
		Debug.log("Successfully pulled the words " + three.words.join(", ") + ".");
		Debug.log("Search Spotify Database");
		spot.search(three.words[0] + ' OR ' + three.words[1], function(response) {
			Debug.log("Spotify search returned " + response.tracks.items.length + " results.");
			var trackToAdd = response.tracks.items[0];
			Debug.log("Picking the first result item.");

			// Don't repeatedly add the same track if the user is stationary
			if(!lastTrackAdded || lastTrackAdded.uri !== trackToAdd.uri) {
				spot.addTrackToPlaylist(trackToAdd);
				lastTrackAdded = trackToAdd;
				
				Location.getCurrent(function(location) {
					var tripId = sessionStorage.getItem("songwalk-trip-id");
					Parse.provider('Trip/').get(tripId)
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
							Parse.provider('Trip/').edit(tripId, { 
								Songs: songs
							})
							.success(function(data) {
								Debug.log("Successfully updated trip '" + tripId + "' with new song with Title '" + trackToAdd.name + "'.");
							}).
							error(function(response) {
								Debug.log("Failed to update trip '" + tripId + "' with new song with Title '" + trackToAdd.name + "'.");
							});
						}).
						error(function(response) {
							Debug.log("Failed to update trip '" + tripId + "' with new song with Title '" + trackToAdd.name + "'.");
						});
				});
			} else {
				Debug.log("Song already added to trip/playlist.");
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
		$scope.makingPlaylist = true;
		spot.loadPlaylistWithName($scope.playlistName);
		Location.getCurrent(function(location) {	
			Parse.provider('Trip/').create({ 
				From: location.display,
				From_Coords: location.coords,
				Songs: [],
				username: $scope.spotify_userdata.id || -1
			})
				.success(function(data) {
					// Save trip ID
					sessionStorage.setItem("songwalk-trip-id", data.objectId);
					Debug.log("Trip with ID '" + data.objectId + "' successfully created and persisted as 'songwalk-trip-id' in sessionStorage.");
					
					var pollingInterval = 1000;
					Debug.log("Setting polling interval to " + pollingInterval + ".")
					sessionStorage.setItem("songwalk-polling-interval", pollingInterval.toString());
					
					// Start Spotify job
					w3w.startGeoWatcher(onGetThreeWordsSuccess);
					Debug.log("Starting Spotify Job");
				}).
				error(function(response) {
					Debug.log("Failed to create trip.");
				});
		});		
	};
	
	$scope.stopAdding = function () {
		$scope.stopped = true;
		w3w.stopGeoWatcher();
		Location.getCurrent(function(location) {
			var tripId = sessionStorage.getItem("songwalk-trip-id");			
			Parse.provider('Trip/').edit(tripId, { 
				To: location.display,
				To_Coords: location.coords,
				endedAt: {
					"__type": "Date",
					"iso": new Date().toISOString()
				}
			})
				.success(function(data) {
					sessionStorage.removeItem("songwalk-trip-id");
					Debug.log("Successfully stopped trip with ID '" + tripId + "'.");
				}).
				error(function(response) {
					Debug.log("Failed to stop trip with ID '" + tripId + "'.");
				});
		});
	};

	$scope.restart = function () {
		Debug.log("Restarting.");
		$scope.playlist = undefined;
		$scope.stopped = false;
		Debug.log("Restarted.");
	};

});