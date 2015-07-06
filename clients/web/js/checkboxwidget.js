window.CheckBoxWidget = ( function() {
    "use strict";

    // widgetInfo is a json object with the following attributes
    //
    //  id: 
    //     just an identifier/name for this widget 
    //
    //  options: 
    //     an array of options to be listed as checkboxes, each option
    //     has the following information:
    //
    function CheckBoxWidget( widgetInfo ) {
	var self = this;
	this.widgetInfo = widgetInfo;
	this.id = widgetInfo.id;
	this.isBoolean = widgetInfo.isBoolean;
	this.env = $("<div class='ei-paramwidget-checkbox'></div>");
	this.options = new Array();
	this.env.append("<div class='params-left-col'></div>");

	var x = $("<div class='params-mid-col'></div>");

	for(var i=0; i<widgetInfo.options.length; i++) {

	    var input = $("<div><div class='desc'>"+widgetInfo.options[i].desc.short+"</div>"+
			  "<div class='selector'>"+
		          "<input class='ui-widget ui-state-default ui-corner-all' type='checkbox' value='"+
			  widgetInfo.options[i].value+"'"+
			  ( widgetInfo.options[i].selected ? " checked='checked'" : "")+
			  "/>"+
			  "</div></div>"
	                 );

	    // this.env.append("<span style='width: 200px; display: inline'>");
	    this.options[i] = input.find("input");
	    x.append(input);

	    if ( widgetInfo.callback ) {
		this.options[i].change( function() {
		    widgetInfo.callback( $(this).prop("value"), $(this).prop("checked") );
		});
	    }
	}

	this.env.append(x);
	this.env.append("<div class='params-right-col'></div>");

    };


    CheckBoxWidget.prototype = {
	constructor: CheckBoxWidget,
	
	//
	domRoot:
	function() {
	    return this.env;
	},


	//
	getId:
	function() {
	    return id;
	},


	//
	getValue:
	function() {
	    var widgetValue = new Array();
	    var j=0;
	    for(var i=0; i<this.options.length; i++) {
		if ( this.options[i].prop("checked") ) {
		    widgetValue[j] = this.options[i].prop("value");
		    j++;
		}
	    }

	    if ( this.isBoolean && widgetValue.length == 0 )
		widgetValue[0] = "no";

	    return widgetValue;
	},
	restoreDefault:
	function() {
	    var self = this;
	    var i = 0;
	    this.env.find("input").each(function (k,v){
		self.widgetInfo.options[k].selected ?
		    $(v).attr("checked","checked") : 
		    $(v).removeAttr("checked");		
	    });
	}
    }

    return CheckBoxWidget;
})();
