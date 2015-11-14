var spot = {};

(function(spot) {

    var baseURL = 'https://api.spotify.com/v1/';

    var access_token,
        refresh_token,
        error;

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
                    return;
                }
            }

            // Could not find our custom playlist for current user, lets create it!
            createCustomPlaylist(playlistName);
        });
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
        $.ajax({
            url: 'https://api.spotify.com/v1/users/'+clientId+'/playlists/'+playlistId+'/tracks?uris=' + track.uri,
            method : 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {},
        });
    };

    spot.init = function() {
        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');

        var oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');

        var params = getHashParams();

        access_token = params.access_token;
        refresh_token = params.refresh_token;
        error = params.error;


        if (error) {
            alert('There was an error during the authentication');
        } else {
            if (access_token) {
                // render oauth info
                oauthPlaceholder.innerHTML = oauthTemplate({
                    access_token: access_token,
                    refresh_token: refresh_token
                });

                $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        try {
                            sessionStorage.setItem('spotify.userdata', JSON.stringify(response));
                        }catch(e){};

                        userProfilePlaceholder.innerHTML = userProfileTemplate(response);
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

            document.getElementById('obtain-new-token').addEventListener('click', function() {
                $.ajax({
                    url: '/refresh_token',
                    data: {
                        'refresh_token': refresh_token
                    }
                }).done(function(data) {
                    access_token = data.access_token;
                    oauthPlaceholder.innerHTML = oauthTemplate({
                        access_token: access_token,
                        refresh_token: refresh_token
                    });

                    try {
                        sessionStorage.setItem('spotify.accessToken', access_token);
                        sessionStorage.setItem('spotify.refreshToken', refresh_token);
                    }catch (e) {};
                });
            }, false);
        }
    };

    return spot;
})(spot);