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
const update = require("./DB/changeData");
const getPageData = require("./DB/getPageData");
const deleteData = require("./DB/deleteData");
const getSearchData = require("./DB/getSearchData");


// переменные
const app = express();
const port = 3000;

// подключение к БД
DBconnect.connectToDB();


// иначе будет пустой ответ(на другом url)
app.use(cors());
app.use(express.static(__dirname + "/front"));// настройка для правильного роутинга фронта
app.use(bodyParser.json({limit:'50mb'})) //для обработки JSON POST запросов
app.use(express.urlencoded({
  extended:true
}));// для обработки URL-кодированных запросов
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb'}))

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
    response.status(200).json({result:"data added"})
  });
  // получаем пост запрос с обновлением существующей записи
  app.post(['/changingData'],async (request,response) => {
    let idToSend = request.body._id
    let withoutID = request.body
    delete withoutID._id
    update.update(idToSend,withoutID)
    response.status(200).json({result:"changed"})
   
  });
  // получаем пост с запросом на удаление записи
  app.post(['/deletingDataItem'],async (request,response) => {
    console.log("revieved request to delete DataItem")
    let idToSend = request.body._id
    deleteData.deleteOne(idToSend)
    response.status(200).json({result:"deleted"})
  });

  // получаем запрос на вывод данных
  // app.get(['/showData'],async (request,response) => {
  //   try {
  //     response.status(200).json(await getData.getAllData());
  //   } catch (error) {
  //     response.status(500).json({error:"error, data not recieved"})
  //   }
  // });

  app.get(['/showData/?*'],async (request,response) => {
    let requestString = request.originalUrl.slice(request.originalUrl.indexOf("?") +"?".length) // стока запроса
    let pageNeeded = request.originalUrl.slice(request.originalUrl.indexOf("page=") +"page=".length).split("&")[0] // конкретная страница запроса
    if (!requestString.includes("nameOrjobTitle=")) { // если нужна только страница без поиска
      try {
        response.status(200).json(await getPageData.getPageData(pageNeeded));
      } catch (error) {
        response.status(500).json({error:"error, data not recieved"})
      }
    } else {
        try {
          
          response.status(200).json(await getSearchData.getSearchData(requestString));
        } catch (error) {
          response.status(500).json({error:"error, data not recieved"})
        }
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



  
