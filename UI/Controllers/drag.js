// threedubmedia.com jQuery drag with handle to grid
jQuery(function($){
	$('.drag').drag(function( ev, dd ){
		$( this ).css({
			top: Math.round( dd.offsetY / 20 ) * 20,
			left: Math.round( dd.offsetX / 20 ) * 20
		});
	},{ handle:".ui-widget-header" });		   
});
jQuery(function($){
	$('.dragPH').drag(function( ev, dd ){
		$( this ).css({
			top: Math.round( dd.offsetY / 20 ) * 20,
			left: Math.round( dd.offsetX / 20 ) * 20
		});
	},{ handle:".ui-widget-header" });		   
});



// jQueryUI drag 
/*
$(function() {
    $( "#draggable" ).draggable({ handle: "p" });
    $( ".drag" ).draggable({handle: "p"});
    $( "#draggable2" ).draggable({ cancel: "p.ui-widget-header" });
    $( "div, p" ).disableSelection();
});
*/