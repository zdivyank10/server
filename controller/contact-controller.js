const contact = require("../models/contact-model");

const contactForm = async(req,res)=>{
    try {
        const respond = req.body;
        await contact.create(respond); 
        res.status(200).json({message : 'Message Send Successfully'})
        
    } catch (error) {
        res.status(500).json({message : 'Message Not Send Successfully '})
    }
}

const getContact = async(req,res)=>{
    try {
        const contacts = await contact.find();
        res.json(contacts)
        
    } catch (error) {
        res.status(500).json({message : 'Message Not Found Successfully '})
    }
}
module.exports = {contactForm,getContact};