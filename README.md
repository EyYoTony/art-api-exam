# Art API

## Getting Started
  This guide will show you how to start up your own version of this API server

### Clone the repo
  First you need to make a local copy of the repo:
  - `git clone https://github.com/EyYoTony/instruments-api-mock-exam.git <directory name>`
  - `cd <directory name>`

### Install dependencies
  Now you need to install all of the node modules required to run the API <br />
  You can either run `npm install` or `yarn` <br />
  I use `npm install`, because yarn doesn't want to cooperate with a windows env

### Establish environment variables
  You now need to add a **.env** file to store your environment variables <br />
  This file name is already in the **.gitignore** file, so it won't show up in your own git repo <br />
  Now fill the **.env** file like this:
  > COUCHDB_URL=(DB url) </br>
  > COUCHDB_NAME=(DB name) </br>
  > PORT=(default port) </br>
  > MYSQL_HOST=(mysql DB host, defaults: 0.0.0.0 or 127.0.0.1)
  > MYSQL_USER=(mysql DB name)
  > MYSQL_PASSWORD=(mysql DB password)
  > MYSQL_DATABASE=(mysql DB name)

### Load data
  There is a **load-data.js** file to help you fill your couch db with example data </br>
  You can run this file by either using the `npm run load` or `node load-data.js` commands

  There is a **art.sql** file in the sql-scripts folder which will make and fill a SQL database </br>
  You can run this file by using the following commands:
  > cd sql-scripts </br>
  > $ mysql < art.sql -u root -p -h 127.0.0.1 -P 3306

  If you used Docker to install mySQL the host defaults to 0.0.0.0

### Load indexes
  To load indexes into your pouchdb, run the `load-indexes.js` file. </br> You can either use the `npm run loadIndex` or `node load-indexes.js` commands </br> **art.sql** will already load indexes into your mySQL DB.
### Start the API
  Finally to start the API, run the `npm start` command
