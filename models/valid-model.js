const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp_code: {
        type: String,
        required: true
    },
    generated_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    expires_at: {
        type: Date,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false,
        required: true
    }
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
