#!/bin/bash

rootdir=$1
shift

for f in $@; do 
    module=${f#$rootdir/}
    echo "<category text=\"$module\" selectable=\"false\">"
    cat $f | awk -v module=$module '{ if (match($0,/(int|void)[\ ,\t]+([a-z,A-Z,0-9,_]+)[\ ,\t]*\(.*\).*/,m)) {	print "<category text=\"" m[2] "\" value=\"" module ":" m[2] "\" selectable=\"true\"/>"; }}'
    echo "</category>"
done
