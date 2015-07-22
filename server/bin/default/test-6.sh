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
echo "</eicommands>"

echo "<eiactions>"
echo '<oncodelineclick  outclass="'$levelout'">'
echo '<lines><line from="20" /></lines>'
echo '<eicommands>'
echo '<highlightlines>'
echo '<lines>'
echo '<line from="20" to="25"/>'
echo '</lines>'
echo '</highlightlines>'
echo '<dialogbox boxtitle="Hey!">'
echo '<content format="html">'
echo 'Click on the marker again to close this window'
echo '</content>'
echo '</dialogbox>'
echo '</eicommands>'
echo '</oncodelineclick>'
echo "</eiactions>"

echo "</eiout>"


