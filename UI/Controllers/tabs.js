(function( $, undefined ) {

$.widget( "ab.tabs", $.ui.tabs, {
		
    _processTabs: function() {

        this._super();

        var iconTabs = this.tablist.find( "> li[data-icon]" );

        iconTabs.each( function( i, v ) {

            var $tab = $( v ),
                iconClass = $tab.attr( "data-icon" ),
                iconClasses = "ui-icon " + iconClass + " ui-tabs-icon",
                $icon = $( "<span/>" ).addClass( iconClasses ),
                $anchor = $tab.find( "> a.ui-tabs-anchor" ),
                $text = $( "<span/>" ).text( $anchor.text() );

            $anchor.empty()
                   .append( $icon )
                   .append( $text );

        });
    },

    _destroy: function() {

        var iconTabs = this.tablist.find( "> li[data-icon]" );

        iconTabs.each( function( i, v ) {

            var $anchor = $( v ).find( "> a.ui-tabs-anchor" ),
                text = $anchor.find( "> span:not(.ui-icon)" ).text();

            $anchor.empty().text( text );

        });

        this._super();

    }

});

})( jQuery );

$(function() {
	//Checking for existing HTML content and if exists do not reload the page
    function tabLoad( e, ui ) {
        if ( ui.panel.html() !== "" ) {
            ui.jqXHR.abort();
        }
        else {
            ui.jqXHR.error(function( data ) {
                $( "<p/>" ).addClass( "ui-corner-all ui-state-error" )
                           .css( "padding", "4px" )
                           .text( data.statusText )
                           .appendTo( ui.panel );
            });
        }
    }

    $( "#tabs" ).tabs({
        beforeLoad: tabLoad,
    	show: {
    		effect: "fade",
    		duration: 300,
    		//effect: "fade",
    		//direction: "left"
    	},
    	/*
    	hide: {
    		effect: "fade",
    		//dircection: "right"
    	}
    	*/
    });

});




