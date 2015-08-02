# Installing EasyInterface

EasyInterface consists of 

 * an applications server where you install and configure your applications; and 
 * several clients (web, eclipse, etc.) that provide access to the applications installed on the server.

Next we explain how to install the EasyInterface server and how to use the different clients. Note that the server comes with several simple applications installed, for the purpose of demonstrating various features. To integrate your own application refer to the user manual [docs/manual.pdf](file://docs/manual.pdf).

In what follows we assume that you have already downloaded EasyInterface into a directory called `easyinterface`, and that files inside this directory have read and execute permissions to `others` which can be done, for example, in Unix based systems by executing:

	> chmod -R 755 easyinterface

## Installing the EasyInterface Server

The installation consists in installing an `Apache Web Server` (with `PHP` enabled) and then configuring it to recognize the EasyInterface directory. If you already have Apache installed and the `easyinterface` directory is placed in a visible directory then no further configuration is required, simply visit the corresponding address (e.g., if it is placed in the `public_html` directory, visit [http://localhost/~user/easyinterface](http://localhost/~user/easyinterface)). Otherwise follow the steps below depending on the operating system you are using, `Linux`, `OS X` or `Windows`.

### Linux

Installing Apache depends on the Linux distribution you are using, for
example, if you are using Ubuntu you can install it by executing the
following in a shell:

    > sudo apt-get update
    > sudo apt-get install apache2
    > sudo apt-get install php5 libapache2-mod-php5 php5-mcrypt
    > sudo service apache2 start

Once installed test that it works correctly by visiting [http://localhost](http://localhost) and test that PHP works correctly by visiting [http://localhost/info.php](http://localhost/info.php) (this address might be different from one distribution to another). Next, to make the `easyinterface` visible, edit `/etc/apache2/mods-enabled/alias.conf` and add the following lines:

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

or from `System Preferences > Sharing > Web Sharing`.  Now visit [http://localhost/ei](http://localhost/ei) to check that EasyInterface works correctly.


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
	
and visit [http://localhost/ei](http://localhost/ei) to check that EasyInterface works correctly. If you have permission problems when accessing this address, try to remove the file `easyinterface/.htaccess`.

**IMPORTANT**: the demo application that come by by default with 
EasyInterface are basically bash scripts, and thus you need to install [win-bash](http://win-bash.sourceforge.net/) if you want to use them simply by downloading the corresponding `zip` file and extracting it in `c:\bash` -- these applications assume that win-bash is installed in `c:\bash`, in particular `c:\bash\bash.exe` is used to execute them.

## Installing the EasyInterface Clients

### The Web-Client

Just visit [http://localhost/ei/clients/web](http://localhost/ei/clients/web)

### The Eclipse Client

Not available yet

### The Remote-Shell Client

Not available yet