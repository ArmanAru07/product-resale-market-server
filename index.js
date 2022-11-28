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
        const usersCollection = client.db('resale-product').collection('user');
        const bookingsCollection = client.db('resale-product').collection('booking');

        //all buyers
        app.get('/all-buyers', async(req, res)=>{
            const userCategory =req.query.userCategory;
            console.log(userCategory);
            const query = {userCategory: userCategory};
            const buyers = await usersCollection.find(query).toArray();
            res.send(buyers);
        })
        //all sellers
        app.get('/all-sellers', async(req, res)=>{
            const userCategory =req.query.userCategory;
            console.log(userCategory);
            const query = {userCategory: userCategory};
            const sellers = await usersCollection.find(query).toArray();
            res.send(sellers);
        })
        //delete
        app.delete('/UserInfo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userInfo.deleteOne(query);
            res.send(result);
        });
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
        //my product
        app.get('/products/:email', async(req, res)=>{
            const email =req.params.email;
            console.log(email);
            const query = {email: email};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })
        
        // category products
        app.get('/products/:name', async(req,res)=>{
            const name=req.params.name;
            console.log(name);
            const query = {categoryName:'YAMAHA'}
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // app.get('/products/:id',async (req,res)=>{

        //     const id=req.params.id;
        //     const query={_id:Object(id) }

        //         const result=await productsCollection.find(query).toArray();
        //         console.log(result);
        //         res.send(result);
        // })

        //users 
        app.post('/users', async(req, res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        //bookings
        app.post('/bookings', async(req, res) =>{
            const bookings = req.body
            console.log(bookings);  
            const result = await bookingsCollection.insertOne(bookings);
            console.log(result);
            res.send(result);
        })
        app.get('/booking', async(req, res)=>{
            const email =req.query.email;
            const query = {email: email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        })
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        });


        //add product
        app.post('/add-product', async(req,res)=>{
            const product=req.body;

            const result=await productsCollection.insertOne(product);
            console.log(result);
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