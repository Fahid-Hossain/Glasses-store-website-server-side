const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
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

        //post api request products
        app.post("/products",async(req,res)=>{
            const products = req.body;
            // console.log("hit the post api",products);
            const result = await productCollections.insertOne(products);
            console.log(result);
            res.json(result);
        })

        //get api request products
        app.get("/products",async (req, res) => {
            const cursor = productCollections.find({})
            const products = await cursor.toArray();
            res.send(products);

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