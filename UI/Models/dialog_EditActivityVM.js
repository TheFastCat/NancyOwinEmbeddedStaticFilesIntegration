//Edit Acitivity VM



///////////////////////////////////
//View Model for Planner Activity//
///////////////////////////////////
	my.editPlannerActivityModel = function(data, event) {	
		this.CustomerId = ko.observable(data.CustomerId);
		this.NoteId = ko.observable(data.NoteId);
		this.NoteCode = ko.observable(data.NoteCode);
		this.SalesActivitySource = ko.observable(data.SalesActivitySource);
		this.SolutionSold = ko.observable(data.SolutionSold);
		this.Note = ko.observable(data.Note);
		this.EnteredBy = ko.observable(data.EnteredBy);
		this.EnteredById = ko.observable(data.EnteredById);
		this.EnteredByName = ko.observable(data.EnteredByName);
		this.AssignedTo = ko.observable(data.AssignedTo);
		this.AssignedToId = ko.observable(data.AssignedToId);
		this.AssignedToName = ko.observable(data.AssignedToName);
		this.StartDate = ko.observable(data.StartDate);
		this.StartTime = ko.observable(data.StartTime);
		this.StartDateTime = ko.observable(data.StartDateTime);
		this.EndDate = ko.observable(data.EndDate);
		this.EndTime = ko.observable(data.EndTime);
		this.EndDateTime = ko.observable(data.EndDateTime);
		this.ContactId = ko.observable(data.ContactId);
		this.ContactName = ko.observable(data.ContactName);		
	}; 	
	
	my.editPlannerActivityVM = function(){			
		my.selectedPlannerActivityNoteId.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'customers/' + my.selectedPlannerActivityCustomer() + '/notes/' + newValue, function (data) {
				var editPlannerActivity = $.map(data, function (item) { return new my.editPlannerActivityModel(item) });
		        self.editPlannerActivity(editPlannerActivity);
			});
		});
		
		var self = this;
	    self.editPlannerActivity = ko.observableArray([]);	    
	    
	}();
	
////////////////////////////////////
//View Model Sales Activity Source//
////////////////////////////////////
	my.editActivitySalesActivitySourceModel = function(data, event) {
		this.ActivityId = ko.observable(data.ActivityId);
		this.Activity = ko.observable(data.Activity);
		this.choosenSalesActivitySource = ko.observableArray([]);
	};
	
	my.editActivitySalesActivitySourceVM = (function(){
		$.getJSON(my.apiBase + 'activities', function (data) {
			var editActivitySalesActivitySource = $.map(data, function (item) { return new my.editActivitySalesActivitySourceModel(item) });
	        self.editActivitySalesActivitySource(editActivitySalesActivitySource);
		});
		
		var self = this;
	    self.editActivitySalesActivitySource = ko.observableArray([]);
	    
	})();
	
////////////////////////////
//View Model for Customers//
////////////////////////////
	my.editActivityCustomerModel = function(data, event) {	
		this.CustomerNo = ko.observable(data.CustomerId);
		this.CustomerName = ko.observable(data.CustomerName);
		this.Street1 = ko.observable(data.Street1);
		this.Street2 = ko.observable(data.Street2);
		this.Suite = ko.observable(data.Suite);
		this.City = ko.observable(data.City);
		this.State = ko.observable(data.State);
		this.FullAddress = ko.computed(function() {
	        return this.Street1() + " " + this.Street2() + " " + this.Suite() + " " + this.City() + " " + this.State();
	    }, this);
		this.FullCustomer = ko.computed(function() {
	        return this.CustomerName() + " (" + this.CustomerNo() + ")";
	    }, this);
	}; 	
	
	my.editActivityCustomerVM = function(){				
		my.selectedPlannerActivityCustomer.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'customers/' + newValue, function (data) {
				var editActivityCustomer = $.map(data, function (item) { return new my.editActivityCustomerModel(item) });
		        self.editActivityCustomer(editActivityCustomer);
			});
		});
		
		var self = this;
	    self.editActivityCustomer = ko.observableArray([]);	
		
	}();
	
///////////////////////////
//View Model for Contacts//
///////////////////////////
		my.editActivityContactsModel = function(data, event) {
			this.CustomerID = ko.observable(data.CustomerID);
			this.ContactID = ko.observable(data.ContactID);
			this.FullName = ko.observable(data.FullName);	
			this.Phone = ko.observable(data.Phone);
			this.Direct = ko.observable(data.Direct);
		};
		
		my.editActivityContactsVM = function(){					
			//Retrieve contacts from the API for the selected customer by subscribing to a change in the observable//
			my.selectedPlannerActivityCustomer.subscribe(function(newValue) {
				$.getJSON(my.apiBase + 'customers/' + newValue + '/contacts/', function (data) {
					var editActivityContacts = $.map(data, function (item) { return new my.editActivityContactsModel(item) });
			        self.editActivityContacts(editActivityContacts);
				});
			});
			
			var self = this;
			self.editActivityContacts = ko.observableArray([]);
			self.selectedContactID = ko.observable().publishOn('desiredContact');
			
		}();
	
