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
		center: { latitude: 45, longitude: -73 }, 
		zoom: 8
	};
	
     Parse.provider('Trip/').get(document.location.pathname.split("/").slice(-1)[0])
		.success(function(data) {
			$scope.trip = data;
			console.log(data);
		}).
		error(function(response) {
			
		});
});