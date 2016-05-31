window.ComboWidget = ( function() {
    "use strict";

    function ComboWidget( widgetInfo ) {
	var self = this;
	this.widgetInfo = widgetInfo;
	this.id = widgetInfo.id;

	this.env = $("<div class='ei-paramwidget-combo'></div>");

	this.env.append("<div class='params-left-col'></div>"+
			"<div class='params-mid-col'>"+
			"<div class='desc'>"+widgetInfo.desc.short+"</div>"+
			"<div class='selector'><select class='ui-widget ui-state-default ui-corner-all'></select></div>"+
			"</div>");


	this.select = this.env.find("select");
	if ( widgetInfo.multiple ) {
	    this.select.attr("multiple","multiple");
	}
	if ( widgetInfo.callback ) {
	    this.select.change( function() {
		widgetInfo.callback( { value: self.select.val() } );
	    });
	}

	for(var i=0; i<widgetInfo.options.length; i++) {
	    var option = $(document.createElement("option"));
	    option.append(widgetInfo.options[i].desc.short);
	    option.attr("value",widgetInfo.options[i].value);

	    if ( widgetInfo.options[i].value == widgetInfo.default_value ) {
		option.attr("selected","selected");
	//	this.select.prepend( option );
}
//	    }else{
		this.select.append( option );
	 //   }
	    
	}
      this.select.change();
      
	if ( widgetInfo.desc.long ) { 
	    var x = $("<div class='params-right-col'><span class='ui-icon ui-icon-info'></span></div>");
	    this.env.append(x); 
	    x.tooltip({ items: x.find("span"), content: widgetInfo.desc.long });
	}



    };

    


    ComboWidget.prototype = {
	constructor: ComboWidget,
	
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
	    widgetValue = this.select.val();
	    return widgetValue;
	},
	restoreDefault:
	function() {
	    var self = this;
	    this.env.find("option").each(function (k,opt){
		var val = $(opt).attr("value");
		if(val == self.widgetInfo.default_value){
		    $(opt).attr("selected","selected");
		}else{
		    $(opt).removeAttr("selected");
		}
	    });
	  this.env.find("select").change();
	}
    }

    return ComboWidget;
})();
