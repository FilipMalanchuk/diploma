const mongoose = require('mongoose');
const Worker = require('./workerSchema');


module.exports = {
    getAllData: async function () {
        
        return await Worker.find({})
        .then((res)=> {
            let array = []
           res.forEach(item => array.push(Buffer.from(item.photo,'base64').toString('utf-8')))
           
           res.push({imagesBase64:array}); // добавляю в ответ на фронт массив с фотками в формате base64 тк на фронт части нельзя переделать из buffer 
                                        
            return res            
        })
        .then(console.log("dataSendToView"))
        .catch(err => console.log("caught an error \n" + err));
      
    }
}