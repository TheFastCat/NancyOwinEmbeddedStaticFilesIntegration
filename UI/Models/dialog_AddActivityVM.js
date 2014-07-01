//Add Activity Planner Data//

self.addToPlannerData = ko.observableArray([
	this.AddToPlannerCustomerNumber = new ko.observable(0),
	this.AddToPlannerCustomerName = new ko.observable(),
	this.AddToPlannerStartDate = new ko.observable(),
	this.AddToPlannerStartTime = new ko.observable(),
	this.AddToPlannerEndDate = new ko.observable(),
	this.AddToPlannerEndTime = new ko.observable(),
	this.AddToPlannerNoteCode = new ko.observable(),  
	this.AddToPlannerActivityContactPhone = new ko.observable(),
	this.AddToPlannerActivityContactDirect = new ko.observable(),  
    //this.AddToPlannerAssignedTo = new ko.observable(),
    this.AddToPlannerCompleted = new ko.observable(),
    this.AddToPlannerSalesActivitySource = new ko.observable(),
    this.AddToPlannerActivityAddress = new ko.observable(),
    this.AddToPlannerActivityContact = new ko.observable().publishOn('desiredContact'),
    //this.AddToPlannerActivityContactPhone = new ko.observable(),
    this.AddToPlannerSolutionSold = new ko.observableArray([]),
	this.AddToPlannerNote = new ko.observable()	
]);	

////////////////////////////////////
//View Model Sales Activity Source//
////////////////////////////////////
	my.addToPlannerSalesActivitySourceModel = function(data, event) {
		this.ActivityId = ko.observable(data.ActivityId);
		this.Activity = ko.observable(data.Activity);
		this.choosenSalesActivitySource = ko.observableArray([]);
	};
	
	my.addToPlannerSalesActivitySourceVM = (function(){
		$.getJSON(my.apiBase + 'activities', function (data) {
			var addToPlannerSalesActivitySource = $.map(data, function (item) { return new my.addToPlannerSalesActivitySourceModel(item) });
	        self.addToPlannerSalesActivitySource(addToPlannerSalesActivitySource);
		});
		
		var self = this;
	    self.addToPlannerSalesActivitySource = ko.observableArray([]);	    
	    
	})();

///////////////////////////
//View Model SolutionSold//
///////////////////////////
	my.addToPlannerSolutionSoldModel = function(data, event) {
		this.SolutionId = ko.observable(data.SolutionId);
		this.Solution = ko.observable(data.Solution);
		this.choosenItems = ko.observableArray([]);
	};
	
	my.addToPlannerSolutionSoldVM = (function(){
		$.getJSON(my.apiBase + 'solutions', function (data) {
			var addToPlannerSolutionSold = $.map(data, function (item) { return new my.addToPlannerSolutionSoldModel(item) });
	        self.addToPlannerSolutionSold(addToPlannerSolutionSold);
		});
		
		var self = this;
	    self.addToPlannerSolutionSold = ko.observableArray([]);
	    
	})();

////////////////////////////
//View Model for Customers//
////////////////////////////
	var allCustomerNumber = function(data, event) {	
		this.CustomerNo = ko.observable(data.CustomerId);
		this.CustomerName = ko.observable(data.CustomerName);
		this.Street1 = ko.observable(data.Street1);
		this.Street2 = ko.observable(data.Street2);
		this.Suite = ko.observable(data.Suite);
		this.City = ko.observable(data.City);
		this.State = ko.observable(data.State);
		this.FullAddress = ko.computed(function() {
	        return this.Street1() + " " + this.Street2() + " " + this.City + " " + this.State();
	    }, this);
		this.FullCustomer = ko.computed(function() {
	        return this.CustomerName() + " (" + this.CustomerNo() + ")";
	    }, this);
	}; 	
	
	my.addToMyPlannerCustomerVM = function(){		
		
		$.getJSON(my.apiBase + 'customers/?SalesPerson=' + my.salesUserFilter, function (data) {
			var listAllCustomerNumber = $.map(data, function (item) { return new allCustomerNumber(item) });
	        self.listAllCustomerNumber(listAllCustomerNumber);	        
		});
		
		$("#salesUserSelect").on("change", function() {
			$.getJSON(my.apiBase + 'customers/?SalesPerson=' + my.salesUserFilter, function (data) {
				var listAllCustomerNumber = $.map(data, function (item) { return new allCustomerNumber(item) });
		        self.listAllCustomerNumber(listAllCustomerNumber);
			});
		});	
				
		var self = this;
	    self.listAllCustomerNumber = ko.observableArray([]);	
		
	}();
	
