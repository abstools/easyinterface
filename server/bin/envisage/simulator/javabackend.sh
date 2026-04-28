#! /bin/bash

. misc/parse_params.sh
. envisage/envisage_settings.sh

execroot=$(getparam "execroot")
downloadroot=$execroot/_ei_download
streamroot=$execroot/_ei_stream
execid=$(getparam "execid")
files=$(getparam "files")
enabledownload=$(getparam "download")
enablestats=$(getparam "stats")
timeout=$(getparam "timeout")
refresh=$(($(getparam "refreshrate")*1000))
refreshrate=$(($(getparam "refreshrate")))

outdir=$streamroot/java
outzip=$downloadroot/java.zip


echo "<eiout>"
echo "<eicommands>"

# The Java backend can generate multiple Main blocks and we need to
# know which one we want to run.  When generating a jar file the
# compiler chooses one, so that's what we do.
env HOME="$outdir" "$ABSTOOLSHOME"/frontend/bin/bash/absc -v --java -d "$outdir" $files -o "$outdir"/model.jar &> "$streamroot"/javabackend.stderr

if [ $? == 0 ]; then

    echo "<printonconsole consoleid='erlexec' consoletitle='Output'>"
    echo "<content format='text' execid='$execid' ext='out' refreshrate='$refresh' action='append'>"
    echo "The source files were successfully compiled to Java!"
    echo "Starting the execution of the Java code."
    echo ""
    echo "</content>"
    echo "</printonconsole>"

    envisage/simulator/javabackend_run.sh $streamroot $execid $timeout $refreshrate $enablestats &> /dev/null &
    echo $! > $streamroot/pid

    if [ $enablestats == "yes" ]; then
	echo "<printonconsole consoleid='erlstats' consoletitle='Statistics'>"
	echo "<content format='graph' execid='$execid' ext='stat' refreshrate='$refresh' action='replace'>"
	echo "</content>"
	echo "</printonconsole>"
    fi

    if [ $enabledownload == "yes" ]; then
	cd $streamroot
	zip -r $outzip java
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
	echo "<download execid='$execid' filename='java.zip' />"
	echo "</eicommands>"
	echo "</onclick>"
	echo "</eiactions>"
    fi

else
    echo "<printonconsole>"
    echo "<content format='text'><![CDATA[ There are some errors!"
    cat $streamroot/javabackend.stderr
    echo "]]></content>"
    echo "</printonconsole>"
    echo "</eicommands>"
fi

echo "</eiout>"

\rm -f $streamroot/javabackend.stderr
