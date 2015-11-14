/* eslint-env browser */

/**
 * Main
 */
(function () {
    'use strict';


    $(document).ready(function() {
        $('#start-playing').click(function () {
            w3w.startGeoWatcher();
        });


        $('#stop-playing').click(function () {
            w3w.stopGeoWatcher();
        });
    });
})();
