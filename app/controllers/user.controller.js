const User = require('../models/user.model.js');
var FCM = require('fcm-node');
var serverKey = 'AAAAwYopCu8:APA91bHLzFkF-xE4Ju3Nqq1I5oz1_qhWn50zX-YECaCYawf1zrT1t1O9VrPXnYkcmjjYpMjvw-3O8qINQj8i27YjNkNsYmh8FzaHX4PCqaNwbNhNlXpmD8ZkzMjPf0r9whJDPB3DjBCy';

// Create and Save a new user
exports.create = (req, res) => {
console.log('change pin is',req.body.changePin)
    var userTask = new User(req.body);
    console.log(userTask);
    User.findOne({deviceId: req.body.deviceId}, function(err, user) {
        if (user){
            //on update cannot update the email and password.
            if(user.pin != req.body.pin && req.body.changePin != "1")
            res.json({
                message: 'Pin Number not matched with existing pin number.'
            });
            else{
                var myquery = { deviceId: req.body.deviceId };
                if(req.body.pin == null || req.body.pin == ''){
                    res.json({
                        message: 'Empty Pin is not allowed.'
                    });
                }
                else{
                    var newvalues = { $set: {fcmToken: req.body.fcmToken, pin: req.body.pin,email:req.body.email,password:req.body.password } };
                    User.updateOne(myquery, newvalues, function(err, saveRes) {
                        if (err) res.status(500).send({
                            message: err.message || "Some error occurred while updating users."
                        });
        
                        res.json({
                            message: 'User successfully updated'
                        });
                    });
                }
            
            }

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

exports.updateFcmToken = (req, res) => {
    var myquery = { deviceId: req.body.deviceId };
    var newvalues = { $set: {fcmToken: req.body.fcmToken } };
                    User.updateOne(myquery, newvalues, function(err, saveRes) {
                        if (err) res.status(500).send({
                            message: err.message || "Some error occurred while updating users."
                        });
        
                        res.json({
                            message: 'Fcm token successfully updated'
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
            blockedApps:req.body.blockedApps,
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

exports.requestChildCallLog = function(req, res) {
    var fcm = new FCM(serverKey);
    var child = req.body.childId;
    var fcmToken = req.body.fcmToken;
    var isNoti = req.body.isNotification;
    var mail = req.body.isEmail;
    var parMail = req.body.parentEmail;

    var message = { 
        to: fcmToken,
        data: {
            parentId: req.body.parentId,
            childId: child,
            locked: false,
            isAppUsage: false,
            isChildCallLog: true,
            isNotification : isNoti,
            isEmail : mail,
            parentEmail : parMail
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

exports.requestChildSmsLog = function(req, res) {
    var fcm = new FCM(serverKey);
    var child = req.body.childId;
    var fcmToken = req.body.fcmToken;
    var isNoti = req.body.isNotification;
    var mail = req.body.isEmail;
    var parMail = req.body.parentEmail;

    var message = { 
        to: fcmToken,
        data: {
            parentId: req.body.parentId,
            childId: child,
            locked: false,
            isAppUsage: false,
            isChildCallLog: false,
            isChildSmsLog: true,
            isNotification : isNoti,
            isEmail : mail,
            parentEmail : parMail
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

exports.requestChildLocation = function(req, res) {
    var fcm = new FCM(serverKey);
    var child = req.body.childId;
    var fcmToken = req.body.fcmToken;
    var isNoti = req.body.isNotification;
    var mail = req.body.isEmail;
    var parMail = req.body.parentEmail;
    var single = req.body.isSingle;

    User.findOne({deviceId: child}, function(err, user) {
        if (user){

            var message = { 
                to: fcmToken,
                data: {
                    parentId: req.body.parentId,
                    childId: child,
                    locked: false,
                    isAppUsage: false,
                    isChildCallLog: false,
                    isNotification : isNoti,
                    isEmail : mail,
                    parentEmail : parMail,
                    isChildLocation: true,
                    isSingle : single
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

        } else if(err){
            res.send(err);
        }else{
            res.json({
                message: 'No user found!'
            });
        }
    });
};


exports.requestChildData = function(req, res) {
    var fcm = new FCM(serverKey);

    User.findOne({deviceId: req.body.childId}, function(err, user) {
        if (user){

            var message = { 
                to: user.fcmToken,
                data: req.body
            };
        
        
            fcm.send(message, function(err, response) {
                if (err) {
                    res.write(JSON.stringify(err));
                } else {
                    res.write(JSON.stringify({message:'Notification Sent Successfully!'}));
                }

                res.end();
            });

        } else if(err){
            res.send(err);
        }else{
            res.json({
                message: 'No user found!'
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

exports.sendChildCallLog = function(req, res) {
    var fcm = new FCM(serverKey);
    var callLogs = req.body.callLogs;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            callLogs : callLogs,
            isChildCallLogReceived: true
        }
    };

    console.log(message);

    fcm.send(message, function(err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send({
                message: 'Notification Sent Successfully!'
            });
        }
    });
};

exports.sendChildSmSLog = function(req, res) {
    var fcm = new FCM(serverKey);
    var smsLogs = req.body.smsLogs;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            smsLogs : smsLogs,
            isChildCallSmsReceived: true
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

exports.sendChildLocation = function(req, res) {
    var fcm = new FCM(serverKey);
    var locationLogs = req.body.location;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            location : locationLogs,
            isChildLocationReceived: true
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



exports.sendChildNotifLog = function(req, res) {
    var fcm = new FCM(serverKey);
    var notifLogs = req.body.notifLogs;
    var fcmToken = req.body.fcmToken;

    var message = { 
        to: fcmToken,
        data: {
            notifLogs : notifLogs,
            isChildNotifLogReceived: true
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
    var blockAll = req.body.blockAll;
    var blockApps = req.body.blockApps;
    var blockedApps=req.body.blockedApps;
    if(blockedApps==undefined || blockedApps==null  || blockedApps=="null" )
    {
        blockedApps=null;
    }
    else
    {
        console.log(blockedApps)
        blockedApps=JSON.parse(blockedApps)

        for(let i=0;i<blockedApps.length;i++)
        {
            console.log("Blocking App "+i+" -> "+blockedApps[i]);
        }
    

    }


    if(blockAll===undefined)
    {
        blockAll=true;
    }
    else
    {
        blockAll=JSON.parse(blockAll);
    }



    if(blockApps===undefined)
    {
        blockApps=false;
    }
    else
    {
        blockApps=JSON.parse(blockApps);
    }



    console.log("Blocking is ->  All: "+blockAll+" Slected : "+blockApps);

    var message = { 
        to: fcmToken,
        data: {
            isBlockChildDeviceNetwork: blockAll,
            blockedApps:JSON.stringify(blockedApps),
            blockApps:blockApps,
        }
    };

    console.log(message);

    fcm.send(message, function(err, response) {
       
       
        try {
           
          if (err) {
            res.send(err);
        } else {
            console.log(response)
            res.send({
                message: 'Notification Sent Successfully!'
            });
        }
          }
          catch(error) {
            console.error("Throw some  , wierd err, no action reqq"); 
          }


    });
};
    exports.findChild = (req, res) => {

        var parentId = req.body.parentId;

        console.log(parentId);
    
        User.findOne({deviceId: parentId}, function(err, user) {
            if (user){
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
            }else if(err){
                res.send(err);
            }else{
                res.json({
                    message: 'User not found.'
                });
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

exports.delete = (req, res) => {

    User.findOne({deviceId: req.params.parentId}, function(err, user) {
        if (user){
            var childListNew = user.childList;

            if(childListNew){
                var index = childListNew.indexOf(req.params.childId);
                if (index > -1) {
                    childListNew.splice(index, 1);
                }
    
                var newvalues = { $set: {childList: childListNew} };
                var myquery = { deviceId: req.params.parentId };
                User.updateOne(myquery, newvalues, function(err, saveRes) {
                    if (err) res.status(500).send({
                        message: err.message || "Some error occurred while updating users."
                    });
    
                    res.json({
                        message: 'User successfully deleted'
                    });
                });
            }else{
                res.json({
                    message: 'No child found'
                });
            }

        }else if(err){
            res.send(err);
        }else{
            res.json({
                message: 'User not found.'
            });
        }
    });

    // User.remove({
    //   deviceId: req.params.deviceId
    // }, function(err, task) {
    //   if (err)
    //     res.send(err);
    //   res.json({ message: 'Child successfully deleted' });
    // });

};

exports.deleteAccount = (req, res) => {

    User.remove({
      deviceId: req.params.deviceId
    }, function(err, task) {
      if (err)
        res.send(err);
      res.json({ message: 'Account successfully deleted' });
    });

};

// Delete a user with the specified userId in the request
exports.deleteOldUsers = (req, res) => {
    User.find( {$and: [ {email : ''},{pin : ''}]}).remove(function(err, user){
        if (err) res.send(err);
        res.json(user);
    });
};

exports.test = (req, res) => {
    res.json('Api is working now latest delete change');
 };