const express = require('express');
const app = express();
require('dotenv').config({path : "./config.env"});
var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const passport = require("passport");
const cookieSession = require('cookie-session');
const passportSetup = require('./passport');
const cors = require("cors");





const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
});

module.exports = io;


//json
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); 
//GOOGLE AUTH;
app.use(cookieSession({
    name : 'session',
    keys : ['anilkumar'],
    maxAge : 24*60*60*100,
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);


//db
require('./db/conn');



// SOCKET IO 
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
});
  






//route
app.use(require('./routers/routes'));



server.listen( process.env.PORT, (err) => {
    console.log("listening to port " +  process.env.PORT);
})

