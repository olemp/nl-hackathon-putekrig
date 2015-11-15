app.service('Location', [function() {
	this.getCurrent = function(callback) {
		navigator.geolocation.getCurrentPosition(function(geo) {
			var coords = {lat: geo.coords.latitude, lng: geo.coords.longitude };
			(new google.maps.Geocoder).geocode({'location': coords}, function(results, status) {	
				callback({
					"coords": {
						"latitude": coords.lat,
						"longitude": coords.lng
					},
					"display": results[0].formatted_address.split(",")[0]
				});
			});
		});
	}
	
	return {
		getCurrent: this.getCurrent
	}
}]);