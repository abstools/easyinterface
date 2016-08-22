#!/bin/bash

### A wrapper script for aPET: ABS partial-evaluation test case generator.
###
###

# execute envisage_settings.sh to set some environment variables needed by
# costabs, etc.
#

. envisage/envisage_settings.sh

# decide which executable to use
#
if [[ -e ${APETHOME}/bin/apet ]] ; then
    PROGRAM=${APETHOME}/bin/apet
else
    PROGRAM=${APETHOME}/src/interfaces/shell/apet
fi

# Execute apet
${PROGRAM} $@ &> /tmp/apet.stderr

# If apet exit with exit-code 0 we just print the output to the
# stdout, otherwise we print an error message to the stdout as well.
#
R=$?
if [ $R == 0 ]; then
    cat /tmp/pet/output.xml
else
    echo "<eiout>"
    echo "<eicommands>"
    echo "<printonconsole consoleid='Error'>"
    echo "<content format='text'>"
    cat /tmp/apet.stderr
    echo "</content>"
    echo "</printonconsole>"
    echo "<dialogbox boxtitle='Execution Error' boxwidth='400'>"
    echo "<content format='html'>"
    echo "<span style='color:red;' >apet exit with non-zero exit code: $R</span>"
    echo "</content>"
    echo "</dialogbox>"
    echo "</eicommands>"
    echo "</eiout>"
fi

#\rm -f /tmp/apet.stderr
