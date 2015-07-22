#! /bin/bash

. `dirname $0`/../envisage_settings.sh  # this file is located in server/bin/envisage


echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"

java -jar $ABSFRONTEND $@ 2> /tmp/abssyntaxchecker.stderr

if [ $? == 0 ]; then
    echo "Your program compiles correctly!!"
else
    echo "Your program does not compile correctly!! The following errors were reported:"
    echo ""
    cat /tmp/abssyntaxchecker.stderr
fi

echo "</content>"
echo "</printonconsole>"
echo "</eicommands>"
echo "</eiout>"

\rm -f /tmp/abssyntaxchecker.stderr
