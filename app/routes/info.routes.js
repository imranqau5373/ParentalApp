    module.exports = (app) => {
    const info = require('../controllers/info.controller.js');

    app.get('/info', info.findAll);

    app.post('/info', info.create);
}