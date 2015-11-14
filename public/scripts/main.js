/* eslint-env browser */

/**
 * Main
 */
(function () {
    'use strict';

    $('#start-playing').click(function () {
       w3w.startGeoWatcher();
    });


    $('#stop-playing').click(function () {
        w3w.stopGeoWatcher();
    });
})();