/////////////////////////////////
//View Model for Contact Phones//
/////////////////////////////////
		my.editActivityContactPhonesModel = function(data, event) {
			this.CustomerID = ko.observable(data.CustomerID);
			this.ContactID = ko.observable(data.ContactID);
			this.Phone = ko.observable(data.Phone);
			this.Direct = ko.observable(data.Direct);
		};
		
		my.editActivityContactPhonesVM = function(){						
			this.selectedContactID.subscribe(function(newValue) {
				$.getJSON(my.apiBase + 'customers/' + my.selectedPlannerActivityCustomer() + '/contacts/' + newValue, function (data) {
					var editActivityContactPhones = $.map(data, function (item) { return new my.editActivityContactPhonesModel(item) });
			        self.editActivityContactPhones(editActivityContactPhones);
				});
			});
			
			var self = this;
			self.editActivityContactPhones = ko.observableArray([]);
				
		}();
		
////////////////////////////
//View Model for Addresses//
////////////////////////////
	my.editActivityCustomerAddressesModel = function(data, event) {
		this.AddressKey = ko.observable(data.AddressKey);
		this.SoloKey = ko.observable(data.SoloKey);
		this.Type = ko.observable(data.Type);
		this.Street1 = ko.observable(data.Street1);
		this.Street2 = ko.observable(data.Street2);
		this.Suite = ko.observable(data.Suite);
		this.City = ko.observable(data.City);
		this.State = ko.observable(data.State);
		this.ZipCode = ko.observable(data.ZipCode);
		this.FullAddress = ko.computed(function() {
	        return this.Type() + ':  '  + this.Street1() + " " + this.City() + " " + this.State();
	    }, this);
	};
	
	my.editActivityCustomerAddressesVM = function(){		
		my.selectedPlannerActivityCustomer.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'addresses?CustomerId=' + newValue, function (data) {
				var editActivityCustomerAddresses = $.map(data, function (item) { return new my.editActivityCustomerAddressesModel(item) });
		        self.editActivityCustomerAddresses(editActivityCustomerAddresses);
		        
			});
		});
		
		var self = this;
		self.editActivityCustomerAddresses = ko.observableArray([]);
			
	}();
		
	
		
