#!/bin/bash

. `dirname $0`/parseparams.sh

echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"

echo '<dialogbox outclass="'$levelout'" boxtitle="Done!" boxwidth="100" boxheight="100">'
echo '<content format="html">'
echo 'text to be shown in the dialog box'
echo '</content>'
echo '</dialogbox>'


echo "</eicommands>"
echo "</eiout>"


