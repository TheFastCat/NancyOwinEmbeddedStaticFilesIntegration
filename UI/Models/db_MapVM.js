////////////////////////////////////
//////// Leaflet Map widget ////////
////////////////////////////////////				 		

my.mapThemes = {
	"BaseMap" : L.mapbox.tileLayer('nusspsg.ijad3n54'), 
	"Dark Map" : L.mapbox.tileLayer('nusspsg.hei0f283'),
	"Satellite View" : L.mapbox.tileLayer('nusspsg.hehpcjf4'),
	"Road Map" : L.mapbox.tileLayer('nusspsg.hi7noiaj'),
};	

my.map = L.map('map', {
	center: [49.8282,-98.5795],
	zoom: 3,
	layers: my.mapThemes.BaseMap,
	dragging: true,		
	zoomControl: false,	
});


// Add zoom control //
L.control.zoom({
	position: "bottomleft"
}).addTo(my.map);

my.map.on('enterFullscreen', function(){
  if(window.console) window.console.log('enterFullscreen');
});

my.map.on('exitFullscreen', function(){
  if(window.console) window.console.log('exitFullscreen');
});	

// Add fullscreen control  NOT CURRENTLY USING, BUT MAY IN THE FUTURE//
/*
L.control.fullscreen({
  position: 'bottomright',
  title: 'Show me the fullscreen !'
}).addTo(my.map);
*/

// Add find me control //
L.control.locate({
	position: "bottomright"
}).addTo(my.map);

// Add Sidebar Control  NOT CURRENTLY USING, BUT MAY IN THE FUTURE//
/*
my.sidebar = L.control.sidebar('sidebar', {
    position: 'left'
});
my.map.addControl(my.sidebar);
$(".sidebarToggle").click(function() {
	my.sidebar.toggle();
});
*/

//Add Optimized Route Control //
$(".optimizeRouteButton").click(function() {		
	$( "#optimizedRouteMapContainer" ).dialog( "open" );
	initGoogleOptimizeRoute();
});

my.customerMarkerOptions = {
	    radius: 8,
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
	};

L.control.layers(my.mapThemes).addTo(my.map);	

//////////////////////////////
// Sales Territories GeoJson//
//////////////////////////////
var GeoJsonSalesTerritories = L.mapbox.featureLayer()	
	.loadURL('../../Resources/data/TerritoriesGeom.json')
	.setFilter(function (feature, layer) {	
		return feature.properties.user_id == my.salesUserFilter
		&& feature.properties.cb_status == my.cbStatusFilter; 
	})	
	.addTo(my.map);

/////////////////////////////////
// Customer ABCD Marker GeoJson//
/////////////////////////////////
var GeoJsonCustomerMarkers = L.mapbox.featureLayer()
	.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
	.setFilter(function (feature, layer) {		
		return feature.properties.cb_status == 'A'
		|| feature.properties.cb_status == 'B'
		|| feature.properties.cb_status == 'C'
		|| feature.properties.cb_status == 'D'; 
	})
	.addTo(my.map);

///////////////////////////////
// NewBusiness Marker GeoJson//
///////////////////////////////
var GeoJsonNewBusinessMarker = L.mapbox.featureLayer()
	.addTo(my.map);

////////////////////////////////
//QuotesPending Marker GeoJson//
////////////////////////////////
var GeoJsonQuotesPendingMarker = L.mapbox.featureLayer()
	.addTo(my.map);

///////////////////////////
//Service Failure GeoJson//
///////////////////////////
var GeoJsonServiceFailuresMarkers = L.mapbox.featureLayer()
	.addTo(my.map);

var GeoJsonServiceFailurePolyline = L.mapbox.featureLayer()		
	.on('layeradd', function() {
		GeoJsonServiceFailurePolyline.setStyle({
			color: 'gray',
			weight: 5
		});	
		GeoJsonServiceFailurePolyline.eachLayer(function(layer) {			
		    var content = 
		        '<p><b>Shipper: </b>' + layer.feature.properties.ShpCompany + '<br />' +
		        '<b>Consignee: </b>' + layer.feature.properties.ConCompany + '<br />' +
		        '<b>Third Party: </b>' + layer.feature.properties.ThdCompany + '<br /></p>' 		        
		    layer.bindPopup(content);		    
		});
	})	
	.addTo(my.map);

////////////////////////////////////
//Service Failure Polyline GeoJson//
////////////////////////////////////
var GeoJsonQuotePolyline = L.mapbox.featureLayer()		
	.on('layeradd', function() {
		GeoJsonQuotePolyline.setStyle({
			color: 'gray',
			weight: 5
		});	
		GeoJsonQuotePolyline.eachLayer(function(layer) {			
		    var content = 
		        '<p><b>Shipper: </b>' + layer.feature.properties.ShpCompany + '<br />' +
		        '<b>Consignee: </b>' + layer.feature.properties.ConCompany + '<br />' +
		        '<b>Third Party: </b>' + layer.feature.properties.ThdCompany + '<br /></p>' 		        
		    layer.bindPopup(content);		    
		});
	})	
	.addTo(my.map);


