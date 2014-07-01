define(['knockout'], function(ko) {
	
    return function appViewModel() {
    	
        this.firstName = ko.observable('Bert');
        this.firstNameCaps = ko.computed(function() {
            return this.firstName().toUpperCase();
        }, this);
    };
    
    
});



