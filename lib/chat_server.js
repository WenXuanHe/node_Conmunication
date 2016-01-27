var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames={};
var nameused = [];
var currentRoom={};
var allRoom=[];
exports.listen = function(server){
	io = socketio.listen(server);////侦听所有 WebSockets 请求
	io.set("log level", 1);////socket.set和socket.get方法分为用于设置和获取变量。
	io.sockets.on("connection", function(socket){///定义用户连接时的逻辑
		guestNumber = assignGuessName(socket, guestNumber, nickNames, nameused);////赋予初始化姓名
		joinRoom(socket, "房间1");
		handleMassageToAll(socket);
		changeName(socket);
		createRoom(socket);
		joinNewRoom(socket);
		////定期更新roomname
		socket.on("room", function(){
			socket.emit("room", {room:allRoom, currentRoom:currentRoom[socket.id]});
		})
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
////断开连接， 删除人物
function handleClientDisconnect(socket){
	socket.on("disconnect", function(){
		var nameIndex = nameused.indexOf(nickNames[socket.id]);///可用于数组找位置
		delete nameused[nameIndex];
		delete nickNames[socket.id];
	});
}
function joinRoom(socket, roomName){
	var newroomName = roomName;
	socket.join(newroomName);
	currentRoom[socket.id] = newroomName;///记录下当前房间
	for(var key in currentRoom){
		var flag = true;
		if(allRoom.length==0){
			allRoom.push(currentRoom[key]);
		}else{
			for(var i =0; i<allRoom.length;i++){
				if(currentRoom[key] === allRoom[i]){
					flag= false;
				}
			}
			if(flag){
				allRoom.push(currentRoom[key]);
			}
		}
	}
	/////让用户知道自己进入了房间
	socket.emit("joinResult", {
		'allRoom':allRoom,
		'currentRoom': newroomName
		});
	/////让此房间的其他人知道有用户进入了房间
	socket.broadcast.to(newroomName).emit("message", {
		text:nickNames[socket.id]+"has joined this room"
	});
}

function createRoom(socket){
	socket.on("createRoom", function(obj){
		socket.leave(obj.oldRoom)
		allRoom.push(obj.newRoomName);
		joinRoom(socket, obj.newRoomName);
	});
}

function joinNewRoom(socket){
	socket.on("joinRoom", function(obj){
		socket.leave(obj.oldRoom);
		joinRoom(socket, obj.RoomName);
	});
}

////处理用户发出的信息给所有人
function handleMassageToAll(socket){
	socket.on("message", function(message){ 
		if(message.text !=="" ){
			socket.broadcast.to(currentRoom[socket.id]).emit("message",
			{
				text:nickNames[socket.id]+":"+message.text
			});
		}
	});
}

function changeName(socket){
	socket.on("changeName", function(newName){
		var oldName = nickNames[socket.id];
		nickNames[socket.id] = newName;
		/////让用户知道自己改了名字
		socket.emit("ChangeNameResult", {'newName':"your new name is "+ newName});
		socket.broadcast.to(currentRoom[socket.id]).emit("message",
		{
			text:oldName+"rename success, new name is" + nickNames[socket.id]
		});
	});
}
