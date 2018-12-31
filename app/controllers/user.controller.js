const User = require('../models/user.model.js');
var FCM = require('fcm-node');
var serverKey = 'AAAAwYopCu8:APA91bHLzFkF-xE4Ju3Nqq1I5oz1_qhWn50zX-YECaCYawf1zrT1t1O9VrPXnYkcmjjYpMjvw-3O8qINQj8i27YjNkNsYmh8FzaHX4PCqaNwbNhNlXpmD8ZkzMjPf0r9whJDPB3DjBCy';

// Create and Save a new user
exports.create = (req, res) => {
    
    var userTask = new User(req.body);
    console.log(userTask);
    User.findOne({deviceId: req.body.deviceId}, function(err, user) {
        if (user){
            //on update cannot update the email and password.
            var myquery = { deviceId: req.body.deviceId };
            var newvalues = { $set: {fcmToken: req.body.fcmToken, pin: req.body.pin,email:req.body.email,password:req.body.password } };
            User.updateOne(myquery, newvalues, function(err, saveRes) {
                if (err) res.status(500).send({
                    message: err.message || "Some error occurred while updating users."
                });

                res.json({
                    message: 'User successfully updated'
                });
            });
            

        }else{
            User.findOne({email: req.body.email}, function(err, userEmail) {
                if(userEmail)
                res.json({
                    message: 'Email Already Exist'
                });
                userTask.save()
                .then(data => {
                    res.json({
                        message: 'User successfully saved'
                    });
                }).catch(err => {
                    return res.send(500, {
                        error: err,
                        pin: req.body.pin
                    });
                });
            });
        }
        
    });

};

// Retrieve and return all user from the database.
exports.findAll = (req, res) => {

    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });

};

exports.addChild = (req, res) => {
    var parentId = req.body.parentId;
    var childId = req.body.childId;

    console.log(parentId);
    console.log(childId);

    User.findOne({deviceId: parentId}, function(err, user) {
        if (err){
            res.send(err);
        }else{
            var childList = user.childList;
            if (!childList) {
                childList = [];
            }
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

exports.addNewChild = (req, res) => {
    var parentEmail = req.body.email;
    var parentPin = req.body.pin;
    var childDevice = req.body.childDeviceId;
    // first need to check that parent device exist or not. if exist then add the child.
var parentQuery = User.findOne( {$and:[{ email: parentEmail},{pin : parentPin}]});
parentQuery.exec(function (err, parentUser) {
    if (err || parentUser == null) {
      res.json({
        message: 'That parent user does not exist.'
      });
    }
    else 
        {
        User.findOne({deviceId: childDevice}, function(err, child) {
            if (err || child == null){
                res.json({
                    message: 'That child user does not exist.'
                  });
            }else{
                console.log('child device id is',child);
                let childId = childDevice;
                parentUser.childList.push(childId);
                User.findOneAndUpdate({
                    deviceId: parentUser.deviceId
                  }, parentUser, {new: true}, 
                    function(err, user) {
                    if (err){
                      res.send(err);
                    }else{
                      res.json(user);
                    }
                  });
            }
        });
    }
    });
};

exports.sendNotification = function(req, res) {
    var fcm = new FCM(serverKey);
    var child = req.body.childId;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            parentId: req.body.parentId,
            childId: child,
            locked: req.body.locked,
            isAppUsage: false
        }
    };

    console.log(message);

    fcm.send(message, function(err, response) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                message: 'Notification Sent Successfully!'
            });
        }
    });
};


exports.requestChildAppUsage = function(req, res) {
    var fcm = new FCM(serverKey);
    var child = req.body.childId;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            parentId: req.body.parentId,
            childId: child,
            locked: false,
            isAppUsage: true
        }
    };

    console.log(message);

    fcm.send(message, function(err, response) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                message: 'Notification Sent Successfully!'
            });
        }
    });
};


exports.sendChildAppUsage = function(req, res) {
    var fcm = new FCM(serverKey);
    var appUsage = req.body.appUsage;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            appUsage : appUsage,
            isChildAppUsage: true
        }
    };

    console.log(message);

    fcm.send(message, function(err, response) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                message: 'Notification Sent Successfully!'
            });
        }
    });
};


exports.blockDeviceNetwork = function(req, res) {
    var fcm = new FCM(serverKey);
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            isBlockChildDeviceNetwork: true
        }
    };

    console.log(message);

    fcm.send(message, function(err, response) {
        if (err) {
            res.send(err);
        } else {
            res.json({
                message: 'Notification Sent Successfully!'
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
exports.findSingleUser = (req, res) => {
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

exports.test = (req, res) => {
    res.json('Api is working now latest child');
 };