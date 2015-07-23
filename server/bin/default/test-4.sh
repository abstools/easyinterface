#!/bin/bash

. default/parse_params.sh

echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"

echo '<addinlinemarker  outclass="'$levelout'">'
echo '<lines><line from="15" /></lines>'
echo '<content format="text">'
echo 'Text to be viewed in the inline marker'
echo '</content>'
echo '</addinlinemarker>'


echo "</eicommands>"
echo "</eiout>"


