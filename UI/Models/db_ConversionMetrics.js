
$(function() {
	
	var svg = d3.select('#box3').append('svg')
		.attr("width", "100%")
		.attr("height", "100%");	
	
	///////////////////////////
	//Sales Conversion Funnel//
	///////////////////////////
	var xFunnelLevel1 = 50;
	var yFunnelLevel1 = 75;
	var w = $('#box3').width();
	var h = 75;
	
	var salesConversionFunnelData = [
		{ "cx": w/2, "cy": yFunnelLevel1, "rx": w * .45, "ry": 10, "fill" : "gray", "stroke" : "black", "opacity": 0.4},
		{ "cx": w/2, "cy": yFunnelLevel1 * 2, "rx": w * .35, "ry": 10, "fill" : "gray", "stroke" : "black", "opacity": 0.4 },
		{ "cx": w/2, "cy": yFunnelLevel1 * 3, "rx": w * .25, "ry": 10, "fill" : "gray", "stroke" : "black", "opacity": 0.4 },
		{ "cx": w/2, "cy": yFunnelLevel1 * 4, "rx": w * .15, "ry": 10, "fill" : "gray", "stroke" : "black", "opacity": 0.4 }];
	
	var salesConversionFunnel = svg.selectAll('ellipse')
		.data(salesConversionFunnelData)
		.enter()
		.append('ellipse');
	
	salesConversionFunnel	
		.attr('cx', function(d) { return d.cx; })
		.attr('cy', function(d) { return d.cy; })
		.attr('ry', function(d) { return d.ry; })
		.attr('rx', function(d) { return d.rx; })
		.attr('fill', function(d) { return d.fill; })
		.attr('stroke', function(d) { return d.stroke; })
		.attr('opacity', function(d) { return d.opacity; });
	
	
	////////////////
	//Alert Counts//
	//////////////// 
	var wCircleLevel1 = ($('#box3 ellipse').eq(0).attr('rx'))/6 + (w * .13); 
	var wCircleLevel1Padding = ($('#box3 ellipse').eq(0).attr('rx'))/6;
	var wCircleLevel2 =  ($('#box3 ellipse').eq(1).attr('rx'))/6 + (w * .31);
	var wCircleLevel1Padding = ($('#box3 ellipse').eq(1).attr('rx'))/6;	
	my.myPlannerDSARActivitiesCountData(myPlannerDSARActivities().length);
	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRActivities().length);
	
	var	alertsCircleData = [  
		{"Source" : "Maintenance", "Count": my.abcdCountVal(), "cxPadding": wCircleLevel1Padding, "cx": wCircleLevel1, "cy": yFunnelLevel1 - 30, "r": 40 },
		{"Source" : "New Customer", "Count": my.newCustomersCountVal(), "cxPadding": wCircleLevel1Padding, "cx": wCircleLevel1 + 50, "cy": yFunnelLevel1 - 30, "r": my.newCustomersCountVal() },
		{"Source" : "Quote Pending", "Count": my.quotesPendingCountVal(), "cxPadding": wCircleLevel1Padding, "cx": wCircleLevel1 + 100, "cy": yFunnelLevel1 - 30, "r": my.quotesPendingCountVal() },
		{"Source" : "Lead Note", "Count": my.leadNotesCountVal(), "cxPadding": wCircleLevel1Padding, "cx": wCircleLevel1 + 150, "cy": yFunnelLevel1 - 30, "r": my.leadNotesCountVal() },
		{"Source" : "Service Failure", "Count": my.serviceFailuresCountVal(), "cxPadding": wCircleLevel1Padding, "cx": wCircleLevel1 + 200, "cy": yFunnelLevel1 - 30, "r": my.serviceFailuresCountVal() },
		{"Source" : "Returning Customer", "Count": my.returningCustomersCountVal(), "cxPadding": wCircleLevel1Padding, "cx": wCircleLevel1 + 250, "cy": yFunnelLevel1 - 30, "r": my.returningCustomersCountVal() },
		{"Source" : "DSAR", "Count": my.myPlannerDSARActivitiesCountData(), "cxPadding": (w-wCircleLevel2)/4, "cx": wCircleLevel2, "cy": yFunnelLevel1 + 50, "r": my.myPlannerDSARActivitiesCountData() },
		{"Source" : "DSMR", "Count": my.myPlannerDSMRActivitiesCountData(), "cxPadding": (w-wCircleLevel2)/4, "cx": wCircleLevel2 + 100,"cy": yFunnelLevel1 + 50, "r": my.myPlannerDSMRActivitiesCountData() }
		];
	
	var alertsCountCircle = svg.selectAll('circle')
		.data(alertsCircleData)
		.enter()
		.append('circle');
	var alertsCountText = svg.selectAll('text')
		.data(alertsCircleData)
		.enter()
		.append('text');
	
	alertsCountCircle
		.attr('cx', function(d,i) { return d.cx; })  
		.attr('cy', function(d) { return d.cy; }) 
		.attr('r', function(d) { if(d.Count > 30) { return 30; } if(d.Count < 10) { return 10;} else { return 20; } })
		.attr('fill',  'lightblue') 
		.attr('stroke', 'gray') 
		.attr('opacity', 0.4);
	
	alertsCountText
		.attr('x', function(d,i) { return d.cx; })
		.attr('y', function(d) { return d.cy; }) //{ if(d.Count > 3) { return d.cy - 30 } else { return d.cy - (d.Count/2); } })
		.text( function (d) { return  d.Count; })
		.attr("font-family", "sans-serif")
		.attr("font-size", "1.2em")
		.attr("fill", "gray");
			
	
	//////////////////
	//Event Handling//
	//////////////////
	//Refresh Icon
	$('#box3 i').on('click',function() {		
		//Set conversion metrics variables		
		my.abcdCountVal(abcdAlerts().length);
		my.newCustomersCountVal(newCustomers().length);
		my.quotesPendingCountVal(quotesPending().length);		
		my.leadNotesCountVal(leadNotes().length);
		my.serviceFailuresCountVal(serviceFailures().length);
		my.returningCustomersCountVal(returningCustomers().length);
		my.myPlannerDSARActivitiesCountData(myPlannerDSARActivities().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRActivities().length);	
		
		my.getSumConversionCounts();
				
		$('#box3 circle').fadeIn('slow');
		$('#box3 text').fadeIn('slow');
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		
		//Remove ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
	});
	
	//Conversion metrics circle click
	svg.selectAll('circle').on('click', function(){
		alertsCountCircle
			.style('stroke', 'gray')
			.attr('fill',  'lightblue')
			.style("stroke-width",1);
			
		d3.select(this)
			.style("stroke","blue")
			.style("stroke-width",3);
		
		
		my.conversionSelectedSource = this.__data__.Source;
		
		//Set alertsCircleData array with new values based on user circle click		
		if(this.__data__.Source == 'Maintenance') {			
			$.each(alertsCircleData, function() {				
			    if (this.Source == "DSAR") {
			    	my.myPlannerDSARActivitiesCountData(myPlannerDSARmaintenance().length);			        			        
			    	this.Count = my.myPlannerDSARActivitiesCountData();			    	
			    } if (this.Source == "DSMR") {			    	
			    	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRmaintenance().length);
			    	this.Count = my.myPlannerDSMRActivitiesCountData();			    	
			    }			   
			});
			my.abcdCountVal(abcdAlerts().length);
			my.newCustomersCountVal(newCustomers().length);
			my.quotesPendingCountVal(quotesPending().length);		
			my.leadNotesCountVal(leadNotes().length);
			my.serviceFailuresCountVal(serviceFailures().length);
			my.returningCustomersCountVal(returningCustomers().length);
			my.getSumConversionCounts();
			
			//Remove ABCD Chart Formatting
			$('.abcdChart').removeClass('abcdChartSelected');
			$(".ui-widget-header").removeClass("ui-state-active");
			my.cbStatusFilterObservable('all');
			my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		};		
		if(this.__data__.Source == 'New Customer') {			
			$.each(alertsCircleData, function() {				
			    if (this.Source == "DSAR") {
			    	my.myPlannerDSARActivitiesCountData(myPlannerDSARnewcustomers().length);	
			    	this.Count = my.myPlannerDSARActivitiesCountData(); 
			    } if(this.Source == "DSMR") {
			    	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRnewcustomers().length);
			    	this.Count = my.myPlannerDSMRActivitiesCountData();
			    }
			});
			my.abcdCountVal(abcdAlerts().length);
			my.newCustomersCountVal(newCustomers().length);
			my.quotesPendingCountVal(quotesPending().length);		
			my.leadNotesCountVal(leadNotes().length);
			my.serviceFailuresCountVal(serviceFailures().length);
			my.returningCustomersCountVal(returningCustomers().length);	
			my.getSumConversionCounts();
		};
		if(this.__data__.Source == 'Quote Pending') {			
			$.each(alertsCircleData, function() {				
				if (this.Source == "DSAR") {		    	
			    	my.myPlannerDSARActivitiesCountData(myPlannerDSARquotespending().length);
			    	this.Count = my.myPlannerDSARActivitiesCountData(); 
			    } if(this.Source == "DSMR") {			    	
			    	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRquotespending().length);
			    	this.Count = my.myPlannerDSMRActivitiesCountData();
			    }
			});
			my.abcdCountVal(abcdAlerts().length);
			my.newCustomersCountVal(newCustomers().length);
			my.quotesPendingCountVal(quotesPending().length);		
			my.leadNotesCountVal(leadNotes().length);
			my.serviceFailuresCountVal(serviceFailures().length);
			my.returningCustomersCountVal(returningCustomers().length);	
			my.getSumConversionCounts();
		};
		if(this.__data__.Source == 'Lead Note') {			
			$.each(alertsCircleData, function() {
			    if (this.Source == "DSAR") {
			    	my.myPlannerDSARActivitiesCountData(myPlannerDSARleadnotes().length);
			    	this.Count = my.myPlannerDSARActivitiesCountData();		        
			    } if(this.Source == "DSMR") {			    	
			    	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRleadnotes().length);
			    	this.Count = my.myPlannerDSMRActivitiesCountData();
			    }
			});
			my.abcdCountVal(abcdAlerts().length);
			my.newCustomersCountVal(newCustomers().length);
			my.quotesPendingCountVal(quotesPending().length);		
			my.leadNotesCountVal(leadNotes().length);
			my.serviceFailuresCountVal(serviceFailures().length);
			my.returningCustomersCountVal(returningCustomers().length);	
			my.getSumConversionCounts();
		};
		if(this.__data__.Source == 'Service Failure') {			
			$.each(alertsCircleData, function() {
			    if (this.Source == "DSAR") {
			    	my.myPlannerDSARActivitiesCountData(myPlannerDSARservicefailures().length);
			    	this.Count = my.myPlannerDSARActivitiesCountData();			        
			    } if(this.Source == "DSMR") {			    	
			    	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRservicefailures().length);
			    	this.Count = my.myPlannerDSMRActivitiesCountData();
			    }			    
			});	
			my.abcdCountVal(abcdAlerts().length);
			my.newCustomersCountVal(newCustomers().length);
			my.quotesPendingCountVal(quotesPending().length);		
			my.leadNotesCountVal(leadNotes().length);
			my.serviceFailuresCountVal(serviceFailures().length);
			my.returningCustomersCountVal(returningCustomers().length);		
			my.getSumConversionCounts();
		};
		if(this.__data__.Source == 'Returning Customer') {			
			$.each(alertsCircleData, function() {
			    if (this.Source == "DSAR") {			        
			    	my.myPlannerDSARActivitiesCountData(myPlannerDSARreturningcustomers().length);
			    	this.Count = my.myPlannerDSARActivitiesCountData();				        
			    } if(this.Source == "DSMR") {			    	
			    	my.myPlannerDSMRActivitiesCountData(myPlannerDSMRreturningcustomers().length);
			    	this.Count = my.myPlannerDSMRActivitiesCountData();
			    }
			});
			my.abcdCountVal(abcdAlerts().length);
			my.newCustomersCountVal(newCustomers().length);
			my.quotesPendingCountVal(quotesPending().length);		
			my.leadNotesCountVal(leadNotes().length);
			my.serviceFailuresCountVal(serviceFailures().length);
			my.returningCustomersCountVal(returningCustomers().length);
			my.getSumConversionCounts();
		};
		if(this.__data__.Source == 'DSAR') {			
			my.abcdCountVal(myPlannerDSARmaintenance().length);
			my.newCustomersCountVal(myPlannerDSARnewcustomers().length);
			my.quotesPendingCountVal(myPlannerDSARquotespending().length);		
			my.leadNotesCountVal(myPlannerDSARleadnotes().length);
			my.serviceFailuresCountVal(myPlannerDSARservicefailures().length);
			my.returningCustomersCountVal(myPlannerDSARreturningcustomers().length);
			my.myPlannerDSARActivitiesCountData(myPlannerDSARActivities().length);		
			my.myPlannerDSMRActivitiesCountData(myPlannerDSMRActivities().length);	
			my.getSumConversionCounts();
			
		};
		if(this.__data__.Source == 'DSMR') {			
			my.abcdCountVal(myPlannerDSMRmaintenance().length);
			my.newCustomersCountVal(myPlannerDSMRnewcustomers().length);
			my.quotesPendingCountVal(myPlannerDSMRquotespending().length);		
			my.leadNotesCountVal(myPlannerDSMRleadnotes().length);
			my.serviceFailuresCountVal(myPlannerDSMRservicefailures().length);
			my.returningCustomersCountVal(myPlannerDSMRreturningcustomers().length);
			my.myPlannerDSARActivitiesCountData(myPlannerDSARActivities().length);		
			my.myPlannerDSMRActivitiesCountData(myPlannerDSMRActivities().length);
			my.getSumConversionCounts();			
		};
		
		my.getSumConversionCounts();
		alertsCountCircle.data(alertsCircleData);
		alertsCountText.data(alertsCircleData);		
		
		alertsCountCircle
			.transition()		
			.duration(800)			
			.attr('cx', function(d) { return d.cx; })
			.attr('cy', function(d) { return d.cy; }) //{ if(d.Count > 3) { return d.cy - 30 } else { return d.cy - (d.Count/2); } })
			.attr('r', function(d) { if(d.Count > 30) { return 30; } if(d.Count < 10) { return 10;} else { return 20; } })
			.attr('fill',  'lightblue') 
			.attr('stroke', 'gray') 
			.attr('opacity', 0.4);
	
		alertsCountText
			.transition()	
			.duration(800)
			.attr('x', function(d) { return d.cx; })
			.attr('y', function(d) { return d.cy; }) //{ if(d.Count > 3) { return d.cy - 30 } else { return d.cy - (d.Count/2); } })
			.text( function (d) { return  d.Count; })
			.attr("font-family", "sans-serif")
			.attr("font-size", "1.2em")
			.attr("fill", "gray");
		
		
	});	

	//Set alertsCircleData array with new values based on user planner click using subscribe to a sum of activities set in spartan.js
	my.sumConversionCountsObservable.subscribe(function(newValue) {		
		
		$.each(alertsCircleData, function() {
		    if (this.Source == "Maintenance") {			        
		        this.Count = my.abcdCountVal();
		    } 
		    if(this.Source == "New Customer") {		    	
		    	this.Count = my.newCustomersCountVal();
		    }
		    if(this.Source == "Quote Pending") {		    	
		    	this.Count = my.quotesPendingCountVal();
		    }
		    if(this.Source == "Lead Note") {		    	
		    	this.Count = my.leadNotesCountVal();
		    }
		    if(this.Source == "Service Failure") {		    	
		    	this.Count = my.serviceFailuresCountVal();
		    }
		    if(this.Source == "Returning Customer") {		    	
		    	this.Count = my.returningCustomersCountVal();
		    }
		    if (this.Source == "DSAR") {
		        this.Count = my.myPlannerDSARActivitiesCountData();		        		    	
		    } 
		    if(this.Source == "DSMR") {	    	
		    	this.Count = my.myPlannerDSMRActivitiesCountData();
		    }
		});
		
		alertsCountCircle.data(alertsCircleData);
		alertsCountText.data(alertsCircleData);
		
		alertsCountCircle
			.transition()		
			.duration(700)
			.attr('cx', function(d,i) { return d.cx; })
			.attr('cy', function(d) { return d.cy; }) //{ if(d.Count > 3) { return d.cy - 30 } else { return d.cy - (d.Count/2); } })
			.attr('r', function(d) { if(d.Count > 30) { return 30; } if(d.Count < 10) { return 10;} else { return 20; } })
			.attr('fill',  'lightblue') 
			.attr('stroke', 'gray') 
			.attr('opacity', 0.4);
	
		alertsCountText
			.transition()	
			.duration(700)
			.attr('x', function(d,i) { return d.cx; })
			.attr('y', function(d) { return d.cy; }) //{ if(d.Count > 3) { return d.cy - 30 } else { return d.cy - (d.Count/2); } })
			.text( function (d) { return  d.Count; })
			.attr("font-family", "sans-serif")
			.attr("font-size", "1.2em")
			.attr("fill", "gray");
	});



});