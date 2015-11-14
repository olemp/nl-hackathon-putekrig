var app = angular.module('home', []);
app.controller('mainCtrl', function($scope) {

	$(document).on('userdata-loaded', function (){
		$scope.spotify_userdata = JSON.parse(sessionStorage.getItem("spotify.userdata"));
		console.log($scope.spotify_userdata);
		$scope.$apply();
	});

	$(document).on('playlist-updated', function() {
		$scope.playlist = spot.getPlaylist();
		$scope.$apply();
	});

});