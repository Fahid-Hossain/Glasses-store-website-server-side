const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json())


//connect to database mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2qch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//node mongodb connect 
async function run() {
    try {
        await client.connect();
        // console.log("database connected successfully");
        const database = client.db("Chasmish_Glasses");
        const productCollections = database.collection("products");
        const orderCollections = database.collection("orders");
        const userCollections = database.collection("users");

        //post api request products
        app.post("/products", async (req, res) => {
            const products = req.body;
            // console.log("hit the post api",products);
            const result = await productCollections.insertOne(products);
            console.log(result);
            res.json(result);
        })

        //get api all products
        app.get("/products", async (req, res) => {
            const cursor = productCollections.find({})
            const products = await cursor.toArray();
            res.send(products);

        })

        //get api single product
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollections.findOne(query);
            res.send(product);

        })

        //post api orders 
        app.post("/orders", async (req, res) => {
            const orders = req.body;
            // console.log(orders);
            const result = await orderCollections.insertOne(orders);
            res.json(result);
        })



        //get api user orders by email
        // app.get("/orders", async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     const cursor = orderCollections.find(query)
        //     const result = await cursor.toArray();
        //     res.json(result);

        // })

        //get api orders 
        app.get("/orders", async (req, res) => {
            const cursor = orderCollections.find({})
            const result = await cursor.toArray();
            res.send(result);
        })

        //Delete api orders
        app.delete("/orders/:id",async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollections.deleteOne(query);
            res.json(result);
        })

        // post user data
        app.post("/users",async(req,res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.json(result);
            // console.log(result);
        })

        // make admin user 
        app.put("/users/admin",async(req, res) => {
            const user = req.body;
            console.log("update",user);
            const filter = {email: user.email};
            const updateDoc ={
                $set:{role: "admin"}
            }
            const result = await userCollections.updateOne(filter, updateDoc);
            res.json(result);

        })



    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Chasmish')
})

app.listen(port, () => {
    console.log(`Chasmish listening at port: ${port}`)
})