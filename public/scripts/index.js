var app = angular.module('home', []);
app.controller('mainCtrl', function($scope) {
	$scope.spotify_userdata = JSON.parse(sessionStorage.getItem("spotify.userdata"));
	console.log($scope.spotify_userdata);
});