// зависимости
const http = require('http');
const express = require("express");
const cors = require("cors");
const path = require('path');


// переменные
const app = express();
const port = 3000;


// иначе будет пустой ответ(на другом url)
app.use(cors());
app.use(express.static(__dirname + "/front"));// настройка для правильного роутинга фронта

app.listen(port,'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${port}`);
});



// обработка запросов

app.get(['/','/index.html'],async (request,response) => {
    let options = {
      root : path.join(__dirname)
    };
    let fileName = 'index.html';
    response.sendFile(fileName,options)
  });

// Добавить обработку запроса на несуществующие страницы
  
