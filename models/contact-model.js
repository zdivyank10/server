const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    username : {
        type : "string",
        required : true,
    },

    email : {
        type : "String",
        required : true,
    },

    message : {
        type : "String",
        required : true,
    },
})

   
//define collection name

const contact = new mongoose.model("contact",contactSchema);

module.exports = contact;