#! /bin/bash

. misc/parse_params.sh
. envisage/envisage_settings.sh

execroot=$(getparam "execroot")
streamroot=$execroot/_ei_stream
execid=$(getparam "execid")
files=$(getparam "files")
timeout=$(getparam "timeout")
refresh=$(($(getparam "refreshrate")*1000))
refreshrate=$(($(getparam "refreshrate")))
outdir=$execroot/_ei_tmp
mainprog=$(getparam "mainblock")

echo "<eiout>"
echo "<eicommands>"

olddir=`pwd`
cd $HABSHOME
./dist/build/habs/habs -o $outdir $files &> $outdir/habs.stderr
env HOME=$outdir cabal exec ghc -- --make $outdir/*.hs -main-is $mainprog &> $outdir/habs.stderr

if [ $? == 0 ]; then

    echo "<printonconsole consoleid='erlexec' consoletitle='Output'>"
    echo "<content format='text' execid='$execid' ext='out' refreshrate='$refresh' action='append'>"
    echo "The source files were successfully compiled to Haskell!"
    echo "Starting the execution of the Haskell code."
    echo ""
    echo "</content>"
    echo "</printonconsole>"
    cd $olddir
    envisage/habs/habs_run.sh $execroot $execid $timeout $refreshrate $mainprog &> /dev/null &
    echo $! > $streamroot/pid


    echo "</eicommands>"

else
    echo "<printonconsole>"
    echo "<content format='text'><![CDATA[ There are some errors!"
    cat $outdir/habs.stderr
    echo "]]></content>"
    echo "</printonconsole>"
    echo "</eicommands>"
fi

echo "</eiout>"

\rm -f $streamroot/erlangbackend.stderr
