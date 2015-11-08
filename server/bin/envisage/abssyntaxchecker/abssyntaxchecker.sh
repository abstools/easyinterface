#! /bin/bash

. envisage/envisage_settings.sh

root=$1
shift

echo "<eiout>"
echo "<eicommands>"

java -jar $ABSFRONTEND $@ 2> /tmp/abssyntaxchecker.stderr

if [ $? == 0 ]; then
    echo "<printonconsole>"
    echo "<content format='text'>Your program compiles correctly!!</content>"
    echo "</printonconsole>"
else
    echo "<printonconsole>"
    echo "<content format='text'>There are some compilation errors! See markers in the code area!!</content>"
    echo "</printonconsole>"
    cat /tmp/abssyntaxchecker.stderr | gawk -v root=$root '{ 
    if (match($0,/(.+):([0-9]+):([0-9]+):(.*)/,m)) {
      dest = m[1]
      print "<addmarker dest=\47" dest "\47 outclass=\47error\47>"
      print "<lines><line from=\47" m[2] "\47/></lines>"
      print "<content format=\47text\47><![CDATA[" m[4] "]]></content>"
      print "</addmarker>"
    }
}
'
fi

echo "</eicommands>"
echo "</eiout>"

#\rm -f /tmp/abssyntaxchecker.stderr


