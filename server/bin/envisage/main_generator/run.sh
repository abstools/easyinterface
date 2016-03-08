#! /bin/bash

. envisage/envisage_settings.sh

. default/parse_params.sh

export CLASSPATH=/vagrant/frontend/dist/absfrontend.jar:$CLASSPATH

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


if [ !  -z  $abs  ] && [ !  -z $spec ] && [ !  -z $json ]; then
	python /home/vagrant/main_generator/abs_deployer/abs_deployer.py $abs $spec $json

else
	echo "<eiout>"
	echo "<eicommands>"
	echo "<dialogbox outclass='error' boxtitle='Error!'>"
	echo " <content format='html'>"
	echo
	echo " <ul>"
	echo "<li><span style='color: red'>Three input files (.abs, .spec, and .json) are required.</span></li>"
	echo "</ul>"
	echo "</content>"
	echo "</dialogbox>"
	echo "</eicommands>"
	echo "</eiout>"
fi




