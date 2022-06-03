/*!
 * Chat JavaScript
 * (c) 2019 Jose Emilio Phinney Dominguez
 * Released under my License.
 */

const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app)
const io = socketio.listen(server);

//db connection
mongoose.connect('mongodb://localhost/chat-database')
.then(db => console.log('db is connected'))
.catch(err => console.log(err))

//settings
app.set('port', process.env.PORT || 3000)

require('./socket')(io);


//Midlewares
app.use(morgan('dev'))

//static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
server.listen(app.get('port'), () => {
    console.log('Server running on Port ',app.get('port'))
});           