module.exports = (app) => {
    const Apps = require('../controllers/app.controller.js');

    app.get('/apps', Apps.findAll);

    app.post('/apps', Apps.create);
}