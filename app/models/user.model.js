const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    deviceName: String,
    deviceId: String,
    locked: Boolean,
    pin: String,
    fcmToken: String,
    childList: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);