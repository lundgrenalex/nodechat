var chat = require('net'),
    connections;

server = net.createServer(function (socket) {
        socket.setEncoding('utf8');
        socket.setTimeout(1000*120, function () {
            for (i = 0; i < connections.length; i++) {
                if (connections[i].address == socket.address().address) {
                    socket.write('Good bye! Timeout Exception \n');         // Say Goodbay
                    socket.end();                                           // Destroy Connection
                    connections.splice(i, 1);                               // Remove user from connections
                }
            }
        });
});

chat.on('connection', function (socket) {
    
    'use strict';
    
    var i, j;
    
    connections.push({
        socket: socket, 
        address: socket.address().address, 
        name: ''
    }); 
    
    socket.write(connections.length + ' people in chat! \n');
    
    connections.forEach(function (connection) {
        connection.socket.write('We have new user in our chat from ip: ' + socket.address().address + '\n');
    });

    socket.write('Hi there, lets chat, tell me your name: ');
       
    socket.on('data', function (data) {  
        
        data = String(data).trim();
        
        connections.forEach(function (connection) {  
        
            if (connection.name === '') {
                connection.name = data;
            } else if (connection.socket == socket) {
                connections.forEach(function (el) {
                    if (el.socket !== socket)
                        el.socket.write(connection.name + ' says: ' + data + '\n');
                });
            }
            
        });
    });
    
});

server.on('erroe', function (error) {
    console.log(error);
});

server.listen(9999);