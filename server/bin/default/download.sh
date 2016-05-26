#!/bin/bash

mkdir $1
touch $1/pepe
touch $1/pepe.avi

touch $1/terminated


echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received a download request with token:"
echo $2
echo "</content>"
echo "</printonconsole>"
echo "<printonconsole>"
echo "<content format='html'><![CDATA["
echo '<a id="linkpepe" href="#"> CLICK HERE </a>'
echo "]]></content>"
echo "</printonconsole>"
echo "<download execid='"$2"' filename='pepe' />"
echo "</eicommands>"
echo "<eiactions>"
echo '<onclick>'
echo '<elements>'
echo '<selector value="#linkpepe"/>'
echo '</elements>'
echo '<eicommands>'
echo "<download execid='"$2"' filename='pepe' />"
echo '</eicommands>'
echo '</onclick>'
echo "</eiactions>"
echo "</eiout>"
