window.Parameters = (function() {
    "use strict";
    
    // static variables should go here 
    var parametersId = 0;

    function Parameters(place,options) {

	parametersId++;
	
	this.paramsId = "OPTS-"+parametersId;
	this.paramsHolder = place;
        this.accord = null;
	this.sectionInfoById = new Array();
	this.secId = 0;
	this.setOptions(options);
	this.initParameters();
    };
    
    Parameters.prototype = {
	constructor: Parameters,
	
	//
	sectionId_to_sectionTag:
	function( id ) {
	    return "section-"+id;
	},
	
	//
	setOptions: 
	function() {
	},

	//
	initParameters: 
	function() {
	    var self = this;

	    $(this.paramsHolder).append("<div><p>Below you find the parameters of the different tools</p><div style='height: 200px;' id='"+this.paramsId+"'></div></div>");
	    this.accord = $(this.paramsHolder).find( "#"+this.paramsId ).accordion({
	        collapsible: true,
	        heightStyle: "content",
	        active: 0,
		icons: { header: "ui-icon-circle-arrow-e", activeHeader: "ui-icon-circle-arrow-s" }
	    });
	},

	//
	addSection: 
	function(label, sectionId, params, profiles) {
	    var self = this;
            var tagId = this.sectionId_to_sectionTag( sectionId );
	    this.accord.append("<h3 id='label-"+tagId+"'>"+
			       label+"</h3><div id='"+tagId+"'></div>");
	    this.accord.accordion( "refresh" );

	    this.accord.find("#"+tagId).append("<b>Profile: </b><select class='profile-combobox ui-widget ui-widget-content ui-state-default ui-corner-all' id='profile-"+tagId+"'></select> <button id='btn-profile-"+tagId+"'>b2</button>");

	  $("#btn-profile-"+tagId).button({
		label: "Load Profile"
	    });
	    $("#btn-profile-"+tagId).click(function(){
	      self.setProfileValues(sectionId,$("#profile-"+tagId).find("option:selected").val());
	    });
	    var sectionInfo = { id: sectionId, 
				tag: tagId, 
				secId: this.secId, 
				profileChange: false,
				params: {},
				profiles: {}
	                      };

	    this.sectionInfoById[sectionId] = sectionInfo;
	    this.secId++;

	    if ( params ) this.addParamsFromXML(sectionId,params);	    
	    if ( profiles ) this.addProfilesFromXML(sectionId,profiles);	    


	},

	//
	addProfilesFromXML:
	function(sectionId,profiles) {
	  var self = this;
	  var sectionInfo = self.sectionInfoById[sectionId];
	  var selector = $("#profile-"+sectionInfo.tag);
	  selector.append("<option value='default'>Default</option>");


	  $(profiles).find("> profile").each(
	    function() {
	      var profileValues = self.profileValuesFromXML(this);
	      var profileName = $(this).attr("name");
	      selector.append("<option value='"+profileName+"' >"+profileName+"</option>");
	      sectionInfo.profiles[profileName] = profileValues;
	    });
	  $(selector).change(function(){
	    var optionSelected = $(this).find("option:selected");
	    var valueSelected  = optionSelected.val();	
	    if(sectionInfo.profileChange)
	      return;
	    sectionInfo.profileChange = true;
	    
	    self.setProfileValues(sectionId,valueSelected);
	    
	    sectionInfo.profileChange = false;
	  });

	  sectionInfo.profileSelector = selector;
	},

	//
	addParamsFromXML:
	function(sectionId,params) {
	    var self = this;
	    $(params).find("> ").each(
		function() {
		    self.addParamFromXML( sectionId, this );
		});
	},

	//
	addParamFromXML:
	function(sectionId,param) {
	   //widgets are: 
	    //checkbox, checkboxMultiple, combo, comboMultiple,
	    //textfield, textarea, radio
	    var defaultWidget = {
		"selectone":"combo",
		"flag":"checkbox",
		"selectmany":"comboMultiple",
		"textfield":"textfield"
	    };
	    var widget;
	    var type = param.tagName;
	    param = $(param);
	    if(param.attr("widget"))
		widget = param.attr("widget");
	    else{
		widget = defaultWidget[type];
	    }

	    var name = param.attr("name");
	    var desc = {
		short: param.find("> desc").find("short").text(),
		long: param.find("> desc").find("long").text()
	    };

	    var defaultValue = this.defaultValueFromXML(type,param);
	    switch ( widget ) {
	    case "checkbox":
		var trueval = "true";
		var falseval = "false";
		var boolean = true;
		if(param.attr("explicit")=="true"){
		  boolean = false;
		  trueval= (param.attr("trueval"))?param.attr("trueval"):"true";
		  falseval= (param.attr("falseval"))?param.attr("falseval"):"false";
		}
		var options = new Array(trueval,falseval);
		this.addCheckWidget(sectionId,
				     {
					 id: name, 
					 desc: desc,
					 options: options,
					 multiple: false,
					 boolean: boolean,
					 default_value: defaultValue
				     });
		break;
	    //
	    case "checkboxMultiple":
		var trueval = "true";
		var falseval = "false";
		var boolean = true;
		if(param.attr("explicit")=="true"){
		  boolean = false;
		  trueval= (param.attr("trueval"))?param.attr("trueval"):"true";
		  falseval= (param.attr("falseval"))?param.attr("falseval"):"false";
		}
		var options = new Array(trueval,falseval);
	
		this.addCheckWidget(sectionId,
				     {
					 id: name, 
					 desc: desc,
					 options: options,
					 multiple: true,
					 boolean: boolean,
					 default_value: defaultValue
				     });
		break;
	    //
	    case "combo":
		var options = new Array();
		param.find("option").each( 
		    function ( index ) {
		      var tmp_value = $(this).attr("value");
		      var desc_short = $(this).find("desc > short").text();
		      var desc_long = $(this).find("desc > long").text();
		      if (!desc_short || desc_short =='')
			desc_short = tmp_value;
		      if (!desc_long || desc_long =='')
			desc_long = tmp_value;
			options[index] = { value: tmp_value,
					   desc: { 
					       short: desc_short,
					       long: desc_long
					   }
					 }
		    });
		var multiple = false;
		if(type=="selectmany"){
		    multiple = true;
		}
		this.addComboWidget(sectionId,
				       {
					   id: name, 
					   desc: desc,
					   multiple: false,
					   options: options,
					   default_value: defaultValue
				       });
		break;
		//
	    case "comboMultiple":
		var options = new Array();
		param.find("option").each( 
		    function ( index ) {
		      var tmp_value = $(this).attr("value");
		      var desc_short = $(this).find("desc > short").text();
		      var desc_long = $(this).find("desc > long").text();
		      if (!desc_short || desc_short =='')
			desc_short = tmp_value;
		      if (!desc_long || desc_long =='')
			desc_long = tmp_value;
			options[index] = { value: tmp_value,
					   desc: { 
					       short: desc_short,
					       long: desc_long
					   }
					 }
		    });

		this.addComboWidget(sectionId,
				       {
					   id: name, 
					   desc: desc,
					   multiple: true,
					   options: options,
					   default_value: defaultValue
				       });
		break;
		//
	    case "textfield":
		this.addTextfieldWidget(sectionId,
					{
					    multiple: (param.attr("multiline") =="true")?true:false,
					    id:name,
					    desc: desc,
					    default_value: defaultValue
					});
		break;
		//
	    case "textarea":
		this.addTextfieldWidget(sectionId,
				       {
					   multiple: true,
					   id: name, 
					   desc: desc,
					   default_value: defaultValue
				       });
		break;

	    }

	},


	//
	defaultValueFromXML:
        function(type,param){
	  var defaultValue = new Array();
	  if(type == "textfield")
	    defaultValue[0] = param.find("> initialtext").text();
	  else{
	    var i = 0;
	    param.find("> default").each(function(){
	      if($(this).attr("value"))
		defaultValue[i] = $(this).attr("value");
	      else
		defaultValue[i] = $(this).text();
	      i++;
	    });

	  }
	  return defaultValue;
	},

	//
	profileValuesFromXML:
	function(profile){
	  var profileValue = {};
	  $(profile).find("> setparamvalue").each(function(){
	    var name = $(this).attr("name");
	    var i = 0;

	    if(profileValue[name])
	      i = profileValue[name].length;
	    else
	      profileValue[name] = new Array();

	    if($(this).attr("value"))
	      profileValue[name][i] = $(this).attr("value");
	    else
	      profileValue[name][i] = $(this).text();

	  });
	  return profileValue;
	},

	// paramInfo: id, options,multiple,default_value, desc
	//
	addCheckWidget:
	function(sectionId, paramInfo) {
	    var sectionInfo = this.sectionInfoById[sectionId];
	    var callBackWrapper = undefined;
	    if ( paramInfo.callback ) 
		callBackWrapper = function(name,value) { 
		    paramInfo.callback( {value: value? paramInfo.options[0]:paramInfo.options[1]} ); }

	    var widget = new CheckBoxWidget( 
		{ id: paramInfo.id,
		  options: [
	              { 
			  value: paramInfo.options, 
			  selected: (paramInfo.default_value[0] == paramInfo.options[0]), 
			  desc: paramInfo.desc ,
			  isBoolean: paramInfo.boolean
		      }
		  ],
		  callback: callBackWrapper
		});

	    this.accord.find("#"+sectionInfo.tag).append( widget.domRoot() );
            this.accord.accordion( "refresh" );
	    this.sectionInfoById[sectionId].params[paramInfo.id] = widget;
	},

	//
	addComboWidget:
	function(sectionId,paramInfo) {
	    var sectionInfo = this.sectionInfoById[sectionId];

	    var widget = new ComboWidget({ id: paramInfo.id,
		 			   desc: paramInfo.desc,
	                                   default_value: paramInfo.default_value,
					   multiple: paramInfo.multiple,
					   options: paramInfo.options,
					   callback: paramInfo.callback
					 });
	    
	    
	    this.accord.find("#"+sectionInfo.tag).append( widget.domRoot() );
            this.accord.accordion( "refresh" );

	    this.sectionInfoById[sectionId].params[paramInfo.id] = widget;
	},

	//
	addTextfieldWidget:
	function(sectionId,paramInfo) {
	    var sectionInfo = this.sectionInfoById[sectionId];

	    var widget = new TextAreaWidget({ id: paramInfo.id,
		 			      desc: paramInfo.desc,
					      multiple: paramInfo.multiple,
	                                      default_value: paramInfo.default_value
					    });
	    
	    
	    this.accord.find("#"+sectionInfo.tag).append( widget.domRoot() );
            this.accord.accordion( "refresh" );

	    this.sectionInfoById[sectionId].params[paramInfo.id] = widget;

	},

	//
	restoreDefaultValues:
	function(sectionId,max) {
 	    var self = this;
	    var secTag = this.sectionId_to_sectionTag(sectionId);
	    if(sectionId < 0){
		for(var p in this.sectionInfoById){
		    this.restoreDefaultValues(p);
		}
	    }else{
	      $('#profile-'+this.sectionInfoById[sectionId].tag+'').find("option").each(function(k,v){
		if($(v).val()=="default")
		  $(v).attr("selected","selected");
		else
		  $(v).removeAttr("selected");
	      });
		for(var p in this.sectionInfoById[sectionId].params){
		  this.sectionInfoById[sectionId].params[p].restoreDefault();
		}

	    }

	},

	selectProfile:
	function(sectionId,profile){
	  var self = this;
	  if(sectionId < 0){
	    for(var p in self.sectionInfoById){
	      self.selectProfile(p,profile);
	    }
	  }else{
	    var sectionInfo = self.sectionInfoById[sectionId];
	    if(sectionInfo.profileChange)
	      return;

	    var selector = sectionInfo.profileSelector;
	    if( $("option[value='"+profile+"']",selector).length > 0){
	      $(selector).val(profile);
	      sectionInfo.profileChange = true;
	      
	      self.setProfileValues(sectionId,profile);
	      
	      sectionInfo.profileChange = false;
	    }
	  }
	},

	//
        setProfileValues:
	function(sectionId,profile) {
 	  var self = this;
	  if(profile == "default"){
	      self.restoreDefaultValues(sectionId);
	  } else if(sectionId < 0){
	    for(var p in this.sectionInfoById){
	      this.setProfileValues(p,profile);
	    }
	  }else{
	    var secTag = self.sectionId_to_sectionTag(sectionId);
	    var profileValues = self.sectionInfoById[sectionId].profiles[profile];
	    for(var p in profileValues){
	      this.sectionInfoById[sectionId].params[p].setValue(profileValues[p]);
	    }
	  }
	},

	//
	setActiveParameSet:
	function(sectionId) {
	  if ( sectionId != undefined ) {
		this.accord.accordion({active: this.sectionInfoById[sectionId].secId });
	    } else {
		this.accord.accordion({active: false});
	    }
	    this.accord.accordion( "refresh" );
	},


	//
	getParams:
	function(sectionId) {
	    var r = new Array();
	    var sectionParams = this.sectionInfoById[sectionId].params;
	    for(var p in sectionParams) {
		    r[p]=sectionParams[p].getValue();
	    }
	    return r;
	},


	//
	placeParamSet:
	function(toolId,holder){
	  var tagId = this.sectionId_to_sectionTag( toolId );
	  this.accord.find("#"+tagId).append($(holder).contents());
	},
	     
	//
	getParamSet:
	function(toolId,holder){
	  var tagId = this.sectionId_to_sectionTag( toolId );
	  var cont = this.accord.find("#"+tagId).contents();
	  cont.show();
	  $(holder).append(cont);
	  
	}
    };

    return Parameters;

})();

