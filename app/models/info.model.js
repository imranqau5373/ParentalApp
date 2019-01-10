const mongoose = require('mongoose');

const InfoSchema = mongoose.Schema({
    isProfitAds: Boolean,
    adText: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Info', InfoSchema);