///////////////////////////
//View Model for Contacts//
///////////////////////////
	var allContacts = function(data, event) {
		this.CustomerID = ko.observable(data.CustomerID);
		this.ContactID = ko.observable(data.ContactID).publishOn("selectedContact");
		this.FullName = ko.observable(data.FullName);	
	};
	
	my.addToMyPlannerContactVM = function(){			
		
			my.selectedCustomerObservable.subscribe(function(newValue) {
				if (my.selectedCustomerObservable() != 0) {
					$.getJSON(my.apiBase + 'customers/' + newValue + '/contacts', function (data) {
						var listAllContacts = $.map(data, function (item) { return new allContacts(item) });
				        self.listAllContacts(listAllContacts);
					});
				};
				
			});	
		
		var self = this;
		self.listAllContacts = ko.observableArray([]);
					
	}();
	
///////////////////////////////
//View Model for ContactPhone//
///////////////////////////////
	my.addActivityContactPhonesModel = function(data, event) {
		this.CustomerID = ko.observable(data.CustomerID);
		this.ContactID = ko.observable(data.ContactID).subscribeTo("selectedContact");
		this.FullName = ko.observable(data.FullName);
		this.Phone = ko.observable(data.Phone);
		this.Fax = ko.observable(data.Fax);
		this.Direct = ko.observable(data.Direct);
	};
	
	my.addActivityContactPhonesVM = function(){			

		//Retrieve contacts from the API for the selected customer by subscribing to a change in the observable//
		this.AddToPlannerActivityContact.subscribe(function(newValue) {
			if (my.selectedCustomer != 0) {
				my.selectedCustomer = ko.utils.unwrapObservable(my.selectedCustomerObservable());
				$.getJSON(my.apiBase + 'customers/' + my.selectedCustomer + '/contacts/' + newValue, function (data) {
					var addActivityContactPhones = $.map(data, function (item) { return new my.addActivityContactPhonesModel(item) });
			        self.addActivityContactPhones(addActivityContactPhones);
				});
			};
		});
		
		
		var self = this;
		self.addActivityContactPhones = ko.observableArray([]);
			
	}();	
	
////////////////////////////
//View Model for Addresses//
////////////////////////////
	my.allCustomerAddressesModel = function(data, event) {
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
	        return this.Type() + ':  '  + this.Street1() + " " + this.Street2() + " " + this.City() + " " + this.State();
	    }, this);
	};
	
	my.allCustomerAddressesVM = function(){		
		my.selectedCustomerObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'addresses?CustomerId=' + newValue, function (data) {
				var allCustomerAddresses = $.map(data, function (item) { return new my.allCustomerAddressesModel(item) });
		        self.allCustomerAddresses(allCustomerAddresses);
		        
			});
		});
		
		var self = this;
		self.allCustomerAddresses = ko.observableArray([]);
			
	}();
	

	
