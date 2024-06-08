const mongoose = require('mongoose');
const Worker = require('./workerSchema');


module.exports = {
    getPageData: async function (page) {
        
        return await Worker.find().skip((page - 1)*10).limit(10)
        .then((res)=> {
            let array = []
           res.forEach(item => array.push(Buffer.from(item.photo,'base64').toString('utf-8')))
           console.log()
           
           res.push({imagesBase64:array}); // добавляю в ответ на фронт массив с фотками в формате base64 тк на фронт части нельзя переделать из buffer 
                                        
            return res            
        })
        .then(async function(res) {
            res[res.length - 1].numberOfDocuments = await Worker.find().countDocuments()// добавляю цифру количества данных в колекции 
            return res
        })
        .then(console.log(`dataSendToView page=${page}`))
        .catch(err => console.log("caught an error \n" + err));
      
    }
}