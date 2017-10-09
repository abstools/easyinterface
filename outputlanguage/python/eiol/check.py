def types(ty, data):
    if isinstance(ty, list):
        return data in ty
    if ty == "version":
        import distutils.version as v
        try:
            v.StrictVersion(data)
        except ValueError:
            return False
    elif ty == "format":
        return (data in ["html", "svg", "text", "graph"])
    elif ty == "string":
        return isinstance(data, str)
    elif ty == "word":
        # TODO: check no spaces"
        return isinstance(data, str)
    elif ty == "ei-path":
        return isinstance(data, str)
    elif ty == "int":
        try:
            int(data)
        except:
            return False
    return True

