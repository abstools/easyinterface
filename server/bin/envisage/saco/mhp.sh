#!/bin/bash

### A wrapper script for SACO's MHP analysis
###
###

# execute envisage_settings.sh to set some environment variables needed by
# costabs, etc.
#
. envisage/envisage_settings.sh
. misc/parse_params.sh

# decide which executable to use
#
if [[ -e ${SACOHOME}/bin/maypar ]] ; then
    PROGRAM=${SACOHOME}/bin/maypar
else
    PROGRAM=${SACOHOME}/src/interfaces/mhp/shell/mhp_shell
fi

# Decide the entry. If the user provide a single entry then use it,
# otherwise use 'main'
#
entries=$(getparam "entries")
numofentries=($entries)

if [ ${#numofentries[@]} == 1 ]; then
    entry="$entries"
else
    entry="main"
fi

# remove -entries and its arguments, we assume it is the first in the
# command-line parameters
#
shift                      
shift ${#numofentries[@]} 


# Execute mh_shell, we add '-ei_version 2' to the parameters since now
# saco's output uses the old easy interface language
#
${PROGRAM} $entry $@ -ei_version 2 -mode complete -highlight '/dev/null' &> /tmp/mhp.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otherwise we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/costabs/output.xml
else
    echo "<eiout>"
    echo "<eicommands>"
    echo "<printonconsole consoleid='Error'>"
    echo "<content format='text'>"
    cat /tmp/mhp.stderr
    echo "</content>"
    echo "</printonconsole>"
    echo "<dialogbox boxtitle='Execution Error' boxwidth='400'>"
    echo "<content format='html'>"
    echo "<span style='color:red;' >Error occurred while executing May-Happen-in-Parallel analysis:</span>"
    echo "</content>"
    echo "</dialogbox>"
    echo "</eicommands>"
    echo "</eiout>"
fi

\rm -f /tmp/mhp.stderr
