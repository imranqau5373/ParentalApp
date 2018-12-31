 
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    deviceName: String,
    deviceId: String,
    locked: Boolean,
    pin: String,
    fcmToken: String,
    email : String,
    password : String,
    childList: Array
}, {
    timestamps: true
});

 module.exports = mongoose.model('User', UserSchema);