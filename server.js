var http = require('http');
var fs = require('fs');
var path =  require('path');
var mime = require('mime'); ///附加的mime模块有根据文件扩展名得出MIME类型的能力
var cache = {};
var chatServer = require('./lib/chat_server');

//////发送错误信息
function send404(response){
	response.writeHead(404, {'Content-Type':'text/plain'});
	response.write("404:this page is not fund");
	response.end();
}

/////发送文件
function sendFile(response, filePath, fileContent){
	response.writeHead(200, {'Content-Type':mime.lookup(path.basename(filePath))});
	response.end(fileContent);
}

/////提供静态文件服务
function serverStatic(response, cache, abSPath){
	if(cache[abSPath]){
		sendFile(response, abSPath, cache[abSPath]);///从内存中读取文件，因内存中读取更快
	}else{
		fs.exists(abSPath, function(exists){///检测文件是否存在，返回boolen值
			if(exists){
				fs.readFile(abSPath, function(err, data){///读取文件，返回读取状态，和数据
					if(err){
						send404(response);
					}else{
						cache[abSPath] = data;
						sendFile(response, abSPath, data);
					}
				})
			}else{
				send404(response);
			}
		})
	}
}

////创建HTTP服务器
var server = http.createServer(function(request, response){
	var filePath = '';
	if(request.url=='/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public'+request.url;
	}
	var absPath = './'+filePath;
	serverStatic(response, cache, absPath);
}).listen(3000, function(){
	console.log("server listen on port 3000");
})
chatServer.listen(server);