default:
	rm -f ei.js ei.min.js
	cat *.js > tmp
	mv -f tmp ei.js
	java -jar ../../../tools/compiler.jar --js=ei.js > ei.min.js
	chmod 755 ei.min.js
	rm -f ei.js

