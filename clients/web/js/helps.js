window.Helps = (function() {
    "use strict";
    
    // static variables should go here 
    var helpsId = 0;

    function Helps(place,options) {
	helpsId++;
	
	this.helpId = "OPTS-"+helpsId;
	this.helpsHolder = place;
	this.accord = null;
	this.sectionInfoById = new Array();
	this.secId = 0;
	this.setOptions(options);
	this.initHelps();
    };
    
    Helps.prototype = {
	constructor: Helps,
	
	//
	sectionId_to_sectionTag:
	function( id ) {
	    return "help-"+id;
	},
	
	//
	setOptions: 
	function(options) {
	},

	//
	initHelps: 
	function() {
	    var self = this;

	    $(this.helpsHolder).append("<div><p>Below you find the helps of the different tools</p><div style='height: 200px;' id='"+this.helpId+"'></div></div>");
	    this.accord = $(this.helpsHolder).find( "#"+this.helpId ).accordion({
	        collapsible: true,
	        heightStyle: "content",
	        active: 0,
		icons: { header: "ui-icon-circle-arrow-e", activeHeader: "ui-icon-circle-arrow-s" }
	    });

	},

	//
	addSection: 
	function(label, sectionId, XML) {
	    var self = this;
            var tagId = this.sectionId_to_sectionTag( sectionId );
	    this.accord.append("<h3 id='label-"+tagId+"'>"+
			       label+"</h3><div id='"+tagId+"'></div>");
	    this.accord.accordion( "refresh" );


	    var sectionInfo = { id: sectionId, 
				 tag: tagId, 
				 secId: this.secId, 
				 content: "No Help" 
			       };

	    this.sectionInfoById[sectionId] = sectionInfo;
	    this.secId++;
	    if ( XML && XML.length > 0 ) this.addHelpFromXML(sectionId,XML);
	    

	},

	//
	addHelpFromXML:
	function(sectionId,help) {
	  var sectionInfo = this.sectionInfoById[sectionId];
	  var outclass =  help.attr( _ei.outlang.syntax.outclass ) || "info";
	  var contentXML = help.find("> "+_ei.outlang.syntax.content);
	  
	  if (contentXML.length ==0){
	    help.append($("<content format='text'>No Help</content>"));
	    contentXML =  help.find("> "+_ei.outlang.syntax.content);
	  }

	    var content = new DocContent({ 
	      content: contentXML,
	      outclass: outclass
	    }).getDOM();
	  var wrap = $("<div></div>");
	    wrap.append( $(content) );
	    this.accord.find("#"+sectionInfo.tag).append(wrap);

	},


	setActiveHelpSet:
	function(sectionId) {
	    if ( sectionId != undefined ) {
		this.accord.accordion({active: this.sectionInfoById[sectionId].secId });
	    } else {
		this.accord.accordion({active: false});
	    }
	    this.accord.accordion( "refresh" );
	}
    };

    return Helps;

})();

