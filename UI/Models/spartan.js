//Define Namespace ***Changed to my" from "spartan" for brevity***//
 

var spartan = spartan || {};
var my = spartan || {};

my.map = my.map || {};

$(function() {	
	
//////////////////////////////		
//Define Dashboard Variables//
//////////////////////////////
	//my.apiBase = 'http://wdennusstra0769/api/'; //Use this for development
    my.apiBase = /api/;  //Use this for push to master

 
	my.salesUserFilter = 'BRRO';//ko.utils.unwrapObservable(my.salesUserFilter);
	my.salesUserFilterObservable = ko.observable('all').publishOn("desiredUser");
	    	
	my.cbStatusFilterObservable = ko.observable().publishOn("desiredBucket");
	my.cbStatusFilter = ko.utils.unwrapObservable(my.cbStatusFilter);
	
	//Date Variables for My Planner//
	my.plannerStartDate = moment(my.plannerStartDate).format('YYYY-MM-DD');
	my.plannerEndDate = moment(my.plannerEndDate).add('d',22).format('YYYY-MM-DD');
	
	//Variables for My Alerts//
	my.customerIdNumber;
	my.clickedElement;
	
	//Arrays pushed from db_myPlannerVM to be displayed on dashboard map//
	my.customerLeadNotesToMap = [];
	my.customerToMap = [];
	my.customerQuotesPendingToMap = [];	
	my.myPlannerActivitiesToMap = [];
	my.myPlannerTodayActivitiesToMap = [];
	my.myPlannerThisWeekActivitiesToMap = [];
	my.myPlannerNextWeekActivitiesToMap = [];
	my.myPlannerThirdWeekActivitiesToMap = [];
	
	//Arrays pushed from db_myPlannerVM to be included as waypoints in Google Optimize Routing map//
	my.dateToRouteInput;
	my.myPlannerActivitiesToRoute = [];
	my.myPlannerCustomersToRoute = [];
	
	
	//Variables for adding and editing planner events//
	my.selectedPlannerActivityKey = ko.observable("").publishOn("desiredActivity");
	my.selectedAlert = ko.observable("").publishOn("desiredAlert");
	my.selectedCustomerObservable = ko.observable(0).publishOn('desiredCustomer');
	my.selectedCustomer = ko.utils.unwrapObservable(my.selectedCustomerObservable());
	my.selectedCustomerNameObservable = ko.observable();
	my.selectedCustomerName = ko.utils.unwrapObservable(my.selectedCustomerNameObservable());
	my.selectedPlannerActivityCustomer = ko.observable().publishOn("selectedEditCustomer");
	my.selectedPlannerActivityNoteId = ko.observable().publishOn("selectedEditNoteId");
	my.addToPlannerSolutionSoldSelected = ko.observableArray([]);
	my.selectedContactObservable = ko.observable().subscribeTo('desiredContact');
	my.selectedContact = ko.utils.unwrapObservable(my.selectedContactObservable());
		
	
	//Variables for alerts details
	my.selectedAlertTrackingNumberObservable = ko.observable();
	my.selectedAlertTrackingNumber = ko.utils.unwrapObservable(my.selectedAlertTrackingNumberObservable());
	my.selectedShipmentDetail = ko.observable();	
	
	
	//Variables for Conversion Metrics
	my.abcdCountVal = ko.observable();
	my.newCustomersCountData;
	my.newCustomersCountVal = ko.observable(0);
	my.quotesPendingCountVal = ko.observable();
	my.leadNotesCountVal = ko.observable();
	my.serviceFailuresCountVal = ko.observable();
	my.returningCustomersCountVal = ko.observable();
	//TODO-CAMO- Need to Clean this up should only need the Val variables, but still tied to Data
	my.myPlannerDSARActivitiesCountVal = ko.observable();
	my.myPlannerDSMRActivitiesCountVal = ko.observable();
	my.myPlannerDSARActivitiesCountData = ko.observable();
	my.myPlannerDSMRActivitiesCountData = ko.observable();
	
	my.conversionSelectedSource;
	
	my.sumConversionCountsObservable = ko.observable();
	my.getSumConversionCounts = function() {
		my.sumConversionCountsObservable(my.newCustomersCountVal() + 
			my.abcdCountVal() +
			my.quotesPendingCountVal() + 
			my.leadNotesCountVal() +
			my.serviceFailuresCountVal() +
			my.myPlannerDSARActivitiesCountData() +
			my.myPlannerDSMRActivitiesCountData())		
	};
	
	//Variables for map events
	my.mapSelectTrackingNumberObservable = ko.observable();
		
			
//////////////////////////////////////	
//Define Customers Tab(ct) Variables//
//////////////////////////////////////	
	my.ctFilterCustomerNameContainsVal;
	my.ctFilterCustomerNameContainsObservable = ko.observable("");
	my.ctFilterCustomerNameContainsAPIsyntax = "";
	my.customersTabABCDSelectVal;
	my.customersTabABCDSelectValObservable = ko.observable("");
	my.ctABCDSelectValAPIsytax = "";
	my.ctFilterCustomerNumberValObservable = ko.observable("");	
	my.ctFilterCustomerNumberVal;
		
////////////////////////////	
//Define Spartan Functions//
////////////////////////////
	//list all properties of any object//
	my.list = function(obj) {
	  for(var prop in obj) {
		  console.log (prop);
	  }  
	};

	



});


