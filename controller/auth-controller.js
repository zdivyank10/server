const user = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const Verification = require('../models/valid-model');


const home = async (req,res)=>{
    try
    {
        res.status(200).
        send("Hello i'm Homepage from auth");
    }
    catch(error)
    {
            res.status(400)
            .send("Oops Not Found");
            console.log(error);
     
    }
}

// *-----------------------------------------
// *-----------------------------------------

//  Register Logic 💯

// *-----------------------------------------
// *-----------------------------------------

const register= async (req,res)=>{
    try
    {
        const {username ,email,phone ,password} = req.body;
        //first email database mathi
        //second email uper thi☝️
        // const userExist = await user.findOne({email : email})
        
        const userExist = await user.findOne({email})
        if(userExist)
        {
            return res.status(400).json({msg :"Already Registerd.."})
        }

        //bycrpt password...
        var salt = bcrypt.genSaltSync(10);
        var hash_Password = await bcrypt.hash(password, salt);
        // await user.create({username ,email,phone ,password})
        const newUser = await user.create({ username, email, phone, password:hash_Password });
        res.status(200)
        .json({
            // msg : newUser ,
            msg : "Registration Successful" ,
            token : await newUser.genrateToken(),
            userId : newUser._id.toString()
            })
        console.log(newUser);
    }
    catch(error)
    {
        res.status(500)
        .send("Oops Not Found");
        console.log(error);
    }
}


// *-----------------------------------------
// *-----------------------------------------

//  Login Logic 💯

// *-----------------------------------------
// *-----------------------------------------

const login = async(req,res) =>{
    
    try {
        const {email ,password} = req.body;
        const userExist = await user.findOne({email})
        
        if (!userExist)
        {
            return res.status(400).json({message:"invalid credentials "});
        }

        //compare password
        const passwordMatch = await userExist.comparePass(password);

        if (passwordMatch ) {
            res.status(200)
            .json({
                message : "Login Succesful" ,
                token : await userExist.genrateToken(),
                userId : userExist._id.toString()
                })
        }
        else{
            res.status(401)
            .json({
                message : "Invalid Email Or Password" ,
                })
        }

    } catch (error) {
        // res.status(500)
        // .json("Internal Error");
        // console.log(error);
        const status = 500;
        const message = "Internal Error";
        const extraDetails =err.errors[0].message; 
        const err = {
         status,
         message,
         extraDetails
        }
        next(err)
    }
}


// *-----------------------------------------
// *-----------------------------------------

//  User Logic 💯

// *-----------------------------------------
// *-----------------------------------------
//took users instead of user.....

const users = async(req,res) =>{

    try {
        const userData = req.users;
        console.log(userData);
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(`error from user route${error}`);
    }

}
const eachuser = async(req,res) =>{

    const { id } = req.params;
    console.log('userid',id);
    try {
        const eachuser = await user.find({_id:id });
        console.log('each user data:', eachuser);

        res.json(eachuser);
    } catch (error) {
        console.log(`error from ${error}`);
    }
}

const updateUserPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ error: 'New password is required' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password in the database
        await user.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'apikey', // API key username
        pass: process.env.SENDGRID_API_KEY // SendGrid API key
    }
});

// Function to generate a random 6-digit OTP with expiration time
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
    return { otp, expirationTime };
}

// Controller function for user registration and sending verification email
const registerUser = async (req, res) => {
    const { email } = req.body;

    try {
        // Generate a random 6-digit OTP with expiration time
        const { otp, expirationTime } = generateOTP();

        // Check if there is an existing verification record for the email
        let existingVerification = await Verification.findOne({ email });

        if (existingVerification) {
            // If there is an existing verification record, update the OTP and expiration time
            existingVerification.otp_code = otp;
            existingVerification.expires_at = expirationTime;
            await existingVerification.save();
        } else {
            // If there is no existing verification record, create a new one
            const newVerification = new Verification({
                email: email,
                otp_code: otp,
                generated_at: new Date(),
                expires_at: expirationTime
            });
            await newVerification.save();
        }

        // Send verification email with OTP
        transporter.sendMail({
            from: 'ink.garden10@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Your verification OTP is: ${otp}, This code will expire after 5 mins.`
        }, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to send verification email.' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Verification OTP sent to your email.', expirationTime });
            }
        });
    } catch (error) {
        console.error('Error handling registration:', error);
        res.status(500).json({ message: 'Failed to handle registration.' });
    }
};


const verify = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the verification record for the provided email
        const verificationRecord = await Verification.findOne({ email });

        if (!verificationRecord) {
            return res.status(400).json({ message: 'No verification record found for this email.' });
        }

        // Check if the provided OTP matches the one stored in the database
        if (otp === verificationRecord.otp_code) {
            // Check if the OTP has expired
            const currentTime = new Date();
            if (currentTime > verificationRecord.expires_at) {
                return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
            }

            // return res.status(200).json({ message: 'OTP verification successful.' });
            await user.findOneAndUpdate({ email }, { is_verified: true });

            // Delete the verification record from the database
            await Verification.findOneAndDelete({ email });

            return res.status(200).json({ message: 'OTP verification successful. User is now verified.' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};




module.exports = {home,register,login,users,eachuser,updateUserPassword,registerUser,verify}