
# ENVISAGE_CONFIG should be generated automatically with some values
# for the variables that start with EC_
#
# We rely on the fact that the PHP server calls the applications
# starting in the directory bin, i.e., it first changes directory to
# server/bin and the executes the app. Thus envisage/ENVISAGE_CONFIG
# refers to ENVISAGE_CONFIG where envisage_setting.sh is
#
#
. envisage/ENVISAGE_CONFIG

# SACO
export SACOHOME=${EC_SACOHOME}
export COSTABSHOME=${SACOHOME}
export PATH=${PATH}:${SACOHOME}/bin

# ABSTOOLS
export ABSTOOLSHOME=${EC_ABSTOOLSHOME}
export ABSFRONTEND=${EC_ABSFRONTEND}/absfrontend.jar
