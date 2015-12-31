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
		chatApp.sendMessage($("#room").text(), message);
		$("#message").append(divEscapedContentElemen(message));
		////$("#message").scrollTop($("#message").prop('scrollHeight'));
	}
	$("#send-massenge").val('');
}

