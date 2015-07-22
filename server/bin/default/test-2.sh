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

echo '<addmarker outclass="'$levelout'">'
echo '<lines>'
echo '<line from="4" />'
echo '</lines>'
echo '<content format="text">'
echo 'text to associated to the marker'
echo '</content>'
echo '</addmarker>'

echo "</eicommands>"
echo "</eiout>"


