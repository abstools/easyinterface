#! /bin/bash

outdir=$1
csize=$2
fnext=$3
fncounter="0"

while read -r x; 
do
((fncounter++))
fname="$outdir/$fncounter"

echo $x > $fname
l=0;
while read -t 0.01 -r x; 
do
    echo $x >> $fname
    ((l++))
    if [ $l -gt $csize ]
    then 
	break
    fi
done
\mv $fname $fname.$fnext
done
