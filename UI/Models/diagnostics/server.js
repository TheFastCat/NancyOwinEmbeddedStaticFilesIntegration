

/////////////////////////////
//   Spinner               //
/////////////////////////////

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});


/////////////////////////////
//   Server Assemblies     //
/////////////////////////////

$(function() {

 var diagnostics_tabThree = function(data, event) {
		this.Name = ko.observable(data.Name);   
		this.Version = ko.observable(data.Version);
		this.AssemblyInfo = ko.observable(data.AssemblyInformationalVersion);
		this.AssemblyIsStronglyNamed = ko.observable(data.AssemblyIsStronglyNamed); 
		this.GitHash = ko.observable(data.AssemblyInformationalVersionIsGitCommitHash);	
		this.stronglyNamed = ko.computed(function() {
			if(this.AssemblyIsStronglyNamed() === true){
				return "true";
			}
			else {
				return null;
				}
		},this);
		
		this.GitHashInfo = ko.computed(function() {
			if(this.GitHash() === true){
				return this.AssemblyInfo();
			}
			else {
				return null;
				}
		},this);	
 }; 
 
	  serverAssembliesVM = (function(){

		/////JSON DATA/////
//		$.getJSON('http://SalesApp.us/api/diagnostics/server/assemblies', function (stuff) {
		$.getJSON(my.apiBase + 'diagnostics/server/assemblies', function (stuff) {
		var filteredData = stuff.filter(function(item){
			return item.Name && item.Version; 
		});
		
    
	var listserverdiagnostics = $.map(filteredData, function (item) { return new diagnostics_tabThree(item) });
        	self.listserverdiagnostics(listserverdiagnostics);
		});

	var self = this;
    	self.listserverdiagnostics = ko.observableArray([]);

    this.gridOptions = {
        	data: self.listserverdiagnostics,
        	displaySelectionCheckbox: false,     
                columnDefs: [  
        			{field: 'Name', 
        			displayName: 'Name', 
        			width: '33%'
	        		},                 
					{field: 'Version',
					displayName: 'Version',
					width: '15%'
					},
		    		{field: 'GitHashInfo', 
		    		displayName: 'GitCommitHash', 
		    		width: '38%',
		    		cellTemplate:'<a data-bind="attr: { \'href\': \'https://nussproalm.visualstudio.com/DefaultCollection/_git/Sales%20Application/commit/\' + $data.getProperty($parent) , \'class\': \'kgCellText colt\' + $index()}, html: $data.getProperty($parent)" target="_new"></a>'        
		    		},  
					{field: 'stronglyNamed', 
					displayName: 'StronglyNamed', 
					width: '10%' 
					}],   
			displaySelectionCheckbox: false,
        	disableTextSelection: false,
        	canSelectRows: false,
    
    };
    
}());

ko.applyBindings(serverAssembliesVM, $("#tabs-3")[0]);

});

