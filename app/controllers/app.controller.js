const App = require('../models/app.model.js');

// Create and Save a new user
exports.create = (req, res) => {

    var apps  = [];
    apps = JSON.parse(req.body.appList);

    for (let index = 0; index < apps.length; index++) {
        const element = apps[index];
     
        App.findOne({packageName: element.packageName}, function(err, app) {
            if (app){
                
                // app already present
                console.log("App already present");
                
            }else{
    
                var dataTask = new App(element);
                dataTask.save()
                .then(data => {
                    
                }).catch(err => {
                    
                });
            }
            
        });
        
    }

    res.json({
        message: 'Apps saved successfully'
    });
};

exports.findAll = (req, res) => {

    App.find() 
    .then(apps => {
        res.send(apps);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving apps."
        });
    }) ;

};