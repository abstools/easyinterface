var _ei_data = {};

var loadConfig = function(){
  var successfunc = function(data){
    _ei_data = data;
    if(!data.apps || !($.isArray(data.apps) || data.apps.lenght >0))
      _ei_data.apps = [{server: eiserverURI ,apps:"_all"}];

    if(!data.examples ||!($.isArray(data.examples) || data.examples.lenght >0))
      _ei_data.examples = [{server: eiserverURI ,examples:"_all"}];

    if(!data.outlineserver)
      _ei_data.outlineserver = eiserverURI;

    if(!data.outline)
      _ei_data.outline = "on";
  }

  $.ajax({
    dataType: "json",
    url: "webclient.cfg",
    async: false,
    success: successfunc,
    error: function(jqxhr,settings, exception){
      $.ajax({
	dataType: "json",
	url: "webclient.default.cfg",
	async: false,
	success: successfunc,
	error: function(jqxhr,settings, exception){
	  $('body').html("<span style='color:red'>No config file found, please contact admin.</span>");
	}
      });
    }
  });



}
