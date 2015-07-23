#!/bin/bash

### A wrapper script for SACO's Resource Usage Analysis
###
###

# execute envisage_settings.sh to set some environment variables needed by
# costabs, etc.
#
. envisage/envisage_settings.sh

# Execute costabs, we add '-ei_version 2' to the parameters since now
# saco's output uses the old easy interface language
#
${SACOHOME}/src/interfaces/shell/costabs $@ -ei_version 2 &> /tmp/costabs.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otherwise we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/costabs/output.xml
else
    echo "<eierror>"
    echo "Error occurred while executing the resource usage analysis:"
    echo ""
    cat /tmp/costabs.stderr
    echo "</eierror>"
fi

\rm -f /tmp/costabs.stderr

