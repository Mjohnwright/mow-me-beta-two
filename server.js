require('dotenv').config()

// THIS VERSION IS SPLIT INTO 2 COMPONENTS
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')(session)
const dbConnection = require('./db') // loads our connection to the mongo database
const Job = require('./db/models/jobs')
const User = require('./db/models/user')

const passport = require('./passport')
const app = express()
const PORT = process.env.PORT || 3001

// ===== Middleware ====
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())
app.use(
	session({
		secret: process.env.APP_SECRET || "this is the default passphrase",
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		resave: false,
		saveUninitialized: false
	})
)

// ===== Passport ====
app.use(passport.initialize())
app.use(passport.session()) // will call the deserializeUser

// ===== testing middleware =====
app.use(function(req, res, next) {
	console.log('===== passport user =======')
	console.log(req.session)
	console.log(req.user)
	console.log('===== END =======')
	next()
})

/* Mongo Database
* - this is where we set up our connection to the mongo database
*/
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/mern-passport",
  {useNewUrlParser: true}
);
// mongoose.Promise = global.Promise
// let MONGO_URL
// const MONGO_LOCAL_URL = 'mongodb://localhost:27017/mern-passport'

// Loading evnironmental variables here
//Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

if (process.env.NODE_ENV === 'production') {
	console.log('loading dev environments')
	require('dotenv').config()
}

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI)
	MONGO_URL = process.env.MONGODB_URI
} else {
	mongoose.connect(MONGO_LOCAL_URL) // local mongo url
	MONGO_URL = MONGO_LOCAL_URL
}

// should mongoose.connection be put in the call back of mongoose.connect???
const db = mongoose.connection
db.on('error', err => {
	console.log(`There was an error connecting to the database: ${err}`)
})
db.once('open', () => {
	console.log(
		`You have successfully connected to your mongo database: ${MONGO_URL}`
	)
})


// ==== if its production environment!
// if (process.env.NODE_ENV === 'production') {
// 	const path = require('path')
// 	console.log('YOU ARE IN THE PRODUCTION ENV')
// 	app.use('/static', express.static(path.join(__dirname, '../build/static')))
// 	app.get('/', (req, res) => {
// 		res.sendFile(path.join(__dirname, '../build/'))
// 	})
// }

/* Express app ROUTING */
app.use('/auth', require('./auth'))
app.use('/api', require('./api'))



// ====== Error handler ====
app.use(function(err, req, res, next) {
	console.log('====== ERROR =======')
	console.error(err.stack)
	res.status(500)
})

// ==== Starting Server =====
//Starts the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});


const userSeed = [
  {    
    firstName: "amy",
    lastName: "barrons",
    phone:"123456",
    email: "user@user.com",
    username:"amy",
    password:"123",
    dateJoined: new Date(Date.now())
  },
    {    
      firstName: "brian",
      lastName: "barrons",
      phone:"123456",
      email: "user@user.com",
      username:"brian",
      password:"123",
      dateJoined: new Date(Date.now())
    },
    {    
      firstName: "chris",
      lastName: "barrons",
      phone:"123456",
      email: "user@user.com",
      username:"chris",
      password:"123",
      dateJoined: new Date(Date.now())
    }
  
 
 ];

const jobsSeed = [
  {
    username: "Amos",
    streetAddress: "333 street",
    city:"phila",
    state: "PA",
    zipCode:"19148",
    price:"100",
    dateNeededBy: new Date(Date.now()),
    jobChosen: false
  },
  {
    username: "Xerxes",
    streetAddress: "333 street",
    city:"phila",
    state: "PA",
    zipCode:"19148",
    price:"100",
    dateNeededBy: new Date(Date.now()),
    jobChosen: false
  },
  {
    username: "Yolanda",
    streetAddress: "333 street",
    city:"phila",
    state: "PA",
    zipCode:"19148",
    price:"100",
    dateNeededBy: new Date(Date.now()),
    jobChosen: false
  }
 ];

seedDb = () => {
  User.remove({})
  .then(() => {
    User.create(userSeed)
    .then(data => {
      console.log(` records inserted ${data}`);
    })
    .catch(err => {
      console.error(err);
    });
  })
  .catch(err => {
    console.error(err);
  });

  Job.remove({})
  .then(() => {
    Job.create(jobsSeed)
    .then(data => {
      console.log(` records inserted ${data}`);
    })
    .catch(err => {
      console.error(err);
    });
  })
  .catch(err => {
    console.error(err);
  });
}

// seedDb();
