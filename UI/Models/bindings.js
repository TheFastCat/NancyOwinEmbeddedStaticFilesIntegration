///////////////////////////////////////////////////////////////////////////////////
///////// Knockout Binding Handlers that can be reused on any data binding /////////
///////////////////////////////////////////////////////////////////////////////////

////////////////////////////////
// jQuery Button with disable //
////////////////////////////////
ko.bindingHandlers.jqButton = {
    init: function(element) {
       $(element).button(); 
    },
    update: function(element, valueAccessor) {
        var currentValue = valueAccessor();
        $(element).button("option", "disabled", currentValue.enable === false);
    }
	
};

////////////
// FadeIn //
////////////
ko.bindingHandlers.selectFilter = {
	init: function(element, valueAccessor, allBindingsAccessor) {
		//handle the field changing
	    ko.utils.registerEventHandler(element, "change", function () {
	        var observable = valueAccessor();
	        observable($(element).selectFilter("selectedValue"));
	    });
	}
};

///////////////////
// Select Filter //
///////////////////
ko.bindingHandlers.selectFilter = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			//init logic
		},
		update: function(element, valueAccessor, allbindingsAccessor, viewModel){
			$(element).hide();
			ko.bindingHandlers.text.update(element, valueAccessor);
			$(element).fadeIn();
		}
}

/////////////////
// Star Rating //
/////////////////
ko.bindingHandlers.starRating = {
    init: function(element, valueAccessor) {
        $(element).addClass("starRating");
        for (var i = 0; i < 5; i++)
           $("<span>").appendTo(element);$("span", element).each(function(index) {
        $(this).hover(
            function() { $(this).prevAll().add(this).addClass("hoverChosen") }, 
            function() { $(this).prevAll().add(this).removeClass("hoverChosen") }                
        ).click(function() { 
       var observable = valueAccessor();  // Get the associated observable
       observable(index+1);               // Write the new rating to it
     }); 
    });
    },
     update: function(element, valueAccessor) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor();
        $("span", element).each(function(index) {
            $(this).toggleClass("chosen", index < observable());
        });
    }
};

//////////
// Fade //
//////////
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Start visible/invisible according to initial value
        var shouldDisplay = valueAccessor();
        $(element).toggle(shouldDisplay);
    },
    update: function(element, valueAccessor) {
        // On update, fade in/out
        var shouldDisplay = valueAccessor();
        shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
    } 
};

/////////////////////////
// Slide Up Slide Down //
/////////////////////////
ko.bindingHandlers.slideVisible = {
    update: function(element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();
 
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);
 
        // Grab some more data from another binding property
        var duration = allBindings.get('slideDuration') || 400; // 400ms is default duration unless otherwise specified
 
        // Now manipulate the DOM element
        if (valueUnwrapped == true)
            $(element).slideDown(duration); // Make the element visible
        else
            $(element).slideUp(duration);   // Make the element invisible
    }
};


////////////////
//jqDatepicker//
////////////////
ko.bindingHandlers.jqDatepicker = {
    init: function(element) {
    	$(element).datepicker(); // Turns the element into a jQuery datepicker
    }
};

////////////////
//jqTimepicker//
////////////////
ko.bindingHandlers.jqTimepicker = {
  init: function(element) {
  	$(element).timepicker({ 'timeFormat': 'H:i:s' }); // Turns the element into a jQuery timepicker
  },
  update: function(element) {
  	$(element).timepicker({ 'scrollDefaultNow': true,  'timeFormat': 'H:i:s' }); // Turns the element into a jQuery timepicker
  }
};

////////////
//jqButton//
////////////
ko.bindingHandlers.jqButton = {
    init: function(element) {
       $(element).button(); // Turns the element into a jQuery UI button
    }
};


///////////////////////
//jqAutoPopulateList //
///////////////////////
ko.bindingHandlers.jqAuto = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	    var options = valueAccessor() || {},
	        allBindings = allBindingsAccessor(),
	        unwrap = ko.utils.unwrapObservable,
	        modelValue = allBindings.jqAutoValue,
	        source = allBindings.jqAutoSource,
	        valueProp = allBindings.jqAutoSourceValue,
	        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
	        labelProp = allBindings.jqAutoSourceLabel || valueProp;
	
	    //function that is shared by both select and change event handlers
	    function writeValueToModel(valueToWrite) {
	        if (ko.isWriteableObservable(modelValue)) {
	           modelValue(valueToWrite );  
	        } else {  //write to non-observable
	           if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
	                    allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite );    
	        }
	    }
	    
	    //on a selection write the proper value to the model
	    options.select = function(event, ui) {
	        writeValueToModel(ui.item ? ui.item.actualValue : null);
	    };
	        
	    //on a change, make sure that it is a valid value or clear out the model value
	    options.change = function(event, ui) {
	        var currentValue = $(element).val();
	        var matchingItem =  ko.utils.arrayFirst(unwrap(source), function(item) {  
	           return unwrap(inputValueProp ? item[inputValueProp] : item) === currentValue; 
	        });
	        
	        if (!matchingItem) {
	        	$(function() {
	        	    $( "#dialog-confirm" ).dialog({
	        	      resizable: false,	        	      
	        	      modal: true,	        	      
	        	      buttons: {
	        	        "Add": function() {
	        	        	$.ajax({
	        	        		url: 'http://wdennusstra0769/dev/api/' + 'customers',
	        	        		type: 'POST',
	        	        		data: {CustomerName: currentValue},
	        	        		dataType: 'json',
	        	        		success: function(data){
	        	        			alert(data);
	        	        		}
	        	        	});
	        	        	$( this ).dialog( "close" );
	        	        },
	        	        Cancel: function() {
	        	          $( this ).dialog( "close" );
	        	        }
	        	      }
	        	    });
	        	});
	        	$( "#dialog-confirm" ).text("Do you want to add" + currentValue + "?");	
	        	
	        	//writeValueToModel(null);
	        }    
	    }
	    
	    
	    //handle the choices being updated in a DO, to decouple value updates from source (options) updates
	    var mappedSource = ko.dependentObservable(function() {
	            mapped = ko.utils.arrayMap(unwrap(source), function(item) {
	                var result = {};
	                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
	                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
	                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
	                return result;
	        });
	        return mapped;                
	    }, null, { disposeWhenNodeIsRemoved: element });
	    
	    //whenever the items that make up the source are updated, make sure that autocomplete knows it
	    mappedSource.subscribe(function(newValue) {
	       $(element).autocomplete("option", "source", newValue); 
	    });
	    
	    options.source = mappedSource();
	    
	    //initialize autocomplete
	    $(element).autocomplete(options);
	},
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	   //update value based on a model change		
	   var allBindings = allBindingsAccessor(),
	       unwrap = ko.utils.unwrapObservable,
	       modelValue = unwrap(allBindings.jqAutoValue) || '', 
	       valueProp = allBindings.jqAutoSourceValue,
	       inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;
	    
	   //if we are writing a different property to the input than we are writing to the model, then locate the object
	   if (valueProp && inputValueProp !== valueProp) {
	       var source = unwrap(allBindings.jqAutoSource) || [];
	       var modelValue = ko.utils.arrayFirst(source, function(item) {
	             return unwrap(item[valueProp]) === modelValue;	             
	       }) || {};  //probably don't need the || {}, but just protect against a bad value          
	   } 
	       
	   //update the element with the value that should be shown in the input
	       $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());    
	 }
	 
};


		