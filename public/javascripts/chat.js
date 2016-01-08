////定义发送程序
var Chat = function(socket){
	this.socket = socket;
}
Chat.prototype.sendMessage = function(roomName, text){
	var data = {
		room:roomName,
		text:text
	};
	this.socket.emit("message", data);
}

Chat.prototype.changeName = function(newName){
	this.socket.emit("changeName", newName);
}

Chat.prototype.createRoom = function(newRoomName){
	this.socket.emit("createRoom", {
		newRoomName:newRoomName,
		oldRoom:$('.current').text()
	});
}

Chat.prototype.joinRoom = function(RoomName){
	this.socket.emit("joinRoom", {
		RoomName:RoomName,
		oldRoom:$('.current').text()
	});
}