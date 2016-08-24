#!/bin/bash

. misc/parse_params.sh
files=$(getparam "f")
entities=$(getparam "e")
whattocount=$(getparam "w")
showoutline=$(getparam "s")

echo "I've received the following command-line parameters:"
echo ""
echo "  $@"

echo ""
echo "File statistics:"
echo ""

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
    echo " - $f has " `wc $wcparam $f | awk '{print $1}'` $whattocount
done

if [ $showoutline == "" ]; then
    echo ""
    echo "Selected entities:"
    echo ""
    for e in $entities 
    do
       echo "- $e"
    done
fi
