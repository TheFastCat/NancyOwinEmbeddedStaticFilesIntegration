// ******* NOT BEING USED, BUT KEEP FOR BACKUP THIS IS BUCKETS AND MAP DASHBOARD WIDGETS COMBINED *********** //

///////////////////////////////////////////////////////////////////////
//////// D3 SVG elements for the dashboard -- Buckets and Map ///////// 
//////// *** JSON & GeoJson files being loaded below 	 	  /////////	
///////////////////////////////////////////////////////////////////////

	////////////////////////////////////
	//////// Leaflet Map widget ////////
	////////////////////////////////////				 		

	// Cloudmade map tiles //
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/00819d76c73f47228e66e4999b144ebe/{styleId}/256/{z}/{x}/{y}.png';
	//var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';		 
	var baseMap = L.tileLayer('http://a.tiles.mapbox.com/v3/camronm.g8mkpol1/{z}/{x}/{y}.png',{
		zoom: 8,
		maxZoom: 18 		
  	});			
	var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677}), //attribution: cloudmadeAttribution}),
	    midnight  = L.tileLayer(cloudmadeUrl, {styleId: 999}),   //attribution: cloudmadeAttribution}),
	 	darkness =  L.tileLayer(cloudmadeUrl, {styleId: 98997}); //attribution: cloudmadeAttribution});
	
	var map = L.map('map', {
		center: [39.8282,-98.5795],
		zoom: 3,
		layers: [baseMap],
		dragging: true,		
		zoomControl: false	
	});
	
	var mapThemes = {
		"BaseMap" : baseMap,
		"Minimal" : minimal,
		"Night View" : midnight,
		"Darkness" : darkness
	};			

	map.on('enterFullscreen', function(){
	  if(window.console) window.console.log('enterFullscreen');
	});
	
	map.on('exitFullscreen', function(){
	  if(window.console) window.console.log('exitFullscreen');
	});	
	
	// Add fullscreen control //
	L.control.fullscreen({
	  position: 'bottomright',
	  title: 'Show me the fullscreen !'
	}).addTo(map);
	
	// Add find me control //
	L.control.locate({
		position: "bottomright"
	}).addTo(map);
	
	var customerMarkerOptions = {
		    radius: 8,
		    fillColor: "#ff7800",
		    color: "#000",
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.8
		};
	
	L.control.layers(mapThemes).addTo(map);		 	

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
	var svg = d3.select("#box1")
		.append("svg")
		.attr("viewbox", "0 0 " + w + " " + h ) //fit to current window
		.attr("preserveAspectRatio", "xMidYMid meet");
		//.attr("width", w)
		//.attr("height", h);	
	

	var svgLMap = d3.select(map.getPanes().overlayPane)
			.append("svg"),
		g = svgLMap
			.append("g")
			.attr("class", "leaflet-zoom-hide");

	
