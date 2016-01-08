////可信的文本
var divSystemContentElemen = function(text){
	return $('<div></div>').html("<i>"+text+"</i>");
}
////可疑的文本
var divEscapedContentElemen = function(text){
	return $('<div></div>').text(text);
}

/////处理原始的用户输入
var processUserInput = function(chatApp, socket){
	var message = $("#send-massenge").val();
	if(message.indexOf("nick/")!== -1){
		chatApp.changeName(message.split('/')[1]);
	}else if(message.indexOf("create/")!== -1){
		chatApp.createRoom(message.split('/')[1]);
	}else if(message.indexOf("join/")!==-1){
		chatApp.joinRoom(message.split('/')[1]);
	}else{
		chatApp.sendMessage($(".current").text(), message);
		$("#message").append(divEscapedContentElemen(message));
		////$("#message").scrollTop($("#message").prop('scrollHeight'));
	}
	$("#send-massenge").val('');
}

