
$body = $("#todayHeader");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});


//My Planner accordion headers with dates
 $(function() {
    // Now
    var now = moment();   
            
    $('#todayHeader').append([
    	moment().format('ddd, MMMM Do') 
    ].join('<br/>'));
    
    $('#thisWeekHeader').append([
    	moment().add('d',1).format('ddd, MMMM Do') + ' - ' + moment().add('d', 7).format('ddd, MMMM Do'),
    ].join('<br/>'));
    
    $('#nextWeekHeader').append([
    	moment().add('d', 8).format('ddd, MMMM Do') + ' - ' + moment().add('d', 14).format('ddd, MMMM Do'),
    ].join('<br/>'));
    
    $('#thirdWeekHeader').append([
    	moment().add('d', 15).format('ddd, MMMM Do') + ' - ' + moment().add('d', 21).format('ddd, MMMM Do'),
    ].join('<br/>'));     
 });
 

//////////////////////////////
//View Model for My Planner //
////////////////////////////// 
 	my.myPlannerActivitiesModel = function(data, event) {
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
 	};
	
	
	my.MyPlannerPostboxVM = (function() {				
		$.getJSON(my.apiBase + 'notes?'
				+ 'IsActionable=True'
				+ '&IsCompleted=False' 
				+ '&Start=' + my.plannerStartDate   
				+ '&End=' + my.plannerEndDate
				+ '&AssignedTo=' + my.salesUserFilter, 
				function (data) {	
					var myPlannerActivities = $.map(data, function (item) { return new my.myPlannerActivitiesModel(item) });
					self.myPlannerActivities(myPlannerActivities); 
					my.myPlannerDSARActivitiesCountData(self.myPlannerDSARActivities().length);
					my.myPlannerDSMRActivitiesCountData(self.myPlannerDSMRActivities().length);
					my.getSumConversionCounts();
		});
		
		my.salesUserFilterObservable.subscribe(function(newValue) {
			$.getJSON(my.apiBase + 'notes?'
					+ 'IsActionable=True'
					+ '&IsCompleted=False' 
					+ '&Start=' + my.plannerStartDate   
					+ '&End=' + my.plannerEndDate
					+ '&AssignedTo=' + newValue, 
					function (data) {	
						var myPlannerActivities = $.map(data, function (item) { return new my.myPlannerActivitiesModel(item) });
						self.myPlannerActivities(myPlannerActivities);   	
						my.myPlannerDSARActivitiesCountData(self.myPlannerDSARActivities().length);
						my.myPlannerDSMRActivitiesCountData(self.myPlannerDSMRActivities().length);
						my.getSumConversionCounts();
					});
		});  
		
			
		var self = this;
		self.myPlannerActivities = ko.observableArray([]);		
		self.availableSalesUsersList = ko.observableArray([]).subscribeTo("availableSalesUsers", true);	
		
		self.selectedActivity = ko.observable("").subscribeTo("desiredActivity", true);
		self.selectedAlert = ko.observable("").subscribeTo("desiredAlert", true);
		


	//////////////////////////////////////////////
	//Create date groupings for MyPlanner widget//
	//////////////////////////////////////////////
		
	    /////////
		//Today//
		/////////
		self.myPlannerTodaysActivities = ko.computed(function() {	          
	        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY');
	        		my.myPlannerTodayActivitiesToMap.push(self.myPlannerTodaysActivities());
	        		my.getSumConversionCounts();
	        	}).sort(function(a,b){return a.StartDateTime() > b.StartDateTime() ? 1: -1});	
	    },self);
	    self.justTodayCustomerNumbers = ko.computed(function() {
	        var todayCustomerNumbers = ko.utils.arrayMap(self.myPlannerTodaysActivities(), function(item) {
	            return item.CustomerId();            
	        });
	        return todayCustomerNumbers.sort();	        
	    }, self);	    
	    self.myPlannerTodayDSAR = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'
        		&& moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY');        		   		
        	})	
	    },self);
	    self.myPlannerTodayDSMR = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'        		
        		&& moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY');	   		
        	})	
	    },self);	    
	    self.myPlannerTodayMaintenaceActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Maintenance';		   		
        	})	
	    },self);
	    self.myPlannerTodayNewCustomerActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'New Customer';		   		
        	})	
	    },self);
	    self.myPlannerTodayQuotePendingActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Quote Pending';		   		
        	})	
	    },self);
	    self.myPlannerTodayLeadNoteActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Lead Note';		   		
        	})	
	    },self);
	    self.myPlannerTodayServiceFailureActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Service Failure';		   		
        	})	
	    },self);
	    self.myPlannerTodayReturningCustomerActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Returning Customer';		   		
        	})	
	    },self);
	    
	    /////////////
		//This Week//
		/////////////
	    self.myPlannerThisWeeksActivities = ko.computed(function() {	           
	        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
					&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY');
	        	}).sort(function(a,b){return a.StartDateTime() > b.StartDateTime() ? 1: -1});	
	    },self);
	    self.justThisWeekCustomerNumbers = ko.computed(function() {
	        var thisWeekCustomerNumbers = ko.utils.arrayMap(self.myPlannerThisWeeksActivities(), function(item) {
	            return item.CustomerId();
	        });
	        return thisWeekCustomerNumbers.sort();	        
	    }, self);
	    self.myPlannerThisWeekDSAR = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'
    			&& moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY');        		   		
        	})	
	    },self);
	    self.myPlannerThisWeekDSMR = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'        		
    			&& moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY');     		
        	})	
	    },self);	    
	    self.myPlannerThisWeekMaintenaceActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY') 
        		&& item.SalesActivitySource() == 'Maintenance';		   		
        	})	
	    },self);
	    self.myPlannerThisWeekNewCustomerActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'New Customer';		   		
        	})	
	    },self);
	    self.myPlannerThisWeekQuotePendingActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Quote Pending';		   		
        	})	
	    },self);
	    self.myPlannerThisWeekLeadNoteActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Lead Note';		   		
        	})	
	    },self);
	    self.myPlannerThisWeekServiceFailureActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Service Failure';		   		
        	})	
	    },self);
	    self.myPlannerThisWeekReturningCustomerActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',7).format('MM/DD/YYYY')
        		&& item.SalesActivitySource() == 'Returning Customer';		   		
        	})	
	    },self);
	    
	    /////////////
	    //Next Week//
	    /////////////
	    self.myPlannerNextWeeksActivities = ko.computed(function() {	        
	        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
					&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY');
	        	}).sort(function(a,b){return a.StartDateTime() > b.StartDateTime() ? 1: -1});	
	    },self);
	    self.justNextWeekCustomerNumbers = ko.computed(function() {
	        var nextWeekCustomerNumbers = ko.utils.arrayMap(self.myPlannerNextWeeksActivities(), function(item) {
	            return item.CustomerId();
	        });
	        return nextWeekCustomerNumbers.sort();
	    }, self);	    
	    self.myPlannerNextWeekDSAR = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return item.NoteCode() == 'DSAR'
    			&& moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY');       		   		
	    	})	
	    },self);
	    self.myPlannerNextWeekDSMR = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return item.NoteCode() == 'DSMR'        		
    			&& moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY');   		
	    	})	
	    },self);	    
	    self.myPlannerNextWeekMaintenaceActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY') 
	    		&& item.SalesActivitySource() == 'Maintenance';		   		
	    	})	
	    },self);
	    self.myPlannerNextWeekNewCustomerActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'New Customer';		   		
	    	})	
	    },self);
	    self.myPlannerNextWeekQuotePendingActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Quote Pending';		   		
	    	})	
	    },self);
	    self.myPlannerNextWeekLeadNoteActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Lead Note';		   		
	    	})	
	    },self);
	    self.myPlannerNextWeekServiceFailureActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Service Failure';		   		
	    	})	
	    },self);
	    self.myPlannerNextWeekReturningCustomerActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',7).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',15).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Returning Customer';		   		
	    	})	
	    },self);
		    
	    //////////////
	    //Third Week//
	    //////////////
	    self.myPlannerThirdWeeksActivities = ko.computed(function() {	               
	        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {
	        		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
					&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY');
	        	}).sort(function(a,b){return a.StartDateTime() > b.StartDateTime() ? 1: -1});	
	    },self);
	    self.justThirdWeekCustomerNumbers = ko.computed(function() {
	        var thirdWeekCustomerNumbers = ko.utils.arrayMap(self.myPlannerThirdWeeksActivities(), function(item) {
	            return item.CustomerId();
	        });
	        return thirdWeekCustomerNumbers.sort();
	    }, self);
	    self.myPlannerThirdWeekDSAR = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return item.NoteCode() == 'DSAR'
    			&& moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY');       		   		
	    	})	
	    },self);
	    self.myPlannerThirdWeekDSMR = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return item.NoteCode() == 'DSMR'        		
    			&& moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY');   		
	    	})	
	    },self);	    
	    self.myPlannerThirdWeekMaintenaceActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Maintenance';		   		
	    	})	
	    },self);
	    self.myPlannerThirdWeekNewCustomerActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'New Customer';		   		
	    	})	
	    },self);
	    self.myPlannerThirdWeekQuotePendingActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Quote Pending';		   		
	    	})	
	    },self);
	    self.myPlannerThirdWeekLeadNoteActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Lead Note';		   		
	    	})	
	    },self);
	    self.myPlannerThirdWeekServiceFailureActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Service Failure';		   		
	    	})	
	    },self);
	    self.myPlannerThirdWeekReturningCustomerActivities = ko.computed(function() {	          
	    	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
	    		return moment(item.StartDate()).format('MM/DD/YYYY') > moment().add('d',14).format('MM/DD/YYYY')
				&& moment(item.StartDate()).format('MM/DD/YYYY') < moment().add('d',22).format('MM/DD/YYYY')
	    		&& item.SalesActivitySource() == 'Returning Customer';		   		
	    	})	
	    },self);
	    
	/////////////////////////////////////////////////////////////////
	//Create Sales Activity Source groupings for Conversion Metrics//
	/////////////////////////////////////////////////////////////////
	    self.myPlannerDSARActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'        		        		   		
        	})       	
	    },self);
	    
	    self.myPlannerDSMRActivities = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'    		        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSARmaintenance = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'        		
        		&& item.SalesActivitySource() == 'Maintenance';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSMRmaintenance = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'
        		&& item.SalesActivitySource() == 'Maintenance';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSARnewcustomers = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'    			
        		&& item.SalesActivitySource() == 'New Customer';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSMRnewcustomers = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'    			
        		&& item.SalesActivitySource() == 'New Customer';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSARquotespending = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'    			
        		&& item.SalesActivitySource() == 'Quote Pending';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSMRquotespending = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'    			
        		&& item.SalesActivitySource() == 'Quote Pending';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSARleadnotes = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'    			
        		&& item.SalesActivitySource() == 'Lead Note';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSMRleadnotes = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'    			
        		&& item.SalesActivitySource() == 'Lead Note';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSARservicefailures = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'    			
        		&& item.SalesActivitySource() == 'Service Failure';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSMRservicefailures = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'    			
        		&& item.SalesActivitySource() == 'Service Failures';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSARreturningcustomers = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSAR'    			
        		&& item.SalesActivitySource() == 'Returning Customers';        		   		
        	})	
	    },self);
	    
	    self.myPlannerDSMRreturningcustomers = ko.computed(function() {	          
        	return ko.utils.arrayFilter(self.myPlannerActivities(), function(item) {	        		
        		return item.NoteCode() == 'DSMR'    			
        		&& item.SalesActivitySource() == 'Returning Customer';        		   		
        	})	
	    },self);
	    
    ///////////////////////////
    //Just Customer ID arrays//		   
    ///////////////////////////
  		self.justDSARCustomerIds = ko.computed(function() { 
  			return ko.utils.arrayMap(self.myPlannerDSARActivities(), function(item) {
  				return item.CustomerId();            
  			});			
  		}, self);
  		self.justDSMRCustomerIds = ko.computed(function() { 
  			return ko.utils.arrayMap(self.myPlannerDSMRActivities(), function(item) {
  				return item.CustomerId();            
  			});			
  		}, self); 
	    
	////////////////////
	// Confirm Delete //
	////////////////////
		self.removeActivity = function(activity){
			if (confirm("Are you sure?")) {
				self.myPlannerTodaysActivities.remove(activity);
			}
				return false;
		};				
	})();
	
		
	/////////////////////////////////////////
	//Create dialog to add planner activity//
	/////////////////////////////////////////	
	$(function() {
		$('#addActivityDialog').dialog({
			autoOpen: false,
			height: 600,
			width: "98%",
			modal: true,
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
					$(this).dialog("close");
					my.selectedCustomerObservable(null);
					
				}
			}				      
		}); 
	});
	
	self.addActivity = function(item){ 	
		$(function() {		
			resetAddToPlannerData();
		    $("#addActivityDialog").load("../../Resources/Views/dialogAddActivity.html");
			$("#addActivityDialog").dialog("open");			
		});
	};
	
	
	
	//////////////////////////////////////////
	//Create dialog to edit planner activity//
	//////////////////////////////////////////		
	$(function() {
		$('#editActivityDialog').dialog({
			autoOpen: false,
			height: 600,
			width: "98%",
			modal: true,
			buttons: {				
				Save: function() {				
					var noteIdVal = my.selectedPlannerActivityNoteId();
					var customerIdVal = my.selectedCustomer;
	  				var contactIdVal = $('#editActivityContact').val();
	  				var codeVal = $('#editActivityNoteCode').val();
	  				var startVal = $('#editActivityStartDate').val() + ' ' + $('#editActivityStartTime').val();  
	  				var endVal = $('#editActivityEndDate').val() + ' ' + $('#editActivityEndTime').val();    				
	  				var assignedToVal = my.salesUserFilter;
	  				var descriptionVal = $('#editActivityNote').val();
	  				var completedVal = $('#editActivityCompleteCheckbox').val();
	  				
	  	        	$.ajax({
	  	        		url: my.apiBase + 'notes/',
	  	        		type: 'PATCH',
	  	        		data: {NoteId : noteIdVal, CustomerId: customerIdVal, ContactId: contactIdVal, Code: codeVal, AssignedTo: assignedToVal, Description: descriptionVal, Start: startVal, End: endVal, Completed: completedVal},
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
	  	        		},
	  	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
	  	        			alert(jqXHR.status + textStatus + errorThrown);
	  	        		}
	  	        	});
			        					
					$(this).dialog("close");	

				},
				Delete: function() {
					var noteIdVal = my.selectedPlannerActivityNoteId();
					$.ajax({
	  	        		url: my.apiBase + 'notes/',
	  	        		type: 'DELETE',
	  	        		data: {NoteId : noteIdVal},	  	        		
	  	        		success: function(data){    	        			  
	  	        			//Update planner after  activity
	  	        			my.clickedElement.parent().empty();         			
	  	        		},
	  	        		
	  	        		error: function(jqXHR, textStatus, errorThrown) {  	        		    
	  	        			alert(jqXHR.status + textStatus + errorThrown);	  	        			
	  	        		}
	  	        		
	  	        	});
					
					$(this).dialog("close");				        	
				},
				Cancel: function() {
					$(this).dialog("close");				        	
				}
			}				      
		}); 
	});
	self.editActivity = function(item){ 	
		my.selectedPlannerActivityKey(this); 
		my.selectedPlannerActivityCustomer(selectedActivity().CustomerId());  // (self.editPlannerActivity()[0].CustomerId());
		my.selectedPlannerActivityNoteId(selectedActivity().NoteId())  // (self.editPlannerActivity()[0].NoteId());
		my.clickedElement = $(event.target);
		$(function() {	
			resetAddToPlannerData();
			$("#editActivityDialog").dialog("open");
			$("#editActivityDialog").load("../../Resources/Views/dialogEditActivity.html");
		});
	};
		
	
	/////////////////////////////////////////////////////////////////////
	//Create dialog to add planner activity from customers tab grid row//
	/////////////////////////////////////////////////////////////////////
	self.alertAddActivityFromGridRow = function(item){ 	
		$(function() {		
			//resetAddToPlannerData();			
			AddToPlannerCustomerNumber((ko.toJS(selectedCustomerGridRow)[0]).CustomerId);
			//AddToPlannerCustomerNumber(my.selectedAlert().CustomerNo());
			$("#alertAddActivityFromGridRowDialog").dialog("open");
			$("#alertAddActivityFromGridRowDialog").load("../../Resources/Views/dialogAddActivity.html");
		});
	};
	
	///////////////////////////////////
	//Clear add planner activity data//
	///////////////////////////////////
	function resetAddToPlannerData() {
		self.AddToPlannerNote(null); 
	    self.AddToPlannerNoteCode(null);	    
	    //self.AddToPlannerCustomerNumber(0);
	    my.selectedCustomerObservable(0);
	    my.selectedCustomer = 0;	    
	    self.AddToPlannerStartDate(null);
	    self.AddToPlannerStartTime(null); 
	    self.AddToPlannerEndDate(null);
	    self.AddToPlannerEndTime(null); 
	    self.AddToPlannerActivityContactPhone(null);
	    self.AddToPlannerActivityContactDirect(null);
	    //self.AddToPlannerAssignedTo(null);
	    self.AddToPlannerCompleted(null); 
	    self.AddToPlannerSalesActivitySource(null); 
	    $('#addActivityNoteCode').val('NULL'); //This is currently hard coded, not API
	    self.AddToPlannerActivityAddress(null);
	    self.AddToPlannerActivityContact(null);
	    //self.AddToPlannerActivityContactPhone(null); 
	    self.AddToPlannerSolutionSold([]);
	};	
	
	
	///////////////////
	//Event Handlers //
	///////////////////
	
	//Customer marker and Conversion Metrics filter on My Planner widget header click events//
	$("#todayHeader").on("click", function() {	
		//Set map filter		
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		my.myPlannerTodayActivitiesToMap = justTodayCustomerNumbers();		
		GeoJsonCustomerMarkers.setFilter(function (feature, layer) {	
			return $.inArray(feature.properties.solo_key, my.myPlannerTodayActivitiesToMap) !== -1;
		});
			
		//Remove ABCD Chart Formatting and variables
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set conversion metrics variables		
		my.abcdCountVal(myPlannerTodayMaintenaceActivities().length);
		my.newCustomersCountVal(myPlannerTodayNewCustomerActivities().length);
		my.quotesPendingCountVal(myPlannerTodayQuotePendingActivities().length);		
		my.leadNotesCountVal(myPlannerTodayLeadNoteActivities().length);
		my.serviceFailuresCountVal(myPlannerTodayServiceFailureActivities().length);
		my.returningCustomersCountVal(myPlannerTodayReturningCustomerActivities().length);
		my.myPlannerDSARActivitiesCountData(myPlannerTodayDSAR().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerTodayDSMR().length);
		
		my.getSumConversionCounts();
				
		$('#box3 circle').fadeIn('slow');
		$('#box3 text').fadeIn('slow');
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		
	});
	
	$("#thisWeekHeader").on("click", function() {	
		//Set map filter
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		my.myPlannerThisWeekActivitiesToMap = justThisWeekCustomerNumbers();
		GeoJsonCustomerMarkers.setFilter(function (feature, layer) {	
			return $.inArray(feature.properties.solo_key, my.myPlannerThisWeekActivitiesToMap) !== -1;
		});
		
		//Remove ABCD Chart Formatting and variables
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set conversion metrics variables		
		my.abcdCountVal(myPlannerThisWeekMaintenaceActivities().length);
		my.newCustomersCountVal(myPlannerThisWeekNewCustomerActivities().length);
		my.quotesPendingCountVal(myPlannerThisWeekQuotePendingActivities().length);		
		my.leadNotesCountVal(myPlannerThisWeekLeadNoteActivities().length);
		my.serviceFailuresCountVal(myPlannerThisWeekServiceFailureActivities().length);
		my.returningCustomersCountVal(myPlannerThisWeekReturningCustomerActivities().length);
		my.myPlannerDSARActivitiesCountData(myPlannerThisWeekDSAR().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerThisWeekDSMR().length);
		
		my.getSumConversionCounts();
				
		$('#box3 circle').fadeIn('slow');
		$('#box3 text').fadeIn('slow');
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});		
	});
	
	$("#nextWeekHeader").on("click", function() {	
		//Set map filter
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		my.myPlannerNextWeekActivitiesToMap = justNextWeekCustomerNumbers();
		GeoJsonCustomerMarkers.setFilter(function (feature, layer) {	
			return $.inArray(feature.properties.solo_key, my.myPlannerNextWeekActivitiesToMap) !== -1;
		});
		
		//Remove ABCD Chart Formatting and variables
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set conversion metrics variables		
		my.abcdCountVal(myPlannerNextWeekMaintenaceActivities().length);
		my.newCustomersCountVal(myPlannerNextWeekNewCustomerActivities().length);
		my.quotesPendingCountVal(myPlannerNextWeekQuotePendingActivities().length);		
		my.leadNotesCountVal(myPlannerNextWeekLeadNoteActivities().length);
		my.serviceFailuresCountVal(myPlannerNextWeekServiceFailureActivities().length);
		my.returningCustomersCountVal(myPlannerNextWeekReturningCustomerActivities().length);
		my.myPlannerDSARActivitiesCountData(myPlannerNextWeekDSAR().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerNextWeekDSMR().length);
		
		my.getSumConversionCounts();
				
		$('#box3 circle').fadeIn('slow');
		$('#box3 text').fadeIn('slow');
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
	});
	
	$("#thirdWeekHeader").on("click", function() {	
		//Set map filter
		GeoJsonServiceFailurePolyline.setFilter(function() { return false; });
		GeoJsonQuotePolyline.setFilter(function() { return false; });
		my.myPlannerThirdWeekActivitiesToMap = justThirdWeekCustomerNumbers();
		GeoJsonCustomerMarkers.setFilter(function (feature, layer) {	
			return $.inArray(feature.properties.solo_key, my.myPlannerThirdWeekActivitiesToMap) !== -1;
		});
		
		//Remove ABCD Chart Formatting and variables
		$('.abcdChart').removeClass('abcdChartSelected');
		$(".ui-widget-header").removeClass("ui-state-active");
		my.cbStatusFilterObservable('all');
		my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilterObservable);
		
		//Set conversion metrics variables		
		my.abcdCountVal(myPlannerThirdWeekMaintenaceActivities().length);
		my.newCustomersCountVal(myPlannerThirdWeekNewCustomerActivities().length);
		my.quotesPendingCountVal(myPlannerThirdWeekQuotePendingActivities().length);		
		my.leadNotesCountVal(myPlannerThirdWeekLeadNoteActivities().length);
		my.serviceFailuresCountVal(myPlannerThirdWeekServiceFailureActivities().length);
		my.returningCustomersCountVal(myPlannerThirdWeekReturningCustomerActivities().length);
		my.myPlannerDSARActivitiesCountData(myPlannerThirdWeekDSAR().length);		
		my.myPlannerDSMRActivitiesCountData(myPlannerThirdWeekDSMR().length);
		
		my.getSumConversionCounts();
				
		$('#box3 circle').fadeIn('slow');
		$('#box3 text').fadeIn('slow');
		$('#box3 circle').css({'stroke-width': '1px', 'stroke':'gray'});
		
	});
	
	//Excel Export
	$('#exportPlannerButton').click(function(){
	    var data = ko.toJSON(myPlannerActivities())
	    if(data == '')
	        return;
	    JSONToCSVConvertor(data, "My 3 Week Planner", true);
	});
