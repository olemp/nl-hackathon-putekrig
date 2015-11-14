var spot = {};

(function(spot) {

    var baseURL = 'https://api.spotify.com/v1/';

    var access_token,
        refresh_token,
        error;

    var embededPlayerTemplate,
        embededPlayerPlaceholder;

    // Holds tracks that have been collected so far
    var localPlaylist = [];

    var clientId;
    var playlistId;


    ///////////////////////
    // PRIVATE FUNCTIONS //
    ///////////////////////

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    /**
     * Gets the playlist ID for the NL-PK playlist
     */
    function loadPlaylistId() {
        $.ajax({
            url: 'https://api.spotify.com/v1/users/'+clientId+'/playlists',
            data: {
                'access_token': access_token
            }
        }).done(function(data) {

            var playlistName = "NL-PK";
            var listPlaylist = data.items;
            for(var i=0; i<listPlaylist.length; i++) {
                if(listPlaylist[i].name == playlistName) {
                    playlistId = listPlaylist[i].id;
                    renderEmbededPlaylist();
                    return;
                }
            }

            // Could not find our custom playlist for current user, lets create it!
            createCustomPlaylist(playlistName);
        });
    }

    function renderEmbededPlaylist() {
        var playlist = new Object();
        playlist.clientId = clientId;
        playlist.playlistId = playlistId;
        embededPlayerPlaceholder.innerHTML = embededPlayerTemplate(playlist);
    }

    /**
     * Creates the NL-PK playlist if it does not exist
     * @param playlistName
     */
    function createCustomPlaylist(playlistName) {
        $.ajax({
            url: 'https://api.spotify.com/v1/users/'+clientId+'/playlists',
            method : 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: JSON.stringify({
                'name': playlistName,
                'public' : false
            }),
        }).done(function(data) {
            playlistId = data.id;
            renderEmbededPlaylist();
        });
    }

    ///////////////////////
    // PUBLIC  FUNCTIONS //
    ///////////////////////

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
                q: query,
                type: 'track',
                limit: '5'
            }
        }).done(success);
    };

    /**
     * Takes a track object and adds it to the playlist
     * @param track
     * @param playlist
     */
    spot.addTrackToPlaylist = function (track) {
        localPlaylist.push(track);
        $(document).trigger('playlist-updated');

        $.ajax({
            url: 'https://api.spotify.com/v1/users/'+clientId+'/playlists/'+playlistId+'/tracks?uris=' + track.uri,
            method : 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {},
        }).done(function() {
            renderEmbededPlaylist();
        });
    };

    /**
     * Returns a clone of the list of tracks added so far
     *
     * @returns {Array.<T>}
     */
    spot.getPlaylist = function () {
        return localPlaylist.slice();
    };

    spot.init = function() {
        var embededPlayerSource = document.getElementById('embeded-player-template').innerHTML;

        embededPlayerTemplate = Handlebars.compile(embededPlayerSource);
        embededPlayerPlaceholder = document.getElementById('embeded-spotify-player');

        var params = getHashParams();

        access_token = params.access_token;
        refresh_token = params.refresh_token;

        try {
            sessionStorage.setItem('spotify.access_token', access_token);
            sessionStorage.setItem('spotify.refresh_token', refresh_token);
        } catch(e) {};


        error = params.error;

        if (error) {
            alert('There was an error during the authentication');
        } else {
            if (access_token) {
                $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        try {
                            sessionStorage.setItem('spotify.userdata', JSON.stringify(response));
                            $(document).trigger('userdata-loaded');
                        }catch(e){};

                        clientId = response.id;
                        loadPlaylistId();

                        $('#login').hide();
                        $('#loggedin').show();
                    }
                });
            } else {
                // render initial screen
                $('#login').show();
                $('#loggedin').hide();
            }
        }
        
    };

    return spot;
})(spot);