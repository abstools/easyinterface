#!/bin/bash

##. default/parse_params.sh


TEXTO="<printonconsole>
<content format='text'>
Hi!
</content>
</printonconsole>"

echo $TEXTO > $1/C1.tmp

TEXTO="<printonconsole>
<content format='text'>
I'm not a horse.
</content>
</printonconsole>"

echo $TEXTO > $1/C2.tmp


TEXTO="<printonconsole>
<content format='text'>
Happy Weekend!
</content>
</printonconsole>"

echo $TEXTO > $1/C3.tmp


./default/stream.sh $1 &> /dev/null &
echo $! > $1/pid


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


