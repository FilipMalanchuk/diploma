const mongoose = require('mongoose');
const Worker = require('./workerSchema');
const { ObjectId } = require('bson');



module.exports = {
    deleteOne: async function (id) {      
        let test3 = await Worker.deleteOne({_id:id});
    }
}