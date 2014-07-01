
///////////////////////////////////////////////////////////////////////
//////// D3 SVG elements for the dashboard -- Buckets and Map ///////// 
//////// *** JSON & GeoJson files being loaded below 		  /////////	
///////////////////////////////////////////////////////////////////////
	//Define width, height, padding
	var w = 180;
	var h = 150;
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
	var svg = d3.select("#abcdChart")
		.append("svg")
		.attr("viewbox", "0 0 " + w + " " + h ) //fit to current window
		.attr("preserveAspectRatio", "xMidYMid meet");
		//.attr("width", w)
		//.attr("height", h);	
	
	//////////// JSON DATA ////////////////		
	///////////////////////////
	// Customer Buckets JSON //
	///////////////////////////
	d3.json($("link[rel='ObjABCDThresholdCompletion']").attr("href"), function (data) {
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
		    
			////////////////////////////////////
			///////// Set x and y scale ////////
			////////////////////////////////////
			var xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) { return d.CompletionPercent; })])  
				.range([padding, w - padding]);
			var yScale = d3.scale.ordinal()
				.domain(dataset.map(function(d) { return d.Bucket; }))  //([0, d3.max(dataset, function(d) { return d.Bucket; })])
				.rangeRoundBands([padding, h], 0.05);				
		     			
			//////////////////////////////////////		
			///////// Drawing rectangles /////////
			//////////////////////////////////////
			svg.selectAll("#abcdChart")
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
			 svg.selectAll("#abcdChart")
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
			   		return yScale(d.key) + 20; 
			    })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "12px")
			   .attr("fill", "#C7C6C6");
						   
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
					   		 	return "#1e4c0f";
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
					   		return yScale(d.Bucket) + 20; 
					    })
					    .attr("font-family", "sans-serif")
					    .attr("font-size", "12px")
					    .attr("fill", "#C7C6C6");
					  text.exit()
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
	 					GeoJsonCustomerMarkers.setFilter(function (feature, layer) {	
	 						return feature.properties.user_id == spartan.salesUserFilter
	 						&& feature.properties.cb_status == spartan.cbStatusFilter;
	 					})
						   					
	 											
	 				});
	 				
	 			d3.selectAll("text")
	 				.on("click", function(d) {
	 					spartan.cbStatusFilter = d.Bucket;
	 					createBucketsGrid();
	 					GeoJsonCustomerMarkers.refresh("../../Resources/data/CustomersGeo.json");
	 				});
	 			/* IF NEED TO USE jQuery to nav
	 			$("#abcdChart").click(function() {
					$("#tabs").tabs({active:1});
				});
		 		*/						
		 	
}); //End vABCD_UserCompletion Callback //
		    

		
