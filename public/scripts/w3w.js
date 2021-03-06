/**
 * what3words namespace definition
 *
 * @type {{}}
 */
var w3w = {};

/**
 * Populates the w3w namespace with utility functions
 */
(function(w3w){
    /**
     *
     */
    var geoWatcher;
    var polls = 0;

    /**
     * Starts a one-minute polling of what3words, using the current Position
     *
     * @param onGetPosition Function that gets called whenever getThreeWords returns successfully
     */
    w3w.startGeoWatcher = function(onGetPosition) {
        var pollingInterval = 60000;
        console.log("### Pull #" + (polls+1) + " ###");
        if ('geolocation' in navigator) {
            // geolocation is available
            navigator.geolocation.getCurrentPosition(function (position) {
                w3w.getThreeWords(position, {
                    success: function (words) {
                        onGetPosition(words);
                        polls++;
                    }
                });
            });

            geoWatcher = setTimeout(function() {
                w3w.startGeoWatcher(onGetPosition);
            }, parseInt(pollingInterval)); // poll again in one minute
        } else {
            // geolocation IS NOT available
            console.error('No geolocation makes me a sad panda :-(');
        }
    };

    /**
     * Cancels the timeout, stopping new requests from being made to w3w
     */
    w3w.stopGeoWatcher = function() {
        clearTimeout(geoWatcher);

    };

    /**
     * Performs a jQuery AJAX call to the w3w api, getting three words from the given position object
     *
     * @param position Position object (https://developer.mozilla.org/en-US/docs/Web/API/Position)
     * @param settings jQuery AJAX settings object
     */
    w3w.getThreeWords = function(position, settings) {
        var request = settings || {};
        request.url = '/w3w?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
        $.ajax(request);
    };


    return w3w;
})(w3w);