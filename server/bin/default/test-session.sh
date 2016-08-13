#!/bin/bash

dir=$1
cd $dir
numfiles=(*)
if [ "$numfiles" != "*" ] 
then
    num=${#numfiles[@]}
else
    num=0
fi


echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"

echo ""
echo '<dialogbox boxtitle="Sessions" boxwidth="100" boxheight="100">'
echo '<content format="html">'

echo 'There are <span style="color:red">'$num'</span> files.'
echo '</content>'
echo '</dialogbox>'

echo "</eicommands>"
echo "</eiout>"

touch $dir/$num.ei
