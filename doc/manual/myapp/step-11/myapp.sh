#!/bin/bash

. misc/parse_params.sh
files=$(getparam "f")
entities=$(getparam "e")
whattocount=$(getparam "w")
showoutline=$(getparam "s")

echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'>"
echo "I've received the following command-line parameters:"
echo ""
echo "   $@"
echo "</content>"
echo "</printonconsole>"

echo "<printonconsole consoleid='stats' consoletitle='Statistics'>"
echo "<content format='html'>"
echo "File statistics:"
echo "<div>"
echo "<ul style='background: yellow;' id='files'>"

case $whattocount in
    lines) wcparam="-l"
    ;;
    words) wcparam="-w"
    ;;
    chars) wcparam="-m"
    ;;
esac

for f in $files 
do
    echo " <li> $f has " `wc $wcparam $f | awk '{print $1}'` $whattocount "</li>"
done
echo "</ul>"
echo "</div>"
echo "</content>"
echo "</printonconsole>"

if [ $showoutline == 1 ]; then
    echo "<printonconsole consoleid='outline' consoletitle='Outline'>"
    echo "<content format='html'>"
    echo ""
    echo "Selected entities:"
    echo "<ul>"
    echo ""
    for e in $entities 
    do
      echo "<li> $e </li>"
    done
    echo "</ul>"
    echo "</content>"
    echo "</printonconsole>"
fi
for f in $files 
do
  echo "<addmarker dest='$f' outclass='info'>"
  echo "<lines><line from='1'/></lines>"
  echo "<content format='text'> text for info marker of $f</content>"
  echo "</addmarker>"
done
for f in $files 
do
  echo "<highlightlines dest='$f' outclass='info'>"
  echo "<lines><line from='5' to='10'/></lines>"
  echo "</highlightlines>"
done
for f in $files 
do
  echo "<addinlinemarker dest='$f' outclass='info'>"
  echo "  <lines><line from='15' /></lines>"
  echo "  <content format='text'> Awesome line of code!! </content>"
  echo "</addinlinemarker>"
done
echo "<dialogbox  boxtitle='Done!' boxwidth='300' boxheight='100'>"
echo "  <content format='html'>"
echo "   Hurray!."
echo "   The <span style='color: red'>MFA</span> tool has been applied."
echo "  </content>"
echo "</dialogbox>"
echo "</eicommands>"
echo "<eiactions>"

for f in $files 
do
  echo "<oncodelineclick dest='$f' outclass='info' >"
  echo "<lines><line from='17' /></lines>"
  echo "<eicommands>"
  echo "<highlightlines>"
  echo "<lines><line from='17' to='19'/></lines>"
  echo "</highlightlines>"
  echo "<dialogbox boxtitle='Hey!'> "
  echo "<content format='html'>"
  echo "Click on the marker again to close this window"
  echo "</content>"
  echo "</dialogbox>"
  echo "</eicommands>"
  echo "</oncodelineclick>"
done
echo "<onclick>"
echo "<elements>"
echo "<selector value='#files'/>"
echo "</elements>"
echo "<eicommands>"
echo "<dialogbox boxtitle='Errors'> "
echo "<content format='html'>"
echo "There are some variables used but not declated"
echo "</content>"
echo "</dialogbox>"
echo "</eicommands>"
echo "</onclick>"
echo "</eiactions>"
echo "</eiout>"
