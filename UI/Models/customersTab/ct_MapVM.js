//View Model for Customers Tab Map//

///////
//Map//
///////
	my.customersTabBaseMap = L.tileLayer('http://a.tiles.mapbox.com/v3/camronm.g8mkpol1/{z}/{x}/{y}.png',{
		zoom: 8,
		maxZoom: 18 		
	});	
	
	my.customersTabMap = L.map('customersMap', {
		center: [39.8282,-98.5795],
		zoom: 3,
		layers: [my.customersTabBaseMap],
		dragging: true,		
		zoomControl: false,	
	});


//Add Sidebar Control //
	my.customersSidebar = L.control.sidebar('customersSidebar', {
	    position: 'left'
	});
	my.customersTabMap.addControl(my.customersSidebar);
	$(".sidebarToggle").click(function() {
		my.customersSidebar.toggle();
	});
	setTimeout(function () {
		my.customersSidebar.show();
	}, 200);

////////////////////
//Customer Markers//
////////////////////
	var GeoJsonCustomerGridMarkers = L.mapbox.featureLayer()
		.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json') 
		/*
		.loadURL('../../Resources/data/CustomersGeoMarkerDescription.json')
		.setFilter(function(feature, layer) {
			return feature.properties.user_id == my.salesUserFilter;
		})
		*/
		.addTo(my.customersTabMap)

/////////////////////
//Sales Territories//
/////////////////////
//TODO Create territory color style for each sales ID, this needs to be changed so that it is not hard coded//
	var territoryPolygonStyle = function(feature) {	 		     
	    switch (feature.properties.user_id) {
	    	case "BRRO": return {fillColor: "#005432", color: "#000", weight: 1, fillOpacity: 1};
	    	case "DAWS": return {fillColor: "#003399", color: "#000", weight: 1, fillOpacity: 1};
	        case "DENX": return {fillColor: "#000000", color: "#000", weight: 1, fillOpacity: 1};
	        case "IAHX": return {fillColor: "#000000", color: "#000", weight: 1, fillOpacity: 1};
	        case "JAMT": return {fillColor: "#3366FF", color: "#000", weight: 1, fillOpacity: 1};
	        case "JASM": return {fillColor: "#6600FF", color: "#000", weight: 1, fillOpacity: 1};
	        case "EVON": return {fillColor: "#CC00FF", color: "#000", weight: 1, fillOpacity: 1};
	        case "MAPE": return {fillColor: "#566777", color: "#000", weight: 1, fillOpacity: 1};
	        case "MICO": return {fillColor: "#FF0066", color: "#000", weight: 1, fillOpacity: 1};
	        case "NABR": return {fillColor: "#FF6600", color: "#000", weight: 1, fillOpacity: 1};
	        case "NAVO": return {fillColor: "#666999", color: "#000", weight: 1, fillOpacity: 1};
	        case "PALE": return {fillColor: "#009900", color: "#000", weight: 1, fillOpacity: 1};
	        case "PERI": return {fillColor: "#66FF66", color: "#000", weight: 1, fillOpacity: 1};
	        case "REPF": return {fillColor: "#FFFF00", color: "#000", weight: 1, fillOpacity: 1};
	        case "REWE": return {fillColor: "#66FFFF", color: "#000", weight: 1, fillOpacity: 1};
	        case "MEMU": return {fillColor: "#66FFFF", color: "#000", weight: 1, fillOpacity: 1};
	        case "STFA": return {fillColor: "#FF3300", color: "#000", weight: 1, fillOpacity: 1};
	        case "TIKO": return {fillColor: "#996633", color: "#000", weight: 1, fillOpacity: 1};
	        case "TRGA": return {fillColor: "#FFFFFF", color: "#000", weight: 1, fillOpacity: 1};
	        case "TRLI": return {fillColor: "#ff0000", color: "#000", weight: 1, fillOpacity: 1};
	        case "XXXX": return {fillColor: "#000000", color: "#000", weight: 1, fillOpacity: 1};
		   }
	};

	$.getJSON("../../Resources/data/vSalesTerritories.json", function(data) {		
	    var GeoJsonCustomerGridTerritories = new L.geoJson(data, {
	    	onEachFeature: function (feature, layer) {
	    		layer.bindPopup(feature.properties.description);
	    	},
	    	style: territoryPolygonStyle, 
	    	});
	    GeoJsonCustomerGridTerritories.addTo(my.customersTabMap);
	});