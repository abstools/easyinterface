window.TextAreaWidget = ( function() {
    "use strict";

    function TextAreaWidget( widgetInfo ) {
	var self = this;
	this.widgetInfo = widgetInfo;
	this.id = widgetInfo.id;

	this.env = $("<div class='ei-paramwidget-text'></div>");

	this.env.append("<div class='params-left-col'></div>"+
			"<div class='params-mid-col'>"+
			"<div class='desc'>"+widgetInfo.desc.short+"</div>"+
			"<div class='selector'></div>"+
			"</div>");

	if(widgetInfo.multiple){
	    self.env.find("div.selector").append("<textarea rows='5' class='textfield' >"+widgetInfo.default_value+"</textarea>");
	    self.textfield = self.env.find("textarea");
	}else{
	    self.env.find("div.selector").append("<input type='text' class='textfield' value='"+widgetInfo.default_value+"'/>");
	    self.textfield = self.env.find("input");
	}

	if ( widgetInfo.desc.long ) { 
	    var x = $("<div class='params-right-col'><span class='ui-icon ui-icon-info'></span></div>");
	    this.env.append(x); 
	    x.tooltip({ items: x.find("span"), content: widgetInfo.desc.long });
	}

    };

    


    TextAreaWidget.prototype = {
	constructor: TextAreaWidget,
	
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
	    
	    widgetValue[0] = ''+this.textfield.val()+'';
	    return widgetValue;
	},
	restoreDefault:
	function() {
	    var self = this;
	    this.textfield.val(self.widgetInfo.default_value);
	},
	setValue:
	function(newvalue){
	  var self = this;
	  self.textfield.val(newvalue);
	}
    }

    return TextAreaWidget;
})();
