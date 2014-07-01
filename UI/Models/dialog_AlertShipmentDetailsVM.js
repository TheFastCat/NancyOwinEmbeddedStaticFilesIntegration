
$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop: function() { $body.removeClass("loading"); }  
});

//Create Shipment Detail Dialog
$(function() {
	$('#alertShipmentDetailDialog').dialog({
		autoOpen: false,
		height: 425,
		width: "98%", 
		modal: true,
		close: function() {
			$(this).dialog("close");			
			my.selectedCustomerObservable(0);
		}
	});
});


//TODO NOT USING A MASTER VM BECAUSE WANT TO USE LAZY LOAD, HOW CAN THESE WORK TOGETHER?

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New Customer Shipment- this is used to populate tracking all tracking numbers for selected api/customer alert //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	my.alertShipmentTrackingNumberModel = function (data, event) {
		this.TrackingNumber = ko.observable(data.TrackingNumber);
	};

	my.alertShipmentTrackingNumberVM = function() {
			
			my.selectedCustomerObservable.subscribe(function(newValue) {
				if (my.selectedCustomerObservable() != 0) {					
					$.getJSON(my.apiBase + "customers/" + my.selectedCustomer + "/shipments", function (data) {	
			        	var alertShipmentTrackingNumber = $.map(data, function (item) { return new my.alertShipmentTrackingNumberModel(item) });
			        	self.alertShipmentTrackingNumber(alertShipmentTrackingNumber);      
					});
				};
			});
			
		var self = this;
		self.alertShipmentTrackingNumber = ko.observableArray([]);	
				
	};
		

////////////////////////////////////////////////////////////////////////////////
//New Customer Shipment- this is used to build the detail shipment dialog view//
////////////////////////////////////////////////////////////////////////////////	
	my.alertShipmentDetailModel = function (data, event) {
		this.ShpUser = ko.observable(data.ShpUser);
		this.ConUser = ko.observable(data.ConUser);
		this.ThdUser = ko.observable(data.ThdUser);
		this.ShpCustNum = ko.observable(data.ShpCustNum);
		this.ShpCompany = ko.observable(data.ShpCompany);
		this.ShpStreet1 = ko.observable(data.ShpStreet1);
		this.ShpCity = ko.observable(data.ShpCity);
		this.ShpState = ko.observable(data.ShpState);
		this.ShpZipcode = ko.observable(data.ShpZipcode);
		this.ShpContact = ko.observable(data.ShpContact);
		this.ConCustNum = ko.observable(data.ConCustNum);
		this.ConCompany = ko.observable(data.ConCompany);
		this.ConStreet1 = ko.observable(data.ConStreet1);
		this.ConCity = ko.observable(data.ConCity);
		this.ConState = ko.observable(data.ConState);
		this.ConZipcode = ko.observable(data.ConZipcode);
		this.ConContact = ko.observable(data.ConContact);
		this.ThdCustNum = ko.observable(data.ThdCustNum);
		this.ThdCompany = ko.observable(data.ThdCompany);
		this.ThdStreet1 = ko.observable(data.ThdStreet1);
		this.ThdCity = ko.observable(data.ThdCity);
		this.ThdState = ko.observable(data.ThdState);
		this.ThdZipcode = ko.observable(data.ThdZipcode);
		this.ThdContact = ko.observable(data.ThdContact);
		this.TrackingNumber = ko.observable(data.TrackingNumber);
		this.ShipmentDate = ko.observable(moment(data.ShipmentDate).format('MM/DD/YYYY HH:MM'));
		this.Service = ko.observable(data.Service);
		this.FreightTerms = ko.observable(data.FreightTerms);
		this.SalesActivitySource = ko.observable("New Customer");
	};
	
	my.alertShipmentDetailVM = function() {
		
			if (my.selectedCustomerObservable() == 0) {				
				$.getJSON(my.apiBase + "shipments?TrackingNumber=" + my.selectedAlertTrackingNumber, function (data) {	
	        		var alertShipmentDetail = $.map(data, function (item) { return new my.alertShipmentDetailModel(item) });
	        		self.alertShipmentDetail(alertShipmentDetail);      
				});	
			} if (my.selectedCustomerObservable() != 0) {
				my.selectedAlertTrackingNumberObservable.subscribe(function(newValue) {
					$.getJSON(my.apiBase + "customers/" + my.selectedCustomer + "/shipments?TrackingNumber=" + newValue, function (data) {	
						var alertShipmentDetail = $.map(data, function (item) { return new my.alertShipmentDetailModel(item) });
						self.alertShipmentDetail(alertShipmentDetail); 
					});
				});
			}
		
		
		var self = this;
		self.alertShipmentDetail = ko.observableArray([]);		
	
		//////////////////////////////////////////////////////
		//Create dialog to add planner activity from details//
		//////////////////////////////////////////////////////	
		self.addActivityFromShipmentDetail = function(elem){ 	
			my.selectedShipmentDetail(this);	
			//my.selectedCustomerObservable(my.selectedAlert().CustomerId());
			
			if(my.selectedCustomerObservable() == 0) {
				if(my.selectedShipmentDetail().ShpUser() == my.salesUserFilter) {
					my.selectedCustomerObservable(my.selectedShipmentDetail().ShpCustNum());
					my.selectedCustomerNameObservable(my.selectedShipmentDetail().ShpCompany());
					
				} 
				if(my.selectedShipmentDetail().ConUser() == my.salesUserFilter) {
					my.selectedCustomerObservable(my.selectedShipmentDetail().ConCustNum());
					my.selectedCustomerNameObservable(my.selectedShipmentDetail().ConCompany());
					
				} 
				if(my.selectedShipmentDetail().ThdUser() == my.salesUserFilter) {
					my.selectedCustomerObservable(my.selectedShipmentDetail().ThdCustNum());
					my.selectedCustomerNameObservable(my.selectedShipmentDetail().ThdCompany());
				}
				my.selectedCustomer = ko.utils.unwrapObservable(my.selectedCustomerObservable());
				my.selectedCustomerName = ko.utils.unwrapObservable(my.selectedCustomerNameObservable());
			}
						
			
			$(function() {				
				$("#alertAddActivityDialog").dialog("open");
				$("#alertAddActivityDialog").load("../../Resources/Views/dialogAddActivityFromAlert.html");				
			});
		};
	
	};

///////////////////
//Event Handlers //
///////////////////	
	
	
