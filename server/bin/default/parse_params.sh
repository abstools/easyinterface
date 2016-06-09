#!/bin/bash
curr_flag=""

whattocount="lines"
showoutline=0
levelout="info"
rootdir=""
files=""
entities=""

for i in "$@"
do
case $i in
    -f) curr_flag="f"
	;;
    -r) curr_flag="r"
	;;
    -e) curr_flag="e"
        ;;
    -c) curr_flag="c"
        ;;
    -s) curr_flag="s"
	;;
    -l) curr_flag="l"
        ;;
     *) case $curr_flag in 
	    f) files="$files $i"
	       ;;
            r) rootdir="$i"
	       curr_flag=""
	       ;;
            e) entities="$entities $i"
	       ;;
            c) whattocount="$i"
	       curr_flag=""
	       ;;
	    l) levelout="$i"
	       curr_flag=""
	       ;;
            s)
    	       showoutline="$i"
	       curr_flag=""
	       ;;
	    *) echo "Invalid parameters"
	       exit
	       ;;
	esac
	;;
esac
done
