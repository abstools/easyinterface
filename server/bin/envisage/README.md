# Envisage Collaboratory

This directory includes bash scripts that serve as wrappers for
Envisage's tools. These scripts are referenced by the configuration
files in `server/config/envsage`.

## The settings file

The script `envisage_setting.sh` is used to set some environment
variables, e.g., paths to abstools, saco, etc. Scripts that need these
paths can show execute `envosage/envisage_setting.sh` first to set the
corresponding environment variables.

The script `envisage_setting.sh` sets the different variables using
the information provided in `ENVISAGE_CONFIG`. This file is not
included in the repository, and it should be generated either manually
or by the automatic installation scripts of the Envisage
Collaboratory. 

A template for `ENVISAGE_CONFIG` is available in
[ENVISAGE_CONFIG.tmpl](ENVISAGE_CONFIG.tmpl)
