//View Model for Customers Tab, Shipment Grid//

/////////////////////////////
//South Panel Customer Grid//
/////////////////////////////	
	my.customersTabShipmentModel = function (data, event) {
			this.ShpUser = ko.observable(data.ShpUser);
			this.ConUser = ko.observable(data.ConUser);
			this.ThdUser = ko.observable(data.ThdUser);
			this.ShpCompany = ko.observable(data.ShpCompany);
			this.ConCompany = ko.observable(data.ConCompany);
			this.ThdCompany = ko.observable(data.ThdCompany);
			this.ShpCustNum = ko.observable(data.ShpCustNum);
			this.ConCustNum = ko.observable(data.ConCustNum);
			this.ThdCustNum = ko.observable(data.ThdCustNum);
			this.TrackingNumber = ko.observable(data.TrackingNumber);
			this.ShipmentDate = ko.observable(moment(data.ShipmentDate).format('MM/DD/YYYY'));			
		};
	
	my.customersTabShipmentVM = function() {	
		$.getJSON(my.apiBase + 'shipments/?Phase=NewCustomerId=549', function (data) {		
			data.sort(function(a,b){return a.Name == b.Name ? 1 : (a.Name > b.Name ? 1 : -1);});
			var customersTabShipment = $.map(data, function (item) { return new my.customersTabShipmentModel(item) });
	        self.customersTabShipment(customersTabShipment);
		});
		
		var self = this;
	    self.customersTabShipment = ko.observableArray([]);
	    self.selectedShipmentsGridRow = ko.observableArray([]);
	    
	    this.shipmentGridOptions = {
	            data: self.customersTabShipment,  
	            multiSelect: true,
	            keepLastSelected: true,
	            selectedItems: self.selectedShipmentsGridRow,
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
	    						field: 'TrackingNumber',
	    						displayName: 'Tracking Number',
	    						
	    					 },
	                         {
	                        	field: 'ShpCustNum', 
	                        	displayName: 'ShpCustNum',   	
	            			 },
	            			 {
	                        	field: 'ShpCompany', 
	                        	displayName: 'ShpCompany',   	
	            			 },
	            			 {
	                        	field: 'ConCustNum', 
	                        	displayName: 'ConCustNum',   	
	            			 },
	            			 {
	                        	field: 'ConCompany', 
	                        	displayName: 'ConCompany',   	
	            			 },
	            			 {
	            				field: 'ShipmentDate',
	            				displayName: 'ShipmentDate'
	            			 }
	            			 ]
	     };
	}();