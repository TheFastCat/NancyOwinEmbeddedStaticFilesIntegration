///////////////////////////////////////////////////
// ABCD Chart function called in my.abcdAlertsVM // 	
///////////////////////////////////////////////////	
my.getUserABCD = function(){
	$("#abcdChartA")
		.append( $('<div/>', {
	    	text: self.StatusCompletionPercentA(),
	    	id: 'abcdA',
	    	addClass:('bar'),
	    	style: 'width:' + self.StatusCompletionPercentA() + ';'
	    }));				
	
	$("#abcdChartB")
		.append( $('<div/>', {
	    	text: self.StatusCompletionPercentB(),
	    	addClass:('bar'),		        	
	    	style: 'width:' + self.StatusCompletionPercentB() + ';'
	    }));
	
	$("#abcdChartC")
		.append( $('<div/>', {
	    	text: self.StatusCompletionPercentC(),
	    	addClass:('bar'),
	    	style: 'width:' + self.StatusCompletionPercentC() + ';'
	    }));
	
	$("#abcdChartD")
		.append( $('<div/>', {
	    	text: self.StatusCompletionPercentD(),
	    	addClass:('bar'),
	    	style: 'width:' + self.StatusCompletionPercentD() + ';'
	    }));
};

///////////////////////
//ABCD Grid ViewModel//  
///////////////////////
	my.abcdAlertsModel = function(data, event) {	
		this.CustomerName = ko.observable(data.CustomerName);
		this.CustomerId = ko.observable(data.CustomerId);
		this.SalesPriority = ko.observable(data.SalesPriority);	
		this.Status = ko.observable(data.Status);	
		this.SalesPerson = ko.observable(data.SalesPerson);
		this.City = ko.observable(data.City);	
		this.State = ko.observable(data.State);		
		this.SalesActivitySource = ko.observable("Maintenance");			
		this.FullCustomer = ko.dependentObservable(function() {
	        return this.CustomerName() + " (" + this.CustomerId() + ")";
	    }, this);		
	}; 
	
	my.abcdAlertsVM = (function() {
		$.getJSON(my.apiBase + 'customers'
				+ '?BucketTypes=A&BucketTypes=B&BucketTypes=C&BucketTypes=D'
				+ '&SalesPerson=' + my.salesUserFilter
				, function (data) {							
					data.sort(function(a,b){return a.SalesPriority == b.SalesPriority ? 0 : (a.SalesPriority > b.SalesPriority ? 1 : -1);});
					var abcdAlerts = $.map(data, function (item) { return new my.abcdAlertsModel(item) });
					self.abcdAlerts(abcdAlerts);
									
					//Set counts val for metrics
					my.abcdCountVal(self.abcdAlerts().length);
					my.getSumConversionCounts();
		});
		
		my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'customers'
					+ '?BucketTypes=A&BucketTypes=B&BucketTypes=C&BucketTypes=D'
					+ '&SalesPerson=' + newValue
					, function (data) {							
						data.sort(function(a,b){return a.SalesPriority == b.SalesPriority ? 0 : (a.SalesPriority > b.SalesPriority ? 1 : -1);});
						var abcdAlerts = $.map(data, function (item) { return new my.abcdAlertsModel(item) });
						self.abcdAlerts(abcdAlerts);
						
						//Function from above to fill in ABCD completion chart
						my.getUserABCD();
						
						//Set counts val for metrics
						my.abcdCountVal(self.abcdAlerts().length);
						my.getSumConversionCounts();
			});
		}); 
		
		my.cbStatusFilterObservable.subscribe(function(newValue) {
			if(newValue == 'all') {
				$.getJSON(my.apiBase + 'customers'
						+ '?BucketTypes=A&BucketTypes=B&BucketTypes=C&BucketTypes=D'
						+ '&SalesPerson=' + my.salesUserFilter
						, function (data) {							
							data.sort(function(a,b){return a.SalesPriority == b.SalesPriority ? 0 : (a.SalesPriority > b.SalesPriority ? 1 : -1);});
							var abcdAlerts = $.map(data, function (item) { return new my.abcdAlertsModel(item) });
							self.abcdAlerts(abcdAlerts);
							
							//Function from above to fill in ABCD completion chart
							//my.getUserABCD();
							
							//Set counts val for metrics
							my.abcdCountVal(self.abcdAlerts().length);
							my.getSumConversionCounts();
				});				
			} else {			
				$.getJSON(my.apiBase + 'customers'
						+ '?BucketType=' + newValue					
						+ '&SalesPerson=' + my.salesUserFilter
						, function (data) {							
							data.sort(function(a,b){return a.SalesPriority == b.SalesPriority ? 0 : (a.SalesPriority > b.SalesPriority ? 1 : -1);});
							var abcdAlerts = $.map(data, function (item) { return new my.abcdAlertsModel(item) });
							self.abcdAlerts(abcdAlerts);
							
							//Function from above to fill in ABCD completion chart
							//my.getUserABCD();
							
							//Set counts val for metrics
							my.abcdCountVal(self.abcdAlerts().length);
							my.getSumConversionCounts();
				});
			}
		}); 
		
	    var self = this;
	    self.abcdAlerts = ko.observableArray([]);	
	    self.SelectedCustomerNo = new ko.observableArray();
	    
	    /////////////////////////////
	    //Aggregate computed fields//	
	    /////////////////////////////
	    self.Priority1and2 = ko.computed(function() {	    	
	    	return ko.utils.arrayFilter(this.abcdAlerts(), function(item) {
	    		return item.SalesPriority() == 1
	    		|| item.SalesPriority() == 2;
	    	});
	    }, this);
	    
	    self.StatusA = ko.computed(function() {	    	
	    	return ko.utils.arrayFilter(this.abcdAlerts(), function(item) {
	    		return item.Status() == 'A';
	    	});
	    }, this);	    
	    
	    self.StatusB = ko.computed(function() {	    	
	    	return ko.utils.arrayFilter(this.abcdAlerts(), function(item) {
	    		return item.Status() == 'B';
	    	});
	    }, this);
	    
	    self.StatusC = ko.computed(function() {	    	
	    	return ko.utils.arrayFilter(this.abcdAlerts(), function(item) {
	    		return item.Status() == 'C';
	    	});
	    }, this);
	    
	    self.StatusD = ko.computed(function() {	    	
	    	return ko.utils.arrayFilter(this.abcdAlerts(), function(item) {
	    		return item.Status() == 'D';
	    	});
	    }, this);
	    
	    self.CountSalesPriority1A = ko.computed(function() {
			var count = 0;
		    ko.utils.arrayForEach(self.StatusA(), function(item) {		        
		        if (item.SalesPriority() == 1) {
		        	count ++ ;
		        }
		    });
		    return count;
	    }, this);
	    
	    self.CountSalesPriority1B = ko.computed(function() {
			var count = 0;
		    ko.utils.arrayForEach(self.StatusB(), function(item) {		        
		        if (item.SalesPriority() == 1) {
		        	count ++ ;
		        }
		    });
		    return count;
	    }, this);
	    
	    self.CountSalesPriority1C = ko.computed(function() {
			var count = 0;
		    ko.utils.arrayForEach(self.StatusC(), function(item) {		        
		        if (item.SalesPriority() == 1) {
		        	count ++ ;
		        }
		    });
		    return count;
	    }, this);
	    
	    self.CountSalesPriority1D = ko.computed(function() {
			var count = 0;
		    ko.utils.arrayForEach(self.StatusD(), function(item) {		        
		        if (item.SalesPriority() == 1) {
		        	count ++ ;
		        }
		    });
		    return count;
	    }, this);
	    
	    ////////////////////////////////////
	    //Completion Percentage Aggregates//
	    ////////////////////////////////////
	    self.StatusCompletionPercentA = ko.computed(function() {
	    	var completion;
	    	ko.utils.arrayForEach(this.abcdAlerts(), function(item) {		        
        		completion = self.CountSalesPriority1A()/self.StatusA().length;    		
		    });	    	
	    	if(self.StatusA().length != 0) {
	    		return (completion * 100).toFixed(0) + '%';
	    	}
	    	if(self.StatusA().length == 0) {
	    		return 0;
	    	}
	    }, this);
	    
	    self.StatusCompletionPercentB = ko.computed(function() {
	    	var completion;
	    	ko.utils.arrayForEach(this.abcdAlerts(), function(item) {		        
	        	completion = self.CountSalesPriority1B()/self.StatusB().length;
		    });
	    	if(self.StatusB().length != 0) {
	    		return (completion * 100).toFixed(0) + '%';
	    	}
	    	if(self.StatusB().length == 0) {
	    		return 0;
	    	}    	
	    }, this);
	    
	    self.StatusCompletionPercentC = ko.computed(function() {
	    	var completion;
	    	ko.utils.arrayForEach(this.abcdAlerts(), function(item) {		        
		        completion = self.CountSalesPriority1A()/self.StatusC().length;
		    });
	    	if(self.StatusC().length != 0) {
	    		return (completion * 100).toFixed(0) + '%';
	    	}
	    	if(self.StatusC().length == 0) {
	    		return 0;
	    	}    	
	    }, this);
	    
	    self.StatusCompletionPercentD = ko.computed(function() {
	    	var completion;
	    	ko.utils.arrayForEach(this.abcdAlerts(), function(item) {		        
		        completion = self.CountSalesPriority1D()/self.StatusD().length;
		    });
	    	if(self.StatusD().length != 0) {
	    		return (completion * 100).toFixed(0) + '%';
	    	}
	    	if(self.StatusD().length == 0) {
	    		return 0;
	    	}    	
	    }, this);
	    
	    ////////////////////////////////////////////////////
	    //Status in Array DSAR/DSMR for Conversion Metrics//
	    ////////////////////////////////////////////////////
	    self.DSARStatusA = ko.computed(function() {    	
	    	var returnStatus = [];	    	
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusA(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSARCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "added") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSMRStatusA = ko.computed(function() {    	
	    	var returnStatus = [];
	    	var returnNoteCode = [];
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusA(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSMRCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSARStatusB = ko.computed(function() {    	
	    	var returnStatus = [];	    	
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusB(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSARCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSMRStatusB = ko.computed(function() {	    	
	    	var returnStatus = [];
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusB(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSMRCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSARStatusC = ko.computed(function() {	    	
	    	var returnStatus = [];
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusC(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSARCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSMRStatusC = ko.computed(function() {	    	
	    	var returnStatus = [];
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusC(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSMRCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSARStatusD = ko.computed(function() {	    	
	    	var returnStatus = [];
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusD(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSARCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    
	    self.DSMRStatusD = ko.computed(function() {	    	
	    	var returnStatus = [];
	    	var justStatusCustomerIds = ko.utils.arrayMap(self.StatusD(), function(item) {
	    			returnStatus.push(item.CustomerId());            
		        });	    	
	    	var match = ko.utils.compareArrays(returnStatus,justDSMRCustomerIds());
	    	var results = [];
	    	ko.utils.arrayForEach(match, function(matched) {
	            if (matched.status === "retained") {
	                results.push(matched.value);
	            }
	        });
	    	return results;
	    }, this);
	    	    
	    
	})();	
	
///////////////////
// New Customers // 
///////////////////
	my.newCustomersModel = function(data, event) {	
		this.CustomerId = ko.observable(data.CustomerId);
		this.CustomerName = ko.observable(data.CustomerName);
		this.SalesPerson = ko.observable(data.SalesPerson);
		this.Street1 = ko.observable(data.Street1);
		this.Street2 = ko.observable(data.Street2);
		this.Suite = ko.observable(data.Suite);
		this.City = ko.observable(data.City);
		this.State = ko.observable(data.State);		
		this.SalesActivitySource = ko.observable("NewBusiness");
		this.FullAddress = ko.computed(function() {
	        return this.Street1() + " " + this.Street2() + " " + this.City + " " + this.State();
	    }, this);
		this.FullCustomer = ko.computed(function() {
	        return this.CustomerName() + " (" + this.CustomerId() + ")";
	    }, this);
	}; 	
	
	my.newCustomersVM = function() { 				
		$.getJSON(my.apiBase + "customers?Category=New&SalesPerson=" + my.salesUserFilter, function (data) {		
			var newCustomers = $.map(data, function (item) { return new my.newCustomersModel(item) });
	        self.newCustomers(newCustomers); 
	        
	        //Set counts for Conversion Metrics
	        my.newCustomersCountVal(self.newCustomers().length);
	        my.getSumConversionCounts();
		});
		
		var self = this;
	    self.newCustomers = ko.observableArray([]);		
	    
	    //Get a list of newBusinessCustomerIds//
	    self.justnewCustomersCustomerIds = ko.computed(function() {
	        var newCustomersCustomerIds = ko.utils.arrayMap(self.newCustomers(), function(item) {
	            return item.CustomerId();
	        });
	        return newCustomersCustomerIds.sort();
	        
	    }, self);
	    
	    my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + "customers?Category=New&SalesPerson=" + newValue, function (data) {		
				var newCustomers = $.map(data, function (item) { return new my.newCustomersModel(item) });
		        self.newCustomers(newCustomers); 
		        
		        //Set counts for Conversion Metrics
		        my.newCustomersCountVal(self.newCustomers().length);
		        my.getSumConversionCounts();
			});
			
		});
	
	}();
	

////////////////////
// Quotes Pending //
////////////////////
	my.quotesPendingModel = function (data, event) {
		this.ShpUser = ko.observable(data.ShpUser);
		this.ConUser = ko.observable(data.ConUser);
		this.ThdUser = ko.observable(data.ThdUser);
		this.ShpCompany = ko.observable(data.ShpCompany);
		this.ConCompany = ko.observable(data.ConCompany);
		this.ThdCompany = ko.observable(data.ThdCompany);
		this.ShpCustNum = ko.observable(data.ShpCustNum);
		this.ConCustNum = ko.observable(data.ConCustNum);
		this.ThdCustNum = ko.observable(data.ThdCustNum);
		this.ShpCity = ko.observable(data.ShpCity);
		this.ConCity = ko.observable(data.ConCity);
		this.ThdCity = ko.observable(data.ThdCity);
		this.ShpState = ko.observable(data.ShpState);
		this.ConState = ko.observable(data.ConState);
		this.ThdState = ko.observable(data.ThdState);
		this.TrackingNumber = ko.observable(data.TrackingNumber);
		this.ShipmentDate = ko.observable(data.ShipmentDate);
		this.SalesActivitySource = ko.observable("Quote");
	};

	my.quotesPendingVM = (function() {
		$.getJSON(my.apiBase + 'shipments?Phase=Quote&SalesPerson=' + my.salesUserFilter, function (data) {
        	var quotesPending = $.map(data, function (item) { return new my.quotesPendingModel(item) });
        	self.quotesPending(quotesPending);    
        	
        	//Set counts for Conversion Metrics
        	my.quotesPendingCountVal(self.quotesPending().length);
        	my.getSumConversionCounts();
		});
		
		var self = this;
		self.quotesPending = ko.observableArray([]);
		
		//Get a array of Quotes Pending TrackingNumbers for map in array filter
		self.justQuotesPendingTrackingNumbers = ko.computed(function() {
			var retVal = ko.utils.arrayMap(self.quotesPending(), function(item) {
				return item.TrackingNumber();
			});
			return retVal.sort();
		});
		
		my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'shipments?Phase=Quote&SalesPerson=' + newValue, function (data) {
	        	var quotesPending = $.map(data, function (item) { return new my.quotesPendingModel(item) });
	        	self.quotesPending(quotesPending); 

	        	//Set counts for Conversion Metrics
	        	my.quotesPendingCountVal(self.quotesPending().length);
	        	my.getSumConversionCounts();
			});			
		});

	})();

////////////////
// Lead Notes //
////////////////		
	my.leadNotesModel = function(data, event) {
 		this.CustomerId = ko.observable(data.CustomerId);
 		this.CustomerName = ko.observable(data.CustomerName);
 		this.NoteId = ko.observable(data.NoteId);
 		this.NoteThreadId = ko.observable(data.NoteThreadId);
 		this.NoteCode = ko.observable(data.NoteCode);
 		this.SalesActivitySource = ko.observable(data.SalesActivitySource);
 		this.SolutionSold = ko.observable(data.SolutionSold);
 		this.Note = ko.observable(data.Note);
 		this.EnteredBy = ko.observable(data.EnteredBy);
 		this.AssignedTo = ko.observable(data.AssignedTo);
 		this.StartDate = ko.observable(data.StartDate);
 		this.StartTime = ko.observable(data.StartTime);
 		this.StartDateTime = ko.observable(data.StartDateTime);
 		this.ContactId = ko.observable(data.ContactId);
 		this.ContactName = ko.observable(data.ContactName);
 		this.SalesActivitySource = ko.observable("LeadNote");
 	};
	
	my.leadNotesVM = (function() {			
		$.getJSON(my.apiBase + 'notes?NoteCode=Lead&AssignedTo=' + my.salesUserFilter, function (data) {	
			var leadNotes = $.map(data, function (item) { return new my.leadNotesModel(item) });
			self.leadNotes(leadNotes);	
						
			//Set counts for Conversion Metrics
			my.leadNotesCountVal(self.leadNotes().length);
			my.getSumConversionCounts();
		});
		
		var self = this;
		self.leadNotes = ko.observableArray([]);
		self.leadNoteCityState = ko.observable();
		
		//Get a list of CustomerIds//
	    self.justLeadNoteCustomerIds = ko.computed(function() {
	        var leadNoteCustomerIds = ko.utils.arrayMap(self.leadNotes(), function(item) {	           
	        	return item.CustomerId();
	        });
	        return leadNoteCustomerIds.sort();	        
	    }, self);
		
	    my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'notes?NoteCode=Lead&AssignedTo=' + newValue, function (data) {	
				var leadNotes = $.map(data, function (item) { return new my.leadNotesModel(item) });
				self.leadNotes(leadNotes); 	
				
				//Set counts for Conversion Metrics
				my.leadNotesCountVal(self.leadNotes().length);
				my.getSumConversionCounts();				
			});			
		});     		    
	  
	    self.leadNotes.subscribe(function(newValue) {
		    for(var i=0; i < leadNotes().length; i++) {
		    	$.getJSON(my.apiBase + "customers/" + leadNotes()[i].CustomerId(), function (data) {    			 
	    			$.map(data, function (item) { return leadNoteCityState(item.City + ' ' + item.State) });     			
				});
		    };
	    });
	    
	})();
	
//////////////////////
// Service Failures //
//////////////////////	
	my.serviceFailuresModel = function (data, event) {
		this.ShpUser = ko.observable(data.ShpUser);
		this.ConUser = ko.observable(data.ConUser);
		this.ThdUser = ko.observable(data.ThdUser);
		this.ShpCompany = ko.observable(data.ShpCompany);
		this.ConCompany = ko.observable(data.ConCompany);
		this.ThdCompany = ko.observable(data.ThdCompany);
		this.ShpCustNum = ko.observable(data.ShpCustNum);
		this.ConCustNum = ko.observable(data.ConCustNum);
		this.ThdCustNum = ko.observable(data.ThdCustNum);
		this.ShpCity = ko.observable(data.ShpCity);
		this.ConCity = ko.observable(data.ConCity);
		this.ThdCity = ko.observable(data.ThdCity);
		this.ShpState = ko.observable(data.ShpState);
		this.ConState = ko.observable(data.ConState);
		this.ThdState = ko.observable(data.ThdState);
		this.TrackingNumber = ko.observable(data.TrackingNumber);
		this.ShipmentDate = ko.observable(data.ShipmentDate);
		this.SVFNote = ko.observable(data.SVFNote);
		this.SalesActivitySource = ko.observable("ServiceFailure");
	};

	my.serviceFailuresVM = (function() {
		$.getJSON(my.apiBase + 'shipments?Failed=True&SalesPerson=' + my.salesUserFilter, function (data) {
        	var serviceFailures = $.map(data, function (item) { return new my.serviceFailuresModel(item) });
        	self.serviceFailures(serviceFailures);  
        	
        	//Set counts for Conversion Metrics
        	my.serviceFailuresCountVal(self.serviceFailures().length);
        	my.getSumConversionCounts();
		});

		var self = this;
		self.serviceFailures = ko.observableArray([]);
		
		//Get a array of serviceFailureTrackingNumbers for map in array filter
		self.justServiceFailureTrackingNumbers = ko.computed(function() {
			var retVal = ko.utils.arrayMap(self.serviceFailures(), function(item) {
				return item.TrackingNumber();
			});
			return retVal.sort();
		});
		
		my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'shipments?Failed=True&SalesPerson=' + newValue, function (data) {
	        	var serviceFailures = $.map(data, function (item) { return new my.serviceFailuresModel(item) });
	        	self.serviceFailures(serviceFailures);  
	        	
	        	//Set counts for Conversion Metrics
	        	my.serviceFailuresCountVal(self.serviceFailures().length);
	        	my.getSumConversionCounts();
			});
		});
		
		
	})();
	
	
/////////////////////////
// Returning Customers // 
////////////////////////
	my.returningCustomersModel = function(data, event) {	
		this.CustomerId = ko.observable(data.CustomerId);
		this.CustomerName = ko.observable(data.CustomerName);
		this.SalesPerson = ko.observable(data.SalesPerson);
		this.Street1 = ko.observable(data.Street1);
		this.Street2 = ko.observable(data.Street2);
		this.Suite = ko.observable(data.Suite);
		this.City = ko.observable(data.City);
		this.State = ko.observable(data.State);		
//		this.SalesActivitySource = ko.observable("NewBusiness");
		this.FullAddress = ko.computed(function() {
	        return this.Street1() + " " + this.Street2() + " " + this.City + " " + this.State();
	    }, this);
		this.FullCustomer = ko.computed(function() {
	        return this.CustomerName() + " (" + this.CustomerId() + ")";
	    }, this);
	}; 	
	
	my.returningCustomersVM = function() { 				
		$.getJSON(my.apiBase + "customers?Category=Returning&SalesPerson=" + my.salesUserFilter, function (data) {		
			var returningCustomers = $.map(data, function (item) { return new my.returningCustomersModel(item) });
	        self.returningCustomers(returningCustomers); 
	    	
	        //Set counts for Conversion Metrics
	        my.returningCustomersCountVal(self.returningCustomers().length);
	    	my.getSumConversionCounts();
		});
		
		var self = this;
	    self.returningCustomers = ko.observableArray([]);		
	    
	    //Get an array of newBusinessCustomerIds for map in array filter
	    self.justreturningCustomersCustomerIds = ko.computed(function() {
	        var returningCustomersCustomerIds = ko.utils.arrayMap(self.returningCustomers(), function(item) {
	            return item.CustomerId();
	        });
	        return returningCustomersCustomerIds.sort();
	        
	    }, self);
	    
	    my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + "customers?Category=Returning&SalesPerson=" + newValue, function (data) {		
				var returningCustomers = $.map(data, function (item) { return new my.returningCustomersModel(item) });
		        self.returningCustomers(returningCustomers); 
		    	
		        //Set counts for Conversion Metrics
		        my.returningCustomersCountVal(self.returningCustomers().length);
		    	my.getSumConversionCounts();
			});
			
		});
	
	}();	
	

//////////////////////////////
//data-bind click Functions //
//////////////////////////////
	
	///////////////////////////////////////////////////////
	//Create dialog to add planner activity from an alert//
	///////////////////////////////////////////////////////
	$(function() {
		$('#alertAddActivityDialog').dialog({
			autoOpen: false,
			height: 600,
			width: "98%",
			modal: true,
			close: function() {
				//Close all open dialog boxes and return to dashboard
				$(this).dialog("close");					
				$('#alertShipmentDetailDialog').dialog("close");
				
				//Reset all form fields and subscribed variables
				resetAddToPlannerData();
				my.selectedAlertTrackingNumberObservable();
				my.selectedAlertTrackingNumber = ko.utils.unwrapObservable(my.selectedAlertTrackingNumberObservable());
				my.selectedCustomerObservable(0);
				my.selectedCustomer = 0;
    		},
			buttons: {				
				Save: function() {				
					var customerIdVal = my.selectedCustomer;
    				var contactIdVal = $('#addActivityContact').val();
    				var codeVal = $('#addActivityNoteCode').val();
    				var startVal = $('#addActivityStartDate').val() + ' ' + $('#addActivityStartTime').val();  
    				var endVal = $('#addActivityEndDate').val() + ' ' + $('#addActivityEndTime').val();    				
    				var assignedToIdVal = my.salesUserFilter;
    				var descriptionVal = $('#addActivityNote').val();
    				
    	        	$.ajax({
    	        		url: my.apiBase + 'customers/' + customerIdVal + '/notes/',
    	        		type: 'POST',
    	        		data: {CustomerId: customerIdVal, ContactId: contactIdVal, Code: codeVal, Start: startVal, End:endVal, AssignedToId: assignedToIdVal, Description: descriptionVal},
    	        		dataType: 'json',    	        		
    	        		success: function(data){    	        			  
    	        			//Update planner after adding activity
    	        			$.getJSON(my.apiBase + 'notes?'
    	        					+ 'IsActionable=True&'
    	        					+ 'IsCompleted=False&' 
    	        					+ 'DueDateStart=' + my.plannerStartDate   
    	        					+ '&DueDateEnd=' + my.plannerEndDate
    	        					+ '&AssignedTo=' + my.salesUserFilter, 
    	        					function (data) {	
    	        						var myPlannerActivities = $.map(data, function (item) { return new my.myPlannerActivitiesModel(item) });
    	        						self.myPlannerActivities(myPlannerActivities); 					
    	        			});  
    	        			my.selectedCustomerObservable(null);
    	        		},
    	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
	  	        			alert(jqXHR.status + textStatus + errorThrown);
	  	        		}
    	        	});

					$(this).dialog("close");	
					$('#alertShipmentDetailDialog').dialog("close");	
					
					//Remove the alert that has been converted to an activity
					my.clickedElement.parent().empty();	
					
				},
				Cancel: function() {
					//Close all open dialog boxes and return to dashboard
					$(this).dialog("close");					
					$('#alertShipmentDetailDialog').dialog("close");
					
					//Reset all form fields and subscribed variables
					resetAddToPlannerData();
					my.selectedAlertTrackingNumberObservable();
					my.selectedAlertTrackingNumber = ko.utils.unwrapObservable(my.selectedAlertTrackingNumberObservable());
					my.selectedCustomerObservable(0);
					my.selectedCustomer = 0;
				}
			}				      
		}); 
	});	
	self.addActivityFromAlert = function(item, event){	
		//These variables are used to in add to planner API routes and dialog HTML
		my.selectedAlert(this);		
		my.selectedCustomerObservable(my.selectedAlert().CustomerId());		
		my.selectedCustomer = ko.utils.unwrapObservable(my.selectedCustomerObservable());		
		my.selectedCustomerNameObservable(my.selectedAlert().CustomerName());
		my.selectedCustomerName = ko.utils.unwrapObservable(my.selectedCustomerNameObservable());
		
		//Populate lead note into add to planner note field
		var prop = 'Note';
		if(my.selectedAlert().hasOwnProperty(prop)) {			
			AddToPlannerNote(my.selectedAlert().Note());
		};
				
		//Used to remove the alert that has been converted to an activity on add activity from alert dialog save
		my.clickedElement = $(event.target);
		
		$(function() {		
			//resetAddToPlannerData();
			$("#alertAddActivityDialog").dialog("open");
			$("#alertAddActivityDialog").load("../../Resources/Views/dialogAddActivityFromAlert.html");			
		});
	};	
	

	//////////////////////////////////////////	
	//Create dialog for detail shipment view//
	//////////////////////////////////////////
	self.shipmentDetailsOpen = function(elem, event){ 	
		//Used to in add to planner API routes and dialog HTML 
		my.selectedAlert(this);			
		my.selectedCustomerObservable(my.selectedAlert().CustomerId());
		my.selectedCustomer = ko.utils.unwrapObservable(my.selectedCustomerObservable());
		my.selectedCustomerNameObservable(my.selectedAlert().CustomerName());
		my.selectedCustomerName = ko.utils.unwrapObservable(my.selectedCustomerNameObservable());
		
		
		//Used to remove the alert that has been converted to an activity on add activity from alert dialog save
		my.clickedElement = $(event.target);		
		
		$(function() {			
			$("#alertShipmentDetailDialog").dialog("open");
			$("#alertShipmentDetailDialog").load("../../Resources/Views/dialogAlertShipmentDetails.html");						
		});		
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Create dialog for detail shipment view from Shipment API business object (Quotes Pending, Service Failures)//
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//Added "event" parameter to fix Firefox bug.  
	self.shipmentTrackingNumberDetailsOpen = function(elem, event){ 	
		//Used to in add to planner API routes and dialog HTML
		my.selectedAlert(this);			
		my.selectedCustomerObservable(0);
		my.selectedCustomer = ko.utils.unwrapObservable(my.selectedCustomerObservable());		
		my.selectedAlertTrackingNumberObservable(my.selectedAlert().TrackingNumber);
		my.selectedAlertTrackingNumber = ko.utils.unwrapObservable(my.selectedAlertTrackingNumberObservable());		
		
		//Used to remove the alert that has been converted to an activity on add activity from alert dialog save. 
		my.clickedElement = $(event.target);
		
		//Solution found on Stackoverflow.  Works, but buggy.
//		$('#alertNewBusinessDetailDialog').click(function(event){
//			my.clickedElement = event.target;
//		});		
							
		$(function() {				
			$("#alertShipmentDetailDialog").dialog("open");
			$("#alertShipmentDetailDialog").load("../../Resources/Views/dialogAlertShipmentDetails.html");				
		});
	};
	
		

///////////////////
//Event Handlers //
///////////////////
	$('#abcdChartA').on('click', function() {		
		//Set status filters used for map, ABCD Chart and Conversion Metrics
		my.cbStatusFilterObservable('A');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set map filters
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonCustomerMarkers
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.cb_status == spartan.cbStatusFilter;
			});
		
		//Set ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(this).addClass('abcdChartSelected');
		
		//Set Conversion Metrics variables and Animate 
		my.abcdCountVal(StatusA().length);
		my.myPlannerDSARActivitiesCountData(DSARStatusA().length);		
		my.myPlannerDSMRActivitiesCountData(DSMRStatusA().length);	
		my.newCustomersCountVal(newCustomers().length);
		my.quotesPendingCountVal(quotesPending().length);		
		my.leadNotesCountVal(leadNotes().length);
		my.serviceFailuresCountVal(serviceFailures().length);
		my.returningCustomersCountVal(returningCustomers().length);		
		my.getSumConversionCounts();
		
		//Animate Conversion Metrics
		$('#box3 circle').eq(0).fadeIn('slow');
		$('#box3 text').eq(0).fadeIn('slow');
		$('#box3 circle').slice(1,6).fadeOut('slow');
		$('#box3 text').slice(1,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		
	});

	$('#abcdChartB').on('click', function() {
		//Set status filters used for map, ABCD Chart and Conversion Metrics
		my.cbStatusFilterObservable('B');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set map filters
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonCustomerMarkers
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.cb_status == spartan.cbStatusFilter;
			});
		
		//Set ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(this).addClass('abcdChartSelected');
		
		//Set conversion metrics variables and animate 
		my.abcdCountVal(StatusB().length);
		my.myPlannerDSARActivitiesCountData(DSARStatusB().length);		
		my.myPlannerDSMRActivitiesCountData(DSMRStatusB().length);		
		my.newCustomersCountVal(newCustomers().length);
		my.quotesPendingCountVal(quotesPending().length);		
		my.leadNotesCountVal(leadNotes().length);
		my.serviceFailuresCountVal(serviceFailures().length);
		my.returningCustomersCountVal(returningCustomers().length);
			
		
		my.getSumConversionCounts();
		
		//Animate Conversion Metrics
		$('#box3 circle').eq(0).fadeIn('slow');
		$('#box3 text').eq(0).fadeIn('slow');
		$('#box3 circle').slice(1,6).fadeOut('slow');
		$('#box3 text').slice(1,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
	});

	$('#abcdChartC').on('click', function() {
		//Set status filters used for map, ABCD Chart and Conversion Metrics
		my.cbStatusFilterObservable('C');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set map filters
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });		
		GeoJsonCustomerMarkers
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.cb_status == spartan.cbStatusFilter;
			});
				
		//Set ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(this).addClass('abcdChartSelected');		
		
		//Set Conversion Metrics variables and animate 
		my.abcdCountVal(StatusC().length);
		my.myPlannerDSARActivitiesCountData(DSARStatusC().length);		
		my.myPlannerDSMRActivitiesCountData(DSMRStatusC().length);		
		my.newCustomersCountVal(newCustomers().length);
		my.quotesPendingCountVal(quotesPending().length);		
		my.leadNotesCountVal(leadNotes().length);
		my.serviceFailuresCountVal(serviceFailures().length);
		my.returningCustomersCountVal(returningCustomers().length);
		
		
		//Animate Conversion Metrics
		$('#box3 circle').eq(0).fadeIn('slow');
		$('#box3 text').eq(0).fadeIn('slow');
		$('#box3 circle').slice(1,6).fadeOut('slow');
		$('#box3 text').slice(1,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
	});

	$('#abcdChartD').on('click', function() {
		//Set status filters used for map, ABCD Chart and Conversion Metrics
		my.cbStatusFilterObservable('D');		
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set map filters
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonCustomerMarkers
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.cb_status == spartan.cbStatusFilter;
			});
		
		//Set ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(this).addClass('abcdChartSelected');
		
		//Set Conversion Metrics variables and animate 
		my.abcdCountVal(StatusD().length);
		my.myPlannerDSARActivitiesCountData(DSARStatusD().length);		
		my.myPlannerDSMRActivitiesCountData(DSMRStatusD().length);		
		my.newCustomersCountVal(newCustomers().length);
		my.quotesPendingCountVal(quotesPending().length);		
		my.leadNotesCountVal(leadNotes().length);
		my.serviceFailuresCountVal(serviceFailures().length);
		my.returningCustomersCountVal(returningCustomers().length);
		
		
		//Animate Conversion Metrics
		$('#box3 circle').eq(0).fadeIn('slow');
		$('#box3 text').eq(0).fadeIn('slow');
		$('#box3 circle').slice(1,6).fadeOut('slow');
		$('#box3 text').slice(1,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
	});

	$("#abcdHeader").on("click", function() {		
		//Set map filters
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonCustomerMarkers.setFilter(function(feature, layer) { 
				return true 
				&& feature.properties.cb_status == 'A'
				|| feature.properties.cb_status == 'B'
				|| feature.properties.cb_status == 'C'
				|| feature.properties.cb_status == 'D';  
		});
		
		//Remove ABCD Chart Formatting AND cbStatus variable
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		
		//Set Conversion Metrics variables 
		my.abcdCountVal(abcdAlerts().length);
		my.myPlannerDSARActivitiesCountData(myPlannerDSARmaintenance().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRmaintenance().length);		
		my.getSumConversionCounts();
		
		/*
		//Animate Conversion Metrics
		$('#box3 circle').eq(0).fadeIn('slow');
		$('#box3 text').eq(0).fadeIn('slow');
		$('#box3 circle').slice(1,6).fadeOut('slow');
		$('#box3 text').slice(1,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		
		//Use below to alter formatting rather than fadeIn/Out 
		//$('#box3 circle').eq(0).css({'stroke':'blue', 'stroke-width':'3px'});
		//$('#box3 circle').eq(0).siblings('circle').css({'stroke-width': '1px', 'stroke':'gray'});
		*/
		
	});
	
	$("#newCustomerHeader").on("click", function() {	
		//Set map filters
		GeoJsonCustomerMarkers.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonNewBusinessMarker
			.loadURL('../../Resources/data/ObjGeoCustomersNewBusiness.json')			
			.setFilter(function (feature, layer) {	
				return feature.properties.SalesPerson == my.salesUserFilter; //$.inArray(feature.properties.solo_key, my.customerNewBusinessToMap) !== -1;
			})
			.addTo(my.map);
		
		//Remove ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set Conversion Metrics variables
		my.newCustomersCountVal(newCustomers().length);
		my.myPlannerDSARActivitiesCountData(myPlannerDSARnewcustomers().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRnewcustomers().length);
		my.getSumConversionCounts();
		
		/*
		//Animate Conversion Metrics
		$('#box3 circle').eq(1).fadeIn('slow');
		$('#box3 text').eq(1).fadeIn('slow');
		$('#box3 circle').eq(0).fadeOut('slow');
		$('#box3 text').eq(0).fadeOut('slow');
		$('#box3 circle').slice(2,6).fadeOut('slow');
		$('#box3 text').slice(2,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		
		//Use below to alter formatting rather than hide 
		//$('#box3 circle').eq(0).css({'stroke':'blue', 'stroke-width':'3px'});
		//$('#box3 circle').eq(0).siblings('circle').css({'stroke-width': '1px', 'stroke':'gray'});
		*/
	});

	$("#quotesPendingHeader").on("click", function() {	
		//Set map filters
		GeoJsonCustomerMarkers.setFilter(function() { return false; });
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });		
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonSalesTerritories.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker
			.loadURL('../../Resources/data/GeoObjViewCustomersQuotesPending.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.SalesPerson == my.salesUserFilter;
			});
		GeoJsonQuotePolyline
			.loadURL('../../Resources/data/GeoObjViewShipmentsQuote.json')					
			.setFilter(function (feature, layer) {	
				return feature.properties.TrackingNumber = $.inArray(feature.properties.TrackingNumber, justQuotesPendingTrackingNumbers()) !== -1;
		});		
		
		//Remove ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set Conversion Metrics variables
		my.quotesPendingCountVal(quotesPending().length);	
		my.myPlannerDSARActivitiesCountData(myPlannerDSARquotespending().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRquotespending().length);
		my.getSumConversionCounts();
		
		/*
		//Animate Conversion Metrics
		$('#box3 circle').eq(2).fadeIn('slow');
		$('#box3 text').eq(2).fadeIn('slow');
		$('#box3 circle').slice(0,2).fadeOut('slow');	
		$('#box3 text').slice(0,2).fadeOut('slow');	
		$('#box3 circle').slice(3,6).fadeOut('slow');
		$('#box3 text').slice(3,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		*/
	});

	$("#leadNotesHeader").on("click", function() {			
		//Set map filters
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });	
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonCustomerMarkers			
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.solo_key = $.inArray(feature.properties.solo_key, justLeadNoteCustomerIds()) !== -1;
			});	 
		
		//Set City State for Lead Notes
		for(var i=0; i < leadNotes().length; i++) {
	    	$.getJSON(my.apiBase + "customers/" + leadNotes()[i].CustomerId(), function (data) {    			 
    			$.map(data, function (item) { return leadNoteCityState(item.City + ' ' + item.State) });   		            			
			});
	    };
		
		//Remove ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set Conversion Metrics variables
		my.leadNotesCountVal(leadNotes().length);
		my.myPlannerDSARActivitiesCountData(myPlannerDSARleadnotes().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRleadnotes().length);
		my.getSumConversionCounts();
		
		/*
		//Animate Conversion Metrics
		$('#box3 circle').eq(3).fadeIn('slow');
		$('#box3 text').eq(3).fadeIn('slow');
		$('#box3 circle').slice(0,3).fadeOut('slow');	
		$('#box3 text').slice(0,3).fadeOut('slow');	
		$('#box3 circle').slice(4,6).fadeOut('slow');
		$('#box3 text').slice(4,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		*/
	});
	
	$("#serviceFailuresHeader").on("click", function() {			
		//Set map filters
		GeoJsonCustomerMarkers.setFilter(function() { return false; });	
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });		
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonSalesTerritories.setFilter(function() { return false; });
		
		GeoJsonServiceFailuresMarkers			
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.solo_key = $.inArray(feature.properties.solo_key, justLeadNoteCustomerIds()) !== -1;
		});
		
		GeoJsonServiceFailurePolyline
			.loadURL('../../Resources/data/GeoObjViewShipmentsFailure.json')					
			.setFilter(function (feature, layer) {	
				return feature.properties.TrackingNumber = $.inArray(feature.properties.TrackingNumber, justServiceFailureTrackingNumbers()) !== -1;
		});
				
		//Remove ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set Conversion Metrics variables
		my.serviceFailuresCountVal(serviceFailures().length);
		my.myPlannerDSARActivitiesCountData(myPlannerDSARservicefailures().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRservicefailures().length);
		my.getSumConversionCounts();
		
		/*
		//Animate Conversion Metrics
		$('#box3 circle').eq(4).fadeIn('slow');
		$('#box3 text').eq(4).fadeIn('slow');
		$('#box3 circle').slice(0,4).fadeOut('slow');	
		$('#box3 text').slice(0,4).fadeOut('slow');	
		$('#box3 circle').slice(5,6).fadeOut('slow');
		$('#box3 text').slice(5,6).fadeOut('slow');
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		*/
	});
	
	$("#returningCustomerHeader").on("click", function() {			
		//Set map filters
		GeoJsonNewBusinessMarker.setFilter(function() { return false; });
		GeoJsonQuotesPendingMarker.setFilter(function() { return false; });			
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonCustomerMarkers			
			.loadURL('../../Resources/data/GeoCustomerMarkers/GeoCustomerMarkerDescription' + my.salesUserFilter + '.json')
			.setFilter(function (feature, layer) {	
				return feature.properties.solo_key = $.inArray(feature.properties.solo_key, justreturningCustomersCustomerIds()) !== -1;
		});	 
			
		//Remove ABCD Chart Formatting
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set Conversion Metrics variables and animate
		my.returningCustomersCountVal(returningCustomers().length);
		my.myPlannerDSARActivitiesCountData(myPlannerDSARreturningcustomers().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerDSMRreturningcustomers().length);
		my.getSumConversionCounts();
		
		/*
		//Animate Conversion Metrics
		$('#box3 circle').eq(5).fadeIn('slow');
		$('#box3 text').eq(5).fadeIn('slow');
		$('#box3 circle').slice(0,5).fadeOut('slow');	
		$('#box3 text').slice(0,5).fadeOut('slow');			
		//Clear formatting from circle click events
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		*/
	});
	

	
