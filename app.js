var general = 0;
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = 4000;

//USO EN LA APP
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

//INFO MONGO
const url = 'mongodb://localhost:27017';
const dbName = 'urldb'; 

//CLIENT MONGO
const client = new MongoClient(url);

//CONNECT MONGO
client.close();
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);

    app.get('/', (req,res) => {
        client.close();
        res.sendFile("/COMPUTER SCIENCE 2'2/Programación 3/tinyURL/pages/index.html")
    });


    app.post('/tiny', (req, res) => {
        inserturl(db, req.body.direccion, () => {
            client.close();
        });
        req.body = general; 
        res.status(201).send("URL Created, it is" + " " + "localhost:4000/" + (req.body).toString());
    })

    app.get("/:cuteurl", (req, res) => {
        var infor = req.params.cuteurl;
        if(infor != 'tiny'){
            findurl(db, infor, (err, docs) => {
                client.close();
                res.status(301).redirect(docs);
            });
        }else{
            client.close();
        }
    })


});

app.listen(port, () => console.log('QUE COMIENCE LO BUENO'));

var inserturl = (db, infor) => {
    general += 1;
    const collection = db.collection('infourl');
    collection.insertOne({original: infor, cute: general.toString()}, (err,result) => {
        assert.equal(err,null);
        console.log("url insertada");
    });
}

var findurl = (db, infor, cb) => {
    const collection = db.collection('infourl'); 
    var resultado = collection.find({"cute": infor.toString()}).toArray((err, docs) => {
        assert.equal(err, null);
        if(docs[0] != undefined){
            console.log(docs[0]["original"]);
            cb(null, docs[0]["original"]);
            //return docs[0]["original"];
        }
    });
}