var spot = {};

(function(spot) {

    var baseURL = 'https://api.spotify.com/v1/';

    /**
     * Makes a request to Spotify web API, searching for tracks with the given query string.
     * Calls success when done, passing the response from the query with maximum five tracks.
     *
     * Example responses available at
     * https://developer.spotify.com/web-api/console/get-search-item/?q=abba&type=track#complete
     *
     * @param query
     * @param success
     */
    spot.search = function (query, success) {
        var url = baseURL + 'search';
        $.ajax({
            url: url,
            data: {
                q: query.replace(' ', '+'),
                type: 'track',
                limit: '5'
            }
        }).done(success);
    };

    return spot;
})(spot);