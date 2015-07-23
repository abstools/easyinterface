# EasyInterface Server Configuration Files

This directory includes 3 files:

* `eiserver.default.cfg` is the main configuration file, which refers
  to other configuration files from the directory `default`

* `envisage.cfg` is the configuration file for the **Envisage
  Collaboratory**, they refer to other configuration files from the
  directory `envisage`

By default, the EasyInterface server uses `eiserver.default.cfg`,
unless there is a file `eiserver.cfg`. Thus, if you want to enable the
Envisage Collaboratory you should copy `envisage.cfg` to
`eiserver.cfg`.

