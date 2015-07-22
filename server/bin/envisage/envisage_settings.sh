#--START--
autovar_SACOHOME="/home/genaim/Systems/costa/costabs/"
autovar_ABSTOOLSHOME="/home/genaim/Systems/abstools/"
#--END--

# The installation script should generate the above part, between
# --START-- and --END--, automatically depending on where the
# corresponding tools are installed.

# SACO
export SACOHOME=${autovar_SACOHOME}
export COSTABSHOME=${SACOHOME}
export PATH=${PATH}:${SACOHOME}/bin

# ABSTOOLS
export ABSTOOLSHOME=${autovar_ABSTOOLSHOME}
