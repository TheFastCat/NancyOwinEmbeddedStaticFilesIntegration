

/////////////////////////////
//   Spinner               //
/////////////////////////////

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});


/////////////////////////////
//      LOGS              //
/////////////////////////////


$(function () {
	
// Tooltip functionality. Can turn tooltip off and fadeOut after 2 seconds //
//var du = 2000;
  	  
//  	  $( ".gridStyle" ).tooltip({
//    		position: {
//    		my:"left-150 top", at:"right top-70"
//    		},
    	//	hide: {
    	//	effect: "fadeOut",delay: 200
    	//	},
    	
    	/*Sets 2 second delay to Timeout*/	
    	//	open: function(event, ui){
    	//		setTimeout(function(){
    	//			$(ui.tooltip).hide('explode');
    	//		}, du);
    	//	}
//	   	});	
		
		
//	$('#startdate').datepicker().datepicker('setDate', 'today');    //State Date Field starts with current date//
	
	$("#startdate").datepicker({
		duration: "fast",
		defaultDate: null,
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function(selectedDate) {
			$("#enddate").datepicker( "option", "minDate", selectedDate);
		}
	});
	
	$( "#enddate" ).datepicker({
		defaultDate: null,
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function(selectedDate) {
			$("#startdate").datepicker( "option", "maxDate", selectedDate);
		}
	});

	
	var searchboxvalueStartDateFull = "";
	var searchboxvalueStartDate = ko.observable($("#startdate").val());
	$("#startdate").on("change",function(){
		searchboxvalueStartDate($("#startdate").val());	
		searchboxvalueStartDateFull = "&Start=" + $("#startdate").val();		
	});
	
	var searchboxvalueEndDateFull = "";
	var searchboxvalueEndDate = ko.observable($("#enddate").val());
	 $("#enddate").on("change",function(){
		searchboxvalueEndDate($("#enddate").val());
		searchboxvalueEndDateFull = "&Finish=" + $("#enddate").val();					
	});
	
	var searchboxvalueLevelFull = "";
	var searchboxvalueLevel = ko.observable($("#leveldropdown").val());
	 $("#leveldropdown").on("change",function(){
		searchboxvalueLevel($("#leveldropdown").val());		
		searchboxvalueLevelFull = "&Level=" + $("#leveldropdown").val();
	});
	
	/*
	var searchboxvalueAllLogs = ko.observable($("#resetbutton").val());
	$("#resetbutton").on("click",function(){
		searchboxvalueStartDate("");
		searchboxvalueEndDate("");
		searchboxvalueLevel("");
		searchboxvalueStartDateFull = "";
		searchboxvalueEndDateFull = "";	
		searchboxvalueLevelFull = "";
	});
	*/
	
	my.apiLogsModel = function(data, event) {
		this.Level = ko.observable(data.Level);
		this.DateTime = ko.observable(moment(data.DateTime).format('MM/DD/YYYY, h:mm a'));
	//	this.DateTime = ko.observable(data.DateTime);   
		this.Message = ko.observable(data.Message);
		this.Context = ko.observable(data.Context);	
		this.StackTrace = ko.observable(data.StackTrace);			
		this.Id = ko.observable(data.Id);
	};
	
	my.apiLogsVM = (function(){

		/////JSON DATA/////
	//	$.getJSON("../../../Resources/data/logJson.txt", function (stuff) {	 
		
		////API DATA//////
		$.getJSON(my.apiBase + "diagnostics/logs", function (stuff) {	
			var apiLogs = $.map(stuff, function (item) { return new my.apiLogsModel(item) });
    		self.apiLogs(apiLogs);
		});
		
		searchboxvalueStartDate.subscribe(function(newValue) {
			$.getJSON(my.apiBase + "diagnostics/logs?Start=" + newValue + searchboxvalueLevelFull + searchboxvalueEndDateFull, function (data) {
				var apiLogs = $.map(data, function (item) { return new my.apiLogsModel(item) });
	        	self.apiLogs(apiLogs);
			});
		});
		
		searchboxvalueEndDate.subscribe(function(newValue) {
			$.getJSON(my.apiBase + "diagnostics/logs?Finish=" + newValue + searchboxvalueLevelFull + searchboxvalueStartDateFull, function (data) {
				var apiLogs = $.map(data, function (item) { return new my.apiLogsModel(item) });
	        	self.apiLogs(apiLogs);
			});
		});
			
		searchboxvalueLevel.subscribe(function(newValue) {
			$.getJSON(my.apiBase + "diagnostics/logs?Level=" + newValue + searchboxvalueStartDateFull + searchboxvalueEndDateFull, function (data) {
				var apiLogs = $.map(data, function (item) { return new my.apiLogsModel(item) });
	        	self.apiLogs(apiLogs);
			});
		});
		
		/*
		//Reset Button//
		searchboxvalueAllLogs.subscribe(function() {
			$.getJSON("http://wdennss0226/dev/api/diagnostics/logs", function (data) {
				var apiLogs = $.map(data, function (item) { return new my.apiLogsModel(item) });
	        	self.apiLogs(apiLogs);
			});
		});
		*/
			
	var self = this;
	self.apiLogs = ko.observableArray([]);
	    
	     	
    this.gridOptions = {
        	data: self.apiLogs,
        	displaySelectionCheckbox: false,     
                columnDefs: [  
        			{field: 'Id', 
        			displayName: 'Id', 
        			width: '05%',
        		//	cellTemplate:'<a data-bind="attr: { \'href\': \'https://nussproalm.visualstudio.com/DefaultCollection/_git/Sales%20Application/commit/\' , \'class\': \'kgCellText colt\' + $index()}, html: $data.getProperty($parent)" target="_new"></a>' 
	        		}, 
	        		{field: 'DateTime', 
        			displayName: 'Date', 
        		//	cellFilter: function(data) { return moment(data).format('MMMM Do YYYY, h:mm:ss a')},//  
        			width: '16%'
	        		},                                                  
					{field: 'Level',
					displayName: 'Level',
					width: '08%',
					},
		    		{field: 'Message', 
		    		displayName: 'Message', 
		    		width: '28%',        
		    		}, 
		    		{field: 'Context', 
		    		displayName: 'Context', 
		    		width: '22%',        
		    		},  
		    		{field: 'StackTrace', 
		    		displayName: 'StackTrace', 
		    		width: '22%',        
		    		}   
					],   
			displaySelectionCheckbox: false,
        	disableTextSelection: false,
        	canSelectRows: true, 
    };
    
}());

ko.applyBindings(my.apiLogsVM, $("#tabs-1")[0]);

});
