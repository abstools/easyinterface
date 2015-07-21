#!/bin/bash

### A wrapper script for SACO's resource usage analysis
###
###

# execute saco_settings.sh to set some environment variables needed by
# costabs, etc.
#
. `dirname $0`/saco_settings.sh

# Execute costabs, we add '-ei_version 2' to the parameters since now
# saco's output uses the old easy interface language
#
${SACOHOME}/src/interfaces/shell/costabs $@ -ei_version 2 &> /tmp/costabs.stderr

# If costabs exit with exit-code 0 we just print the output to the
# stdout, otheriwse we print an error message to the stdout as well.
#
if [ $? == 0 ]; then
    cat /tmp/costabs/output.xml
else
    echo "<eierror>"
    echo "Error occurred while executing SACO:"
    echo ""
    cat /tmp/costabs.stderr
    echo "</eierror>"
fi
