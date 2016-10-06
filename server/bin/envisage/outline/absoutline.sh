#!/bin/bash

. envisage/envisage_settings.sh

java -jar $ABSFRONTEND -outline $@ 2> /tmp/absoutline.stderr

if [ $? == 1 ]; then
    echo "<eiout>"
    echo "<eicommands>"
    echo "<printonconsole consoleid='Error'>"
    echo "<content format='text'><![CDATA[ There are some errors!"
    cat /tmp/absoutline.stderr
    echo "]]></content>"
    echo "</printonconsole>"
    echo "<dialogbox boxtitle='Execution Error' boxwidth='400'>"
    echo "<content format='html'>"
    echo "<span style='color:red;' >Execution Error</span>"
    echo "</content>"
    echo "</dialogbox>"
    echo "</eicommands>"
    echo "</eiout>"
fi

\rm -f /tmp/absoutline.stderr
