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
