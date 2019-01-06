 
module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    app.post('/addChild', users.addChild);

    app.post('/addNewChild', users.addNewChild);


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

    // Child to Parent notification for app usage
    app.post('/sendChildAppUsage', users.sendChildAppUsage);

    // Block child device network
    app.post('/blockDeviceNetwork', users.blockDeviceNetwork);

    // Update a User with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);

    app.delete('/deleteOldUsers', users.deleteOldUsers);

} 