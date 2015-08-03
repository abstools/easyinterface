# EasyInterface Server Configuration Files

This directory includes the server configuration files, which define the available applications and example sets. By default `eiserver.default.cfg` is used, unless there is a file called `eiserver.cfg` in which case it is the one used.

EasyInterface comes with the following configuration files:

* `eiserver.default.cfg` which defines several demo appications for the purpose of demonstrating various features, these applications are also refered to in the user manual. This file just includes other configuration files from the directory `default`. 

* `eiserver.default.win.cfg` is, in principle, the same as `eiserver.default.cfg` except that it is suitable for executing the demo application on Windows (see below).

* `envisage.cfg` is the configuration file for the **ABS COLLABORATOTY**, it just includes other configuration files from the directory `envisage` (see below). 

As mentioned above, by default the server uses `eiserver.default.cfg` unless there is a file called `eiserver.cfg`. Thus, if you want to enable, for example, the **ABS COLLABORATORY** you should copy `envisage.cfg` to `eiserver.cfg`.


## Configuring the Server to Run on Windows

To run the EasyInterface server on windows you should copy `eiserver.default.win.cfg` to
`eiserver.cfg`. The difference between `eiserver.default.cfg` and `eiserver.default.win.cfg` is in that the later uses `c:\bash\bash.exe` to execute the different demo applications, e.g., compare `default/test-0.cfg` with `default/test-0.win.cfg`.

## Configuring the Server for the ABS COLLABORATORY

To enable the **ABS COLLABORATORY** configuration files you should copy `envisage.cfg` to `eiserver.cfg`, but in addition you should have the corresponding tools installed as well. The easist way to install these tools, together with the **ABS COLLABORATORY** is using the abstools configuration script avalable at [http://github.com/abstools](http://github.com/abstools) -- see [ENVISAGE.md](ENVISAGE.md) for more details.