//View Model for Sales User //
	
$(function() {
	
	my.employeesSalesModel = function(data, event) {	
		this.FullName = ko.observable(data.FullName);
		this.EmployeeCode = ko.observable(data.EmployeeCode);		
	}; 
	
	my.employeesSalesVM = function() { 
		$.getJSON(my.apiBase + "employees/sales?RoleCode=SSAUSR", function (data) {		 

			data.sort(function(a,b){return a.FullName == b.FullName ? 0 : (a.FullName > b.FullName ? 1 : -1);});
			
			var employeesSales = $.map(data, function (item) { return new my.employeesSalesModel(item) });
	        self.employeesSales(employeesSales);
		});
		
	    var self = this;
	    self.employeesSales = ko.observableArray([]);			   
	}();
	ko.applyBindings(my.employeesSalesVM, $("#salesUserSelect")[0]);
	
	
	///////////////////
	//Event Handlers //
	///////////////////
	
	//Sales User filter for territories and customer markers on salesUserSelect change event//
	$("#salesUserSelect").on("change", function() {
	    my.salesUserFilter = $(this).val();
	    my.salesUserFilterObservable($(this).val());
	    $('.abcdChart').removeClass('abcdChartSelected');
	    $('.bar').remove();
	    
	    //Set map filters
	    GeoJsonNewBusinessMarker.setFilter(function() { return false; });
	    GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
	    GeoJsonSalesTerritories.setFilter(function (feature, layer) {	
			return feature.properties.user_id == spartan.salesUserFilter;
		});	    
	    GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
	    GeoJsonQuotePolyline.setFilter(function() { return false; });
	    GeoJsonCustomerMarkers.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json');
	    GeoJsonCustomerMarkers.setFilter(function (feature, layer) {	
			//return true;		
    		return feature.properties.cb_status == 'A'
    		|| feature.properties.cb_status == 'B'
    		|| feature.properties.cb_status == 'C'
    		|| feature.properties.cb_status == 'D'; 
		});
	    
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
	    
		//CustomersTab
	    $('#customerNumberInput').val('');
	     
	});

    
});