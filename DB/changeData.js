const mongoose = require('mongoose');
const Worker = require('./workerSchema');
const { ObjectId } = require('bson');



module.exports = {
    update: async function (id, newData) {      
        let test3 = await Worker.findByIdAndUpdate(id,{$set:newData})
    }
}