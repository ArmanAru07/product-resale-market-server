const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yxbgeqc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db('resale-product').collection('category');
        const productsCollection = client.db('resale-product').collection('products');

        //category..
        app.get('/category', async(req, res) =>{
            const query = {}
            const cursor = categoryCollection.find(query);
            const category = await cursor.toArray();
            res.send(category);
        })
        //products..
        app.get('/products', async(req, res) =>{
            const query = {}
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        
        //category products
        app.get('/products/:name', async(req,res)=>{
            const name=req.params.name;
            const query = {categoryName:name}
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            console.log(products);
            res.send(products);
        })

        //users 
        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('resale-product server is running')
})

app.listen(port, () => {
    console.log(`resale-product server running on ${port}`);
})