const mongoose = require('mongoose');
const Schema = mongoose.Schema


const workerSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    surname: {
        type : String,
        required : true
    },
    patronymic: {
        type : String,
        required : true
    },
    jobTitle: {
        type:[String],
        default: "немає інформації"
    },
    phoneNumber: {
        type : String,
        required : true
    },
    email:{
        type : String,
        required : false,
        default : "немає"
    },
    payment: {
        type : Number,
        required : true
    },
    dateOfJobStart: {
        type: String,
        required: true
    },
    address: {
        type : String,
        required : false
    },
    photo : {
        type: Buffer,
        required: true
    },
    additional : [Schema.Types.Mixed]

})

const Worker = mongoose.model("worker",workerSchema);
module.exports = Worker;