//Customers Tab View Model for Filters//

////////////////
//North Pannel//
////////////////
	//$('#customersNorthPanel').hide();

	$('#northShowHideButton').on('click', function() {
		$('#customersNorthPanel').toggle('blind', 500);	
	});

	$('#customersTabNorthPanelResetButton').on('click', function() {
  		$(this).siblings().val('');
  		self.selectedCustomerGridRow.removeAll();	
  		$.getJSON(my.apiBase + 'customers/?BucketTypes=A&BucketTypes=B&BucketTypes=C&BucketTypes=D&SalesPerson=' + my.salesUserFilter, function (data) {		
			var filteredData = data.filter(function(item) {
				return item.user_id == my.salesUserFilter;
			});
			data.sort(function(a,b){return a.CustomerName == b.CustomerName ? 1 : (a.CustomerName > b.CustomerName ? 1 : -1);});
			var allCustomersGrid = $.map(data, function (item) { return new allCustomersGridModel(item) });
	        self.allCustomersGrid(allCustomersGrid);
  		});  		 
  	});

