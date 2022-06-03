$(function(){               //Jquery
    
    //Conexion de Socket del Cliente
    const socket = io(); //Conexion de los websockets

    //obtaining DOM elements from the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat')

    //obtaining DOM elements from the nicknameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError')
    const $nickname = $('#nickname')

    const $users = $('#usernames')

    $nickForm.submit( (e) => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), (data) => {
            if(data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }
            else{
               $nickError.html(`
                    
                    <div class="alert alert-danger">
                        That username already exist
                    </div>

               `); 
            }
            $nickname.val('');
        });
    })

    //events
    $messageForm.submit(function(e) {
        e.preventDefault();  
        socket.emit('send message', $messageBox.val(), (data) => {
            $chat.append(`<p class="error">${data}</p>`)
        }) 
        $messageBox.val('')     
        
    })

    //El cliente escucha el evento que le envia el servidor
    socket.on('new message', function (data) {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + `<p><b>time: </b>${data.tiempo}</p><hr/>` +'<br/>' );
    });

    socket.on('usernames', (data) => {
        let html = ''; 
        for (let i=0; i<data.length; i++){
            html = html + `<img id="user" src="./img/user.png" >${data[i]}</br>`
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
    $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}<br/><b>time: </b>${data.tiempo}<hr/></p>`)
    })

   // socket.on('load old msgs', data => {
   //     for(let i=0; i<data.length; i++) {
   //         displayMsg(data[i]);  
   //     }
   // })

   // function displayMsg(data) {
   //     $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
   //  }

})
