const Chat = require('./models/Chat')
const moment = require('moment');

let time = "";

var getTime = function(){
    var now = moment();
    var timestamp = now.unix();
    var currentMoment = moment.unix(timestamp);
    time = currentMoment.format(' h:mm a')
}

module.exports = function(io){

    //nicknames guardados en memoria del server
    let users = {};

    //Conexion de Socket del Servidor
    io.on('connection', async socket => {
        console.log('new user connected')

       //  let messages = await Chat.find({}).limit(4);
       // socket.emit('load old msgs', messages);

        socket.on('new user', (data, cb) => {
            console.log(data) 
            if(data in users) {
                cb(false);
            }
            else {
               cb(true); 
               socket.nickname = data;
               users[socket.nickname] = socket
               updateNicknames();
            }
        })

        socket.on('send message', async (data, cb) => {
            //w joe asdsss

            var msg = data.trim();
            

            if(msg.substr(0,3) === '/w ') {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                   var name = msg.substring(0, index) ;
                   var msg = msg.substring(index + 1);
                   if (name in users) {
                       getTime();
                       users[name].emit('whisper', {
                           msg: msg,
                           nick: socket.nickname,
                           tiempo: time
                       });
                   }
                   else {
                    cb('Error! Please enter a Valid User')
                   }
                }
                else {
                   cb('Error! Please enter your message') 
                }
            } 
            else {
                var newMsg = new Chat({
                    msg: msg,
                    nick: socket.nickname 
                })

                await newMsg.save();
                getTime();

                io.sockets.emit('new message', {
                    
                    msg: data,
                    nick: socket.nickname,
                    tiempo: time 
    
                });
            }

            
        })

        socket.on('disconnect', (data) => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames(); 
        })

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }

        

    })


}