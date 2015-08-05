#! /bin/bash

. envisage/envisage_settings.sh

echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "<![CDATA["

java -jar $ABSFRONTEND $@ 2> /tmp/abssyntaxchecker.stderr

if [ $? == 0 ]; then
    echo "Your program compiles correctly!!"
else
    echo "Your program does not compile correctly!! The following errors were reported:"
    echo ""
    cat /tmp/abssyntaxchecker.stderr
fi

echo "]]>"
echo "</content>"
echo "</printonconsole>"
echo "</eicommands>"
echo "</eiout>"

\rm -f /tmp/abssyntaxchecker.stderr
