

/////////////////////////////
//   Spinner               //
/////////////////////////////

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});


/////////////////////////////
//   API                   //
/////////////////////////////	

$(function() {

 var diagnostics_tabTwo = function(data, event) {
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
 
	diagnosticsVM = (function(){

		/////API DATA/////
		$.getJSON(my.apiBase + 'diagnostics/assemblies', function (stuff) {
		var filteredData = stuff.filter(function(item){
			return item.Name && item.Version; 
		});
		
    
	var listdiagnostics = $.map(filteredData, function (item) { return new diagnostics_tabTwo(item) });
        	self.listdiagnostics(listdiagnostics);
		});

	var self = this;
    	self.listdiagnostics = ko.observableArray([]);

    this.gridOptions = {
        	data: self.listdiagnostics,
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

ko.applyBindings(diagnosticsVM, $("#tabs-2")[0]);

 });

