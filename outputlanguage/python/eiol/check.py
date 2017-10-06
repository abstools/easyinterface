def types(ty, data):
    if ty == "version":
        import distutils.version as v
        try:
            v.StrictVersion(data)
        except ValueError:
            return False
    elif ty == "outclass":
        return (data in ["error", "info", "warning"])
    elif ty == "bool":
        return (data in ["true", "false"])
    elif ty == "format":
        return (data in ["html", "svg", "text", "graph"])
    elif ty == "string":
        return isinstance(data, str)
    elif ty == "word":
        # TODO: check no spaces"
        return isinstance(data, str)
    elif ty == "int":
        try:
            int(data)
        except:
            return False
    return True

