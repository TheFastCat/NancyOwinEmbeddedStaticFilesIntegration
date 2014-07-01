//Master View Model for Customers Tab//	
	my.customerTabMasterVM = {
		allCustomersGridVM : my.allCustomersGridVM,
		customersTabShipmentVM : my.customersTabShipmentVM
	};
	ko.applyBindings(my.customerTabMasterVM, $("#customersTab")[0]);