// ************ JSON DATA ***************************************//		
	///////////////////////////
	// Customer Buckets JSON //
	///////////////////////////
	$.getJSON($("link[rel='vABCD_UserCompletion']").attr("href"), function (data) {
	//d3.json("../../Resources/data/vABCD_UserCompletion.json", function(data) {
		dataset = data		  		
  		var id = 0;
  		for(i=0; i<dataset.length; i++) data[i].id = id++;  				
  		spartan.salesUserFilter = d3.select("#salesUserSelect").node().value; 
	    
	    dataset.sort(function(a, b) {
            return d3.ascending(a.Bucket, b.Bucket);
        });
       
        mean_by = "Bucket";
        var rollupStatus = d3.nest()
        	.key(function(d) {
       			return d[mean_by];	       
       		})
       		.rollup(function(d) {
       			return d3.mean(d, function(g) {
       				return g.CompletionPercent;
       			});
       		})
       		.entries(data);	       
		
        	///////////////////////////////
		    // Sales Territories GeoJSON //
        	///////////////////////////////
        	$.getJSON($("link[rel='CustomersGeo']").attr("href"), function (data) {
        	//d3.json("../../Resources/data/CustomersGeo.json", function(jsonSalesTerritories) {			
				var transform = d3.geo.transform({point: projectPoint}),
				      path = d3.geo.path().projection(transform),
				      bounds = path.bounds(jsonSalesTerritories);
					
				var feature = g.selectAll("path")
					    .data(jsonSalesTerritories.features)
					    .enter().append("path");
		
				//////////////////////////////
				// Sales Territories GeoJson//
				//////////////////////////////
				var GeoJsonSalesTerritories = L.geoJson.ajax($("link[rel='TerritoriesGeom']").attr("href"), {
				//var GeoJsonSalesTerritories = L.geoJson.ajax("../../Resources/data/TerritoriesGeom.json", {
				      style: {color: "#005432", weight: 1 },					
					  onEachFeature: function (feature, layer) {
				    	  layer.bindPopup(feature.properties.territory);
				      },
				      filter: function (feature, layer) {			
							var userFilter = spartan.salesUserFilter; 		
							if (feature.properties.user_id == userFilter) {									
								return (feature.properties);						
							} else {	
								return (feature.properties.isHidden);
								// MAY WANT TO ADAPT THIS FOR APPOINTMENT MADE OR NOT...
								//switch (feature.properties.user_id) {
						    	//case "BRRO": return {color: "#005432", weight: 3 };							
								//}
					       }		 
						 
						}
				    }).addTo(map);				    
					
					//markerCustomer.addTo(map);
					
					$("#salesUserSelect").on("change", function() {
						GeoJsonSalesTerritories.refresh("../../Resources/data/TerritoriesGeom.json");
			        });
				
				//////////////////////////
				// Customer Pins GeoJson//
				//////////////////////////
				var GeoJsonCustomerMarkers = L.geoJson.ajax($("link[rel='CustomersGeo']").attr("href"), {
				//var GeoJsonCustomerMarkers = L.geoJson.ajax("../../Resources/data/CustomersGeo.json", {
				      onEachFeature: function (feature, layer) {
				    	  layer.bindPopup("<b>" + feature.properties.description + "</b><br>" +
				    			  "# " + feature.properties.solo_key + "<br>" +
				    			  feature.properties.ph_city + ", " + feature.properties.ph_state);
				      },
				      filter: function (feature, layer) {			
							var userFilter = spartan.salesUserFilter; 		
							if (feature.properties.user_id == userFilter 
									&& feature.properties.cb_status == spartan.cbStatusFilter) {
								return (feature.properties);						
							} else {	
								return (feature.properties.isHidden);
								// MAY WANT TO ADAPT THIS FOR APPOINTMENT MADE OR NOT...
								//switch (feature.properties.user_id) {
						    	//case "BRRO": return {color: "#005432", weight: 3 };							
								//}
					       }		 
						 
						}
				    }).addTo(map);				    
					
					//markerCustomer.addTo(map);
					
					$("#salesUserSelect").on("change", function() {
			        	GeoJsonCustomerMarkers.refresh("../../Resources/data/CustomersGeo.json");
			        });					
		
			//	});
				
				
		   
		    
			////////////////////////////////////
			///////// Set x and y scale ////////
			////////////////////////////////////
			var xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) { return d.CompletionPercent; })])  
				.range([padding, w - padding * 2 ]);
			var yScale = d3.scale.ordinal()
				.domain(dataset.map(function(d) { return d.Bucket; }))  //([0, d3.max(dataset, function(d) { return d.Bucket; })])
				.rangeRoundBands([padding, h], 0.05);				
		     			
			//////////////////////////////////////		
			///////// Drawing rectangles /////////
			//////////////////////////////////////
			svg.selectAll("#box1")
				.data(rollupStatus)
		   		.enter()   		
				.append("rect")
				.attr("x", function(d) {
					return padding;        
				})
			    .attr("y", function(d) {
			   		return yScale(d.key); 
			    })
			    .attr("width", function(d) {
			   		return xScale(d.values) - padding ; 
				})
			    .attr("height", yScale.rangeBand())
			    
			    .attr("fill", function(d) {
			   		if(d.CompletionPercent >= .80) {
			   		 	return "66FF33";
			   		}else{
			   			return "#FF0000";
			   		}
			    })
			    .attr("class", "add")
			    .style("fill-opacity", 0.6);
			    
	
			 ////////////////////////		    
			 ///////// Text /////////
			 //////////////////////// 
			 svg.selectAll("#box1")
			   .data(rollupStatus)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d.key + "     " + formatAsPercentage(d.values);
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d) {
					return padding + 25;//padding + (d.values * 100);   
				})
			    .attr("y", function(d) {
			   		return yScale(d.key) + 33; 
			    })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "14px")
			   .attr("fill", "white");
	
	
			////////////////////////////////			   
			////////// Drawing Map /////////
			////////////////////////////////			
				map
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
					var point = map.latLngToLayerPoint( new L.LatLng(y,x));
					this.stream.point(point.x, point.y);
				}
								   
			 ////////////////////////////////////	
			 ///////// On Change Events ///////// 
			 ////////////////////////////////////  	 
			 d3.select("#salesUserSelect")
			 	.on("change", function(d) {				
					salesUserFilter = d3.select("#salesUserSelect").node().value;
					spartan.salesUserFilter = d3.select("#salesUserSelect").node().value;
					var tableABCD = d3.select("#tableABCD");
					var filtered = dataset.filter(function(d) {
						return d.user_id == spartan.salesUserFilter;												
					});
					
					///////////////////////////
					//Bucket Bar Chart Change//
					///////////////////////////
					var bars = svg.selectAll("rect")			
						.data(filtered);					
						
					var text = svg.selectAll("text")
						.data(filtered);
		
					bars.transition()
						.duration(700)
						.attr("fill", "#D6D6D6")
						.attr("x", function(d) {
							return padding;        
						})
				    	.attr("y", function(d,i) {
				   			return yScale(d.Bucket); 
				    	})
				    	.attr("width", function(d) {
			   				return xScale(d.CompletionPercent) - padding ; 
					    })
					    .attr("height", yScale.rangeBand())
					    .attr("fill", function(d) {
					   		if(d.CompletionPercent >= .80) {
					   		 	return "#66FF33";
					   		}else{
					   			return "#FF0000";
					   		}
					    })
					    .attr("class", "add")
					    .style("fill-opacity", 0.6);
					 bars.exit()
					 	.remove();
					    
					 
					 ///////////////    
					 //Text change//
					 ///////////////   
					 text.transition()
					 	.duration(700)
					 	.text(function(d) {
			   				return d.Bucket + "     " + formatAsPercentage(d.CompletionPercent);
					   	})
					   	.attr("text-anchor", "middle")
					   	.attr("x", function(d) {
							return  padding + 25;   
						})
					    .attr("y", function(d) {
					   		return yScale(d.Bucket) + 33; 
					    })
					    .attr("font-family", "sans-serif")
					    .attr("font-size", "14px")
					    .attr("fill", "white");
					  text.exit()
					  	.remove();
					
			
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
	 			var NewContent= "<div id='myGrid' class='added'>Buckets Aging</div>";
	 			d3.selectAll("rect")			 				
	 				.on("click", function(d) { 	
	 					spartan.cbStatusFilter = d.Bucket;
	 					createBucketsGrid();
	 					GeoJsonCustomerMarkers.refresh("../../Resources/data/CustomersGeo.json");
	 					
	 					
				        if (NewContent != '') {						            
				            $("#spin").after(NewContent);						            							            
				            NewContent = '';
				        } else {						            
				            $('#spin').next().toggle("blind",600);
				        };						   					
	 											
	 				});
	 				
	 			d3.selectAll("text")
	 				.on("click", function(d) {
	 					spartan.cbStatusFilter = d.Bucket; 
	 					GeoJsonCustomerMarkers.refresh("../../Resources/data/CustomersGeo.json");
	 				});
	 			/* IF NEED TO USE jQuery to nav
	 			$("#box1").click(function() {
					$("#tabs").tabs({active:1});
				});
		 		*/
					
	 		
	// }); //End sales territories geojson callback //		
		 	
}); //End vABCD_UserCompletion Callback //
		    

		
