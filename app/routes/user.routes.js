 
module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    app.post('/addChild', users.addChild);

    app.post('/addNewChild', users.addNewChild);

    app.post('/updateFcmToken', users.updateFcmToken);

    // Retrieve all User
    app.get('/users', users.findAll);

    app.get('/test', users.test);

    // Retrieve a single User with deviceId
    app.post('/userByDevice', users.findSingleUser);

    app.post('/userByPin', users.findByPin);

    app.post('/findChild', users.findChild);

    app.post('/sendNotification', users.sendNotification);

    // Parent to child notification for app usage
    app.post('/requestChildAppUsage', users.requestChildAppUsage);

    app.post('/requestChildSmsLog', users.requestChildSmsLog);

    app.post('/requestChildNotifLog', users.requestChildNotifLog);

    app.post('/requestChildLocation', users.requestChildLocation);


    // Child to Parent notification for app usage
    app.post('/sendChildAppUsage', users.sendChildAppUsage);

    app.post('/sendChildCallLog', users.sendChildCallLog);

    app.post('/sendChildNotifLog', users.sendChildNotifLog);

    app.post('/sendChildSmSLog', users.sendChildSmSLog);

    app.post('/sendChildLocation', users.sendChildLocation);

    // Block child device network
    app.post('/blockDeviceNetwork', users.blockDeviceNetwork);

    app.post('/requestChildCallLog', users.requestChildCallLog);

    app.post('/requestChildData', users.requestChildData);

    // Update a User with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:childId/:parentId', users.delete);

    app.delete('/deleteOldUsers', users.deleteOldUsers);

    app.delete('/deleteAccount/:deviceId', users.deleteAccount);

} 