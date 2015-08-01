# Installing EasyInterface

EasyInterface consists of 

 * applications server, where you configure your applications; and 
 * several clients (web, eclipse, etc.) that provide access to the
   applications installed on the server.

Next we explain how to install the EasyInterface server and how to use
the different clients. The server comes with several simple
applications for the purpose of demonstrating various features, you
can refer to `docs/manual.pdf` to see how to integrate your own
applications.

In what follows we assume that you have cloned a copy of EasyInterface
into a directory called `easyinterface`.

## Installing the EasyInterface Server

The installation consists in first installing an `Apache Web Server`
(with a corresponding PHP module), and then configuring it to
recognize the EasyInterface directory. Follow the steps below
depending on if you are using `Linux`, `OS X` or `Windows`.

### Linux

Installing Apache depends on the Linux distribution you are using, for
example, if you are using Ubuntu you can install it by executing the
following in a shell:

    > sudo apt-get update
    > sudo apt-get install apache2
    > sudo apt-get install php5 libapache2-mod-php5 php5-mcrypt
    > sudo service apache2 restart

Once installed test that it works correctly by visiting
http://localhost and test that PHP works correctly by visiting
http://localhost/info.php (this link might be different from on
distribution to another).

Otherwise, edit `/etc/apache2/mods-enabled/alias.conf`
and add the following lines:

	  Alias /ei "/path-to/easyinterface"

	  <Directory "/path-to/easyinterface">
	     Options FollowSymlinks MultiViews Indexes IncludesNoExec
	     AllowOverride All
	     Require all granted
	  </Directory>

You will have to restart Apache to activate this change, which can be
done by executing the following in a shell:
    
    > sudo service apache2 restart

To test that the EasyInterface server works correctly visit
`http://localhost/ei`.

### OS X

OS X typically comes with Apache installed, and all you need is to
configure it to recognize the EasyInterface directory. This can be
done by editing `/etc/apache2/httpd.conf` to include the following
lines:

	  Alias /ei "/path-to/easyinterface"

	  <Directory "/path-to/easyinterface">
	     Options FollowSymlinks MultiViews Indexes IncludesNoExec
	     AllowOverride All
	     Require all granted
	  </Directory>

Afterwards you should restart Apache, and then visit
`http://localhost/ei` to test that EasyInterface works correctly.

### Windows

There are several third-party distributions that makes it easy to
install Apache on Windows, we have used `WAMP`. Once installed, in
`c:\wamp` for example, you need is to configure it to recognize the
EasyInterface directory which can be done by editing
`c:\wamp\bin\apache\apache.XYZ\httpd.conf` to include the following
lines:

	  Alias /ei "/path-to/easyinterface"

	  <Directory "/path-to/easyinterface">
	     Options FollowSymlinks MultiViews Indexes IncludesNoExec
	     AllowOverride All
	     Require all granted
	  </Directory>

Afterwards you should restart Apache, and then visit
`http://localhost/ei` to test that EasyInterface works correctly.

In addition, the demp application that are installed by default use
bash (since they are bash scripts), so you will also need to install
win-bash to use them -- they assume it is installed in `c:\bash\bash`.