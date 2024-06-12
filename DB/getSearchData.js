const mongoose = require('mongoose');
const Worker = require('./workerSchema');


module.exports = {
    getSearchData: async function (searchString) {
        let page = searchString.slice(searchString.indexOf("page=") +"page=".length).split("&")[0]
        let nameOrjobTitle = searchString.slice(searchString.indexOf("nameOrjobTitle=") +"nameOrjobTitle=".length).split("&")[0]
        nameOrjobTitle = decodeURI(nameOrjobTitle)
        return await Worker.find({$or:[
            {name:{$regex:`${nameOrjobTitle}`,$options:'i'}},
            {surname:{$regex:`${nameOrjobTitle}`,$options:'i'}},
            {patronymic:{$regex:`${nameOrjobTitle}`,$options:'i'}},
            {jobTitle:{$regex:`${nameOrjobTitle}`,$options:'i'}}
        ]}).skip((page - 1)*10).limit(10)
        .then((res)=> {
            let array = []
           res.forEach(item => array.push(Buffer.from(item.photo,'base64').toString('utf-8')))
           console.log()
           
           res.push({imagesBase64:array}); // добавляю в ответ на фронт массив с фотками в формате base64 тк на фронт части нельзя переделать из buffer 
                                        
            return res            
        })
        .then(async function(res) {
            res[res.length - 1].numberOfDocuments = await Worker.find({$or:[
                {name:{$regex:`${nameOrjobTitle}`,$options:'i'}},
                {surname:{$regex:`${nameOrjobTitle}`,$options:'i'}},
                {patronymic:{$regex:`${nameOrjobTitle}`,$options:'i'}},
                {jobTitle:{$regex:`${nameOrjobTitle}`,$options:'i'}}
            ]}).countDocuments()// добавляю цифру количества данных в колекции 
            return res
        })
        .then(console.log(`dataSendToView page=${page}, nameOrjobTitle = ${nameOrjobTitle}`))
        .catch(err => console.log("caught an error \n" + err));
      
    }
}