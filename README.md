**TreeView**
===================
----------


Description
-------------

TreeView is a webapp which allows user to create tree structure with root element and two sub-levels. It provides realtime updates to all the users connected to the webapp.

Table of contents
-------------
1. Dependencies
2. Setup


###Dependencies

1. Nodejs
2. Mongodb


##Setup

1. Install nodejs 
	* For mac and windows download the installer from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
	* For Linux run this command in terminal 
		

	        sudo apt-get install nodejs

2. Install mongodb.
3. Install and configure nginx server.
4. Install bower. Run this command in terminal
	

	    npm install -g bower

5.  Clone the repository.
6. Move inside the project root path i.e, **"treeview/"**
7.  Run this command in terminal 

	    npm install 

	This will install all the **node** and **bower** dependencies for the project.
8. Inside project root path edit the file **config.json** as
	

        {
    	"port":<port no>, 
    	"mongoConnUrl": <mongodb url>/<database name>,
    	"collection":<mongodb collection name>
    	}

	Default to get started:
	
	    {
		"port":7008,
		"mongoConnUrl": "mongodb://localhost:27017/treeview",
		"collection":"factories"
		}
9.  Inside **"treeview/public/"** edit the file config.js as

	    var baseUrl = <server url>;

	Default to get started:

	    var baseUrl = 'http://localhost:7008';

10. Make sure mongodb server is running.
11. Start the app server. Inside project root path **"treeview/"** run this command in terminal,

	    node index.js
12.  Visit url specified in baseUrl by default **http://localhost:7008** in browser.
		
