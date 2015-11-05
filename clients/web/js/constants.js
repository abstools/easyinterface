var _ei = {
  clientId: "web_client",
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
	  selectorvalue    : "value",

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
	  format         : "format",       // attr
	  htmlcontent    : "html",         // attr
	  svgcontent     : "svg",          // attr
	  textcontent    : "text",         // attr
	  
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

	  // ONCODELINECLICK action
	  oncodelineclick: "oncodelineclick",
	  actionautoclean: "autoclean",

	  // ONCLICK action
	  onclick: "onclick"
      }
  },
  debug: true,
  file_ext: ".abs",
  pprefix: "-",
  outline: {
    server: "",
    app: "absoutline"
  },
  general_settings : {
    show_svg_in_new_window: "no",
    file_selection_mode: "file"
  }
};