////////////////////////
// Map Event Handlers TODO- NEED TO ADD EVENT HADLERS FOR MAKER CLICK EVENTS//
////////////////////////


//////////////////////////////////
//Google map for optimized route//
//////////////////////////////////
var suggestedRouteMap;
var coords = new Object();
var markersArray = [];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
coords.lat = 44.856051;
coords.lng = -93.242539;
var latlng = new google.maps.LatLng(coords.lat, coords.lng);
    
$(function() { 
	$("#dateToRoute").datepicker();
	$("#dateToRoute").on('change', function() {
		my.dateToRouteInput = $("#dateToRoute").val();
		var dateToRouteEndDate = moment(my.dateToRouteInput).add('days',1).format('MM/DD/YYYY');
		var retArray=[];
		var retString;
		var retAddresses=[];
		var retCustomerId=[];
		
		$.getJSON(my.apiBase + 'notes'
				+ '?Start=' + my.dateToRouteInput 
				+ '&End=' + dateToRouteEndDate				
				+ '&AssignedTo=' + my.salesUserFilter
				+ '&IsActionable=True'
				+ '&NoteCode=DSMR'
				+ '&IsCompleted=False'				
				, function (data) {
					$.each(data, function(index, value) {
						retArray.push('&Ids=' + data[index].CustomerId);
						retString = retArray.join('');						
					});
					
					$.getJSON(my.apiBase + 'customers?' + retString, function(data) {						
						$.each(data, function(index, value) {											
							my.myPlannerActivitiesToRoute.push(data[index].Street1 + ' ' + data[index].City + ' ' + data[index].State + ' ' + data[index].Zip);
							my.myPlannerCustomersToRoute.push(data[index].CustomerName);							
						});
					});
		});
	});
	
	$("#optimizedRouteMapContainer").dialog({
		autoOpen:false,
		width: 1010,
		height: 758,
		modal: true,
		resizeStop: function(event, ui) {google.maps.event.trigger(suggestedRouteMap, 'resize')  },
		open: function(event, ui) {google.maps.event.trigger(suggestedRouteMap, 'resize'); }      
	});  
	
	initGoogleOptimizeRoute(); 
});
    
function calcRoute() {
	var start = $('#start').val();
	var end = $('#end').val();
	var waypts = [];
	var checkboxArray = my.myPlannerActivitiesToRoute;
	var retString;
	var retArray=[];
	var retAddressArray=[];
	
	/*  //to use checkboxes for waypoint from alerts array */
	//var checkboxArrayAlertsToRoute = $('#alertsToRouteInput :selected');
	var checkboxArrayAlertsToRoute = document.getElementById('alertsToRouteInput');
	for (var i = 0; i < checkboxArrayAlertsToRoute.length; i++) {		
		if (checkboxArrayAlertsToRoute.options[i].selected == true) {
		  
		  retArray.push('&Ids=' + checkboxArrayAlertsToRoute[i].value);
		  
		  $.each(retArray, function(index, value) { 
			  retString = retArray.join('');
		  });
		  
		  $.getJSON(my.apiBase + 'customers?' + retString, function(data) {
			  $.each(data, function(index, value) {				  
				  my.myPlannerActivitiesToRoute.push(data[index].Street1 + ' ' + data[index].City + ' ' + data[index].State + ' ' + data[index].Zip);
				  my.myPlannerCustomersToRoute.push(data[index].CustomerName);
			  });
		  
			  				
				
							  	  
		  });
		}
	};
	
	for (var i = 0; i < my.myPlannerActivitiesToRoute.length; i++) {
		waypts.push({
	        location:checkboxArray[i],
	        stopover:true});
    };
	
	var request = {
			origin: start,
		    destination: end,
		    waypoints: waypts,
		    optimizeWaypoints: true,
		    travelMode: google.maps.TravelMode.DRIVING
	};
	
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			var route = response.routes[0];
			
			var summaryPanel = document.getElementById('directions_panel');						
			summaryPanel.innerHTML = '';
			// For each route, display summary information.						
			for (var i = 0; i < route.legs.length; i++) {
				var routeSegment = i + 1;
				summaryPanel.innerHTML += '<b>' + my.myPlannerCustomersToRoute[i] + '</b><br>';
				summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';				
				summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
				summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
				summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
			}
			
	    }
	});
	
	
};

