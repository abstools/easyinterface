# Envisage Collaboratory

This directory includes some bash scripts that are used as wrappers
for Envisage's tools. These scripts are referenced by the
configuration files in `config/envsage`.


## The setting file

The script `envisage_setting.sh` is used to set some environment
variables, e.g., paths to abstools, saco, etc. Other scripts that want
to access these paths can execute `envisage_setting.sh` to set the
corresponding environment variables. Note that `envisage_setting.sh`
uses the information in `ENVISAGE_CONFIG` to set these path. This file
is not included in the repository, and it should be generated either
manually or by the installation script of the Envisage
Collaboratory. Here is an example of `ENVISAGE_CONFIG`:

    EC_SACOHOME="/home/genaim/Systems/costa/costabs/"
	EC_ABSTOOLSHOME="/home/genaim/Systems/abstools/"
