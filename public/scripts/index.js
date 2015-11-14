var app = angular.module('home', []);
app.controller('mainCtrl', function($scope, Parse) {

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
	};
<<<<<<< HEAD
=======

	$scope.stopAdding = function () {
		$scope.stopped = true;
	};

	$scope.restart = function () {
		$scope.playlist = undefined;
		$scope.stopped = false;
	};

>>>>>>> 23e7b05cb5bd2d99348ce88ac9c3c74559157fec
});