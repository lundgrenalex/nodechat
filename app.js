/**
* Software: Node chat based on sockets
* Author: Alex Lundgren
* Mail: alex@endem.su
* Year: 2015
*/


var net = require('net'),
    connections = [];

// Create Server for incoming connections
server = net.createServer(function (socket) {
    
        // Define message Encoding to utf8
        socket.setEncoding('utf8');
    
        // Set timeout action for innactive users
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

// Actions on messages
server.on('connection', function (socket) {    
    
    'use strict';
        
    // Add connection to connections array
    connections.push({
        socket: socket, 
        address: socket.address().address, 
        name: ''
    }); 
    
    // Display count of connections
    socket.write(connections.length + ' people in chat! \n');
    
    // Tell wellcome meassage for people if we connect to chat
    connections.forEach(function (connection) {
        connection.socket.write('We have new user in our chat from ip: ' + socket.address().address + '\n');
    });

    // Wellcome, message for define nickname
    socket.write('Hi there, lets chat, tell me your name: ');
    
    socket.on('data', function (data) {  
        // Trim \n in new messages 
        data = String(data).trim();
        
        // Display our message to peolpe or define nickname of in not exist
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

// Display errors
server.on('erroe', function (error) {
    console.log(error);
});

// Start and bind server to 0.0.0.0:9999 to incoming connections
server.listen(9999);