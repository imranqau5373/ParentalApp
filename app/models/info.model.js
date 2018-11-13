const mongoose = require('mongoose');

const InfoSchema = mongoose.Schema({
    isProfitAds: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Info', InfoSchema);