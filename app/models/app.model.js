const mongoose = require('mongoose');

const AppsSchema = mongoose.Schema({
    appName: String,
    packageName: String
});

module.exports = mongoose.model('Apps', AppsSchema);