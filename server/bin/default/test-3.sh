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

echo '<highlightlines outclass="'$levelout'">'
echo '<lines>'
echo '<line from="5" to="10"/>'
echo '</lines>'
echo '</highlightlines>'

echo "</eicommands>"
echo "</eiout>"


