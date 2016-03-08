#! /bin/bash

. envisage/envisage_settings.sh
. default/parse_params.sh
export CLASSPATH=/vagrant/frontend/dist/absfrontend.jar:$CLASSPATH

abs=""
for f in $files 
do
	ext=${f##*.}
	if [ $ext = "abs" ]; then
		abs=$f
	fi;
done


if [ !  -z  $abs  ]; then
	python /home/vagrant/smart_deployer/abs_deployer/abs_deployer.py $abs

else
	echo "<eiout>"
	echo "<eicommands>"
	echo "<dialogbox outclass='error' boxtitle='Error!'>"
	echo " <content format='html'>"
	echo
	echo " <ul>"
	echo "<li><span style='color: red'>File .abs missing</span></li>"
	echo "</ul>"
	echo "</content>"
	echo "</dialogbox>"
	echo "</eicommands>"
	echo "</eiout>"
fi



