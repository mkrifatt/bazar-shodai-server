const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
var ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sgjt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("bazarShodai").collection("products");
  const checkOutCollection = client.db("bazarShodai").collection("checkOutProducts");
  
  app.get("/shoppingItems", (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post("/addShopping", (req, res) => {
    const newShopping = req.body;
    console.log("adding new shopping ", newShopping);
    eventCollection.insertOne(newShopping)
    .then( result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/shopping/:id', (req, res)=>{
    eventCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err, shoppingItems)=>{
     res.send( shoppingItems[0]);
    })
  })

  app.post('/orderCheckout', (req, res)=>{
    const newOrder = req.body;
    checkOutCollection.insertOne(newOrder)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req, res)=>{
    checkOutCollection.find({email: req.query.email})
    .toArray((err, totalOrder)=>{
      res.send( totalOrder)
    })
  })

  app.delete('/cancelOrder/:id', (req, res)=>{
    console.log(req.params.id);
    checkOutCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result =>{
      res.send(result.deletedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    console.log(req.params.id);
    eventCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result =>{
      res.send(result.deletedCount > 0)
    })
  })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})