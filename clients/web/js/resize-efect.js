window.ResizeEfect = (function() {
    "use strict";
    
    function ResizeEfect(options) {
      console.log("EXISTO");
      this.count = -1;
      this.dragging = new Array();
      this.actual = -1;
    };

    ResizeEfect.prototype = {
	constructor: ResizeEfect,

	addHorizontalEfect:
	function(leftId,rightId){
	  var self = this;
	  self.count = self.count+1; 
	  var me = self.count;
	  self.dragging = 0;
	  $("#"+leftId).after("<div id='drag-"+me+"' class='dragbarV'></div>");
	  $('#drag-'+me).mousedown(function(e){
	    e.preventDefault();
	    console.log(e,leftId,rightId,me);
	    self.dragging = e.pageX;
	    self.actual = me;
	    var main = $('#'+rightId);
	    var ghostbar = $('<div>',
                        {id:'ghostbar',
                         css: {
                           height: main.outerHeight(),
                           top: main.offset().top,
                           left: main.offset().left
                         }
                        }).appendTo('body');
            $(document).mousemove(function(e){
	      ghostbar.css("left",e.pageX+2);
	    });
	  });
	  $(document).mouseup(function(e){
	    console.log(self.count,self.actual,me);
	    if (self.dragging && me == self.actual) {
	      console.log(e,leftId,rightId,self.actual);
	      var sum =e.pageX-self.dragging;
	      var wL= parseInt($('#'+leftId).css("width").slice(0, -2));
	      var wR= parseInt($('#'+rightId).css("width").slice(0, -2));
	      console.log(sum,wL,wR);
              $('#'+leftId).css("width",wL+sum);
              $('#'+rightId).css("width",wR-sum);
              $('#ghostbar').remove();
	      $(document).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });

	},
	     //
	addVerticalEfect:
	function(upId,downId){
	  var self = this;
	  self.count = self.count+1;
	  var me = self.count;
	  self.dragging = 0;
	  $("#"+upId).after("<div id='drag-"+me+"' class='dragbarH'></div>");
	  $('#drag-'+me).mousedown(function(e){
	    e.preventDefault();
	    self.dragging = e.pageY;
	    self.actual = me;
	    var main = $('#'+upId);
	    var ghostbar = $('<div>',
                        {id:'ghostbar',
                         css: {
                           width: main.outerWidth(),
                           top: main.offset().top,
                           left: main.offset().left
                         }
                        }).appendTo('body');
            $(document).mousemove(function(e){
	      ghostbar.css("top",e.pageY+2);
	    });
	  });
	  $(document).mouseup(function(e){
	    if (self.dragging && me == self.actual) {
	      var sum =e.pageY-self.dragging;
	      var hU= parseInt($('#'+upId).css("height").slice(0, -2));
	      var hD= parseInt($('#'+downId).css("height").slice(0, -2));
              $('#'+upId).css("height",hU+sum);
              $('#'+downId).css("height",hD-sum);
              $('#ghostbar').remove();
	      $(document).unbind('mousemove');
	      self.dragging = 0;
	    }
	  });
	}
    }

    return ResizeEfect;

})();
