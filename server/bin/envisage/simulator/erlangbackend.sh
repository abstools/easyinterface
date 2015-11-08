#! /bin/bash

. misc/parse_params.sh
. envisage/envisage_settings.sh

streamroot=$(getparam "streamroot")
execid=$(getparam "execid")
files=$(getparam "files")
timeout=$(getparam "timeout")

outdir=$streamroot/erlang


echo "<eiout>"
echo "<eicommands>"

env HOME=$outdir $ABSTOOLSHOME/frontend/bin/bash/absc -v -erlang -d $outdir $files &> /tmp/erlangbackend.stderr

if [ $? == 0 ]; then
    echo "<stream  execid='$execid' time='1000' consoletitle='Simulator (Erlang)'>"
    echo "<content format='text'>"
    echo "The source files were successfully compiled to Erlang!"
    echo "Starting the execution of the Erlang code."
    echo ""
    echo "</content>"
    echo "</stream>"
    envisage/simulator/erlangbackend_run.sh $streamroot $execid $timeout &> /dev/null &
    echo $! > $streamroot/pid
else
    echo "<printonconsole>"
    echo "<content format='text'><![CDATA[ There are some errors!"
    cat /tmp/erlangbackend.stderr
    echo "]]></content>"
    echo "</printonconsole>"
fi

echo "</eicommands>"
echo "</eiout>"

\rm -f /tmp/erlangbackend.stderr
