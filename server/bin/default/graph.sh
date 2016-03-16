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

echo "<printonconsole>"
echo "<content format='dygraph'>"
echo '[{"groups":["Group 1","Group 2","Group 3"],"labels":["Label 1","Label 2"]},{"groups":["Group 2","Group 4"],"labels":["Label 3","Label 2"]}]'

echo "</content>"
echo "</printonconsole>"

echo "</eicommands>"
echo "</eiout>"


