#!/bin/bash

. `dirname $0`/../parse_params.sh

echo "<eiout>"
echo "<eicommands>"

cat <<EOF

<printonconsole  consoleid="Graph">
<content format="svg" >

<svg width="161pt" height="336pt"
 viewBox="0.00 0.00 161.00 336.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph1" class="graph" transform="scale(1 1) rotate(0) translate(4 332)">
<title>pt_info</title>
<!-- [80] -->
<g id="node1" class="node"><title>[80]</title>
<polygon  fill="blue" stroke="black" points="113,-328 59,-328 59,-292 113,-292 113,-328"/>
<text text-anchor="middle" x="86" y="-306.4" font-family="Times Roman,serif" font-size="14.00">[80]</text>
</g>
<!-- [81,80] -->
<g id="node2" class="node"><title>[81,80]</title>
<ellipse fill="green" stroke="black" cx="86" cy="-237" rx="48.0833" ry="18.3848"/>
<text text-anchor="middle" x="86" y="-233.4" font-family="Times Roman,serif" font-size="14.00">[81,80]</text>
</g>
<!-- [80]&#45;&gt;[81,80] -->
<g id="edge2" class="edge"><title>[80]&#45;&gt;[81,80]</title>
<path fill="none" stroke="black" d="M86,-291.955C86,-284.091 86,-274.675 86,-265.878"/>
<polygon fill="black" stroke="black" points="89.5001,-265.599 86,-255.6 82.5001,-265.6 89.5001,-265.599"/>
</g>
<!-- [9,81] -->
<g id="node3" class="node"><title>[9,81]</title>
<polygon fill="none" stroke="black" points="115,-182 57,-182 57,-146 115,-146 115,-182"/>
<text text-anchor="middle" x="86" y="-160.4" font-family="Times Roman,serif" font-size="14.00">[9,81]</text>
</g>
<!-- [81,80]&#45;&gt;[9,81] -->
<g id="edge4" class="edge"><title>[81,80]&#45;&gt;[9,81]</title>
<path fill="none" stroke="black" d="M86,-218.201C86,-210.332 86,-201.015 86,-192.345"/>
<polygon fill="black" stroke="black" points="89.5001,-192.231 86,-182.231 82.5001,-192.231 89.5001,-192.231"/>
</g>
<!-- [41,9] -->
<g id="node4" class="node"><title>[41,9]</title>
<polygon fill="none" stroke="black" points="77,-110 19,-110 19,-74 77,-74 77,-110"/>
<text text-anchor="middle" x="48" y="-88.4" font-family="Times Roman,serif" font-size="14.00">[41,9]</text>
</g>
<!-- [9,81]&#45;&gt;[41,9] -->
<g id="edge6" class="edge"><title>[9,81]&#45;&gt;[41,9]</title>
<path fill="none" stroke="black" d="M76.411,-145.831C72.1683,-137.792 67.0879,-128.167 62.404,-119.292"/>
<polygon fill="black" stroke="black" points="65.4811,-117.623 57.7181,-110.413 59.2904,-120.891 65.4811,-117.623"/>
</g>
<!-- [34,9] -->
<g id="node6" class="node"><title>[34,9]</title>
<polygon fill="none" stroke="black" points="153,-110 95,-110 95,-74 153,-74 153,-110"/>
<text text-anchor="middle" x="124" y="-88.4" font-family="Times Roman,serif" font-size="14.00">[34,9]</text>
</g>
<!-- [9,81]&#45;&gt;[34,9] -->
<g id="edge10" class="edge"><title>[9,81]&#45;&gt;[34,9]</title>
<path fill="none" stroke="black" d="M95.589,-145.831C99.8317,-137.792 104.912,-128.167 109.596,-119.292"/>
<polygon fill="black" stroke="black" points="112.71,-120.891 114.282,-110.413 106.519,-117.623 112.71,-120.891"/>
</g>
<!-- [62,41] -->
<g id="node5" class="node"><title>[62,41]</title>
<ellipse fill="none" stroke="black" cx="48" cy="-19" rx="48.0833" ry="18.3848"/>
<text text-anchor="middle" x="48" y="-15.4" font-family="Times Roman,serif" font-size="14.00">[62,41]</text>
</g>
<!-- [41,9]&#45;&gt;[62,41] -->
<g id="edge8" class="edge"><title>[41,9]&#45;&gt;[62,41]</title>
<path fill="none" stroke="black" d="M48,-73.9551C48,-66.0906 48,-56.6751 48,-47.8778"/>
<polygon fill="black" stroke="black" points="51.5001,-47.5995 48,-37.5995 44.5001,-47.5996 51.5001,-47.5995"/>
</g>
</g>
</svg>
</content>
</printonconsole>

EOF


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
  dest=${f#$rootdir}
  echo "<addmarker dest='$dest' outclass='error'>"
  echo "<lines><line from='1'/></lines>"
  echo "<content format='text'> text for info marker of $dest</content>"
  echo "</addmarker>"
done

for f in $files 
do
  dest=${f#$rootdir}
  echo "<highlightlines dest='$dest' outclass='info'>"
  echo "<lines><line from='5' to='10'/></lines>"
  echo "</highlightlines>"
done

for f in $files 
do
  dest=${f#$rootdir}
  echo "<addinlinemarker dest='$dest' outclass='info'>"
  echo "  <lines><line from='15' /></lines>"
  echo "  <content format='html'> Awesome line of code!!</content>"
  echo "</addinlinemarker>"
done

echo "<dialogbox outclass='info' boxtitle='Done!'  boxwidth='300' boxheight='100'>"
echo "  <content format='html'>"
echo "    The <span style='color: red'>MFA</span> analysis has been applied."
echo "    You can see the output in the result in the text area and the corresponding"
echo "    program files."
echo "  </content>"
echo "</dialogbox>"

echo "</eicommands>"

echo "<eiactions>"

for f in $files 
do
  dest=${f#$rootdir}
  echo "<oncodelineclick dest='$dest' outclass='info' >"
  echo "<lines><line from='20' /></lines>"
  echo "<eicommands>"
  echo "<highlightlines>"
  echo "<lines><line from='20' to='25'/></lines>"
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

echo "<onclick>"
echo "<elements>"
echo "<selector value='#node1'/>"
echo "</elements>"
echo "<eicommands>"
echo "<dialogbox boxtitle='Errors'> "
echo "<content format='html'>"
echo "SVG Worked!"
echo "</content>"
echo "</dialogbox>"
echo "</eicommands>"
echo "</onclick>"


echo "</eiactions>"
echo "</eiout>"


