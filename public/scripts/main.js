/* eslint-env browser */

/**
 * Main
 */
(function () {
    'use strict';

    /**
     *
     */
    var geoWatcher;

    if ('geolocation' in navigator) {
        // geolocation is available
        getThreeWords();
    } else {
        // geolocation IS NOT available
        console.error('No geolocation makes me a sad panda :-(');
    }

    function getThreeWords() {
        navigator.geolocation.getCurrentPosition(function (position) {
            w3w.getThreeWords(position, {
                success: onThreeWordsSuccess,
            });
        });

        geoWatcher = setTimeout(getThreeWords, 60000); // poll again in one minute
    }

    function onThreeWordsSuccess(words) {
        console.log(words);
    }

    /**
     * Cancels the timeout, stopping new requests from being made to w3w
     */
    function stopPolling() {
        clearTimeout(geoWatcher);
    }
})();
