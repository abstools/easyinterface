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
echo "<writefile filename='h/basico.txt' overwrite='true' ><![CDATA["
echo "File create with a command"
echo "be careful with slashes and other special characters"
echo "//I'm sure they want to be your friends."
echo "]]></writefile>"
echo '</eicommands>'
echo "</eiout>"


