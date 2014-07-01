//This is an application master View Model//

	my.myAlertsMasterVM = {
		abcdAlertsVM : my.abcdAlertsVM,
		newCustomersVM : my.newCustomersVM,
		quotesPendingVM : my.quotesPendingVM,
		leadNotesAlertVM : my.leadNotesVM,
		serviceFailuresVM : my.serviceFailuresVM
	};
	ko.applyBindings(my.myAlertsMasterVM, $("#myAlerts")[0]);
	ko.applyBindings(my.myAlertsMasterVM, $("#optimizedRouteMapContainer")[0]);
	
		
	my.myPlannerMasterVM = {
		myPlannerVM : my.MyPlannerPostboxVM	
	};
	ko.applyBindings(my.myPlannerMasterVM, $("#box2")[0]);
	ko.applyBindings(my.myPlannerMasterVM, $("#addActivityDialog")[0]); 
	ko.applyBindings(my.myPlannerMasterVM, $("#editActivityDialog")[0]);
	ko.applyBindings(my.myPlannerMasterVM, $("#alertAddActivityDialog")[0]);		
	
	
	my.addActivityMasterVM = {	
		addToPlannerCustomersVM : my.addToPlannerCustomerVM,
		addToPlannerContactsVM : my.addToPlannerContactsVM,
		addActivityContactPhonesVM : my.addActivityContactPhonesVM,
		solutionSoldVM : my.addToPlannerSolutionSoldVM,
		addToPlannerSalesActivitySourceVM : my.addToPlannerSalesActivitySourceVM,
		selectedCustomerRowVM : my.selectedCustomerRowVM,
		allCustomerAddressesVM : my.allCustomerAddressesVM
	};
	//** APPLY BINDINGS FOUND IN dialogAddActivity.html, DOES NOT WORK HERE???
	//ko.applyBindings(my.addActivityMasterVM, $("#addToPlanner")[0]);


	my.editActivityMasterVM = {
		editPlannerActivityVM : my.editPlannerActivityVM,
		editActivityContactsVM : my.editActivityContactsVM,
		editActivityContactPhonesVM : my.editActivityContactPhonesVM,	
		editActivityCustomerVM : my.editActivityCustomerVM,
		editActivityCustomerAddressesVM : my.editActivityCustomerAddressesVM
	};
	//** APPLY BINDINGS FOUND IN dialogEditActivity.html, DOES NOT WORK HERE???
	//ko.applyBindings(my.editActivityMasterVM, $("#box3")[0]);
	//ko.applyBindings(my.editActivityMasterVM, $("#editPlanner")[0]);
