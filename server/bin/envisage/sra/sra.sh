#!/bin/bash

### A wrapper script for SACO's Resource Usage Analysis
###
###

# execute envisage_settings.sh to set some environment variables, etc.
#

. envisage/envisage_settings.sh

echo "<eiout>"
echo "<eicommands>"

java -Xmx512m -jar $SRAHOME/lib/ResourceAnalysis-1.0.jar $2 $1/out.bt $1/out.ec  &> /tmp/sra.stderr
echo $? >/tmp/xxxxxxxmore 
if [ $? != 0 ]; then
    echo "<printonconsole>"
    echo "<content format='text'>"
    echo "<![CDATA["
#   echo "Something went wrong when applying SRA"
    #cat  /tmp/sra.stderr
    echo "]]>"
    echo "</content>"
    echo "</printonconsole>"
else
    $COFLOCOHOME/bin/cofloco -i  $1/out.ec -conditional_ubs -v 0 &> $1/out.ubs
    if [ $? != 0 ]; then
	echo "<printonconsole>"
	echo "<content format='text'>"
	echo "Something went wrong when applying COFLOCO"
	echo "<![CDATA["
#	cat  $1/out.ubs
	echo "]]>"
	echo "</content>"
	echo "</printonconsole>"
    else
	echo "<printonconsole consoleid='srabt' consoletitle='Types'>"
	echo "<content format='text'>"
	echo "<![CDATA["
	cat  $1/out.bt 
	echo "]]>"
	echo "</content>"
	echo "</printonconsole>"
	
	echo "<printonconsole consoleid='sraec' consoletitle='Equations'>"
	echo "<content format='text'>"
	echo "<![CDATA["
	cat $1/out.ec 
	echo "]]>"
	echo "</content>"
	echo "</printonconsole>"
	
	echo "<printonconsole consoleid='sraubs' consoletitle='UBs'>"
	echo "<content format='text'>"
	echo "<![CDATA["
	cat $1/out.ubs 
	echo "]]>"
	echo "</content>"
	echo "</printonconsole>"
	
	echo "<printonconsole>"
	echo "<content format='text'>"
	echo "Resource Analysis (SRA) was successfully applied!"
	echo "The behavioral types, equations and upper bounds are in the corresponding tabs."
	echo "</content>"
	echo "</printonconsole>"
    fi
fi


echo "</eicommands>"
echo "</eiout>"
