const mongoose = require('mongoose')

module.exports = {
    connectToDB: function(){
        const db = "mongodb+srv://adminOfDB:Di1uWeQGfD6X9Vk1@diplomadb.oymjib8.mongodb.net/node_workers?retryWrites=true&w=majority&appName=diplomaDB"

        mongoose.connect(db).then((response) => console.log("connected to database")).catch((error)=>console.log(error))
    }
}