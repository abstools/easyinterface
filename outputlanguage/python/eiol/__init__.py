import xml.etree.ElementTree as ET

from . import check
from . import info

def INNER(text=None):
    element = ET.Element('!INNER')
    element.text = text
    return element

def CDATA(text=None):
    element = ET.Element('![CDATA[')
    element.text = text
    return element

ET._original_serialize_xml = ET._serialize_xml
def _serialize_xml(write, elem, qnames, namespaces, 
                   short_empty_elements, **kwargs):
    if elem.tag == '![CDATA[':
        if not elem.tail:
            elem.tail = ""
        write("<{}{}]]>{}".format(elem.tag, elem.text, elem.tail))
        return
    if elem.tag == '!INNER':
        if not elem.tail:
            elem.tail = ""
        write("{}{}".format(elem.text, elem.tail))
        return
    return ET._original_serialize_xml(
        write, elem, qnames, namespaces, short_empty_elements, **kwargs)
ET._serialize_xml = ET._serialize['xml'] = _serialize_xml


def _object(_tag, _attr_keys, _child_keys, wrap_text=True, **kwargs):
    """Returns global XML object
    """
    childs = {}
    attrs = {}
    for k in kwargs:
        if k in _attr_keys:
            if k in attrs:
                raise TypeError("argument '" + k + "' found too many times")
            attrs[k] = kwargs[k]
        elif k in _child_keys:
            if not(k in childs):
                childs[k] = []
            if isinstance(kwargs[k], list):
                childs[k] += kwargs[k]
            else:
                childs[k].append(kwargs[k])
        else:
            raise TypeError("got an unexpected keyword argument '" + k + "'")
    for k in _attr_keys:
        count = 0
        if k in attrs:
            count = 1
        if _attr_keys[k]["minimun"] > count:
            raise TypeError("argument '" + k + "' not found")
        if count > 0 and not check.types(_attr_keys[k]["type"], attrs[k]):
            raise TypeError("argument " + "'" + k + "' expecting: " +
                            str(_attr_keys[k]["type"]) + " got: "+str(attrs[k]))
    for k in _child_keys:
        count = 0
        if k in childs:
            count = len(childs[k])
        if _child_keys[k]["minimun"] > count:
            raise TypeError("argument '" + k + "' not found")
        elif _child_keys[k]["maximun"] < count:
            raise TypeError("argument '" + k + "' found too many times")

    el = ET.Element(_tag, attrib=attrs)
    text = None
    for tc in childs:
        for c in childs[tc]:
            if tc == "text":
                if text is None:
                    text = ""
                text += c
            else:
                el.append(c)
    if not(text is None):
        if wrap_text:
            el.append(CDATA(text))
        else:
            el.append(INNER(text))
    return el


def create_output(**kwargs):
    tag, attrs, childs, _ = info.eiout()
    return _object(tag, attrs, childs, **kwargs)


def eicommands(**kwargs):
    tag, attrs, childs, _ = info.eicommands()
    return _object(tag, attrs, childs, **kwargs)


def eiactions(**kwargs):
    tag, attrs, childs, _ = info.eiactions()
    return _object(tag, attrs, childs, **kwargs)


def command_print(**kwargs):
    tag, attrs, childs, _ = info.command_print()
    return _object(tag, attrs, childs, **kwargs)


def command_highlightlines(**kwargs):
    tag, attrs, childs, _ = info.command_highlightlines()
    return _object(tag, attrs, childs, **kwargs)


def command_dialogbox(**kwargs):
    tag, attrs, childs, _ = info.command_dialogbox()
    return _object(tag, attrs, childs, **kwargs)


def command_writefile(**kwargs):
    tag, attrs, childs, _ = info.command_writefile()
    return _object(tag, attrs, childs, **kwargs)


def command_setcss(**kwargs):
    tag, attrs, childs, _ = info.command_setcss()
    return _object(tag, attrs, childs, **kwargs)


def command_changecontent(**kwargs):
    tag, attrs, childs, _ = info.command_changecontent()
    return _object(tag, attrs, childs, **kwargs)


def command_addmarker(**kwargs):
    tag, attrs, childs, _ = info.command_addmarker()
    return _object(tag, attrs, childs, **kwargs)


def command_addinlinemarker(**kwargs):
    tag, attrs, childs, _ = info.command_addinlinemarker()
    return _object(tag, attrs, childs, **kwargs)


def command_download(**kwargs):
    tag, attrs, childs, _ = info.command_download()
    return _object(tag, attrs, childs, **kwargs)


def action_oncodelineclick(**kwargs):
    tag, attrs, childs, _ = info.action_oncodelineclick()
    return _object(tag, attrs, childs, **kwargs)


def action_onclick(**kwargs):
    tag, attrs, childs, _ = info.action_onclick()
    return _object(tag, attrs, childs, **kwargs)


def lines(**kwargs):
    tag, attrs, childs, _ = info.lines()
    return _object(tag, attrs, childs, **kwargs)


def line(**kwargs):
    tag, attrs, childs, _ = info.line()
    return _object(tag, attrs, childs, **kwargs)


def elements(**kwargs):
    tag, attrs, childs, _ = info.elements()
    return _object(tag, attrs, childs, **kwargs)


def selector(**kwargs):
    tag, attrs, childs, _ = info.selector()
    return _object(tag, attrs, childs, **kwargs)


def cssproperties(**kwargs):
    tag, attrs, childs, _ = info.cssproperties()
    return _object(tag, attrs, childs, **kwargs)


def cssproperty(**kwargs):
    tag, attrs, childs, _ = info.cssproperty()
    return _object(tag, attrs, childs, **kwargs)


def content(**kwargs):
    tag, attrs, childs, _ = info.content()
    wrap = False
    if "format" in kwargs and kwargs["format"] == "text":
        wrap = True
    return _object(tag, attrs, childs, wrap_text=wrap, **kwargs)
