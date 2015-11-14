/* eslint-env browser */

/**
 * Main
 */
(function () {
    'use strict';

    var lastTrackAdded;

    /**
     * This function is run when the what3words request returns
     * @param three
     */
    function onGetThreeWordsSuccess(three) {
        console.log(three);
        spot.search(three.words[0] + ' OR ' + three.words[1], function(response) {
            var trackToAdd = response.tracks.items[0];

            // Don't repeatedly add the same track if the user is stationary
            if(lastTrackAdded.uri !== trackToAdd.uri) {
                spot.addTrackToPlaylist(trackToAdd);
                lastTrackAdded = trackToAdd;
            }
        });

    }


    $(document).ready(function() {
        spot.init();

        $('#start-playing').click(function () {
            w3w.startGeoWatcher(onGetThreeWordsSuccess);
        });


        $('#stop-playing').click(function () {
            w3w.stopGeoWatcher();
        });
    });
})();
