var eq = {};

(function(eq) {

    var eqContainer,
        eqColumnHtml,
        nColumns;

    eq.init = function() {
        eqContainer = $(".equaliser-container");
        eqColumnHtml = $(".equaliser-column").parent().html();
        eq.hide(); // Hide single col by default.

        var eqColumnWidth = 32;

        var currentWidth = $(window).width();
        nColumns = Math.ceil( currentWidth / eqColumnWidth );
    };

    eq.show = function() {
        appendEQ(nColumns);
        eqContainer.fadeIn();
    }

    eq.hide = function() {
        eqContainer.fadeOut('slow', function() {
            eqContainer.empty();
        });
    }

    function appendEQ(n) {
        eqContainer.append(eqColumnHtml);

        if(n>0) {
            setTimeout(function() { appendEQ(n-1) }, n*1.4);
        }
    }

    return eq;
})(eq);