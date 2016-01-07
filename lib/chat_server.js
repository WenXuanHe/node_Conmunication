var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames={};
var nameused = [];
var currentRoom={};
exports.listen = function(server){
	io = socketio.listen(server);////侦听所有 WebSockets 请求
	io.set("log level", 1);////socket.set和socket.get方法分为用于设置和获取变量。
	io.sockets.on("connection", function(socket){///定义用户连接时的逻辑
		guestNumber = assignGuessName(socket, guestNumber, nickNames, nameused);////赋予初始化姓名
		joinRoom(socket, "房间1");
		handleMassageToAll(socket);
		changeName(socket);
	});
}

/////系统默认赋予一个名字
function assignGuessName(socket, guestNumber, nickNames, nameused) {
	var name = "Gress"+guestNumber;
	nickNames[socket.id] = name;////给名字匹配一个socketid，
	socket.emit("nameResult",{////服务器传递给用户的信息，让用户知道他的名称
		success:true,
		name:name
	});
	nameused.push(name);
	return guestNumber+1;
}

function joinRoom(socket, roomName){
	socket.join(roomName);
	currentRoom[socket.id] = roomName;///记录下当前房间
	/////让用户知道自己进入了房间
	socket.emit("joinResult", {'room':roomName});
	/////让此房间的其他人知道有用户进入了房间
	socket.broadcast.to(roomName).emit("message", {
		text:nickNames[socket.id]+"has joined this room"
	});
}

////处理用户发出的信息给所有人
function handleMassageToAll(socket){
	socket.on("message", function(message){ 
		socket.broadcast.to(currentRoom[socket.id]).emit("message",
		{
			text:nickNames[socket.id]+":"+message.text
		});
	});
}

function changeName(socket){
	socket.on("changeName", function(newName){
		var oldName = nickNames[socket.id];
		nickNames[socket.id] = newName;
		socket.broadcast.to(currentRoom[socket.id]).emit("message",
		{
			text:oldName+"rename success, new name is" + nickNames[socket.id]
		});
	});
}
