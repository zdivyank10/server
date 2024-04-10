require("dotenv").config(); 
module.exports = {
    MONGODB_URI:process.env.MONGODB_URI,
    JWT_KEY:process.env.JWT_KEY,
    SENDGRID_API_KEY:process.env.SENDGRID_API_KEY,
    CLOUD_NAME:process.env.CLOUD_NAME,
    API_KEY:process.env.API_KEY,
    API_SECRET:process.env.API_SECRET
}