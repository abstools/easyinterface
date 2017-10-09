import xml.etree.ElementTree as ET
from . import info
from . import check


def _object(_tag, _attr_keys, _child_keys, **kwargs):
    """Returns global XML object
    """
    childs = []
    attrs = {}
    for k in kwargs:
        if k in _attr_keys:
            attrs[k] = kwargs[k]
        elif k in _child_keys:
            childs.append(kwargs[k])
        else:
            raise TypeError(__name__ +
                            "() got an unexpected keyword argument " +
                            "'" + k + "'")
    for k in _attr_keys:
        if _attr_keys[k]["minimun"] > 0 and not(k in attrs):
            raise TypeError(__name__ +
                            "() argument " +
                            "'" + k + "' not found")
        elif k in attrs and not check.types(_attr_keys[k]["type"], attrs[k]):
            raise TypeError(__name__ +
                            "() argument " + "'" + k + "'" +
                            " expecting: " + _attr_keys[k]["type"] + " type.")

    el = ET.Element(_tag, attrib=attrs)
    for c in childs:
        el.append(c)
    return el


def create_output(**kwargs):
    tag, attrs, childs, _ = info.eiout()
    return _object(tag, attrs, childs, **kwargs)
