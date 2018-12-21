const express = require('express');
const bodyParser = require('body-parser');
const Mongo = require('./mongo');

// init express
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// get data from request
app.post('/data', (req, res) => {
    console.log('Did receive!');
    res.send(req.body.name + "," + req.body.age);

    // insert data to database
    const mongo = new Mongo();
    mongo.insert({ name: req.body.name, age: req.body.age });
});

app.listen(8081);