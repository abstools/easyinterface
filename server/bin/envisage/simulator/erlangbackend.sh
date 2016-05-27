#! /bin/bash

. misc/parse_params.sh
. envisage/envisage_settings.sh

streamroot=$(getparam "streamroot")
downloadroot=$(getparam "downloadroot")
execid=$(getparam "execid")
files=$(getparam "files")
mode=$(getparam "mode")
timeout=$(getparam "timeout")
refresh=$(($(getparam "refreshrate")*1000))

outdir=$streamroot/erlang
outzip=$downloadroot/erlang.zip

echo "<eiout>"
echo "<eicommands>"

env HOME=$outdir $ABSTOOLSHOME/frontend/bin/bash/absc -v -erlang -d $outdir $files &> /tmp/erlangbackend.stderr

if [ $? == 0 ]; then
    if [$mode == "download" ]; then
	zip -r $outzip $outdir
	echo "<printonconsole>"
	echo "<content format='html'><![CDATA["
	echo "<a id='erlzip$execid' href='#'> Click here to download zip </a>"
	echo "]]></content>"
	echo "</printonconsole>"
	echo "</eicommands>"
	echo "<eiactions>"
	echo '<onclick>'
	echo '<elements>'
	echo '<selector value="#erlzip$execid"/>'
	echo '</elements>'
	echo '<eicommands>'
	echo "<download execid='$execid' filename='erlang.zip' />"
	echo '</eicommands>'
	echo '</onclick>'
	echo "</eiactions>"
    else
	echo "<printonconsole consoleid='erlexec' title='Output'>"
	echo "<content format='text' streamid='$execid' streamext='out' streamtimeout='$refresh' streamaction='append'>"
	echo "The source files were successfully compiled to Erlang!"
	echo "Starting the execution of the Erlang code."
	echo ""
	echo "</content>"
	echo "</printonconsole>"
	echo "<printonconsole consoleid='erlstats' title='Statistics'>"
	echo "<content format='dygraph' streamid='$execid' streamext='stat' streamtimeout='$refresh' streamaction='append'>"
	echo "</content>"
	echo "</printonconsole>"
	envisage/simulator/erlangbackend_run.sh $streamroot $execid $timeout &> /dev/null &
	echo $! > $streamroot/pid
	echo "</eicommands>"
    fi
else
    echo "<printonconsole>"
    echo "<content format='text'><![CDATA[ There are some errors!"
    cat /tmp/erlangbackend.stderr
    echo "]]></content>"
    echo "</printonconsole>"
    echo "</eicommands>"
fi

echo "</eiout>"

\rm -f /tmp/erlangbackend.stderr
