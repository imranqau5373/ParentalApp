const Info = require('../models/info.model.js');

// Create and Save a new user
exports.create = (req, res) => {

    const info = new Info(req.body);

    info.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });

};

exports.findAll = (req, res) => {

    Info.find()
    .then(info => {
        res.send(info);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });

};