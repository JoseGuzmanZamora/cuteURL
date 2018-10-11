var generalrepetida = false;
var generalnorepetida = "";
const bootstrap = require('bootstrap');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = 4000;

//USO EN LA APP
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

var db; 

MongoClient.connect('mongodb://root:password1@ds227373.mlab.com:27373/urldb', (err, database) => {
    if(err) return console.log(err);
    db = database.db('urldb');
    db.collection('infourl').createIndex({"createdAt": 1}, {expireAfterSeconds: 36000});
    app.listen(port, () => console.log('QUE COMIENCE LO BUENO'));
})

app.get('/', (req,res) => {
    res.sendFile("/COMPUTER SCIENCE 2'2/Programación 3/tinyURL/pages/index.html")
});

app.post('/tiny', (req, res) => {
    var infor = req.body.direccion;
    var temporalurl = shortener(infor);
    db.collection('infourl').find({"original": infor.toString()}).toArray((err, docs) => {
        assert.equal(err, null);
        if(docs.length == 0){
            var fecha = new Date();
            db.collection('infourl').insertOne({"createdAt": new getDate(), original: infor, cute: temporalurl.toString(), visits: 0, creates: 1, year: fecha.getFullYear().toString(), month: fecha.getMonth().toString(), day: fecha.getDate().toString(), hour: fecha.getHours().toString(), minute: fecha.getMinutes().toString()}, (err, result) => {
                if(err) return console.log(err);
                console.log("GUARDADO BABY.");
                req.body = temporalurl; 
                res.status(201).send("URL Created, it is" + " " + "localhost:4000/" + (req.body).toString());
            });
        }else{
            db.collection('infourl').updateOne({"original": infor.toString()}, {
                $inc: {creates: 1}
            }, (err, result) => {
                if(err) return console.log(err);
                res.status(201).send("URL Created, it is" + " " + "localhost:4000/" + (docs[0]["cute"]).toString());
            });
        }
    });
})

app.get("/:cuteurl", (req, res) => {
    var infor = req.params.cuteurl;
    if(infor != 'tiny'){
        var resultado = db.collection('infourl').find({"cute": infor.toString()}).toArray((err, docs) => {
            assert.equal(err, null);
            if(docs[0] != undefined){
                console.log(docs[0]["original"]);
                db.collection('infourl').updateOne({"cute": infor.toString()}, {
                    $inc: {visits: 1}
                }, (err, result) => {
                    if(err) return console.log(err);
                    res.status(301).redirect(docs[0]["original"]);
                });
            }
        });
    }
})

var shortener = (urloriginal) => {
    var numbercode = 0;
    for(var i = 0; i < urloriginal.length; i++) {
        numbercode += (urloriginal.toString()).charCodeAt(i);
    };
    var aleatoreo = Math.random() * 1000000;
    var encoded = numbercode*aleatoreo*numbercode*aleatoreo;
    return encoded.toString(32).slice(0,6);
}