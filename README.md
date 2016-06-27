**TreeView**
===================
----------


Description
-------------

TreeView is a webapp which is designed following the problem statement of **"Passport Programming Challenge"** described below hosted by **"PassportParking, Inc"**. TreeView allows user to create tree structure with root element and two sub-levels. It provides realtime updates to all the users connected to the webapp.

> **Problem Statement**

> - Create a web UI with a treeview control that allows multiple users to connect and see the same structure from different locations.
> - Allow each user to create/delete nodes in the tree.
> - Live update (Realtime update) all connected users with any changes to the tree.
> - The treeview will always have a Root and should allow for 2 sublevels – Parent(Factory) and Child(Numbers).
	1. Each Factory will have the following properties when created:
		* The name of the factory
		* The random number pool (the inclusive set of numbers from which to choose, Ex: 30 to 200, including 30 and 200) 
> - The child nodes for each factory represent the factory output ­> the Numbers.
> - A way to create a Factory. (Right Click form is shown here, you can have anything. Ex: a create button on the Root) 
> - A way for the generator to run on a Factory. (Again, Right Click Form is shown here)
	1. The input should be the count of Numbers to create (only allow 1 to 15 in the count).
	2. The Numbers don’t have to be unique but have to be randomly generated from the pool.
	3. When the Numbers are created, have them created as nodes below the factory and also remove any previous nodes from previous generator run.
> - Utilize a database so that the information is saved (persistent)
> - Should be able to close your web UI and reconnect with it, in its current state. See that it:
	1. Has the current tree data. (Changes made by others)
	2.  [[ Possible location for awesomeness ]]
> - Your project should be hosted on the web. Use a service such as DigitalOcean, Amazon AWS, or Heroku to host/run your submission.

Table of contents
-------------
1. Dependencies
2. Setup


###Dependencies

1. Nodejs
2.  Mongodb


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
		
