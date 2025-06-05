const http = require('http'); const url = require('url'); 
 
let comments = []; const stats = {}; 
 
const server = http.createServer((req, res) => 
{ 
  const parsedUrl = url.parse(req.url, true);   const pathname = parsedUrl.pathname;   const method = req.method; 
 
  console.log(`Получен ${method} запрос на ${pathname}`); 
 
  const userAgent = req.headers['user-agent'] || 'unknown';   stats[userAgent] = (stats[userAgent] || 0) + 1; 
 
  if (pathname === '/' && method === 'GET') 
  { 
    handleRoot(res); 
  } else if (pathname === '/comments' && method === 'POST') 
  { 
    handleCommentsPost(req, res); 
  } else if (pathname === '/stats' && method === 'GET') 
  { 
    handleStats(res); 
  } else { 
    handleNotFound(res); 
  } 
}); 
 
// Обработчики маршрутов function handleRoot(res) 
{ 
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' 
});   res.end('Добро пожаловать в наше приложение!'); 
} 
 
function handleCommentsPost(req, res) 
{ 
  let body = '';   req.on('data', chunk => 
  { 
    body += chunk.toString(); 
  }); 
  req.on('end', () => 
  {     try     { 
      const newComment = JSON.parse(body);       comments.push(newComment); 
      res.writeHead(200, { 'Content-Type': 'application/json' }); 
      res.end(JSON.stringify(comments)); 
    }      catch (e)     { 
      res.writeHead(400, { 'Content-Type': 'text/plain; char-set=utf-8' });       res.end('Неверный формат JSON'); 
    } 
  }); 
} 
 
function handleStats(res) 
{ 
	  let 	html 	= 	'<table 	border="1"><tr><th>User-Agent</th><th>Количество запросов</th></tr>';   for (const [ua, count] of Object.entries(stats)) 
  { 
    html += `<tr><td>${ua}</td><td>${count}</td></tr>`; 
  } 
  html += '</table>'; 
   
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' 
});   res.end(html); 
} 
 
function handleNotFound(res) 
{ 
  res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' 
});   res.end('400 Bad Request'); 
} 
 
// Запуск сервера const PORT = 5001; const HOST = 'localhost'; server.listen(PORT, HOST, () => 
{ 
  console.log(`Сервер запущен на http://${HOST}:${PORT}`);   console.log(`IP: ${HOST}, Порт: ${PORT}`); 
}; 
server.on('connection', (socket) => { 
	  console.log(`Новое 	подключение: 	${sock-
et.remoteAddress}:${socket.remotePort}`); 
}); 
