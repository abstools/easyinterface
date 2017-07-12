//
//
function jQuerySelectorEscape(expression) {
    return expression.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
}


//
//
function getLines(linesXML) {
    var lines = new Array();
    
    linesXML.find("> line").each( function () {

	var init = {line: null, ch: null};
	var end  = {line: null, ch: null};

	var fromval = $(this).attr('from');

	if ( !fromval )
	    throw "getLines Error: the attribute 'from' is obligatory";

	var from = parseInt(fromval)-1;
	if ( isNaN(from) )
	    throw "getLines Error: invalid value (" + fromval + ") for the attribute 'from'";

	init.line = from;

	var fromch = $(this).attr('fromch');
	var to = $(this).attr('to');
	var toch = $(this).attr('toch');

 	// init = {line: parseInt()-1, ch:parseInt($(this).attr('fromch')) };
	// end = {line: parseInt($(this).attr('to'))-1, ch:parseInt($(this).attr('toch')) };

	if( fromch ) {
	    init.ch = parseInt(fromch);
	    if ( isNaN(init.ch) )
		throw "getLines Error: invalid value (" + fromch + ") for the attribute 'fromch'";
	}
	
	if( to ) {
	    end.line = parseInt(to)-1;
	    if ( isNaN(end.line) )
		throw "getLines Error: invalid value (" + to + ") for the attribute 'to'";
	} else
	    end.line = init.line;

	if( toch ) {
	    end.ch = parseInt(toch);
	    if ( isNaN(end.ch) )
		throw "getLines Error: invalid value (" + toch + ") for the attribute 'toch'";

	}


	lines[lines.length] = {init: init, end: end};
	
    });

    return lines;
}
