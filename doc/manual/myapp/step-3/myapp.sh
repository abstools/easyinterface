#!/bin/bash

. misc/parse_params.sh
files=$(getparam "f")

echo "I've received the following command-line parameters:"
echo ""
echo "  $@"

echo ""
echo "File statistics:"
echo ""
for f in $files 
do
   echo " - $f has " `wc -l $f | awk '{print $1}'` "lines"
done

entities=$(getparam "e")

echo ""
echo "Selected entities:"
echo ""
for e in $entities 
do
   echo "- $e"
done
