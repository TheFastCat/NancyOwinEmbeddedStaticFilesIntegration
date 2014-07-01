/////// On click event from db_bucketsVM.js used to build an display a filtered bucket grid, but may want to replace with koGrid ////////

function createBucketsGrid () {	
	var grid;
	var columns = [
		{id: "!", 
			name: "!", 
			field: "PassFail",	
			width: 3,			
			formatter: function(row, cell, value, columnDef, dataContext) {
				if (value < 1) {
					return "<span class = 'slickGridRed'>!</span>";
				}
			}	
		},
	    {id: "Name", name: "Customer", field: "Name",	width: 300},
	    {id: "Number", name: "Customer #", field: "Number"},
	    {id: "Aging", name: "Aging", field: "Aging"},
	    {id: "Bucket", name: "Bucket", field: "Bucket"},
	    {id: "SalesID", name: "Sales ID", field: "SalesID"},	    
	    
	];
	
	var options = {
	    enableCellNavigation: true,
	    enableColumnReorder: true,
	    forceFitColumnns: true
	};

	$.getJSON($("link[rel='ObjCustomerStatusBuckets']").attr("href"), function (data) {
	//$.getJSON("../../Resources/data/ObjCustomerStatusBuckets.json", function(data) {
		var filteredAging = data.filter(function(d) {
			return d.SalesID == spartan.salesUserFilter && d.Bucket == spartan.cbStatusFilter;
		});

		grid = new Slick.Grid("#bucketsGrid", filteredAging, columns, options);
		
	});	
}