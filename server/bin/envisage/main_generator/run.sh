#! /bin/bash

. envisage/envisage_settings.sh

. default/parse_params.sh

export CLASSPATH=$ABSFRONTEND:$CLASSPATH

abs=""
spec=""
json=""

for f in $files 
do
	ext=${f##*.}
	if [ $ext = "abs" ]; then
		abs=$f
	elif [ $ext = "spec" ]; then
		spec=$f
	elif [ $ext = "json" ]; then
		json=$f
	fi;
done

echo "<eiout>"
echo "<eicommands>"

if [ !  -z  $abs  ] && [ !  -z $spec ] && [ !  -z $json ]; then
	cd /home/vagrant/main_generator/abs_deployer
	python abs_deployer $abs $spec $json

else
	echo "<dialogbox outclass='error' boxtitle='Error!'>"
	echo " <content format='html'>"
	echo
	echo " <ul>"
	echo "<li><span style='color: red'>Three input files (.abs, .spec, and .json) are required.</span></li>"
	echo "</ul>"
	echo "</content>"
	echo "</dialogbox>"
fi


echo "</eicommands>"
echo "</eiout>"


