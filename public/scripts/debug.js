app.service('Debug', [function() {
	this.log = function(msg) {
		if(console && console.log) {
            console.log("TRIP: " + msg)
        }
	}
	
	return {
		log: this.log
	}
}]);