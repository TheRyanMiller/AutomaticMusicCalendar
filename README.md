0# Automated Music Calendar 
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)


Automated Music Calendar (AMC) is a MERN app built to collect, organize, and present a schedule of upcoming local live music events. While I wrote this app originally to serve the Charleston, South Carolina music scene, AMC was flexibly designed to be open source, and pluggable with any source sites. To do so, simply fork the project, add some custom scrapers, and update some configuration parameters and add custom scrapers. scrape event data from any set of websites you want, simply write a scraper and add it to the configuration directory. Scraped events are pushed to the database, and automatically presented 

## Installation
AMC requires a running instance of [MongoDB](https://docs.mongodb.com/guides/server/install/). Mongo setup is outside the scope of this guide, but connection details can be found in the `.env` file at the project root.
Once variables are setup, AMC is ready to run out of the box. It comes packaged with default scrapers which pull data from several Charleston, SC music venues. If you would like to pull event from different sources, simply add or remove scrapers from the `/scrapers` directory. Instructions on how to write a custom scraper can be found below. Once satisfied, you can start the app by running these commands from your terminal.

> Clone the repo to your local machine
```
$   git clone https://github.com/TheRyanMiller/CharlestonLiveMusicCalendar.git
```
> Change into the project directory and install the server-side NPM packages, and then the client-side NPM packages.
```
$   cd CharlestonLiveMusicCalendar
$   npm install
$   cd client
$   npm install
```
> Issue this command from the `/client` directory to launch the app locally
```
$   npm run
```
## Configuration

### Firebase Authentication
By default, AMC uses Firebase to offer users the ability to login via Facebook and Google. If you intend to allow logins, you will need to setup a Firebase account and project. See [here](https://firebase.google.com/docs/auth) for details.


### Server Environment Variables
Create an `.env` file at the project root, and set the following variables. An example file has been provided `./envExample`.

`MONGO_URL_DEV=`[MongoDB connection string] e.g. mongodb://localhost:27017/chslivemusic  
`API_PORT=`3001

### Client Environment Variables

`REACT_APP_FIREBASE_API_KEY=`[Your Personal Firebase API Key]  
`REACT_APP_FIREBASE_AUTH_DOMAIN=`[Your personal Firebas Auth Domain]  
`REACT_APP_PROJECT_ID=`[Firebase Project ID]  
`REACT_APP_API=`[Your AMC Server API] e.g. localhost:3001/api




## Custom Scrapers
Several scrapers come packaged in this repository by default
1. They Royal American
2. The Pour House
3. The Music Farm
4. Tin Roof

Even if you choose not to use these specific scrapers, they may still prove useful to you as examples of how to write your own.
Each event event item can contain the following properties:

`_id` String. Unique event identifier.  
`title` String. Title of event, typically the headline act  
`openers` String. Single string list of opening acts.  
`infoLink` String. Direct link to event on source site   
`fee` String. Price of admission or cover charge  
`showUrl`  String. URL to event  
`location`  String. Location of event - string  
`doorsTime`  String. Time of doors (e.g. "7pm").  
`showTime`  String. Time of show (e.g. "8pm").  
`time` Date. Time of event  
`locAcronym` String. Location acronymn identifier associated with event location  
`ticketLink`  String. Ticket Link.
`updateDate` Date. Current date (```new Date()```)

