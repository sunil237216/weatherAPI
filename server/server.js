const express = require('express');
const {authenticate} = require('./middleware/authenticate');
const _ =require("lodash");
const bodyParser = require('body-parser');
const {
    mongoose
} = require('./db/moongose');
const {
    Weather
} = require('./models/weather');
const {
    User
} = require('./models/user');
var app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.post('/addweather', (req, res) => {
    console.log(req.body);
    var weather = new Weather({
        DeviceID: req.body.DeviceID,
        Temperature: req.body.Temperature,
        Humidity:req.body.Humidity,
        AirPressure:req.body.AirPressure,
        Co2:req.body.Co2      
    });
    weather.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.post('/todos/update', (req, res) => {
    Todo.findOneAndUpdate({
        _id :req.body.id},
        {
          $set:{
            text:req.body.text
          }
        },{
            returnOriginal:false
      }).then((result) =>{
        console.log(result);
        });
});

app.get('/getweather', (req, res) => {
    Weather.find().then((weathers) => {
        res.send({
            weathers
        })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id',function (req, res) {

    var id = req.params.id;
    var ObjectId = require('mongodb').ObjectID;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findOne({_id:id,_creater:req.user._id}).then((todo) => {
        if (!todo) {

            res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    })

    //  res.send(req.params);

});

app.post('/users/login',(req,res) => {

    var body =_.pick(req.body,['email','password']);

    User.findByCredentials(body.email,body.password).then((user) =>{

      return user.generateAuthToken().then((token) =>{
        res.header('x-auth',token).send(user);
      });

    }).catch((err)=>{
       res.status(400).send();
   })
      

});


app.delete('/todos/:id', function (req, res) {
    var id = req.params.id;
    var ObjectId = require('mongodb').ObjectID;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    Todo.findOneAndRemove({_id:id,_creater:req.user._id}).then((todo) => {
        if (!todo) {

            res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {

    console.log('started at port', port);
})