function clearRoute() {
	$('#waypoints').empty();
	$('#directions_panel').empty();
	$('#start').val('');
	$('#end').val('');
	$('#dateToRoute').val('');
	my.myPlannerActivitiesToRoute = [];
	my.myPlannerCustomersToRoute = [];
	initGoogleOptimizeRoute();	
};
    
function initGoogleOptimizeRoute() { 
	var mapOptions = {
		zoom: 4,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false
	};
	
	suggestedRouteMap = new google.maps.Map(document.getElementById("optimizedRouteMapCanvas"),  mapOptions);  
	   
	directionsDisplay = new google.maps.DirectionsRenderer();
		var mapOptions = {
		zoom: 4,
		center: latlng
	};
	  
	directionsDisplay.setMap(suggestedRouteMap);
                     
}; 




////////////////////////////////////////////////////////////////////////////////
///////// D3 SVG customer dots think about replacing with 3d bar charts ////////
//////// Change and click events not working 							////////
////////////////////////////////////////////////////////////////////////////////
/*
//Define width, height, padding
var w = 180;
var h = 236;
var wMap = 500;
var hMap = 300;
var padding = 5;
var barPadding = 1;

// Define color //
var color = d3.scale.category20();								
		
//////// Formatters ////////
var formatAsPercentage = d3.format("1%"),
	formatNumber = d3.format(",d"),
  	formatChange = d3.format("+,d"),
  	formatDate = d3.time.format("%B %d, %Y"),
  	formatTime = d3.time.format("%I:%M %p");

//////////////////////////////
///////// Declare svg ////////
//////////////////////////////

var svgLMap = d3.select(map.getPanes().overlayPane)
		.append("svg"),
	g = svgLMap
		.append("g")
		.attr("class", "leaflet-zoom-hide");

///////////////////////////////
//Sales Territories GeoJSON //
///////////////////////////////
d3.json("../../Resources/data/CustomersGeo.json", function(jsonSalesTerritories) {			
	var transform = d3.geo.transform({point: projectPoint}),
	      path = d3.geo.path().projection(transform),
	      bounds = path.bounds(jsonSalesTerritories);
		
	var feature = g.selectAll("path")
		    .data(jsonSalesTerritories.features)
		    .enter().append("path");
	
	////////////////////////////////////
	///////// Set x and y scale ////////
	////////////////////////////////////
	var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) { return d.CompletionPercent; })])  
		.range([padding, w - padding * 2 ]);
	var yScale = d3.scale.ordinal()
		.domain(dataset.my.map(function(d) { return d.Bucket; }))  //([0, d3.max(dataset, function(d) { return d.Bucket; })])
		.rangeRoundBands([padding, h], 0.05);
	
	////////////////////////////////
	////////// Drawing Map /////////
	////////////////////////////////			
		my.map
			.on("viewreset", reset);
			reset();
			
		function reset() {
			var topLeft = bounds[0],
				bottomRight = bounds[1];
		
			svgLMap
				.attr("width", bottomRight[0] - topLeft[0])
		        .attr("height", bottomRight[1] - topLeft[1])
		        .style("left", topLeft[0] + "px")
		        .style("top", topLeft[1] + "px");
		
			g	.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

			feature
				.attr("d", path)    			
				.style("fill", function(d,i) {
		        	return color(i);
		        })
		        .style("opacity", "0.5");
		}
		
		function projectPoint(x,y) {
			var point = my.map.latLngToLayerPoint( new L.LatLng(y,x));
			this.stream.point(point.x, point.y);
		}

	 ////////////////////////////////////
	 ///////// On Change Events ///////// 
	 ////////////////////////////////////  	 
	 d3.select("#salesUserSelect")
	 	.on("change", function(d) {											
	
			//////////////
			//Map change//
			//////////////
			var jsonFiltered = jsonSalesTerritories.features.filter(function(d) {
				return d.properties.user_id == spartan.salesUserFilter;
			});
			var territories = svgLMap.selectAll("path").data(jsonFiltered);
				
				territories.transition()
					.duration(300)						
					.attr("d", path)
					.style("fill", function(d,i) {
		        		return color(i);
		        });
					
				territories.exit()
					.remove();	
	    				              
	 }); //End on change//	
 
	/////////////////////////////////
	///////// On Click Event ////////
	/////////////////////////////////			 			
	d3.selectAll("rect")			 				
		.on("click", function(d) { 	
			//spartan.cbStatusFilter = d.Bucket;			
			GeoJsonCustomerMarkers.refresh("../../Resources/data/CustomersGeo.json"); 
		});
		
	d3.selectAll("text")
		.on("click", function(d) {
			//spartan.cbStatusFilter = d.Bucket; 
			GeoJsonCustomerMarkers.refresh("../../Resources/data/CustomersGeo.json");
		});

});
*/
