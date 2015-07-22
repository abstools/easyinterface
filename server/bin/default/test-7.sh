#!/bin/bash

exec `dirname $0`/parse_params.sh

echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"
echo '<printonconsole consoleid="1" consoletitle="Welcome">'
echo '<content format="html">'
echo '<span style="color: red;" id="error1">10 errors</span> were found in the file program.abs'
echo '</content>'
echo '</printonconsole>'
echo "</eicommands>"

echo "<eiactions>"
echo '<onclick>'
echo '<elements>'
echo '<selector value="#error1"/>'
echo '</elements>'
echo '<eicommands>'
echo '<dialogbox boxtitle="Errors">'
echo '<content format="html">'
echo 'There are some variables used but not declated'
echo '</content>'
echo '</dialogbox>'
echo '</eicommands>'
echo '</onclick>'
echo "</eiactions>"

echo "</eiout>"