///////////////////////////
//Click Binding Functions//
///////////////////////////
		//Create dialog to add contact//	
		self.editActivityNewContact = function(item){ 	
			var customer = my.selectedPlannerActivityCustomer();
			$(function() {	
	    	    $( "#editActivityAddNewContactDialog" ).dialog({
	    	      resizable: false,	        	      
	    	      modal: true,	        	      
	    	      buttons: {
	    	        "Add": function() {
	    	        	var customerIdVal = customer;
	    				var firstNameVal = $('#editActivityAddNewContactDialog input:eq(0)').val();
	    				var lastNameVal = $('#editActivityAddNewContactDialog input:eq(1)').val();
	    				var phoneVal = $('#editActivityAddNewContactDialog input:eq(2)').val();
	    				var directVal = $('#editActivityAddNewContactDialog input:eq(3)').val();
	    	        	$.ajax({
	    	        		url: my.apiBase + 'contacts',
	    	        		type: 'POST',
	    	        		data: {CustomerId: customerIdVal, FirstName: firstNameVal, LastName: lastNameVal, Phone: phoneVal, Direct: directVal},
	    	        		dataType: 'json',
	    	        		success: function(data){        	        			
	    	        			$.getJSON(my.apiBase + 'customers/' + customer + '/contacts', function (data) {
	    	        				var editActivityContacts = $.map(data, function (item) { return new my.editActivityContactsModel(item) });
	    	    			        self.editActivityContacts(editActivityContacts);
	    	    				});
	    	        		},
	    	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
		  	        			alert(jqXHR.status + textStatus + errorThrown);
		  	        		}
	    	        	});
	    	        	$( this ).dialog( "close" );
	    	        },
	    	        Cancel: function() {
	    	          $( this ).dialog( "close" );
	    	        }
	    	      }
	    	    });
			});
		};
		
		//Create dialog to edit contact phones//	
		self.editActivityEditContact = function(item){		 					
			$(function() {
	    	    $( "#editActivityEditContactPhonesDialog" ).dialog({
	    	      resizable: false,	        	      
	    	      modal: true,	        	      
	    	      buttons: {
	    	        "Add": function() {
	    	        	var customerIdVal = my.selectedPlannerActivityCustomer();
	    	        	var contactIdVal = my.selectedContactObservable();       				
	    				var phoneVal = $('#editActivityEditContactPhonesDialog input:eq(0)').val();
	    				var directVal = $('#editActivityEditContactPhonesDialog input:eq(1)').val();
	    	        	$.ajax({
	    	        		url: my.apiBase + 'contacts/',
	    	        		type: 'PATCH',
	    	        		data: {ContactId: contactIdVal, CustomerId: customerIdVal, Phone: phoneVal, Direct: directVal},
	    	        		dataType: 'json',
	    	        		success: function(data){    	        			
	    	        			$.getJSON(my.apiBase + 'customers/' + customerIdVal + '/contacts/' + contactIdVal, function (data) {
	    	    					var editActivityContactPhones = $.map(data, function (item) { return new my.editActivityContactPhonesModel(item) });
	    	    			        self.editActivityContactPhones(editActivityContactPhones);
	    	    				});
	    	        		},
	    	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
		  	        			alert(jqXHR.status + textStatus + errorThrown);
		  	        		}
	    	        	});
	    	        	$( this ).dialog( "close" );
	    	        },
	    	        Cancel: function() {
	    	          $( this ).dialog( "close" );
	    	        }
	    	      }
	    	    });
	    	});
		};
		
		//Create dialog to edit meeting address//	
		self.editActivityEditMeetingAddress = function(item){				
			$(function() {	
				$( "#editActivityEditMeetingAddressDialog" ).dialog({
	    	      resizable: false,	        	      
	    	      modal: true,	        	      
	    	      buttons: {
	    	        "Add": function() {
	    	        	var customerIdVal = my.selectedPlannerActivityCustomer();    	        	      				
	    				var street1Val = $('#editActivityEditMeetingAddressDialog input:eq(0)').val();
	    				var cityVal = $('#editActivityEditMeetingAddressDialog input:eq(1)').val();
	    				var stateVal = $('#editActivityEditMeetingAddressDialog input:eq(2)').val();  
	    				var zipVal = $('#editActivityEditMeetingAddressDialog input:eq(3)').val();  
	    				// THIS MIMICS AN API PUT BY DELETING MEET ADDRESS BEFORE EDITING  
	    				$.ajax({
	    					url: my.apiBase + 'addresses',
	    		        		type: 'DELETE',
	    		        		data: {CustomerId: customerIdVal, Type: 'MEET'},  		
	    		        		success: function(data){    
	    		        			$.ajax({
	    		    	        		url: my.apiBase + 'addresses',
	    		    	        		type: 'POST',
	    		    	        		data: {CustomerId: customerIdVal, Type: 'MEET', Street1: street1Val, City: cityVal, State: stateVal, Zip: zipVal},
	    		    	        		dataType: 'json',
	    		    	        		success: function(data){    	        			
	    		    	        			$.getJSON(my.apiBase + 'addresses?CustomerId=' + customerIdVal, function (data) {
	    		    	        				var editActivityCustomerAddresses = $.map(data, function (item) { return new my.editActivityCustomerAddressesModel(item) });
	    		    	        		        self.editActivityCustomerAddresses(editActivityCustomerAddresses);
	    		    	        		        	    		    	        		        
	    		    	        			});	    		    	        			
	    		    	        		}
	    		    	        		/*
	    		    	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
	    			  	        			alert(jqXHR.status + textStatus + errorThrown);
	    			  	        		}
	    			  	        		*/
	    		    	        	});	    		        			
	    		        			
	    		        		},
	    		        		// NO ERROR HANDLING, ERRORS TO BE EXPECTED WHEN DELETING RECORDS TAHT DO NOT EXIST	        		
	    		        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
	    		        			$.ajax({
	    		    	        		url: my.apiBase + 'addresses/',
	    		    	        		type: 'POST',
	    		    	        		data: {CustomerId: customerIdVal, Type: 'MEET', Street1: street1Val, City: cityVal, State: stateVal, Zip: zipVal},
	    		    	        		dataType: 'json',
	    		    	        		success: function(data){    	        			
	    		    	        			$.getJSON(my.apiBase + 'addresses?CustomerId=' + customerIdVal, function (data) {
	    		    	        				var editActivityCustomerAddresses = $.map(data, function (item) { return new my.editActivityCustomerAddressesModel(item) });
	    		    	        		        self.editActivityCustomerAddresses(editActivityCustomerAddresses);
	    		    	        		        
	    		    	        			});	 
	    		    	        	
	    		    	        		},
	    		    	        		
	    		    	        		/*
	    		    	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
	    			  	        			alert(jqXHR.status + textStatus + errorThrown);
	    			  	        		}
	    			  	        		*/
	    		    	        	});	  	        			
	    		        		}
	    		        		
	    		        });
	    				
	    	        	$( this ).dialog( "close" );
	    	        	
	    	        },
	    	        Cancel: function() {
	    	          $( this ).dialog( "close" );	    	          
	    	        }
	    	      }
	    	    });
	    	});
		};
		