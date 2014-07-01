//View Model for Customers Tab, Customer Grid//

////////////////////////////
//West Panel Customer Grid//
////////////////////////////
	var allCustomersGridModel = function(data, event) {	
		this.CustomerId = ko.observable(data.CustomerId);
		this.CustomerName = ko.observable(data.CustomerName);	
		this.Status = ko.observable(data.Status);
		this.SalesID = ko.observable(data.SalesID);
		this.TopAcctStation = ko.observable(data.TopAcctStation);
		this.SalesActivitySource = ko.observable("Account Maintenace");
		this.City = ko.observable(data.City);
		this.State = ko.observable(data.State);
		this.CityState = ko.computed(function() {
	        return this.City() + "," + this.State();
	    }, this);
		this.FullCustomer = ko.computed(function() {
	        return this.CustomerName() + " (" + this.CustomerId() + ")";
	    }, this);
	};
	
	my.allCustomersGridVM = function() {	
		//$.getJSON('../../Resources/data/CustomersABCD.json', function (data) {
		$.getJSON(my.apiBase + 'customers/?SalesPerson=' + my.salesUserFilter, function (data) {		
			var filteredData = data.filter(function(item) {
				return item.user_id == my.salesUserFilter;
			});
			data.sort(function(a,b){return a.Name == b.Name ? 1 : (a.Name > b.Name ? 1 : -1);});
			var allCustomersGrid = $.map(data, function (item) { return new allCustomersGridModel(item) });
	        self.allCustomersGrid(allCustomersGrid);
		});
		
		var self = this;
	    self.allCustomersGrid = ko.observableArray([]);	
	    self.selectedCustomerGridRow = ko.observableArray();
	    
	    	    
	    //Get a list of filtered customer numbers//
	    self.justFilteredCustomerGridNumbers = ko.computed(function() {
		    var filteredCustomerGridNumbers = ko.utils.arrayMap(self.allCustomersGrid(), function(item) {
		        return item.CustomerId();
		    });
		    return filteredCustomerGridNumbers.sort();
		}, self);
		
		//Get a list of selected customer numbers//
		self.justSelectedCustomerGridNumbers = ko.computed(function() {
		    var selectedCustomerGridNumbers = ko.utils.arrayMap(self.selectedCustomerGridRow(), function(item) {
		        return item.CustomerId();
		    });
		    return selectedCustomerGridNumbers.sort();
		}, self);
	    
	    this.gridOptions = {
	            data: self.allCustomersGrid,  
	            multiSelect: true,
	            keepLastSelected: true,
	            selectedItems: self.selectedCustomerGridRow,
	            enableSorting: true,
	            canSelectRows: true,
	            displaySelectionCheckbox: false,
	            jqueryUITheme: false,
	            footerVisible: false,  
	            showColumnMenu: false,
	            enablePaging: false,
	            showFilter: false,
	            columnDefs: [                      
	    					 {
	    						field: 'CustomerId',
	    						displayName: 'Customer Number',
	    						width: '0%'
	    					 },
	                         {
	                        	field: 'CustomerName', 
	                        	displayName: 'Customers',
	                        	width: '75%'                    	
	            			 },
	            			 {
	                        	field: 'CityState', 
	                        	displayName: 'City State',
	                        	width: '25%',
	                        	cellTemplate:'<div data-bind=" attr: {\'class\': \'kgCellText colt\' + $index()}, style: {\'font-size\': \'.6em\'}, html: $data.getProperty($parent)"></div>'
	            			 }
	            			 ]
	    };
		
	    //Customer Grid Subscriptions//
	    my.salesUserFilterObservable.subscribe(function(newValue) {
	    	$.getJSON(my.apiBase + 'customers/?'
				+ 'SalesPerson=' + newValue			
				+ my.ctFilterCustomerNameContainsAPIsyntax
				+ my.ctABCDSelectValAPIsytax 
				, function (data) {		
					data.sort(function(a,b){return a.CustomerName == b.CustomerName ? 1 : (a.CustomerName > b.CustomerName ? 1 : -1);});
					var allCustomersGrid = $.map(data, function (item) { return new allCustomersGridModel(item) });
			        self.allCustomersGrid(allCustomersGrid);
			       
		        GeoJsonCustomerGridMarkers.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			        
			});
		}); 
	    
		my.ctFilterCustomerNameContainsObservable.subscribe(function(newValue) {		
			$.getJSON(my.apiBase + 'customers/?' 
				+ 'Name=' + newValue
				+ my.ctABCDSelectValAPIsytax 
				, function (data) {		
					data.sort(function(a,b){return a.CustomerName == b.CustomerName ? 1 : (a.CustomerName > b.CustomerName ? 1 : -1);});
					var allCustomersGrid = $.map(data, function (item) { return new allCustomersGridModel(item) });
			        self.allCustomersGrid(allCustomersGrid);		        
			        
			    //Set map with above subscription, needs to be inside of getJSON callback//
		        GeoJsonCustomerGridMarkers
		        	.loadURL('../../Resources/data/CustomersGeoMarkerDescription.json')
			        .setFilter(function (feature, layer) {	
				 		return $.inArray(feature.properties.solo_key, self.justFilteredCustomerGridNumbers()) !== -1;
				 	});
			});	
		}); 
		
		my.customersTabABCDSelectValObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'customers/?' 
				+ 'BucketType=' + newValue
				+ my.ctFilterCustomerNameContainsAPIsyntax
				, function (data) {			
					data.sort(function(a,b){return a.CustomerName == b.CustomerName ? 1 : (a.CustomerName > b.CustomerName ? 1 : -1);});
					var allCustomersGrid = $.map(data, function (item) { return new allCustomersGridModel(item) });
			        self.allCustomersGrid(allCustomersGrid);
			    
			    //Set map with above subscription, needs to be inside of getJSON callback//
			    GeoJsonCustomerGridMarkers
		        	.loadURL('../../Resources/data/CustomersGeoMarkerDescription.json')
			        .setFilter(function (feature, layer) {	
				 		return $.inArray(feature.properties.solo_key, self.justFilteredCustomerGridNumbers()) !== -1;
				 	});
			});
		}); 
		
		my.ctFilterCustomerNumberValObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'customers/' + newValue, function (data) {			
				data.sort(function(a,b){return a.CustomerName == b.CustomerName ? 1 : (a.CustomerName > b.CustomerName ? 1 : -1);});
				var allCustomersGrid = $.map(data, function (item) { return new allCustomersGridModel(item) });
		        self.allCustomersGrid(allCustomersGrid);
		        
		        //Set map with above subscription, needs to be inside of getJSON callback//
		        GeoJsonCustomerGridMarkers
		        	.loadURL('../../Resources/data/CustomersGeoMarkerDescription.json')
			        .setFilter(function (feature, layer) {	
				 		return $.inArray(feature.properties.solo_key, self.justFilteredCustomerGridNumbers()) !== -1;
				 	});
		        
			});
		}); 
		
		self.justSelectedCustomerGridNumbers.subscribe(function(newValue) {		
			GeoJsonCustomerGridMarkers
	        	.loadURL('../../Resources/data/CustomersGeoMarkerDescription.json')
		        .setFilter(function (feature, layer) {	
			 		return $.inArray(feature.properties.solo_key, newValue) !== -1;
			 	});
		}); 	
	    
		////////////////////////
		//Customers Tab Events//
		////////////////////////
		
		$('#customerNameContainsInput').on('change', function() {
			my.ctFilterCustomerNameContainsObservable($(this).val());
			my.ctFilterCustomerNameContainsAPIsyntax = '&Name=' + $(this).val(); 
			$('#customerNumberInput').val('');
		});
	  	
		$('#customerNumberInput').on('change',function(){
	  		my.ctFilterCustomerNumberVal = $('#customerNumberInput').val();
	  		my.ctFilterCustomerNumberValObservable($('#customerNumberInput').val());
	  		$(this).siblings().val('');
	  	});
		
		$('#customersTabABCDSelect').on('change',function(){
	  		my.customersTabABCDSelectVal = $('#customersTabABCDSelect').val();
	  		my.customersTabABCDSelectValObservable($('#customersTabABCDSelect').val());
	  		my.customersTabABCDSelectValAPIsytax = '&BucketType=' + my.customersTabABCDSelectVal;	
	  		$('#customerNumberInput').val('');
	  	});
	  	  	
	  	
	  	
	
	}();