var _ei = {
  clientId: "web_client",
  outformat: "eiol",
  language: "text/x-csrc",
  serverPath:"",
  exampleServerPath:"",
  serverCommand: {
    all: "_ei_all",
    app: {
      details    : "app_details",
      execute    : "execute"
    },
    example: {
      details    : "exset_details"
    },
    stream: {
      get        : "get_stream",
      kill       : "kill_stream"
    },
  },
  outlang: {
      syntax: {
	  eicommands       : "eicommands",         // tag
	  eiactions        : "eiactions",          // tag
	  eiout            : "eiout",              // tag
	  eistream         : "ei_stream",        // tag
	  eierror          : "ei_error",           // tag
	  eiappout         : "ei_output",          // tag
	  eiserverout      : "ei_server_output",   // tag
	  eiserverresponse : "ei_response",        // tag
	  dest             : "dest",               // attr
	  color            : "color",              // attr
	  elements         : "elements",           // tag
	  selector         : "selector",           // tag
	  selectorvalue    : "value",              // attr

	  //
	  outclass       : "outclass",     // attr
	  info           : "info",         // attr value
	  warning        : "warning",      // attr value
	  error          : "error",        // attr value

	  // LINES environment
	  lines          : "lines",        // tag
	  line           : "line",         // tag

	  // CONTENT environemnt
	  content        : "content",      // tag
	  streamid       : "execid",     // attr
	  streamext      : "ext",    // attr
	  streamaction   : "action", // attr
	  streamtime     : "refreshrate",// attr
	  format         : "format",       // attr
	  htmlcontent    : "html",         // attr value
	  svgcontent     : "svg",          // attr value
	  textcontent    : "text",         // attr value
	  dygraphcontent : "graph",      // attr value

	  // PRINTONCONSOLE command
	  printonconsole : "printonconsole", // tag
	  consoleid      : "consoleid",      // attr
	  consoletitle   : "consoletitle",   // attr

	  // STREAM command
	  stream         : "stream",         // tag
	  //consoleid      : "consoleid",      // attr
	  //consoletitle   : "consoletitle",   // attr
	  time           : "time",           // attr
	  execid         : "execid",         // attr
	  streamposition : "position",       // attr

	  // ADDMARKER command
	  addmarker      : "addmarker",     // tag

	  // ADDMARKER command
	  addinlinemarker : "addinlinemarker",     // tag

	  // HIGHLIGHTLINES command
	  highlightlines : "highlightlines", // tag

	  // WRITEFILE command
	  writefile      : "writefile",  // tag
	  filename       : "filename",  // attr
	  overwrite      : "overwrite", // attr
	  url            : "url",       // attr
	  
	  //DOWNLOAD command
	  downloadfile   : "download",  //tag
	  //filename       : "filename",  // attr
	  //execid         : "execid",    // attr

	  // SETCSS command
	  setcss         : "setcss",
	  cssproperties  : "cssproperties",
	  cssproperty    : "cssproperty",
	  csspropertyname : "name",
	  csspropertyvalue : "value",

	  // DIALOGBOX command
	  dialogbox      : "dialogbox", // tag
	  boxtitle       : "boxtitle", // attr
	  boxwidth       : "boxwidth", // attr
	  boxheight      : "boxheigh", // attr

	  // TIMELINE command
	  timeline       : "timeline", // tag
	  tlwidget       : "widget", //  attr
	  tltitle        : "title",  //  attr
	  tlauto         : "auto",   //  attr

	  tlstep         : "step",  // tag
	  tlclean        : "autoclean", // attr

	  // ASKURL command
	  askurl         : "askUrl", //  tag
	  audelay        : "delay",  // attr
	  autries        : "tries",  // attr

	  // CHANGECONTENT command
	  changecontent  : "changecontent", // tag
	  ccaction       : "action", //attr

	  // ONCODELINECLICK action
	  oncodelineclick: "oncodelineclick",
	  actionautoclean: "autoclean",

	  // ONCLICK action
	  onclick: "onclick"
      }
  },
  debug: true,
  outline: true,
  file_ext: ".c",
  pprefix: "-",
  outline: {
    server: "",
    app: "absoutline"
  },
  inlineSetting:{
    active: !false
  },
  general_settings : {
    show_svg_in_new_window: "no",
    file_selection_mode: "file"
  }
};
