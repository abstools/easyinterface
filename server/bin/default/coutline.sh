#!/bin/bash

echo $@ > /tmp/xxx
rootdir=$1/_ei_files
shift

for f in $@; do 
    module=${f#$rootdir/}
    echo "<category text=\"$module\" selectable=\"false\">"

    # MAKE SURE YOU'VE A RECENT VERSION OF awk that include the match
    # function with 3 arguments. E.g., GNU Awk 4.0.0
    #
    cat $f | awk -v module=$module '{ 
       if (match($0,/(int|void)[\ ,\t]+([a-z,A-Z,0-9,_]+)[\ ,\t]*\(.*\).*/,m)) {
          print "<category text=\"" m[2] "\" value=\"" module ":" m[2] "\" selectable=\"true\"/>"; 
       }
}
'
    echo "</category>"
done
