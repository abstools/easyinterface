#! /bin/bash

. envisage/envisage_settings.sh

streamroot=$1
shift
execid=$1
shift
outdir=$streamroot/erlang


echo "<eiout>"
echo "<eicommands>"

env HOME=$outdir $ABSTOOLSHOME/frontend/bin/bash/absc -v -erlang -d $outdir $@ &> /tmp/erlangbackend.stderr

if [ $? == 0 ]; then
    echo "<stream  execid='$execid' time='1000'>"
    echo '<content format="text">'
    echo 'The source files were successfully compiled to ErLang!'
    echo 'Starting the simulation'
    echo ''
    echo '</content>'
    echo '</stream>'
    envisage/simulator/erlangbackend_run.sh $streamroot $execid &> /dev/null &
else
    echo "<printonconsole>"
    echo "<content format='text'>![CDATA[ There are some errors!"
    cat /tmp/erlangbackend.stderr
    echo "]]</content>"
    echo "</printonconsole>"
fi

echo "</eicommands>"
echo "</eiout>"

\rm -f /tmp/erlangbackend.stderr
 

