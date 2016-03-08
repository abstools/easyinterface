#! /bin/bash

. envisage/envisage_settings.sh

. default/parse_params.sh
export CLASSPATH=$ABSFRONTEND:$CLASSPATH

abs=""

for f in $files 
do
	ext=${f##*.}
	if [ $ext = "abs" ]; then
		abs=$f
	fi;
done

echo "<eiout>"
echo "<eicommands>"

if [ !  -z  $abs  ]; then
	cd /home/vagrant/smart_deployer/abs_deployer
	python abs_deployer $abs

else
	echo "<dialogbox outclass='error' boxtitle='Error!'>"
	echo " <content format='html'>"
	echo
	echo " <ul>"
	echo "<li><span style='color: red'>File .abs missing</span></li>"
	echo "</ul>"
	echo "</content>"
	echo "</dialogbox>"
fi

echo "</eicommands>"
echo "</eiout>"


