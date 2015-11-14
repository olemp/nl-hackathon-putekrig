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
     * Performs a jQuery AJAX call to the w3w api, getting three words from the given position object
     *
     * @param position Position object (https://developer.mozilla.org/en-US/docs/Web/API/Position)
     * @param settings jQuery AJAX settings object
     */
    w3w.getThreeWords = function(position, settings) {
        var baseURL = 'https://api.what3words.com/position?key=QC7EIE5R&lang=en&position=';
        var request = settings || {};

        // Build the URL using the baseURL with API key, and add coordinates from the Position object
        request.url = baseURL + position.coords.latitude + ',' + position.coords.longitude;

        $.ajax(request);
    };


    return w3w;
})(w3w);