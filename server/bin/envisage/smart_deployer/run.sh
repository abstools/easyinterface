#! /bin/bash

. envisage/envisage_settings.sh
. misc/parse_params.sh

execroot=$(getparam "execroot")
files=$(getparam "files")
outdir=$execroot/_ei_tmp

file=""
orderedfiles=""

for f in $files
do
    grep  "\[[\ ]*SmartDeploy[\ ]*:" $f > /dev/null
    if [ $? == 0 ]; then
	file=$f
	orderedfiles="$f $orderedfiles"
    else
	orderedfiles="$orderedfiles $f"
    fi
done

echo "<eiout>"
echo "<eicommands>"
echo "<printonconsole>"
echo "<content format='text'><![CDATA["

if [ $file == "" ]; then
    echo "Not found"
else
    python $SMARTDEPLOYERHOME/abs_deployer/abs_deployer.py $orderedfiles 2> $outdir/smartdeployer.stderr
    if [ ! $? == 0 ]; then
	cat $outdir/smartdeployer.stderr
    fi
fi

echo "]]></content>"
echo "</printonconsole>"
echo "</eicommands>"
echo "</eiout>"

