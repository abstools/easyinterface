# Installing EasyInterface

EasyInterface consists of 

 * An applications server (PHP scripts on top of a Web server) where you install and configure your applications; and 
 * Several clients (web, eclipse, etc.) that provide access to the applications installed on the server.

In what follows we explain how to install the EasyInterface server and comment on how to use the different clients. After installing the server it is recommended to read Chapter 2 of the user manual [docs/manual.pdf](file://docs/manual.pdf) which explains how to use the demo applications that come with EasyInterface through the web-client, and, moreover, develops and integrate a simple application to experiment with various features, etc.

## Downloading EasyInterface

In what follows we assume that you have already [downloaded](http://github.com/abstools/easyinterface) EasyInterface into a directory called `easyinterface`, and that all files inside this directory have read and execute permissions to `others` which can be done, for example, in Unix based systems by executing:

	> chmod -R 755 easyinterface

The purpose of this is to make these files visible to the `Apache Web Server` on which the EasyInterface serve is running. This is (most likley) not required if you're using Microsoft Windows. 

## Installing EasyInterface Server

The installation consists in installing an `Apache Web Server` (with `PHP` enabled) and then configuring it to recognize the EasyInterface directory. If you already have Apache installed and the `easyinterface` directory is placed in a visible directory then no further configuration is required, simply visit the corresponding address (e.g., if it is placed in the `public_html` directory, visit [http://localhost/~user/easyinterface](http://localhost/~user/easyinterface)). Otherwise follow the steps below depending on the operating system you are using, `Linux`, `OS X` or `Windows`.

**IMPORTANT**: once you finish installing the server, you should refer to [server/config/README.md](server/config/README.md) for further information on configuring the server.

### Linux

Installing Apache depends on the Linux distribution you are using, for example, if you are using Ubuntu you can install it by executing the following in a shell:

    > sudo apt-get update
    > sudo apt-get install apache2
    > sudo apt-get install php5 libapache2-mod-php5 php5-mcrypt
    > sudo service apache2 start

Once installed test that it works correctly by visiting [http://localhost](http://localhost) and test that PHP works correctly by visiting [http://localhost/info.php](http://localhost/info.php) (this address might be different from one distribution to another). Next, to make the `easyinterface` directory visible, edit `/etc/apache2/mods-enabled/alias.conf` and add the following lines:

	  Alias /ei "/path-to/easyinterface"

	  <Directory "/path-to/easyinterface">
	     Options FollowSymlinks MultiViews Indexes IncludesNoExec
	     AllowOverride All
	     Require all granted
	  </Directory>

To activate this change you need to restart Apache by executing the following in a shell:
    
    > sudo service apache2 restart

Now visit [http://localhost/ei](http://localhost/ei) to check that EasyInterface works correctly.

### OS X

OS X typically comes with Apache installed, and all you need is to configure it to recognize the `easyinterface` directory. To do so, edit `/etc/apache2/httpd.conf` add the following lines:

	  Alias /ei "/path-to/easyinterface"

	  <Directory "/path-to/easyinterface">
	     Options FollowSymlinks MultiViews Indexes IncludesNoExec
	     AllowOverride All
	     Require all granted
	  </Directory>

To activate this change you need to restart Apache by executing the following in a shell:
    
    > sudo apachectl restart

You can also restart Apache using `System Preferences > Sharing > Web Sharing`. Now visit [http://localhost/ei](http://localhost/ei) to check that EasyInterface works correctly.


### Microsoft Windows

Apache Web Server for Microsoft Windows is available from [a number of third party vendors](http://httpd.apache.org/docs/current/platform/windows.html#down). We have tested EasyInterface using [WampServer](http://www.wampserver.com/).

Install the [WampServer](http://www.wampserver.com/), for example in `c:\wamp`, and then edit `c:\wamp\bin\apache\apache.X.Y.Z\httpd.conf` and add the following lines to make the `easyinterface` directory visible:

	  Alias /ei "\path-to\easyinterface"

	  <Directory "\path-to\easyinterface">
	     Options FollowSymlinks MultiViews Indexes IncludesNoExec
	     AllowOverride All
	     Require all granted
	  </Directory>

Next restart the WampServer by executing

	c:\wamp\wampserver.exe -restart

Now visit [http://localhost/ei](http://localhost/ei) to check that EasyInterface works correctly. If you have permission problems when accessing this address, try to remove the file `easyinterface/.htaccess`. 

By default the server is configured to execute the demo applications in a Unix based operating system, for using them in Windows you should copy `server/config/eiserver.default.win.cfg` to `server/config/eiserver.cfg` -- for more details see [server/config/README.md](server/config/README.md). 

The demo applications are simple bash scripts, and thus you need to install [win-bash](http://win-bash.sourceforge.net/) if you want to use them. To do so, simply download the corresponding `zip` file and extract it in `c:\bash` (it is important to place it in `c:\bash` since the configuration files use `c:\bash\bash.exe`  to execute the bash scripts).


## Installing/Using EasyInterface Clients

The Web-Client can be used by visiting [http://localhost/ei/clients/web](http://localhost/ei/clients/web). For information on other clients see [clients/README.md](clients/README.md).
