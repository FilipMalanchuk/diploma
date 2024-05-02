// зависимости
const http = require('http');
const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const DBconnect = require("./DB/DBconnect");
const bodyParser = require("body-parser");
const saveToDB = require("./DB/saveToDB");
const getData = require("./DB/getDataFromDB");


// переменные
const app = express();
const port = 3000;

// подключение к БД
DBconnect.connectToDB();


// иначе будет пустой ответ(на другом url)
app.use(cors());
app.use(express.static(__dirname + "/front"));// настройка для правильного роутинга фронта
app.use(bodyParser.json({limit:'16mb'})) //для обработки JSON POST запросов
app.use(express.urlencoded({
  extended:true
}));// для обработки URL-кодированных запросов
app.use(express.json({limit:'16mb'}))
app.use(express.urlencoded({limit:'16mb'}))

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
  app.get(['/addNewData.html','/addNewData','/pages/addNewData.html','/pages/addNewData'],async (request,response) => {
    let options = {
      root : path.join(__dirname + "/front")
    };
    let fileName = '/pages/addNewData.html';
    response.sendFile(fileName,options)
  });
  app.get(['/displayData.html','/displayData','/pages/displayData.html','/pages/displayData'],async (request,response) => {
    let options = {
      root : path.join(__dirname + "/front")
    };
    let fileName = '/pages/displayData.html';
    response.sendFile(fileName,options)
  });


  // получаем пост запрос с сервера с новыми данными для БД
  app.post(['/addingNewData'],async (request,response) => {
    console.log(request.body)
    saveToDB.saveNewDataToDB(request.body)
  });

  // получаем запрос на вывод данных
  app.get(['/showData'],async (request,response) => {
    try {
      response.status(200).json(await getData.getAllData());
    } catch (error) {
      response.status(500).json({error:"error, data not recieved"})
    }
  });




  // проверка на запрос на несуществующую страницу(ошибка 404)
  app.get("*",async (request,response) => {
    let options = {
      root : path.join(__dirname + "/front")
    };
    let fileName = '/pages/error.html';
    console.log(404)
    response.status(404).sendFile(fileName,options)
  });



  
