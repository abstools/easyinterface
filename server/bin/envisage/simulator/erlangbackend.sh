#! /bin/bash

. misc/parse_params.sh
. envisage/envisage_settings.sh

streamroot=$(getparam "streamroot")
downloadroot=$(getparam "downloadroot")
execid=$(getparam "execid")
files=$(getparam "files")
enabledownload=$(getparam "download")
enablestats=$(getparam "stats")
timeout=$(getparam "timeout")
refresh=$(($(getparam "refreshrate")*1000))
refreshrate=$(($(getparam "refreshrate")))

outdir=$streamroot/erlang
outzip=$downloadroot/erlang.zip

echo "<eiout>"
echo "<eicommands>"

env HOME=$outdir $ABSTOOLSHOME/frontend/bin/bash/absc -v -erlang -d $outdir $files &> $streamroot/erlangbackend.stderr

if [ $? == 0 ]; then

    echo "<printonconsole consoleid='erlexec' consoletitle='Output'>"
    echo "<content format='text' streamid='$execid' streamext='out' streamtimeout='$refresh' streamaction='append'>"
    echo "$@"
    echo "The source files were successfully compiled to Erlang!"
    echo "Starting the execution of the Erlang code."
    echo ""
    echo "</content>"
    echo "</printonconsole>"

    envisage/simulator/erlangbackend_run.sh $streamroot $execid $timeout $refreshrate $enablestats &> /dev/null &
    echo $! > $streamroot/pid

    if [ $enablestats == "yes" ]; then
	echo "<printonconsole consoleid='erlstats' consoletitle='Statistics'>"
	echo "<content format='dygraph' streamid='$execid' streamext='stat' streamtimeout='$refresh' streamaction='replace'>"
	echo "</content>"
	echo "</printonconsole>"
    fi

    if [ $enabledownload == "yes" ]; then
	cd $streamroot
	zip -r $outzip erlang
	echo "<printonconsole consoleid='erldownload' consoletitle='Download'>"
	echo "<content format='html'>"
	echo "<span id='erlzip$execid'> Click here to download zip </span>"
	echo "</content>"
	echo "</printonconsole>"
    fi

    echo "</eicommands>"

    if [ $enabledownload == "yes" ]; then
	echo "<eiactions>"
	echo "<onclick>"
	echo "<elements>"
	echo "<selector value='#erlzip$execid'/>"
	echo "</elements>"
	echo "<eicommands>"
	echo "<download execid='$execid' filename='erlang.zip' />"
	echo "</eicommands>"
	echo "</onclick>"
	echo "</eiactions>"
    fi

else
    echo "<printonconsole>"
    echo "<content format='text'><![CDATA[ There are some errors!"
    cat $streamroot/erlangbackend.stderr
    echo "]]></content>"
    echo "</printonconsole>"
    echo "</eicommands>"
fi

echo "</eiout>"

\rm -f $streamroot/erlangbackend.stderr
