def eiout():
    tag = "eiout"
    attrs = {
        "version": {
            "required": False,
            "value": "version",
            "desc": "Indicates output version"
        }
    }
    t1, _, _, _ = eicommands()
    t2, _, _, _ = eiactions()
    childs = {
        t1: {
            "required": False,
            "maximun": float('Inf')
        },
        t2: {
            "required": False,
            "maximun": float('Inf')
        }
    }
    desc = "General Output tag"
    return (tag, attrs, childs, desc)


def eicommands():
    tag = "eicommands"
    attrs = {
        "dest": {
            "required": False,
            "value": "ei-path",
            "desc": "reference to file"
        },
        "outclass": {
            "required": False,
            "value": "outclass",
            "desc": "Indicates output version"
        }
    }
    t0, _, _, _ = command_print()
    t1, _, _, _ = command_highlightlines()
    t2, _, _, _ = command_dialogbox()
    t3, _, _, _ = command_writefile()
    t4, _, _, _ = command_setcss()
    t5, _, _, _ = command_changecontent()
    t6, _, _, _ = command_addmarker()
    t7, _, _, _ = command_addinlinemarker()
    t8, _, _, _ = command_download()
    childs = {
        t0: {
            "required": False,
            "maximun": float('Inf')
        },
        t1: {
            "required": False,
            "maximun": float('Inf')
        },
        t2: {
            "required": False,
            "maximun": float('Inf')
        },
        t3: {
            "required": False,
            "maximun": float('Inf')
        },
        t4: {
            "required": False,
            "maximun": float('Inf')
        },
        t5: {
            "required": False,
            "maximun": float('Inf')
        },
        t6: {
            "required": False,
            "maximun": float('Inf')
        },
        t7: {
            "required": False,
            "maximun": float('Inf')
        },
        t8: {
            "required": False,
            "maximun": float('Inf')
        }
    }
    desc = ""
    return (tag, attrs, childs, desc)


def eiactions():
    tag = "eiactions"
    attrs = {
        "dest": {
            "required": False,
            "value": "ei-path",
            "desc": "reference to file"
        },
        "autoclean": {
            "required": False,
            "value": "bool",
            "desc": ""
        }
    }
    t0, _, _, _ = action_oncodelineclick()
    t1, _, _, _ = action_onclick()
    childs = {
        t0: {
            "required": False,
            "maximun": float('Inf')
        },
        t1: {
            "required": False,
            "maximun": float('Inf')
        }
    }
    desc = ""
    return (tag, attrs, childs, desc)


def command_print():
    tag = "printonconsole"
    attrs = {
        "outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        },
        "consoleid": {
            "required": False,
            "value": "word",
            "desc": ""
        },
        "consoletitle": {
            "required": False,
            "value": "string",
            "desc": ""
        }
    }
    t0, _, _, _ = content()
    childs = {
        t0: {
            "required": True
            "maximun": float('Inf')
        }
    }
    desc = ""
    return (tag, attrs, childs, desc)


def command_highlightlines():
    tag = "highlightlines"
    attrs = {
        "outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        },
        "dest": {
            "required": False,
            "value": "ei-path",
            "desc": "reference to file"
        }
    }
    t0, _, _, _ = lines()
    childs = {
        t0: {
            "required": False
            "maximun": float('Inf')
        }
    }
    desc = ""
    return (tag, attrs, childs, desc)


def command_dialogbox():
    tag = "dialogbox"
    attrs = ["outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        }, "boxtitle", "boxwidth", "boxheight"]
    childs = ["content"]
    desc = ""
    return (tag, attrs, childs, desc)


def command_writefile():
    tag = "writefile"
    attrs = ["filename", "overwrite"]
    childs = ["text"]
    desc = ""
    return (tag, attrs, childs, desc)


def command_setcss():
    tag = "setcss"
    attrs = []
    childs = ["elements", "cssproperties"]
    desc = ""
    return (tag, attrs, childs, desc)


def command_changecontent():
    tag = "changecontent"
    attrs = ["action"]
    childs = ["elements", "content"]
    desc = ""
    return (tag, attrs, childs, desc)


def command_addmarker():
    tag = "addmarker"
    attrs = ["outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        }, "dest": {
            "required": False,
            "value": "ei-path",
            "desc": "reference to file"
        }, "boxtitle", "boxwidth", "boxheight"]
    t0, _, _, _ = lines()
    childs = {
        t0: {
            "required": False
            "maximun": float('Inf')
        },
        "content": {}
    }
    desc = ""
    return (tag, attrs, childs, desc)


def command_addinlinemarker():
    tag = "addinlinemarker"
    attrs = ["outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        }, "dest": {
            "required": False,
            "value": "ei-path",
            "desc": "reference to file"
        }]
    t0, _, _, _ = lines()
    childs = ["lines", "content"]
    desc = ""
    return (tag, attrs, childs, desc)


def command_download():
    tag = "download"
    attrs = ["execid", "filename"]
    childs = []
    desc = ""
    return (tag, attrs, childs, desc)


def action_oncodelineclick():
    tag = "oncodelineclick"
    attrs = ["outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        }, "dest": {
            "required": False,
            "value": "ei-path",
            "desc": "reference to file"
        }, "autoclean": {
            "required": False,
            "value": "bool",
            "desc": ""
        }]
    t0, _, _, _ = lines()
    childs = ["lines", "content", "eicommands"]
    desc = ""
    return (tag, attrs, childs, desc)


def action_onclick():
    tag = "onclick"
    attrs = ["outclass": {
            "required": False,
            "value": "outclass",
            "desc": ""
        }, "autoclean": {
            "required": False,
            "value": "bool",
            "desc": ""
        }]
    childs = ["elements", "eicommands"]
    desc = ""
    return (tag, attrs, childs, desc)


def lines():
    tag = "lines"
    attrs = []
    childs = ["line"]
    desc = ""
    return (tag, attrs, childs, desc)


def line():
    tag = "line"
    attrs = ["from", "to", "fromch", "toch"]
    childs = []
    desc = ""
    return (tag, attrs, childs, desc)


def elements():
    tag = "elements"
    attrs = []
    childs = ["selector"]
    desc = ""
    return (tag, attrs, childs, desc)


def selector():
    tag = "selector"
    attrs = ["value"]
    childs = []
    desc = ""
    return (tag, attrs, childs, desc)


def cssproperties():
    tag = "cssproperties"
    attrs = []
    childs = ["cssproperty"]
    desc = ""
    return (tag, attrs, childs, desc)


def cssproperty():
    tag = "cssproperty"
    attrs = ["name", "value"]
    childs = []
    desc = ""
    return (tag, attrs, childs, desc)


def content():
    tag = "content"
    attrs = ["format", "execid", "ext", "action", "refreshrate"]
    childs = ["text"]
    desc = ""
    return (tag, attrs, childs, desc)