///////////////////////////	
//Click Binding Functions//
///////////////////////////	
	
	//Create dialog to add contact//	
	self.newContact = function(item){ 	
		var customer = my.selectedCustomer;
		$(function() {	
    	    $( "#addNewContactDialog" ).dialog({
    	      resizable: false,	        	      
    	      modal: true,	        	      
    	      buttons: {
    	        "Add": function() {
    	        	var customerIdVal = my.selectedCustomer;
    				var firstNameVal = $('#addNewContactDialog input:eq(0)').val();
    				var lastNameVal = $('#addNewContactDialog input:eq(1)').val();
    				var phoneVal = $('#addNewContactDialog input:eq(2)').val();
    				var directVal = $('#addNewContactDialog input:eq(3)').val();
    	        	$.ajax({
    	        		url: my.apiBase + 'contacts',
    	        		type: 'POST',
    	        		data: {CustomerId: customerIdVal, FirstName: firstNameVal, LastName: lastNameVal, Phone: phoneVal, Direct: directVal},
    	        		dataType: 'json',
    	        		success: function(data){        	        			
    	        			$.getJSON(my.apiBase + 'customers/' + customerIdVal + '/contacts', function (data) {
    	    					var listAllContacts = $.map(data, function (item) { return new allContacts(item) });
    	    			        self.listAllContacts(listAllContacts);
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
	self.editContact = function(item){				
		$(function() {
    	    $( "#editContactPhonesDialog" ).dialog({
    	      resizable: false,	        	      
    	      modal: true,	        	      
    	      buttons: {
    	        "Add": function() {
    	        	var customerIdVal = my.selectedCustomer;
    	        	var contactIdVal = my.selectedContactObservable();      				
    				var phoneVal = $('#editContactPhonesDialog input:eq(0)').val();
    				var directVal = $('#editContactPhonesDialog input:eq(1)').val();
    	        	$.ajax({
    	        		url: my.apiBase + 'contacts',
    	        		type: 'PATCH',
    	        		data: {ContactId: contactIdVal, CustomerId: customerIdVal, Phone: phoneVal, Direct: directVal},
    	        		dataType: 'json',
    	        		success: function(data){    	        			
    	        			$.getJSON(my.apiBase + 'customers/' + customerIdVal + '/contacts/' + contactIdVal, function (data) {
    	        				var addActivityContactPhones = $.map(data, function (item) { return new my.addActivityContactPhonesModel(item) });
    	        		        self.addActivityContactPhones(addActivityContactPhones);
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
	self.editMeetingAddress = function(item){				
		$(function() {	
			$( "#editMeetingAddressDialog" ).dialog({
    	      resizable: false,	        	      
    	      modal: true,	        	      
    	      buttons: {
    	        "Add": function() {
    	        	var customerIdVal = my.selectedCustomer;    	        	      				
    				var street1Val = $('#editMeetingAddressDialog input:eq(0)').val();
    				var cityVal = $('#editMeetingAddressDialog input:eq(1)').val();
    				var stateVal = $('#editMeetingAddressDialog input:eq(2)').val();  
    				var zipVal = $('#editMeetingAddressDialog input:eq(3)').val();  
    				// THIS MIMICS AN API PUT BY DELETING MEET ADDRESS BEFORE EDITING  
    				$.ajax({
    					url: my.apiBase + 'addresses/',
    		        		type: 'DELETE',
    		        		data: {CustomerId: customerIdVal, Type: 'MEET'},  		
    		        		success: function(data){    
    		        			$.ajax({
    		    	        		url: my.apiBase + 'addresses/',
    		    	        		type: 'POST',
    		    	        		data: {CustomerId: customerIdVal, Type: 'MEET', Street1: street1Val, City: cityVal, State: stateVal, Zip: zipVal},
    		    	        		dataType: 'json',
    		    	        		success: function(data){    	        			
    		    	        			$.getJSON(my.apiBase + 'addresses?CustomerId=' + customerIdVal, function (data) {
    		    	        				var allCustomerAddresses = $.map(data, function (item) { return new my.allCustomerAddressesModel(item) });
    		    	        		        self.allCustomerAddresses(allCustomerAddresses); 
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
    		    	        				var allCustomerAddresses = $.map(data, function (item) { return new my.allCustomerAddressesModel(item) });
    		    	        		        self.allCustomerAddresses(allCustomerAddresses); 
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
	
	