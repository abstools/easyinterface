var loadConfig = function(){
  $.getScript("default.cfg").done(function(script,status){
      new EasyInterface(_ei_data);
  }).fail(function(jqxhr,settings, exception){
    $.getScript("eiclient.default.cfg").done(function(script,status){
      new EasyInterface(_ei_data);
    }).fail(function(jqxhr,settings, exception){
      $('body').html("<span style='color:red'>No config file found, please contact admin.</span>");
    });
  });
    

}
