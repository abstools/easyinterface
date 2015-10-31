#!/bin/bash

##. default/parse_params.sh

mkdir $1/commands 


TEXTO="<eicommands><printonconsole>
<content format='text'>
11111-I've received the following command-line parameters:
</content>
</printonconsole></eicommands>"

echo $TEXTO > $1/commands/C1.tmp

TEXTO="<eicommands><printonconsole>
<content format='text'>
22222-I've received the following command-line parameters:
</content>
</printonconsole></eicommands>"

echo $TEXTO > $1/commands/C2.tmp


ROUT=`pwd`
#nohup $ROUT/default/stream.sh $1 &
touch $1/pid

sleep 2
echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"

echo "<stream  execid='$2' time='5000'>"
echo '<content format="text">'
echo 'text to associated to the marker'
echo '</content>'
echo '</stream>'

echo "</eicommands>"
echo "</eiout>"


