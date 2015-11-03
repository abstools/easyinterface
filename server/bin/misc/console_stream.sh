#! /bin/bash

outdir=$1
csize=$2
consoleid=$3
fnprefix="C"
fnext="ei"
fncounter="0"

while read -r x; 
do
((fncounter++))
fname="$outdir/$fnprefix$fncounter"

echo "<eicommands>" > $fname
echo "<printonconsole consoleid='$consoleid'>" >> $fname
echo "<content format='text'>" >> $fname
echo $x >> $fname
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
echo "</content>" >>  $fname
echo "</printonconsole>" >> $fname
echo "</eicommands>" >> $fname
\cp $fname $fname.$fnext
done
