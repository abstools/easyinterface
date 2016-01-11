#! /bin/bash

outdir=$1
csize=$2
fnext="ei"
fncounter="0"

while read -r x; 
do
((fncounter++))
fname="$outdir/$fncounter"

#echo "<printonconsole>" > $fname
#echo "<content format='text'><![CDATA[" >> $fname
echo $x > $fname
l=0;
while read -t 2 -r x; 
do
    echo $x >> $fname
    ((l++))
    if [ $l -gt $csize ]
    then 
	break
    fi
done
#echo "]]></content>" >>  $fname
#echo "</printonconsole>" >> $fname
\mv $fname $fname.$fnext
done
