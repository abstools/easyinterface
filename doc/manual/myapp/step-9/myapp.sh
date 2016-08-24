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
echo "<ul>"

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
echo "</eiout>"
