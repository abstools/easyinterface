#!/bin/bash

##. default/parse_params.sh


TEXTO='<p>My mother has <span style="color:blue">blue</span> eyes.</p>' 

echo $TEXTO > $1/_ei_tmp/C1.tmp

TEXTO=' <div style="background-color:black; color:white; padding:20px;"><h2>London</h2><p>London is the capital city of England. It is the most populous city in the United Kingdom, with a metropolitan area of over 13 million inhabitants.</p></div>'

echo $TEXTO > $1/_ei_tmp/C2.tmp


TEXTO='<h1>My <span style="color:red">Important</span> Heading</h1>'

echo $TEXTO > $1/_ei_tmp/C3.tmp

TEXTO='{"f-titles":["X","Y1","Y2"],"y-title":"test","groups":["Group 5","Group 6","Group 7"],"labels":["Label 1","Label 99"],"title":"uoo","values":[[22,0,1],[23,1,1],[24,1,1],[25,1,1],[26,0.9466666666666667,1]]}'

echo $TEXTO > $1/_ei_tmp/G1.tmpgh


./default/stream.sh $1 &> /dev/null &
echo $! > $1/_ei_stream/pid


echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"

echo "<printonconsole consoleid='html'>"
echo "<content format='html' execid='$2' ext='html' refreshrate='5000'>"
echo '<p>text to associated to the marker</p>'
echo '</content>'
echo '</printonconsole>'

#echo "<printonconsole consoleid='texto'>"
#echo "<content format='text' execid='$2' ext='ei' refreshrate='5000'>"
#echo '<p>text to associated to the marker</p>'
#echo '</content>'
#echo '</printonconsole>'

echo "<printonconsole consoleid='graphs'>"
echo "<content format='graph' execid='$2' ext='gh' refreshrate='5000' action='replace'>"
echo '{"f-titles":["X","Y1","Y2"],"y-title":"test","groups":["Group 1","Group 2","Group 3"],"labels":["Label 1","Label 2"],"title":"slave 2","values":[[22,0,1],[23,1,1],[24,1,1],[25,1,1],[26,0.9466666666666667,1]]}'
echo '{"f-titles":["X","Y1","Y2"],"x-title":"testa","groups":["Group 2","Group 4"],"labels":["Label 3","Label 2"],"title":"slave 1","values":[[22,0,1],[23,1,1],[24,1,1],[25,1,1],[26,0.9466666666666667,1]]}'
echo "</content>"
echo "</printonconsole>"




echo "</eicommands>"
echo "</eiout>"


