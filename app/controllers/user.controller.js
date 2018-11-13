const User = require('../models/user.model.js');

// Create and Save a new user
exports.create = (req, res) => {

    var userTask = new User(req.body);
    User.update({
        deviceId: req.body.deviceId
    }, userTask, {
        upsert: true,
        setDefaultsOnInsert: true
    }, function(err, users) {
        if (err) return res.send(500, {
            error: err,
            pin: req.body.pin
        });
            return res.json({
                message: 'User successfully saved'
            });
        });

};

// Retrieve and return all user from the database.
exports.findAll = (req, res) => {

    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });

};

exports.addChild = (req, res) => {
    var parentId = req.param.parentId;
    var childId = req.body;

    console.log(parentId);
    console.log(childId);

    User.findOne({deviceId: parentId}, function(err, user) {
        if (err){
            res.send(err);
        }else{
            var childList = user.childList;
            childList.push(childId);

            User.findOneAndUpdate({
                deviceId: parentId
              }, user, {new: true}, 
                function(err, user) {
                if (err){
                  res.send(err);
                }else{
                  res.json(user);
                }
              });
        }
        
    });
};


    exports.findChild = (req, res) => {
        var parentId = req.body.parentId;

        console.log(parentId);
    
        User.findOne({deviceId: parentId}, function(err, user) {
            if (err){
                res.send(err);
            }else{
                var childList = user.childList;

                if (childList) {
                    User.find({
                        deviceId:{$in: childList}
                      }, function (err, user) {
                        if (err)
                          res.send(err);
                          return res.json(user);
                      });   
                }
            }
            
        });
    };

// exports.addChild = (req, res) => {
//     User.findOne({deviceId: req.param.deviceId}, function(err, user) {
//         if (err) res.send(err);
//         var childList = [];
//         //childList = user.childList;
//         childList.push(req.body.deviceId);
//         //user.childList = childList;
//     });
// };

// Find a single user with a userId
exports.findOne = (req, res) => {
    User.findOne({deviceId: req.body.deviceId}, function(err, user) {
        if (err) res.send(err);
        res.json(user);
    });
};


exports.findByPin = (req, res) => {
    User.findOne({pin: req.body.pin}, function(err, user) {
        if (err) res.send(err);
        res.json(user);
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {



};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {

};