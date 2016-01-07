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
	var systemMessage;
	if(message.charAt(0)!=="/"){///作为信息发送
		chatApp.sendMessage("房间1", message);
		$("#message").append(divEscapedContentElemen(message));
		////$("#message").scrollTop($("#message").prop('scrollHeight'));
	}else{ ////以/开头作为命令输入
		chatApp.changeName(message.split('/')[1]);
	}
	
	$("#send-massenge").val('');
}

