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
echo "<content format='graph'>"
#echo '{"graphs":['
echo '{"f-titles":["X","Y1","Y2"],"y-title":"test","groups":["Group 1","Group 2","Group 3"],"labels":["Label 1","Label 2"],"title":"slave 2","values":[[22,0,1],[23,1,1],[24,1,1],[25,1,1],[26,0.9466666666666667,1]]}'
#echo ','
echo '{"f-titles":["X","Y1","Y2"],"x-title":"testa","groups":["Group 2","Group 4"],"labels":["Label 3","Label 2"],"title":"slave 1","values":[[22,0,1],[23,1,1],[24,1,1],[25,1,1],[26,0.9466666666666667,1]]}'
#echo ']}'
echo "</content>"
echo "</printonconsole>"

echo "</eicommands>"
echo "</eiout>"


