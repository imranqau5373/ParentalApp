module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    app.post('/addChild', users.addChild);

    // Retrieve all User
    app.get('/users', users.findAll);

    // Retrieve a single User with deviceId
    app.post('/userByDevice', users.findOne);

    app.post('/userByPin', users.findByPin);

    app.post('/findChild', users.findChild);

    // Update a User with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);
}