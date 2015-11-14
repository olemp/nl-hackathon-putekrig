/* eslint-env browser */

/**
 * Main
 */
(function() {
    'use strict';

    if ('geolocation' in navigator) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition(function(position) {
            var requestSettings = {
                success: function(words) {
                    console.log(words);
                }
            };

            w3w.getThreeWords(position, requestSettings);
        });

        /* geoWatcher = navigator.geolocation.watchPosition(function(position) {
         updateLocation(position);
         getThreeWords(position);
         }); */
    } else {
        /* geolocation IS NOT available */
        console.error('No geolocation makes me a sad panda :-(');
    }
})();
