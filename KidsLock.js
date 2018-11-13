const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/user.routes.js')(app);
require('./app/routes/info.routes.js')(app);

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to KidsLock application. Organize and keep track of your childs activity on device."});
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('lock', function(data) {
        console.log(data);

        io.emit('lock_device', data);
    });
    
});

// listen for requests
server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});