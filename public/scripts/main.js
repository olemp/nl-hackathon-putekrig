/* eslint-env browser */

/**
 * Main
 */
(function () {
    'use strict';

    /**
     * This function is run when the what3words request returns
     * @param three
     */
    function onGetThreeWordsSuccess(three) {
        console.log(three);
        spot.search(three.words[0] + ' OR ' + three.words[1], function(response) {
            console.log(response);
            spot.addTrackToPlaylist(response.tracks.items[0]);
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
